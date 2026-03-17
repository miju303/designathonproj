import React, { useEffect, useState } from 'react';
import { notificationApi } from '../services/api';
import { Bell, Info, AlertTriangle, CheckCircle, MailOpen } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications(userId);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead(userId);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'REMINDER': return <AlertTriangle size={18} color="#f59e0b" />;
      case 'ACHIEVEMENT': return <CheckCircle size={18} color="#22c55e" />;
      default: return <Info size={18} color="#3b82f6" />;
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading Notifications...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: 0 }}>Live Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllRead}
            style={{ 
              padding: "8px 15px", 
              background: "#f1f5f9", 
              border: "none", 
              borderRadius: "8px", 
              color: "#475569", 
              fontSize: "14px", 
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <MailOpen size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {notifications.length > 0 ? notifications.map(n => (
          <div key={n.id} 
            onClick={() => !n.read && markRead(n.id)}
            style={{
              background: n.read ? "white" : "#eff6ff",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              display: "flex",
              gap: "15px",
              alignItems: "flex-start",
              border: n.read ? "1px solid #f1f5f9" : "1px solid #bfdbfe",
              cursor: n.read ? "default" : "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{
              padding: "10px",
              background: n.read ? "#f1f5f9" : "white",
              borderRadius: "12px"
            }}>
              {getIcon(n.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", color: n.read ? "#475569" : "#1e3a8a", fontWeight: n.read ? "600" : "700" }}>
                  {n.type === 'REMINDER' ? 'Important Reminder' : n.type === 'ACHIEVEMENT' ? 'System Milestone' : 'System Notification'}
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(n.timestamp).toLocaleString()}</span>
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{n.message}</p>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
            <Bell size={48} style={{ opacity: 0.2, marginBottom: "15px" }} />
            <p>You're all caught up! No recent notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
