import React, { useEffect, useState } from "react";
import { hodApi, adminApi } from "../services/api";
import { 
  Users, 
  Search, 
  Mail, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from "lucide-react";

function FacultyStatus() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  
  const role = localStorage.getItem("userRole");
  const userDept = localStorage.getItem("userDept") || "CSE";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        if (role === "hod") {
          response = await hodApi.getFaculties(userDept);
        } else {
          response = await adminApi.getFaculties();
        }
        setFaculties(response.data);
      } catch (error) {
        console.error("Error fetching faculty status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, userDept]);

  const sendReminder = async (id) => {
    try {
      await hodApi.sendReminder(id, "Your profile completion is low. Please update it as soon as possible.");
      alert("Reminder sent successfully!");
    } catch (error) {
      alert("Failed to send reminder.");
    }
  };

  const filtered = Array.isArray(faculties) ? faculties.filter(f => {
    const name = f.name || "";
    const email = f.email || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "ALL" || f.department === deptFilter;
    return matchesSearch && matchesDept;
  }) : [];

  const getStatus = (pct) => {
    if (pct === 100) return { label: "Complete", color: "#22c55e", bg: "#dcfce7", icon: <CheckCircle size={14} /> };
    if (pct >= 50) return { label: "In Progress", color: "#f59e0b", bg: "#fef9c3", icon: <AlertCircle size={14} /> };
    return { label: "Incomplete", color: "#ef4444", bg: "#fee2e2", icon: <XCircle size={14} /> };
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading Faculty Status...</div>;

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>Faculty Profile Status</h1>
        <p style={{ color: "#64748b", marginTop: "5px" }}>
          {role === "hod" ? `Monitoring ${userDept} Department` : "System-wide Monitoring"}
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "15px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
            <Search style={{ position: "absolute", left: "12px", top: "10px", color: "#94a3b8" }} size={18} />
            <input
              placeholder="Search faculty by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 15px 10px 40px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>
          
          {role === "admin" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Filter size={18} color="#64748b" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "14px",
                  outline: "none"
                }}
              >
                <option value="ALL">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="AIML">AIML</option>
              </select>
            </div>
          )}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Faculty Member</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Department</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Completion</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Status</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const s = getStatus(f.profileCompletion);
              return (
                <tr key={f.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "15px 20px" }}>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>{f.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{f.email}</div>
                  </td>
                  <td style={{ padding: "15px 20px" }}>
                    <span style={{ fontSize: "13px", color: "#475569" }}>{f.department || "N/A"}</span>
                  </td>
                  <td style={{ padding: "15px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "150px" }}>
                      <div style={{ flex: 1, background: "#f1f5f9", height: "6px", borderRadius: "3px" }}>
                        <div style={{ width: `${f.profileCompletion}%`, height: "100%", background: s.color, borderRadius: "3px" }} />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>{f.profileCompletion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "15px 20px" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: "20px", 
                      fontSize: "11px", 
                      fontWeight: "bold",
                      background: s.bg,
                      color: s.color,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      width: "fit-content"
                    }}>
                      {s.icon} {s.label}
                    </span>
                  </td>
                  <td style={{ padding: "15px 20px", borderRadius: "0 12px 12px 0" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={() => setSelectedProfileId(f.id)}
                        style={{ padding: "6px", color: "#3b82f6", background: "#eff6ff", border: "none", borderRadius: "6px", cursor: "pointer" }} 
                        title="View Details">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => sendReminder(f.id)}
                        style={{ padding: "6px", color: "#f59e0b", background: "#fffbeb", border: "none", borderRadius: "6px", cursor: "pointer" }} 
                        title="Send Email Reminder"
                      >
                        <Mail size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            <Users size={48} style={{ marginBottom: "15px", opacity: 0.2 }} />
            <p>No faculty members found matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedProfileId && (
          <ProfileModal 
            faculty={faculties.find(f => f.id === selectedProfileId)} 
            onClose={() => setSelectedProfileId(null)} 
          />
      )}
    </div>
  );
}

function ProfileModal({ faculty, onClose }) {
  if (!faculty) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
      <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#1e3a8a" }}>{faculty.name}'s Profile</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div>
            <img 
              src={faculty.profilePhotoPath ? `http://localhost:8080/uploads/${faculty.profilePhotoPath}` : "https://via.placeholder.com/100"} 
              alt="Profile" 
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} 
            />
          </div>
          <div>
            <p><strong>Email:</strong> {faculty.email}</p>
            <p><strong>Phone:</strong> {faculty.phone}</p>
            <p><strong>Department:</strong> {faculty.department}</p>
            <p><strong>Designation:</strong> {faculty.designation}</p>
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h4>About</h4>
          <p>{faculty.about}</p>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1, background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Profile Completion</h4>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#22c55e" }}>{faculty.profileCompletion}%</div>
          </div>
          <div style={{ flex: 1, background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Research Score</h4>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>{faculty.researchScore}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyStatus;
