import React, { useState, useEffect } from "react";
import api, { adminApi, hodApi } from "../services/api";
import { Plus, ListChecks, Calendar, User } from "lucide-react";

function ManageAssignments() {
  const [faculties, setFaculties] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    facultyId: "",
    title: "",
    submissionDate: "",
    status: "PENDING"
  });

  const role = localStorage.getItem("userRole");
  const dept = localStorage.getItem("userDept") || "CSE";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, aRes] = await Promise.all([
        role === "hod" ? hodApi.getFaculties(dept) : adminApi.getFaculties(),
        api.get("/assignments/faculty/1") // Just a placeholder to trigger a search or similar
      ]);
      setFaculties(fRes.data);
      
      // Fetch all assignments (might need a better endpoint)
      const all = [];
      for (const f of fRes.data) {
        try {
          const res = await api.get(`/assignments/faculty/${f.id}`);
          all.push(...res.data.map(a => ({ ...a, facultyName: f.name })));
        } catch (e) {}
      }
      setAssignments(all);
    } catch (error) {
      console.error("Error fetching assignments data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post("/assignments/assign", {
        title: newAssignment.title,
        submissionDate: newAssignment.submissionDate,
        faculty: {
          id: newAssignment.facultyId
        }
      });
      setShowModal(false);
      setNewAssignment({ facultyId: "", title: "", submissionDate: "", status: "PENDING" });
      fetchData();
      alert("Task assigned successfully!");
    } catch (error) {
      alert("Failed to assign task.");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading Assignments...</div>;

  return (
    <div>
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#1e3a8a", margin: 0 }}>Task Allocation</h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Assign and track faculty tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: "12px 20px", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <Plus size={18} /> New Assignment
        </button>
      </div>

      <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px" }}>Faculty</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px" }}>Assignment Title</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px" }}>Submission Date</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(assignments) && assignments.length > 0 ? assignments.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "15px 20px", fontWeight: "600" }}>{a.facultyName}</td>
                <td style={{ padding: "15px 20px" }}>{a.title}</td>
                <td style={{ padding: "15px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b" }}>
                    <Calendar size={14} /> {new Date(a.submissionDate).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: "15px 20px" }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "11px", 
                    fontWeight: "bold",
                    background: (a.status === 'SUBMITTED' || a.status === 'COMPLETED') ? '#dcfce7' : a.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                    color: (a.status === 'SUBMITTED' || a.status === 'COMPLETED') ? '#166534' : a.status === 'PENDING' ? '#b45309' : '#b91c1c'
                  }}>
                    {a.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No assignments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "450px" }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#1e3a8a" }}>New Task Assignment</h2>
            <form onSubmit={handleAssign} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Select Faculty</label>
                <select 
                  required
                  value={newAssignment.facultyId}
                  onChange={(e) => setNewAssignment({...newAssignment, facultyId: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                >
                  <option value="">Choose...</option>
                  {Array.isArray(faculties) && faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Task Title</label>
                <input 
                  required
                  placeholder="e.g. Prepare Q1 Exam Paper"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Submission Deadline</label>
                <input 
                  type="date"
                  required
                  value={newAssignment.submissionDate}
                  onChange={(e) => setNewAssignment({...newAssignment, submissionDate: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Assign Task
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAssignments;
