import React, { useEffect, useState } from "react";
import api, { hodApi } from "../services/api";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Percent, 
  Mail, 
  Eye,
  BarChart3,
  FileText
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function HodDashboard() {
  const [stats, setStats] = useState({ totalFaculty: 0, profilesCompleted: 0, profilesPending: 0, averageCompletion: 0 });
  const [faculties, setFaculties] = useState([]);
  const [activities, setActivities] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const dept = localStorage.getItem("userDept") || "CSE";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes, actRes] = await Promise.all([
          hodApi.getDashboard(dept),
          hodApi.getFaculties(dept),
          api.get('/activities/all')
        ]);
        setStats(statsRes.data);
        setFaculties(listRes.data);
        setActivities(actRes.data);
        
        const allAssignments = [];
        for (const f of listRes.data) {
          try {
            const aRes = await api.get(`/assignments/faculty/${f.id}`);
            allAssignments.push(...aRes.data);
          } catch (e) {}
        }
        setAssignments(allAssignments);
      } catch (error) {
        console.error("Error fetching HOD data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dept]);

  const sendReminder = async (id) => {
    try {
      await hodApi.sendReminder(id, "Please update your profile. It's below the required completion level.");
      alert("Reminder sent successfully!");
    } catch (error) {
      alert("Failed to send reminder.");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading HOD Dashboard...</div>;

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.profilesCompleted, stats.profilesPending],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#1e3a8a", margin: 0 }}>HOD Overview</h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Department: <span style={{ color: "#3b82f6", fontWeight: "700" }}>{dept}</span></p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "10px 18px", background: "#166534", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} /> Export Excel
          </button>
          <button style={{ padding: "10px 18px", background: "#991b1b", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "24px",
        marginBottom: "30px"
      }}>
        <div className="dashboard-card card-purple glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#6b21a8", fontSize: "14px", fontWeight: "700" }}>Total Faculty</span>
            <Users color="#6b21a8" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{stats.totalFaculty}</div>
        </div>

        <div className="dashboard-card card-blue glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#1e40af", fontSize: "14px", fontWeight: "700" }}>Profiles Completed</span>
            <CheckCircle color="#1e40af" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{stats.profilesCompleted}</div>
        </div>

        <div className="dashboard-card card-pink glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#991b1b", fontSize: "14px", fontWeight: "700" }}>Profiles Pending</span>
            <XCircle color="#991b1b" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{stats.profilesPending}</div>
        </div>

        <div className="dashboard-card card-gray glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#374151", fontSize: "14px", fontWeight: "700" }}>Avg. Completion</span>
            <Percent color="#374151" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{Math.round(stats.averageCompletion)}%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginBottom: "30px" }}>
        <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
          <h3 className="shiny-header" style={{ margin: "0 0 25px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>Faculty Status</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px", fontSize: "14px" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#64748b", fontWeight: "600" }}>
                  <th style={{ padding: "0 15px 10px" }}>Faculty Name</th>
                  <th style={{ padding: "0 15px 10px" }}>Designation</th>
                  <th style={{ padding: "0 15px 10px" }}>Status</th>
                  <th style={{ padding: "0 15px 10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(faculties) && faculties.map((f) => (
                  <tr key={f.id} style={{ background: "#f8fafc" }}>
                    <td style={{ padding: "15px", borderRadius: "12px 0 0 12px", fontWeight: "700", color: "#1e3a8a" }}>{f.name}</td>
                    <td style={{ padding: "15px", color: "#475569", fontWeight: "500" }}>{f.designation}</td>
                    <td style={{ padding: "15px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "3px", width: "80px" }}>
                          <div style={{ 
                            width: `${f.profileCompletion}%`, 
                            height: "100%", 
                            background: f.profileCompletion >= 80 ? "#22c55e" : f.profileCompletion >= 40 ? "#f59e0b" : "#ef4444",
                            borderRadius: "3px"
                          }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>{f.profileCompletion}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "15px", borderRadius: "0 12px 12px 0" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button style={{ padding: "6px", color: "#3b82f6", background: "#eff6ff", border: "none", borderRadius: "6px", cursor: "pointer" }} title="View Details">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="dashboard-card card-yellow" style={{ padding: "30px", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#854d0e", fontSize: "18px", fontWeight: "700" }}>Department Analytics</h3>
            <div style={{ width: "220px", height: "220px", margin: "0 auto" }}>
              <Pie 
                data={chartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { font: { size: 12, family: 'Poppins' } } } }
                }} 
              />
            </div>
          </div>
          <div className="dashboard-card card-pink" style={{ padding: "30px" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#991b1b", fontSize: "16px", fontWeight: "700" }}>Top Researchers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array.isArray(faculties) && faculties.sort((a,b) => b.researchScore - a.researchScore).slice(0, 3).map((f, i) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "rgba(255,255,255,0.4)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#991b1b", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", fontWeight: "700" }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{f.name}</div>
                    <div style={{ fontSize: "12px", color: "#475569" }}>Score: {f.researchScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "30px" }}>
        <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>Monthly Activity Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={{ padding: "15px", background: "#eff6ff", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ color: "#1e40af", fontWeight: "700", fontSize: "20px" }}>
                {activities.reduce((acc, curr) => acc + curr.fdp, 0)}
              </div>
              <div style={{ color: "#1e40af", fontSize: "12px" }}>Total FDPs</div>
            </div>
            <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ color: "#166534", fontWeight: "700", fontSize: "20px" }}>
                {activities.reduce((acc, curr) => acc + curr.workshop, 0)}
              </div>
              <div style={{ color: "#166534", fontSize: "12px" }}>Workshops</div>
            </div>
            <div style={{ padding: "15px", background: "#fdf2f8", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ color: "#991b1b", fontWeight: "700", fontSize: "20px" }}>
                {activities.reduce((acc, curr) => acc + curr.paper, 0)}
              </div>
              <div style={{ color: "#991b1b", fontSize: "12px" }}>Research Papers</div>
            </div>
            <div style={{ padding: "15px", background: "#fffbeb", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ color: "#854d0e", fontWeight: "700", fontSize: "20px" }}>
                {activities.reduce((acc, curr) => acc + curr.eventConduct, 0)}
              </div>
              <div style={{ color: "#854d0e", fontSize: "12px" }}>Events Conducted</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ background: "white", padding: "30px" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>Assignment Tracking</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Total Assigned</span>
              <span style={{ fontWeight: "700", color: "#3b82f6" }}>{assignments.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Completed</span>
              <span style={{ fontWeight: "700", color: "#22c55e" }}>{assignments.filter(a => a.status === 'COMPLETED').length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Pending</span>
              <span style={{ fontWeight: "700", color: "#f59e0b" }}>{assignments.filter(a => a.status === 'PENDING').length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Overdue</span>
              <span style={{ fontWeight: "700", color: "#ef4444" }}>{assignments.filter(a => {
                const subDate = new Date(a.submissionDate);
                return a.status !== 'COMPLETED' && subDate < new Date();
              }).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodDashboard;
