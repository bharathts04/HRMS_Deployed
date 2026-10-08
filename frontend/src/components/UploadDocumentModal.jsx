import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UploadDocumentModal = ({ onClose, onDocumentUploaded }) => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR';
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(user?.id || '');
  const [documentType, setDocumentType] = useState('RESUME');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAdminOrHR) {
      fetchEmployees();
    }
  }, [isAdminOrHR]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees?size=100');
      if (res.success) {
        setEmployees(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!selectedEmployeeId) {
      setError('Please select an employee.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', selectedEmployeeId);
      formData.append('type', documentType);

      const res = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.success) {
        onDocumentUploaded(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to upload document.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error uploading document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-2 mb-6">
          <UploadCloud className="text-indigo-600" size={24} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Upload New Document</h2>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isAdminOrHR && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload for Employee</label>
              <select 
                value={selectedEmployeeId} 
                onChange={(e) => setSelectedEmployeeId(e.target.value)} 
                className="form-input w-full" 
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.department?.name || 'No Dept'})</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select 
              value={documentType} 
              onChange={(e) => setDocumentType(e.target.value)} 
              className="form-input w-full" 
              required
            >
              <option value="RESUME">Resume / CV</option>
              <option value="PAN">PAN Card</option>
              <option value="AADHAAR">Aadhaar / Gov ID</option>
              <option value="PASSPORT">Passport</option>
              <option value="CERTIFICATE">Educational / Professional Certificate</option>
              <option value="OTHER">Other Document</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Choose File</label>
            <div 
              style={{ 
                border: '2px dashed var(--border-color, #cbd5e1)', 
                borderRadius: '12px', 
                padding: '24px', 
                textAlign: 'center',
                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s'
              }}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input 
                id="file-upload-input" 
                type="file" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
                required
              />
              {file ? (
                <div className="flex flex-col items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={32} />
                  <span className="font-medium text-sm text-gray-800">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB — Click to change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <FileText size={32} className="text-indigo-500 opacity-70" />
                  <span className="font-medium text-sm text-gray-700">Click here to browse files</span>
                  <span className="text-xs text-gray-400">PDF, JPG, PNG or DOCX up to 10MB</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 16px' }} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
