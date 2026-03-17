import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Award, Users, Shield, Calendar, Bell } from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      color: "white",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "24px", fontWeight: "700" }}>
          <span style={{ fontSize: "32px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🎓
          </span>
          Faculty Portal
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 24px",
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
            transition: "transform 0.2s, boxShadow 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          Login to Portal
        </button>
      </nav>

      {/* Hero Section */}
      <div style={{
        padding: "100px 50px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <h1 style={{
          fontSize: "64px",
          fontWeight: "800",
          lineHeight: "1.2",
          marginBottom: "24px",
          background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Faculty Profile Update Reminder System
        </h1>
        <p style={{
          fontSize: "20px",
          color: "#94a3b8",
          lineHeight: "1.6",
          marginBottom: "50px"
        }}>
          A comprehensive platform designed to streamline faculty profile management, track academic achievements, handle department assignments, and automate profile update reminders.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "16px 40px",
            background: "white",
            color: "#0f172a",
            border: "none",
            borderRadius: "40px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(255, 255, 255, 0.1)",
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-3px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div style={{
        padding: "60px 50px 100px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <FeatureCard 
          icon={<BookOpen size={32} color="#3b82f6" />}
          title="Profile Management" 
          desc="Easily maintain records of publications, patents, workshops, and certifications." 
        />
        <FeatureCard 
          icon={<Award size={32} color="#8b5cf6" />}
          title="Achievement Tracking" 
          desc="Automated Research Score calculation and achievement badge system." 
        />
        <FeatureCard 
          icon={<Bell size={32} color="#f59e0b" />}
          title="Automated Reminders" 
          desc="Stay updated with profile completion alerts and department notifications." 
        />
        <FeatureCard 
          icon={<Shield size={32} color="#10b981" />}
          title="Admin Controls" 
          desc="Robust management for departments, roles, and system configuration." 
        />
        <FeatureCard 
          icon={<Users size={32} color="#ec4899" />}
          title="HOD Analytics" 
          desc="Real-time department performance graphs and faculty status tracking." 
        />
        <FeatureCard 
          icon={<Calendar size={32} color="#06b6d4" />}
          title="Assignment & Events" 
          desc="Integrated academic calendar and department task assignments." 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      padding: "30px",
      borderRadius: "20px",
      transition: "transform 0.3s, background 0.3s",
      cursor: "default"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-10px)";
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
    }}
    >
      <div style={{
        background: "rgba(255,255,255,0.1)",
        width: "60px",
        height: "60px",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px", color: "white" }}>{title}</h3>
      <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "15px", margin: 0 }}>{desc}</p>
    </div>
  );
}

export default LandingPage;
