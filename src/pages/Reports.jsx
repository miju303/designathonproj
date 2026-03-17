import React from 'react';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';
import { reportApi } from '../services/api';

const Reports = () => {
  const downloadPdf = async () => {
    try {
      const response = await reportApi.downloadNaacPdf();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'NAAC_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Failed to download PDF report.");
    }
  };

  return (
    <div>
      <h1 style={{ color: "#1e3a8a", marginBottom: "30px" }}>Department Reports</h1>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "15px", 
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <BarChart3 size={64} color="#3b82f6" style={{ marginBottom: "20px", opacity: 0.2 }} />
        <h2 style={{ color: "#1e293b", margin: "0 0 10px 0" }}>Report Center</h2>
        <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 30px" }}>
          Detailed department-wise academic performance and profile completion reports are available here.
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button style={{
            padding: "12px 25px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer"
          }}>
            <FileSpreadsheet size={18} /> Export as Excel
          </button>
          <button 
            onClick={downloadPdf}
            style={{
              padding: "12px 25px",
              background: "#1e293b",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
