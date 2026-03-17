import React, { useState, useEffect } from "react";
import api from "../services/api";
import { CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const facultyId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/assignments/faculty/${facultyId}`);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching my assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/assignments/update-status/${id}?status=${status}`);
      fetchAssignments();
      alert(`Status updated to ${status}!`);
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const getStatusInfo = (a) => {
    const subDate = new Date(a.submissionDate);
    const isOverdue = a.status !== 'COMPLETED' && subDate < new Date();
    
    if (a.status === 'SUBMITTED' || a.status === 'COMPLETED') return { label: 'Submitted', color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle size={16} /> };
    if (isOverdue) return { label: 'Overdue', color: '#ef4444', bg: '#fee2e2', icon: <AlertTriangle size={16} /> };
    return { label: 'Pending', color: '#f59e0b', bg: '#fef9c3', icon: <Clock size={16} /> };
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading My Assignments...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>My Assignments</h1>
        <p style={{ color: "#64748b", marginTop: "5px" }}>Track and complete your assigned tasks</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {Array.isArray(assignments) && assignments.length > 0 ? assignments.map((a) => {
          const s = getStatusInfo(a);
          return (
            <div key={a.id} className="dashboard-card" style={{ background: "white", padding: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ 
                    padding: "3px 10px", 
                    borderRadius: "15px", 
                    fontSize: "11px", 
                    fontWeight: "800",
                    background: s.bg,
                    color: s.color,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    {s.icon} {s.label}
                  </span>
                  <span style={{ color: "#64748b", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> Deadline: {new Date(a.submissionDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ margin: 0, color: "#1e293b" }}>{a.title}</h3>
                <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "13px" }}>Assigned on: {new Date(a.assignedDate).toLocaleDateString()}</p>
              </div>

              {a.status !== 'SUBMITTED' && a.status !== 'COMPLETED' ? (
                <button
                  onClick={() => updateStatus(a.id, 'SUBMITTED')}
                  style={{
                    padding: "10px 20px",
                    background: "#166534",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <CheckCircle size={18} /> Mark Submitted
                </button>
              ) : (
                <div style={{ color: "#22c55e", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle size={20} /> Submitted
                </div>
              )}
            </div>
          );
        }) : (
          <div className="dashboard-card" style={{ background: "white", padding: "50px", textAlign: "center", color: "#94a3b8" }}>
            <Clock size={48} style={{ opacity: 0.2, marginBottom: "15px" }} />
            <p>No assignments allocated to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAssignments;
