import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Activity, Clock, Filter, Trash2 } from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, logs would come from a dedicated Audit service
    // For now, we reuse the faculty analytics or simulated system logs
    const fetchLogs = async () => {
      try {
        const response = await adminApi.getAnalytics();
        // Simulating logs based on system events
        const mockLogs = [
          { id: 1, event: 'System Statistics Compiled', user: 'System', time: '10 mins ago', type: 'info' },
          { id: 2, event: 'Database Backup Completed', user: 'System', time: '1 hour ago', type: 'success' },
          { id: 3, event: 'New Faculty Registered', user: 'admin@gmail.com', time: '2 hours ago', type: 'info' },
          { id: 4, event: 'Low Performance Alert Triggered', user: 'System', time: '5 hours ago', type: 'warning' },
          { id: 5, event: 'HOD Session Expired', user: 'hod@gmail.com', time: '1 day ago', type: 'info' },
        ];
        setLogs(mockLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading System Logs...</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: "#1e3a8a", margin: 0 }}>System Logs</h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Activity tracking and audit trails</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            padding: "10px 15px",
            background: "white",
            color: "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer"
          }}>
            <Filter size={16} /> Filter Logs
          </button>
          <button style={{
            padding: "10px 15px",
            background: "#fee2e2",
            color: "#ef4444",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer"
          }}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px', color: '#64748b', fontSize: '13px' }}>Event Handler</th>
              <th style={{ padding: '15px 20px', color: '#64748b', fontSize: '13px' }}>Action / Event</th>
              <th style={{ padding: '15px 20px', color: '#64748b', fontSize: '13px' }}>Timestamp</th>
              <th style={{ padding: '15px 20px', color: '#64748b', fontSize: '13px' }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{log.user}</td>
                <td style={{ padding: '15px 20px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={16} color="#94a3b8" /> {log.event}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', color: '#64748b', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {log.time}
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: '8px', 
                    fontSize: '11px', 
                    fontWeight: 'bold',
                    background: log.type === 'warning' ? '#fef3c7' : log.type === 'success' ? '#dcfce7' : '#e0e7ff',
                    color: log.type === 'warning' ? '#b45309' : log.type === 'success' ? '#166534' : '#3730a3'
                  }}>
                    {log.type.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogs;
