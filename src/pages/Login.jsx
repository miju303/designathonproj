import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useUser } from "../context/UserContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authApi.login({ email, password });
      const data = response.data;

      if (data.success) {
        // Persist to localStorage so ProtectedRoute works immediately
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userDept", data.department || "");

        // Refresh the UserContext so Sidebar gets full user info
        await refreshUser();

        // Role-based redirection
        if (data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (data.role === "HOD") {
          navigate("/hod/dashboard");
        } else if (data.role === "FACULTY") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc", // Matches dashboard background
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "48px",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e2e8f0",
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div style={{ 
            fontSize: "56px", 
            marginBottom: "16px",
            display: "inline-block"
          }}>
            🎓
          </div>
          <h2 style={{ 
            margin: 0, 
            fontSize: "32px", 
            fontWeight: "700", 
            color: "#1e3a8a", // Match dashboard title color
            letterSpacing: "-0.025em" 
          }}>
            Faculty Portal
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "16px" }}>
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "15px",
                color: "#1e293b",
                outline: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: "28px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  paddingRight: "48px",
                  background: "#ffffff",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "15px",
                  color: "#1e293b",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  padding: "4px",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#ef4444",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textAlign: "left"
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
              marginBottom: "10px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 20px 25px -5px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "none";
                e.target.style.boxShadow = "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Validating credentials...
              </>
            ) : "Log In"}
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;
