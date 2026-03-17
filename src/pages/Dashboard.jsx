import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard, ShieldCheck, Briefcase } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    try {
      setUserData(JSON.parse(userStr));
    } catch (e) {
      console.error("Error parsing user data", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!userData) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
      color: "#1e293b"
    }}>
      {/* Navbar */}
      <nav style={{
        background: "white",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            background: "#3b82f6",
            color: "white",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold"
          }}>F</div>
          <span style={{ fontWeight: "700", fontSize: "20px", color: "#0f172a" }}>Faculty System</span>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            background: "white",
            color: "#64748b",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#fff1f2";
            e.target.style.color = "#e11d48";
            e.target.style.borderColor = "#fecdd3";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#64748b";
            e.target.style.borderColor = "#e2e8f0";
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </nav>

      <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>
            Welcome back, {userData.name}!
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>
            Here is what's happening in your department today.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {/* User Profile Card */}
          <div style={{
            background: "white",
            padding: "32px",
            borderRadius: "20px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            border: "1px solid #f1f5f9",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
              <div style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6"
              }}>
                <User size={32} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{userData.name}</h3>
                <span style={{ 
                  display: "inline-block", 
                  marginTop: "4px",
                  padding: "2px 10px", 
                  borderRadius: "20px", 
                  background: "#f1f5f9", 
                  fontSize: "12px", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  color: "#64748b" 
                }}>{userData.role}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#475569" }}>
                <Briefcase size={18} style={{ color: "#94a3b8" }} />
                <span style={{ fontSize: "14px" }}><b>Department:</b> {userData.department}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#475569" }}>
                <ShieldCheck size={18} style={{ color: "#94a3b8" }} />
                <span style={{ fontSize: "14px" }}><b>ID:</b> {userData.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "32px",
            borderRadius: "20px",
            color: "white",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <LayoutDashboard size={24} style={{ color: "#3b82f6" }} />
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>System Overview</h3>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
              You are logged in as a <b>{userData.role}</b>. Depending on your role, you have access to different modules of the Faculty Management System.
            </p>
            <div style={{ marginTop: "24px" }}>
              <button 
                onClick={() => navigate(`/${userData.role.toLowerCase()}/dashboard`)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Go to Detailed Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
