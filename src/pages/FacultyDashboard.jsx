import React, { useEffect, useState } from "react";
import { facultyApi } from "../services/api";
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp 
} from "lucide-react";

function FacultyDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = localStorage.getItem("userId");
        if (!id) {
          console.error("No userId found in localStorage");
          setLoading(false);
          return;
        }
        const response = await facultyApi.getProfile(id);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Faculty Dashboard...</div>;
  if (!profile) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#ef4444' }}>Profile not found</h2>
      <p>There was an issue loading your profile. Please try logging out and in again.</p>
      <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={{ padding: "10px 20px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px" }}>
        Return to Login
      </button>
    </div>
  );

  const getCompletionColor = (val) => {
    if (val >= 80) return "#22c55e";
    if (val >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>Faculty Dashboard</h1>
        <p style={{ color: "#64748b", marginTop: "5px" }}>
          Welcome back, {profile?.name ? profile.name.split(' ')[0] : 'Faculty'}!
        </p>
      </div>

      {/* DASHBOARD CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "30px"
      }}>
        <div className="dashboard-card card-pink glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#1e293b", fontSize: "15px", fontWeight: "700" }}>Profile Completion</span>
            <CheckCircle color="#fb7185" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{profile.profileCompletion}%</div>
          <div style={{ width: "100%", background: "rgba(255,255,255,0.5)", height: "10px", borderRadius: "5px", marginTop: "15px" }}>
            <div style={{ 
              width: `${profile.profileCompletion}%`, 
              height: "100%", 
              background: "#fb7185",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(251, 113, 133, 0.5)"
            }} />
          </div>
        </div>

        <div className="dashboard-card card-purple glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#1e293b", fontSize: "15px", fontWeight: "700" }}>Research Score</span>
            <TrendingUp color="#8b5cf6" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{profile.researchScore}</div>
          <p style={{ color: "#4b5563", fontSize: "13px", marginTop: "10px", fontWeight: "500" }}>Overall research impact</p>
        </div>

        <div className="dashboard-card card-blue glitter-effect">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ color: "#1e293b", fontSize: "15px", fontWeight: "700" }}>Badges Earned</span>
            <Award color="#3b82f6" size={24} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b" }}>{profile.badges ? profile.badges.length : 0}</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
            {profile.badges && profile.badges.map((badge, idx) => (
              <span key={idx} style={{ 
                background: "rgba(255,255,255,0.6)", 
                color: "#1e40af", 
                fontSize: "11px", 
                padding: "3px 10px", 
                borderRadius: "12px",
                fontWeight: "700",
                border: "1px solid rgba(59, 130, 246, 0.3)"
              }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* ACTIVITY TIMELINE */}
        <div className="dashboard-card card-yellow" style={{ padding: "30px" }}>
          <h3 className="shiny-header" style={{ margin: "0 0 25px 0", color: "#854d0e", display: "flex", alignItems: "center", gap: "12px", fontSize: "20px" }}>
            <Clock size={22} color="#a16207" /> Activity Timeline
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {profile.activities && profile.activities.length > 0 ? profile.activities.map((activity, idx) => (
              <div key={idx} style={{ display: "flex", gap: "18px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ 
                    width: "14px", 
                    height: "14px", 
                    borderRadius: "50%", 
                    background: "#eab308",
                    border: "3px solid #fef9c3",
                    boxShadow: "0 0 8px rgba(234, 179, 8, 0.4)"
                  }} />
                  {idx !== profile.activities.length - 1 && (
                    <div style={{ width: "2px", flex: 1, background: "rgba(234, 179, 8, 0.2)", marginTop: "4px" }} />
                  )}
                </div>
                <div style={{ paddingBottom: "12px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>{activity.type}</div>
                  <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "3px" }}>{activity.description}</div>
                  <div style={{ fontSize: "12px", color: "#71717a", marginTop: "6px", fontWeight: "500" }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )) : <p style={{ color: "#71717a", fontStyle: "italic" }}>No activities recorded yet.</p>}
          </div>
        </div>

        {/* PROFILE ALERT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {profile.profileCompletion < 50 && (
            <div style={{
              background: "#fff1f2",
              padding: "20px",
              borderRadius: "15px",
              border: "1px solid #fecaca",
              color: "#991b1b"
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>⚠ Urgent: Profile Incomplete</h4>
              <p style={{ fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
                Your profile is only {profile.profileCompletion}% complete. Please update your details to avoid administrative reminders.
              </p>
            </div>
          )}

          <div style={{
            background: "#f0fdf4",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #bbf7d0",
            color: "#166534"
          }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>💡 Quick Tip</h4>
            <p style={{ fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
              Uploading project proofs and certificates can significantly boost your Research Score and unlock achievement badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;