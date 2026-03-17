import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Award, CheckCircle, TrendingUp, Download, Users } from 'lucide-react';

const AdminNaac = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await adminApi.getNaacReport();
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching NAAC report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading NAAC Report...</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: "#1e3a8a", margin: 0 }}>NAAC Accreditation Report</h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Generated on {new Date(report.timestamp).toLocaleString()}</p>
        </div>
        <button style={{
          padding: "12px 20px",
          background: "#1e293b",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer"
        }}>
          <Download size={18} /> Export Full Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px' }}>Summary Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Accreditation Score</span>
                <span style={{ fontWeight: 'bold', color: '#22c55e' }}>A++ (Predicted)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Faculty Completion</span>
                <span style={{ fontWeight: 'bold' }}>
                  {report.summary && report.summary.totalFaculty > 0 
                    ? Math.round((report.summary.profilesCompleted / report.summary.totalFaculty) * 100) 
                    : 0}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Excellent Research</span>
                <span style={{ fontWeight: 'bold' }}>{report.highPerformingFaculty ? report.highPerformingFaculty.length : 0} Faculty</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#f0f9ff', padding: '25px', borderRadius: '15px', border: '1px solid #bae6fd' }}>
            <TrendingUp size={32} color="#0369a1" style={{ marginBottom: '15px' }} />
            <h4 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Growth Trend</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#0c4a6e', lineHeight: '1.5' }}>
              Institutional research output has increased by 12% compared to the previous assessment cycle.
            </p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} color="#a855f7" /> High Performing Faculty List (90%+)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1.5px solid #f1f5f9' }}>
                  <th style={{ padding: '12px 10px' }}>Name</th>
                  <th style={{ padding: '12px 10px' }}>Dept</th>
                  <th style={{ padding: '12px 10px' }}>Completion</th>
                  <th style={{ padding: '12px 10px' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {report.highPerformingFaculty && report.highPerformingFaculty.length > 0 ? report.highPerformingFaculty.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{f.name}</td>
                    <td style={{ padding: '12px 10px' }}>{f.dept}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <CheckCircle size={14} color="#22c55e" style={{ display: 'inline', marginRight: '5px' }} /> {f.completion}%
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ padding: '2px 8px', background: '#f3e8ff', color: '#7e22ce', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                        EXCELLENT
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No faculty met the high-performance criteria (90%+).</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNaac;
