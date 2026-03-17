import React, { useEffect, useState } from "react";
import { adminApi } from "../services/api";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  UserPlus,
  Shield,
  Filter
} from "lucide-react";

function ManageFaculty() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [newFaculty, setNewFaculty] = useState({ name: "", email: "", password: "", role: "FACULTY", department: "", designation: "" });
  const [newPassword, setNewPassword] = useState("");
  const [newDept, setNewDept] = useState("");

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getFaculties();
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await adminApi.addFaculty(newFaculty);
      setShowAddModal(false);
      setNewFaculty({ name: "", email: "", password: "", role: "FACULTY", department: "", designation: "" });
      fetchFaculties();
      alert("User added successfully!");
    } catch (error) {
      alert("Failed to add user.");
    }
  };

  const handleUpdate = async () => {
    try {
      await adminApi.updateFaculty(selectedFaculty.id, selectedFaculty);
      setShowEditModal(false);
      fetchFaculties();
      alert("Faculty updated successfully!");
    } catch (error) {
      alert("Failed to update faculty.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await adminApi.resetPassword(selectedFaculty.id, newPassword);
      setShowPasswordModal(false);
      setNewPassword("");
      alert("Password reset successfully!");
    } catch (error) {
      alert("Failed to reset password.");
    }
  };

  const handleAssignDept = async () => {
    try {
      await adminApi.assignDepartment(selectedFaculty.id, newDept);
      setShowDeptModal(false);
      setNewDept("");
      fetchFaculties();
      alert("Department assigned successfully!");
    } catch (error) {
      alert("Failed to assign department.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminApi.deleteFaculty(id);
        fetchFaculties();
      } catch (error) {
        alert("Failed to delete user.");
      }
    }
  };

  const filtered = Array.isArray(faculties) ? faculties.filter(f => {
    const name = f.name || "";
    const email = f.email || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || f.role === roleFilter;
    return matchesSearch && matchesRole;
  }) : [];

  if (loading) return <div style={{ padding: "20px" }}>Loading Management...</div>;

  return (
    <div>
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#1e3a8a", margin: 0 }}>Manage Users</h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Add, edit or remove system users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "12px 20px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5)"
          }}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "15px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "15px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search style={{ position: "absolute", left: "12px", top: "10px", color: "#94a3b8" }} size={18} />
            <input
              placeholder="Search by name or email..."
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Filter size={18} color="#64748b" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                fontSize: "14px",
                outline: "none"
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="FACULTY">Faculty</option>
              <option value="HOD">HOD</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Name</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Email</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Role</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Dept/Desig</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Completion</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Score</th>
              <th style={{ padding: "15px 20px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "15px 20px", fontWeight: "600" }}>{f.name}</td>
                <td style={{ padding: "15px 20px", color: "#64748b" }}>{f.email}</td>
                <td style={{ padding: "15px 20px" }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "11px", 
                    fontWeight: "bold",
                    background: f.role === 'ADMIN' ? '#fee2e2' : f.role === 'HOD' ? '#fef3c7' : '#e0e7ff',
                    color: f.role === 'ADMIN' ? '#b91c1c' : f.role === 'HOD' ? '#b45309' : '#4338ca'
                  }}>
                    {f.role}
                  </span>
                </td>
                <td style={{ padding: "15px 20px" }}>
                  <div style={{ color: "#1e3a8a", fontWeight: "600" }}>{f.department || "-"}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{f.designation || "Not Assigned"}</div>
                </td>
                <td style={{ padding: "15px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, background: "#f1f5f9", width: "60px", height: "6px", borderRadius: "3px" }}>
                      <div style={{ width: `${f.profileCompletion}%`, height: "100%", background: "#22c55e", borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>{f.profileCompletion}%</span>
                  </div>
                </td>
                <td style={{ padding: "15px 20px", fontWeight: "700", color: "#6366f1" }}>{f.researchScore || 0}</td>
                <td style={{ padding: "15px 20px", display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => { setSelectedFaculty(f); setShowEditModal(true); }}
                    style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "5px" }}
                    title="Edit Faculty"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedFaculty(f); setShowPasswordModal(true); }}
                    style={{ color: "#f59e0b", background: "none", border: "none", cursor: "pointer", padding: "5px" }}
                    title="Reset Password"
                  >
                    <Shield size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(f.id)} 
                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "5px" }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "400px" }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#1e3a8a" }}>Edit Faculty</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                placeholder="Full Name" 
                value={selectedFaculty.name} 
                onChange={(e) => setSelectedFaculty({...selectedFaculty, name: e.target.value})}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <input 
                placeholder="Email Address" 
                value={selectedFaculty.email} 
                onChange={(e) => setSelectedFaculty({...selectedFaculty, email: e.target.value})}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
               <input 
                placeholder="Designation" 
                value={selectedFaculty.designation} 
                onChange={(e) => setSelectedFaculty({...selectedFaculty, designation: e.target.value})}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <select 
                value={selectedFaculty.role} 
                onChange={(e) => setSelectedFaculty({...selectedFaculty, role: e.target.value})}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              >
                <option value="FACULTY">Faculty</option>
                <option value="HOD">HOD</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={handleUpdate} style={{ flex: 1, padding: "12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Save Changes
                </button>
                <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {showPasswordModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "15px", width: "400px" }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#1e3a8a" }}>Reset Password</h2>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>Set new password for {selectedFaculty.name}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                type="password"
                placeholder="Enter New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleResetPassword} style={{ flex: 1, padding: "12px", background: "#f59e0b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Reset Now
                </button>
                <button onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFaculty;
