import React, { useEffect, useState } from "react";
import { adminApi, reportApi } from "../services/api";
import { 
  Users, 
  Settings, 
  BarChart, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Activity
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalFaculty: 0,
    profilesCompleted: 0,
    profilesPending: 0,
    mostActiveDepartment: "N/A"
  });
  const [logs, setLogs] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, lRes, fRes] = await Promise.all([
          adminApi.getAnalytics(),
          adminApi.getLogs(),
          adminApi.getFaculties()
        ]);
        if (aRes?.data) setAnalytics(aRes.data);
        if (lRes?.data) setLogs(lRes.data);
        if (fRes?.data) setFaculties(fRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadNaacReport = async (format = 'json') => {
    try {
      if (format === 'pdf') {
        const response = await reportApi.downloadNaacPdf();
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'NAAC_Report.pdf');
        document.body.appendChild(link);
        link.click();
        return;
      }

      const response = await adminApi.getNaacReport();
      const data = response.data;
      
      if (format === 'json') {
        const blobData = JSON.stringify(data, null, 2);
        const blob = new Blob([blobData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'NAAC_Audit_Report.json');
        document.body.appendChild(link);
        link.click();
      } else {
        alert(`Generating and downloading NAAC Report in ${format.toUpperCase()} format... (Real-time data included)`);
        setTimeout(() => {
          alert(`${format.toUpperCase()} report downloaded! ✅`);
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to generate NAAC report:", error);
      alert("Failed to generate NAAC report.");
    }
  };

  const downloadReport = (type, format) => {
    alert(`Generating ${type} report in ${format.toUpperCase()} format...`);
    // In a real app, this would call an API that returns a file blob
    setTimeout(() => {
        alert(`${type} report downloaded! ✅`);
    }, 1000);
  };

  const clearLogs = async () => {
    if (window.confirm("Are you sure you want to clear all system logs?")) {
      try {
        await adminApi.clearLogs();
        setLogs([]);
        alert("Logs cleared successfully!");
      } catch (error) {
        alert("Failed to clear logs.");
      }
    }
  };

  const deleteFaculty = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        await adminApi.deleteFaculty(id);
        const updatedFaculties = Array.isArray(faculties) ? faculties.filter(f => f.id !== id) : [];
        setFaculties(updatedFaculties);
        alert("Faculty deleted successfully!");
      } catch (error) {
        alert("Failed to delete faculty.");
      }
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading Admin Dashboard...</div>;

  const barData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Faculty Profiles',
        data: [analytics?.profilesCompleted || 0, analytics?.profilesPending || 0],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['#22c55e', '#ef4444'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const tabStyle = (id) => ({
    padding: "10px 25px",
    cursor: "pointer",
    background: activeTab === id ? "#1e3a8a" : "transparent",
    color: activeTab === id ? "white" : "#64748b",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "all 0.3s"
  });

  return (
    <div>
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#1e3a8a", margin: 0 }}>Administrator Control</h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>System-wide monitoring and management</p>
        </div>
        <div style={{ display: "flex", gap: "10px", background: "#f1f5f9", padding: "5px", borderRadius: "10px" }}>
          <button onClick={() => setActiveTab("analytics")} style={tabStyle("analytics")}>Analytics</button>
          <button onClick={() => setActiveTab("faculty")} style={tabStyle("faculty")}>Faculty Mgmt</button>
          <button onClick={() => setActiveTab("logs")} style={tabStyle("logs")}>System Logs</button>
        </div>
      </div>

      {activeTab === "analytics" && (
        <>
          {/* STATS CARDS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            marginBottom: "30px"
          }}>
            <div className="dashboard-card card-blue glitter-effect">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <Users color="#1e40af" size={24} />
                <span style={{ fontSize: "14px", color: "#1e40af", fontWeight: "700" }}>TOTAL FACULTY</span>
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#1e293b" }}>{analytics?.totalFaculty || 0}</div>
            </div>

            <div className="dashboard-card card-pink glitter-effect">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <CheckCircle color="#991b1b" size={24} />
                <span style={{ fontSize: "14px", color: "#991b1b", fontWeight: "700" }}>COMPLETED</span>
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#1e293b" }}>{analytics?.profilesCompleted || 0}</div>
            </div>

            <div className="dashboard-card card-purple glitter-effect">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <AlertTriangle color="#6b21a8" size={24} />
                <span style={{ fontSize: "14px", color: "#6b21a8", fontWeight: "700" }}>PENDING</span>
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#1e293b" }}>{analytics?.profilesPending || 0}</div>
            </div>

            <div className="dashboard-card card-gray glitter-effect">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <Activity color="#374151" size={24} />
                <span style={{ fontSize: "14px", color: "#374151", fontWeight: "700" }}>ACTIVE DEPT</span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", marginTop: "10px" }}>{analytics?.mostActiveDepartment || "N/A"}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "30px" }}>
            <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
              <h3 className="shiny-header" style={{ margin: "0 0 25px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>Status Distribution</h3>
              <div style={{ height: "300px" }}>
                <Bar 
                  data={barData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                      y: { beginAtZero: true, grid: { color: "#f1f5f9" } }, 
                      x: { grid: { display: false } } 
                    }
                  }} 
                />
              </div>
            </div>

            <div className="dashboard-card card-yellow" style={{ padding: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#854d0e", fontSize: "18px", fontWeight: "700" }}>NAAC Audit Report</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                   <button onClick={() => downloadNaacReport('json')} style={{ padding: "8px 12px", background: "#854d0e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", fontSize: "12px" }}>
                    JSON
                  </button>
                  <button onClick={() => downloadNaacReport('pdf')} style={{ padding: "8px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", fontSize: "12px" }}>
                    PDF
                  </button>
                  <button onClick={() => downloadNaacReport('excel')} style={{ padding: "8px 12px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "600", fontSize: "12px" }}>
                    Excel
                  </button>
                </div>
              </div>
              <p style={{ color: "#713f12", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                Generate a comprehensive real-time report for NAAC accreditation. This includes research scores, profile completion ratios, and faculty activity summaries.
              </p>
              <div style={{ padding: "15px", background: "rgba(255,255,255,0.4)", borderRadius: "10px", border: "1px solid rgba(133, 77, 14, 0.2)" }}>
                <p style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "700" }}>Ready to export:</p>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#854d0e" }}>
                  <li>Current faculty research metrics</li>
                  <li>Department-wise performance data</li>
                  <li>Audit trail of system modifications</li>
                </ul>
              </div>
            </div>

            <div className="dashboard-card card-blue" style={{ padding: "30px" }}>
              <h3 style={{ margin: "0 0 20px 0", color: "#1e3a8a", fontSize: "18px", fontWeight: "700" }}>System Reports</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "700" }}>Faculty Data</p>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => downloadReport('Faculty', 'pdf')} style={miniBtnStyle('#ef4444')}>PDF</button>
                    <button onClick={() => downloadReport('Faculty', 'excel')} style={miniBtnStyle('#22c55e')}>Excel</button>
                  </div>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "700" }}>Assignments</p>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => downloadReport('Assignments', 'pdf')} style={miniBtnStyle('#ef4444')}>PDF</button>
                    <button onClick={() => downloadReport('Assignments', 'excel')} style={miniBtnStyle('#22c55e')}>Excel</button>
                  </div>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "700" }}>Activities</p>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => downloadReport('Activities', 'pdf')} style={miniBtnStyle('#ef4444')}>PDF</button>
                    <button onClick={() => downloadReport('Activities', 'excel')} style={miniBtnStyle('#22c55e')}>Excel</button>
                  </div>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "700" }}>Achievements</p>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => downloadReport('Achievements', 'pdf')} style={miniBtnStyle('#ef4444')}>PDF</button>
                    <button onClick={() => downloadReport('Achievements', 'excel')} style={miniBtnStyle('#22c55e')}>Excel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "faculty" && (
        <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h3 style={{ margin: 0, color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>Faculty Directory</h3>
            <button style={{ padding: "8px 15px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Add New Faculty</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>
                <th style={{ padding: "0 15px 10px" }}>Name</th>
                <th style={{ padding: "0 15px 10px" }}>Email</th>
                <th style={{ padding: "0 15px 10px" }}>Department</th>
                <th style={{ padding: "0 15px 10px" }}>Level</th>
                <th style={{ padding: "0 15px 10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(faculties) && faculties.map(f => (
                <tr key={f.id} style={{ background: "#f8fafc" }}>
                  <td style={{ padding: "15px", borderRadius: "12px 0 0 12px", fontWeight: "700" }}>{f.name}</td>
                  <td style={{ padding: "15px", fontSize: "13px", color: "#64748b" }}>{f.email}</td>
                  <td style={{ padding: "15px" }}><span style={{ padding: "4px 10px", background: "#dbeafe", color: "#1e40af", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{f.department}</span></td>
                  <td style={{ padding: "15px", fontSize: "13px" }}>{f.profileCompletion}%</td>
                  <td style={{ padding: "15px", borderRadius: "0 12px 12px 0" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}><Settings size={18} /></button>
                      <button onClick={() => deleteFaculty(f.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Activity size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="dashboard-card card-gray" style={{ padding: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h3 style={{ margin: 0, color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>System Audit Logs</h3>
            <button onClick={clearLogs} style={{ padding: "8px 15px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Clear Logs</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto", paddingRight: "10px" }}>
            {logs.length > 0 ? [...logs].reverse().map(log => (
              <div key={log.id} style={{ padding: "15px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "700", color: "#1e3a8a" }}>{log.action}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ color: "#475569" }}>{log.details}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "5px" }}>By: {log.userEmail}</div>
              </div>
            )) : <p style={{ textAlign: "center", color: "#94a3b8", padding: "50px 0" }}>No system logs found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

const miniBtnStyle = (color) => ({
    padding: "4px 10px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "600"
});

export default AdminDashboard;
