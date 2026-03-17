import React, { useState } from 'react';
import { fileApi } from '../services/api';
import { Upload, File, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const FileUploadDemo = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus({ type: '', message: '' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus({ type: 'error', message: 'Please select a file first.' });
            return;
        }

        setUploading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fileApi.upload(file);
            console.log('Upload success:', response.data);
            setUploadedDocuments([response.data, ...uploadedDocuments]);
            setStatus({ type: 'success', message: 'File uploaded successfully!' });
            setFile(null);
            // Reset input field
            e.target.reset();
        } catch (error) {
            console.error('Upload error:', error);
            setStatus({ type: 'error', message: 'Failed to upload file. Please check backend connection.' });
        } finally {
            setUploading(false);
        }
    };

    const handleViewFile = (fileId) => {
        const url = fileApi.getFileUrl(fileId);
        window.open(url, '_blank');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '32px' }}>
                <h1 style={{ marginBottom: '8px', color: '#1e293b', fontSize: '24px' }}>File Upload System</h1>
                <p style={{ marginBottom: '32px', color: '#64748b' }}>Store and manage certificates and research papers securely.</p>

                <form onSubmit={handleUpload} style={{ marginBottom: '40px' }}>
                    <div style={{ 
                        border: '2px dashed #e2e8f0', 
                        borderRadius: '12px', 
                        padding: '40px', 
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                    }}
                    onClick={() => document.getElementById('fileInput').click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                    }}
                    >
                        <input 
                            id="fileInput"
                            type="file" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                        />
                        <Upload size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                        <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#334155' }}>
                            {file ? file.name : "Click to upload or drag and drop"}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>PDF, PNG, JPG (max 10MB)</p>
                    </div>

                    {status.message && (
                        <div style={{ 
                            marginTop: '16px', 
                            padding: '12px 16px', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                            color: status.type === 'success' ? '#166534' : '#991b1b',
                            fontSize: '14px'
                        }}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {status.message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={uploading || !file}
                        style={{ 
                            marginTop: '24px',
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: (uploading || !file) ? 'not-allowed' : 'pointer',
                            opacity: (uploading || !file) ? 0.7 : 1,
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                </form>

                <h3 style={{ marginBottom: '16px', color: '#334155', fontSize: '18px' }}>Recent Uploads</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {uploadedDocuments.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>No documents uploaded in this session.</p>
                    ) : (
                        uploadedDocuments.map(doc => (
                            <div key={doc.id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '16px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                backgroundColor: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                                        <File size={20} color="#3b82f6" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>{doc.fileName}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleViewFile(doc.id)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px',
                                        padding: '8px 16px',
                                        backgroundColor: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#475569',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View File <ExternalLink size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploadDemo;
