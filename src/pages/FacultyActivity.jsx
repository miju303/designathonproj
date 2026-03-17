import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Save, Activity } from "lucide-react";

function FacultyActivity() {
  const [activity, setActivity] = useState({
    fdp: 0,
    workshop: 0,
    paper: 0,
    eventConduct: 0,
    hackathon: 0,
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);
  const facultyId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get(`/activities/faculty/${facultyId}`);
        // Find activity for current month/year if exists
        const current = res.data.find(a => a.month === activity.month && a.year === activity.year);
        if (current) setActivity(current);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [facultyId, activity.month, activity.year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...activity, 
        faculty: { id: facultyId } 
      };
      await api.post(`/activities/add`, payload);
      alert("Activities updated successfully! ✅");
    } catch (error) {
      alert("Failed to update activities.");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="dashboard-card" style={{ background: "white", padding: "40px", borderRadius: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
          <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "12px" }}>
            <Activity color="#166534" size={28} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#1e293b" }}>Monthly Activity Update</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{activity.month} {activity.year}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>FDPs Attended</label>
              <input 
                type="number" 
                value={activity.fdp} 
                onChange={(e) => setActivity({...activity, fdp: parseInt(e.target.value)})}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Workshops</label>
              <input 
                type="number" 
                value={activity.workshop} 
                onChange={(e) => setActivity({...activity, workshop: parseInt(e.target.value)})}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Research Papers</label>
              <input 
                type="number" 
                value={activity.paper} 
                onChange={(e) => setActivity({...activity, paper: parseInt(e.target.value)})}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Events Conducted</label>
              <input 
                type="number" 
                value={activity.eventConduct} 
                onChange={(e) => setActivity({...activity, eventConduct: parseInt(e.target.value)})}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px" }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#475569" }}>Hackathons Participated</label>
            <input 
              type="number" 
              value={activity.hackathon} 
              onChange={(e) => setActivity({...activity, hackathon: parseInt(e.target.value)})}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px" }}
            />
          </div>

          <button type="submit" style={{ marginTop: "10px", padding: "14px", background: "#166534", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Save size={20} /> Save Monthly Updates
          </button>
        </form>
      </div>
    </div>
  );
}

export default FacultyActivity;
