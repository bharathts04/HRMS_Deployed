import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Download, Trash2, FileText, Search, Filter, ExternalLink, ShieldCheck, Award, FileSpreadsheet } from 'lucide-react';
import UploadDocumentModal from '../components/UploadDocumentModal';

const Documents = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const endpoint = isAdminOrHR ? '/documents/all' : `/documents/employee/${user.id}`;
      const res = await api.get(endpoint);
      if (res.success) {
        setDocuments(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document permanently?')) {
      try {
        const res = await api.delete(`/documents/${id}`);
        if (res.success) {
          fetchDocuments();
        } else {
          alert(res.message || 'Failed to delete document.');
        }
      } catch (err) {
        alert('An error occurred while deleting the document.');
      }
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      RESUME: { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.2)', icon: <FileText size={14} /> },
      PAN: { bg: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed', border: '1px solid rgba(139, 92, 246, 0.2)', icon: <ShieldCheck size={14} /> },
      AADHAAR: { bg: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed', border: '1px solid rgba(139, 92, 246, 0.2)', icon: <ShieldCheck size={14} /> },
      PASSPORT: { bg: 'rgba(236, 72, 153, 0.1)', color: '#db2777', border: '1px solid rgba(236, 72, 153, 0.2)', icon: <ShieldCheck size={14} /> },
      CERTIFICATE: { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.2)', icon: <Award size={14} /> },
      OTHER: { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)', icon: <FileSpreadsheet size={14} /> },
    };
    const current = styles[type] || styles.OTHER;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: current.bg,
        color: current.color,
        border: current.border
      }}>
        {current.icon}
        {type}
      </span>
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedType === 'ALL' || doc.type === selectedType;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (doc.originalFileName && doc.originalFileName.toLowerCase().includes(searchLower)) ||
      (doc.fileName && doc.fileName.toLowerCase().includes(searchLower)) ||
      (doc.employeeName && doc.employeeName.toLowerCase().includes(searchLower));
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            {isAdminOrHR ? 'Company Documents' : 'My Documents'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.95rem' }}>
            {isAdminOrHR ? 'Manage and review verified digital documents for all employees.' : 'Upload and securely manage your personal identification and work credentials.'}
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
          onClick={() => setShowUploadModal(true)}
        >
          <Plus size={18} /> Upload Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card mb-6" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder={isAdminOrHR ? "Search by filename or employee name..." : "Search by filename..."}
            className="form-input w-full"
            style={{ paddingLeft: '38px', margin: 0 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-input"
            style={{ margin: 0, minWidth: '160px' }}
          >
            <option value="ALL">All Types</option>
            <option value="RESUME">Resume / CV</option>
            <option value="PAN">PAN Card</option>
            <option value="AADHAAR">Aadhaar / ID</option>
            <option value="PASSPORT">Passport</option>
            <option value="CERTIFICATE">Certificate</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Table */}
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
          Loading documents...
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="glass-card text-center py-12" style={{ color: 'var(--text-secondary)' }}>
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm opacity-75 mt-1">
            {searchQuery || selectedType !== 'ALL' 
              ? 'Try adjusting your search filters.' 
              : 'Click "Upload Document" above to get started.'}
          </p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <table className="w-full text-left border-collapse" style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(249, 250, 251, 0.4)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                {isAdminOrHR && (
                  <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee</th>
                )}
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uploaded Date</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc, idx) => (
                <tr 
                  key={doc.id || idx} 
                  style={{ 
                    borderBottom: idx === filteredDocuments.length - 1 ? 'none' : '1px solid var(--border-color)',
                    transition: 'background-color 0.2s',
                  }}
                  className="hover:bg-slate-50/50"
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', color: 'var(--primary-color)' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {doc.originalFileName || doc.fileName || 'Unnamed File'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          ID: #{doc.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {getTypeBadge(doc.type)}
                  </td>
                  {isAdminOrHR && (
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {doc.employeeName || `Employee #${doc.employeeId}`}
                      </div>
                      {doc.employeeId && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EMP-{doc.employeeId}</div>}
                    </td>
                  )}
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2">
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                          title="Download / Preview"
                        >
                          <Download size={14} /> Download
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="btn btn-danger"
                        style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onDocumentUploaded={(newDoc) => {
            fetchDocuments();
          }}
        />
      )}
    </div>
  );
};

export default Documents;
