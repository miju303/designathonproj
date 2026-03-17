import React, { useState, useEffect } from "react";
import api from "../services/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";

function AttendanceTracker() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null); // 'PRESENT' or 'ABSENT' for today
  const facultyId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await api.get(`/attendance/faculty/${facultyId}?startDate=${today}&endDate=${today}`);
        if (res.data.length > 0) {
          setStatus(res.data[0].status);
        }
        
        // Fetch last 30 days
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        const resAll = await api.get(`/attendance/faculty/${facultyId}?startDate=${monthAgo.toISOString().split('T')[0]}&endDate=${today}`);
        setLogs(resAll.data.reverse());
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, [facultyId]);

  const markAttendance = async (s) => {
    try {
      await api.post(`/attendance/mark?facultyId=${facultyId}&status=${s}`);
      setStatus(s);
      alert(`Marked as ${s}!`);
      // Refresh logs
      const today = new Date().toISOString().split('T')[0];
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const resAll = await api.get(`/attendance/faculty/${facultyId}?startDate=${monthAgo.toISOString().split('T')[0]}&endDate=${today}`);
      setLogs(resAll.data.reverse());
    } catch (error) {
      alert("Failed to mark attendance.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="dashboard-card" style={{ background: "white", padding: "40px", borderRadius: "20px", marginBottom: "30px", textAlign: "center" }}>
        <h2 style={{ color: "#1e293b", marginBottom: "10px" }}>Daily Attendance</h2>
        <p style={{ color: "#64748b", marginBottom: "30px" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        {status ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 30px", background: status === 'PRESENT' ? "#f0fdf4" : "#fef2f2", borderRadius: "12px", border: `1px solid ${status === 'PRESENT' ? "#bbf7d0" : "#fecaca"}` }}>
            {status === 'PRESENT' ? <CheckCircle color="#166534" size={24} /> : <XCircle color="#991b1b" size={24} />}
            <span style={{ fontSize: "20px", fontWeight: "800", color: status === 'PRESENT' ? "#166534" : "#991b1b" }}>
              Status: {status}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <div style={{ padding: "15px 30px", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1", color: "#64748b" }}>
              <Clock size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              No attendance marked for today.
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#1e293b" }}>Recent Logs (Last 30 Days)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "15px" }}>
          {logs.map(log => (
            <div key={log.id} style={{ padding: "15px", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "5px" }}>{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
              <div style={{ fontWeight: "700", color: log.status === 'PRESENT' ? "#22c55e" : "#ef4444", fontSize: "13px" }}>{log.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendanceTracker;
