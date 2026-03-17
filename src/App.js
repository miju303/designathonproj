import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import FacultyProfile from "./pages/FacultyProfile.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HodDashboard from "./pages/HodDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageFaculty from "./pages/ManageFaculty.jsx";
import FacultyStatus from "./pages/FacultyStatus.jsx";
import Notifications from "./pages/Notifications.jsx";
import Reports from "./pages/Reports.jsx";
import AdminNaac from "./pages/AdminNaac.jsx";
import AdminLogs from "./pages/AdminLogs.jsx";
import Calendar from "./pages/Calendar.jsx";
import FacultyActivity from "./pages/FacultyActivity.jsx";
import AchievementUpload from "./pages/AchievementUpload.jsx";
import AttendanceTracker from "./pages/AttendanceTracker.jsx";
import ManageAssignments from "./pages/ManageAssignments.jsx";
import MyAssignments from "./pages/MyAssignments.jsx";

import Layout from "./components/Layout";
import { UserProvider, useUser } from "./context/UserContext";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/**
 * ProtectedRoute — checks user from context (with localStorage fallback).
 * Redirects to /login if not authenticated or wrong role.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();

  // While session is being checked on startup, show nothing
  if (loading) return null;

  const role = user?.role?.toLowerCase() || null;

  if (!role) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* General Dashboard Route */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["faculty", "hod", "admin"]}><Dashboard /></ProtectedRoute>} />
        
        {/* Protected Routes */}
        <Route path="/calendar" element={<ProtectedRoute allowedRoles={["faculty", "hod", "admin"]}><Calendar /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyActivity /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute allowedRoles={["faculty"]}><AchievementUpload /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute allowedRoles={["faculty", "hod"]}><AttendanceTracker /></ProtectedRoute>} />
        <Route path="/manage-assignments" element={<ProtectedRoute allowedRoles={["admin", "hod"]}><ManageAssignments /></ProtectedRoute>} />
        <Route path="/my-assignments" element={<ProtectedRoute allowedRoles={["faculty"]}><MyAssignments /></ProtectedRoute>} />
        
        {/* Faculty Dashboard */}
        <Route 
          path="/faculty/dashboard" 
          element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/faculty-profile" 
          element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyProfile /></ProtectedRoute>} 
        />
        <Route 
          path="/notifications" 
          element={<ProtectedRoute allowedRoles={["faculty", "hod", "admin"]}><Notifications /></ProtectedRoute>} 
        />

        {/* HOD Routes */}
        <Route 
          path="/hod/dashboard" 
          element={<ProtectedRoute allowedRoles={["hod"]}><HodDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/hod-list" 
          element={<ProtectedRoute allowedRoles={["hod"]}><FacultyStatus /></ProtectedRoute>} 
        />
        <Route 
          path="/hod-reports" 
          element={<ProtectedRoute allowedRoles={["hod", "faculty"]}><Reports /></ProtectedRoute>} 
        />

        {/* Admin Dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-manage" 
          element={<ProtectedRoute allowedRoles={["admin"]}><ManageFaculty /></ProtectedRoute>} 
        />
        <Route 
          path="/manage-faculty" 
          element={<ProtectedRoute allowedRoles={["admin"]}><ManageFaculty /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-naac" 
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminNaac /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-logs" 
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminLogs /></ProtectedRoute>} 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;