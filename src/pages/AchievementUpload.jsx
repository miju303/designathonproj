import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Upload, Award, ExternalLink } from "lucide-react";

function AchievementUpload() {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ type: "ACADEMIC", title: "", date: "", certificateUrl: "" });
  const facultyId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get(`/achievements/faculty/${facultyId}`);
        setAchievements(res.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchAchievements();
  }, [facultyId]);

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("facultyId", facultyId);
      formData.append("type", newAchievement.type);
      formData.append("title", newAchievement.title);
      formData.append("date", newAchievement.date);
      if (file) {
        formData.append("file", file);
      }

      await api.post(`/achievements/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("File uploaded successfully! ✅");
      setNewAchievement({ type: "ACADEMIC", title: "", date: "", certificateUrl: "" });
      setFile(null);
      const res = await api.get(`/achievements/faculty/${facultyId}`);
      setAchievements(res.data);
    } catch (error) {
      alert("Failed to upload achievement.");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px" }}>
      <div className="dashboard-card" style={{ background: "white", padding: "30px", height: "fit-content" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
          <div style={{ padding: "10px", background: "#fef3c7", borderRadius: "10px" }}>
            <Award color="#d97706" size={24} />
          </div>
          <h2 style={{ margin: 0, color: "#1e293b", fontSize: "20px" }}>Add Achievement</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Type</label>
            <select 
              value={newAchievement.type}
              onChange={(e) => setNewAchievement({...newAchievement, type: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            >
              <option value="ACADEMIC">Academic</option>
              <option value="RESEARCH">Research</option>
              <option value="SPORT">Sports</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Title / Milestone</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Best Researcher Award 2023"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Date Received</label>
            <input 
              type="date" 
              required
              value={newAchievement.date}
              onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Upload Certificate</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>
          <button type="submit" style={{ marginTop: "10px", padding: "12px", background: "#d97706", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Upload size={18} /> Upload Achievement
          </button>
        </form>
      </div>

      <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
        <h2 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "20px" }}>Achievement Portfolio</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {achievements.length > 0 ? achievements.map(ach => (
            <div key={ach.id} style={{ padding: "20px", background: "#fffbeb", borderRadius: "15px", border: "1px solid #fef3c7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span style={{ padding: "4px 8px", background: "#fef3c7", color: "#d97706", borderRadius: "6px", fontSize: "11px", fontWeight: "800" }}>{ach.type}</span>
                <span style={{ fontSize: "12px", color: "#92400e" }}>{new Date(ach.date).toLocaleDateString()}</span>
              </div>
              <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>{ach.title}</h4>
              {ach.certificateUrl && (
                <a 
                  href={ach.certificateUrl.startsWith('http') ? ach.certificateUrl : `http://localhost:8080${ach.certificateUrl}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#d97706", fontWeight: "700", textDecoration: "none" }}
                >
                  View Certificate <ExternalLink size={14} />
                </a>
              )}
            </div>
          )) : <p style={{ color: "#64748b" }}>No achievements uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default AchievementUpload;
