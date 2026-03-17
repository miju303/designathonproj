import React, { useState, useEffect } from "react";
import { facultyApi } from "../services/api";
import { Save, User, Phone, Mail, Building, Briefcase, FileUp, CheckCircle, AlertCircle } from "lucide-react";

function FacultyProfile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        about: "",
        profilePhotoPath: "",
    });
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
    const [uploadNames, setUploadNames] = useState({
        certification: "",
        publication: "",
        project: "",
        patent: "",
        workshop: ""
    });
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await facultyApi.getProfile(userId);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUploadNameChange = (e) => {
        setUploadNames({ ...uploadNames, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\+?[0-9]*$/.test(value)) {
            setProfile({ ...profile, phone: value });
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const name = uploadNames[type] || `New ${type}`;

        try {
            setSaveStatus({ type: "info", message: `Uploading ${type}...` });
            await facultyApi.uploadFile(userId, type, file, name);
            setSaveStatus({ type: "success", message: `${type} uploaded successfully! ✅` });
            
            setUploadNames({ ...uploadNames, [type]: "" });

            const response = await facultyApi.getProfile(userId);
            setProfile(response.data);
        } catch (error) {
            setSaveStatus({ type: "error", message: `Failed to upload ${type}.` });
        }
    };

    const saveDetails = async () => {
        if (!profile.name || !profile.name.trim()) {
            setSaveStatus({ type: "error", message: "Name is required." });
            return;
        }

        const phoneRegex = /^\+91[0-9]{10}$/;
        if (profile.phone && profile.phone.trim() && !phoneRegex.test(profile.phone)) {
            setSaveStatus({ type: "error", message: "Phone must be in format +91XXXXXXXXXX (10-digit number after +91)." });
            return;
        }

        try {
            setSaveStatus({ type: "info", message: "Saving details..." });
            // Ensure ID is present for the backend
            const updateData = { ...profile, id: userId };
            await facultyApi.updateProfileV2(updateData);
            setSaveStatus({ type: "success", message: "Profile updated successfully! ✅" });
            
            const response = await facultyApi.getProfile(userId);
            setProfile(response.data);
        } catch (error) {
            setSaveStatus({ type: "error", message: "Failed to update profile." });
        }
        
        setTimeout(() => setSaveStatus({ type: "", message: "" }), 3000);
    };

    const inputContainerStyle = { marginBottom: "20px" };
    const labelStyle = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "8px"
    };
    const inputStyle = {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "10px",
        border: "1.5px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s"
    };
    const uploadBoxStyle = {
        padding: "20px",
        background: "#f8fafc",
        border: "1.5px dashed #cbd5e1",
        borderRadius: "12px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    };

    if (loading) return <div style={{ padding: "20px" }}>Loading Profile...</div>;

    return (
        <div style={{ maxWidth: "1000px", paddingBottom: "50px" }}>
            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ color: "#1e3a8a", margin: 0 }}>Faculty Profile</h1>
                    <p style={{ color: "#64748b", marginTop: "5px" }}>Complete your profile to boost your research score</p>
                </div>
                <button
                    onClick={saveDetails}
                    style={{
                        padding: "12px 25px",
                        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
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
                    <Save size={18} /> Save Profile
                </button>
            </div>

            {saveStatus.message && (
                <div style={{
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "25px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: saveStatus.type === "success" ? "#f0fdf4" : saveStatus.type === "error" ? "#fff1f2" : "#f0f9ff",
                    color: saveStatus.type === "success" ? "#166534" : saveStatus.type === "error" ? "#991b1b" : "#0369a1",
                    border: `1px solid ${saveStatus.type === "success" ? "#bbf7d0" : saveStatus.type === "error" ? "#fecaca" : "#bae6fd"}`
                }}>
                    {saveStatus.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {saveStatus.message}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    <div className="dashboard-card card-blue glitter-effect" style={{ textAlign: "center", padding: "30px" }}>
                        <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto 20px" }}>
                            <img
                                src={profile.profilePhotoPath ? `http://localhost:8080/uploads/${profile.profilePhotoPath}` : "https://via.placeholder.com/150"}
                                alt="Profile"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid white",
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                                }}
                            />
                            <label style={{
                                position: "absolute",
                                bottom: "5px",
                                right: "5px",
                                background: "#3b82f6",
                                color: "white",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                border: "3px solid white",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
                            }}>
                                <FileUp size={18} />
                                <input type="file" style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "photo")} />
                            </label>
                        </div>
                        <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontWeight: "700" }}>{profile.name || "Set Name"}</h3>
                        <p style={{ margin: 0, color: "#475569", fontSize: "14px", fontWeight: "600" }}>{profile.designation || "Set Designation"}</p>
                        <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "13px" }}>{profile.department || "No Department"}</p>
                    </div>

                    <div className="dashboard-card card-pink" style={{ padding: "25px" }}>
                        <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#991b1b", fontWeight: "700" }}>Profile Completion</h4>
                        <div style={{ width: "100%", background: "rgba(255,255,255,0.5)", height: "12px", borderRadius: "6px" }}>
                            <div style={{ 
                                width: `${profile.profileCompletion}%`, 
                                height: "100%", 
                                background: "#ef4444",
                                borderRadius: "6px",
                                transition: "width 0.5s ease"
                            }} />
                        </div>
                        <p style={{ textAlign: "right", margin: "10px 0 0", fontSize: "16px", fontWeight: "800", color: "#B91C1C" }}>
                            {profile.profileCompletion}%
                        </p>
                    </div>

                    <div className="dashboard-card card-purple" style={{ padding: "20px" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#6b21a8", fontWeight: "700" }}>Research Score</h4>
                        <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b" }}>{profile.researchScore}</div>
                        <p style={{ fontSize: "12px", color: "#6b21a8", margin: "5px 0 0" }}>Update documents to increase score</p>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    <div style={{
                        background: "white",
                        padding: "35px",
                        borderRadius: "20px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                    }}>
                        <h3 className="shiny-header" style={{ margin: "0 0 25px 0", color: "#1e3a8a", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", fontSize: "20px" }}>
                             Basic Information
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                            <div style={inputContainerStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div style={inputContainerStyle}>
                                <label style={labelStyle}>Email Address (Readonly)</label>
                                <input
                                    name="email"
                                    value={profile.email}
                                    style={{ ...inputStyle, background: "#f8fafc", cursor: "not-allowed", color: "#94a3b8" }}
                                    readOnly
                                />
                            </div>

                            <div style={inputContainerStyle}>
                                <label style={labelStyle}>Phone Number (+91 format)</label>
                                <input
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handlePhoneChange}
                                    style={inputStyle}
                                    placeholder="+919876543210"
                                />
                            </div>

                            <div style={inputContainerStyle}>
                                <label style={labelStyle}>Department</label>
                                <select
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">Select Department</option>
                                    <option value="CSE">CSE (Computer Science)</option>
                                    <option value="AIML">AIML (AI & Machine Learning)</option>
                                    <option value="AIDS">AIDS (AI & Data Science)</option>
                                    <option value="ECE">ECE (Electronics & Communication)</option>
                                    <option value="EEE">EEE (Electrical & Electronics)</option>
                                    <option value="MECH">MECH (Mechanical)</option>
                                    <option value="IT">IT (Information Technology)</option>
                                </select>
                            </div>

                            <div style={inputContainerStyle}>
                                <label style={labelStyle}>Designation</label>
                                <select
                                    name="designation"
                                    value={profile.designation}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">Select Designation</option>
                                    <option value="Assistant Professor">Assistant Professor</option>
                                    <option value="Associate Professor">Associate Professor</option>
                                    <option value="Professor">Professor</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <label style={labelStyle}>About (Short Biography)</label>
                            <textarea
                                name="about"
                                value={profile.about}
                                onChange={handleChange}
                                style={{ ...inputStyle, height: "100px", resize: "none" }}
                                placeholder="Describe yourself, your research interests, and expertise..."
                            />
                        </div>
                    </div>

                    <div style={{
                        background: "white",
                        padding: "35px",
                        borderRadius: "20px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                    }}>
                        <h3 className="shiny-header" style={{ margin: "0 0 25px 0", color: "#1e3a8a", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", fontSize: "20px" }}>
                            Academic Documents
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                            <div style={uploadBoxStyle}>
                                <p style={{ margin: "0", fontSize: "14px", fontWeight: "700", color: "#1e3a8a" }}>Patents</p>
                                <input 
                                    name="patent"
                                    value={uploadNames.patent}
                                    onChange={handleUploadNameChange}
                                    placeholder="Patent Title"
                                    style={{ ...inputStyle, padding: "8px 12px", fontSize: "12px" }}
                                />
                                <input type="file" style={{ fontSize: "12px" }} onChange={(e) => handleFileUpload(e, "patent")} />
                            </div>

                            <div style={uploadBoxStyle}>
                                <p style={{ margin: "0", fontSize: "14px", fontWeight: "700", color: "#1e3a8a" }}>Workshops</p>
                                <input 
                                    name="workshop"
                                    value={uploadNames.workshop}
                                    onChange={handleUploadNameChange}
                                    placeholder="Workshop Name"
                                    style={{ ...inputStyle, padding: "8px 12px", fontSize: "12px" }}
                                />
                                <input type="file" style={{ fontSize: "12px" }} onChange={(e) => handleFileUpload(e, "workshop")} />
                            </div>

                            <div style={uploadBoxStyle}>
                                <p style={{ margin: "0", fontSize: "14px", fontWeight: "700", color: "#1e3a8a" }}>Certifications</p>
                                <input 
                                    name="certification"
                                    value={uploadNames.certification}
                                    onChange={handleUploadNameChange}
                                    placeholder="Certification Name"
                                    style={{ ...inputStyle, padding: "8px 12px", fontSize: "12px" }}
                                />
                                <input type="file" style={{ fontSize: "12px" }} onChange={(e) => handleFileUpload(e, "certification")} />
                            </div>

                            <div style={uploadBoxStyle}>
                                <p style={{ margin: "0", fontSize: "14px", fontWeight: "700", color: "#1e3a8a" }}>Publications</p>
                                <input 
                                    name="publication"
                                    value={uploadNames.publication}
                                    onChange={handleUploadNameChange}
                                    placeholder="Publication Title"
                                    style={{ ...inputStyle, padding: "8px 12px", fontSize: "12px" }}
                                />
                                <input type="file" style={{ fontSize: "12px" }} onChange={(e) => handleFileUpload(e, "publication")} />
                            </div>

                            <div style={uploadBoxStyle}>
                                <p style={{ margin: "0", fontSize: "14px", fontWeight: "700", color: "#1e3a8a" }}>Projects</p>
                                <input 
                                    name="project"
                                    value={uploadNames.project}
                                    onChange={handleUploadNameChange}
                                    placeholder="Project Title"
                                    style={{ ...inputStyle, padding: "8px 12px", fontSize: "12px" }}
                                />
                                <input type="file" style={{ fontSize: "12px" }} onChange={(e) => handleFileUpload(e, "project")} />
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: "white",
                        padding: "35px",
                        borderRadius: "20px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                    }}>
                        <h3 className="shiny-header" style={{ margin: "0 0 25px 0", color: "#1e3a8a", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", fontSize: "20px" }}>
                            Uploaded Documents
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {['certifications', 'publications', 'projects', 'patents', 'workshops'].map(type => 
                                profile[type] && profile[type].length > 0 ? (
                                    <div key={type}>
                                        <h4 style={{ margin: "0 0 10px 0", textTransform: "capitalize", color: "#475569" }}>{type}</h4>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                        {profile[type].map((doc, idx) => (
                                            <a 
                                                key={idx}
                                                href={`http://localhost:8080/api/uploads/${doc.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    padding: "8px 15px",
                                                    background: "#f1f5f9",
                                                    color: "#3b82f6",
                                                    borderRadius: "8px",
                                                    textDecoration: "none",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    border: "1px solid #cbd5e1",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px"
                                                }}
                                            >
                                                📄 {doc.certificateName || doc.title || doc.projectTitle}
                                            </a>
                                        ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                            {(!profile.certifications?.length && !profile.publications?.length && !profile.projects?.length && !profile.patents?.length && !profile.workshops?.length) && (
                                <p style={{ color: "#94a3b8", fontSize: "14px", fontStyle: "italic" }}>No documents uploaded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FacultyProfile;