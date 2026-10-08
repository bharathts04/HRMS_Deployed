import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AddReviewModal = ({ onClose, onReviewAdded }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    communicationScore: 5,
    productivityScore: 5,
    teamworkScore: 5,
    leadershipScore: 5,
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees?size=100');
      if (res.success) {
        setEmployees(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScoreChange = (field, score) => {
    setFormData(prev => ({
      ...prev,
      [field]: score
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      setError('Please select an employee.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employeeId: parseInt(formData.employeeId),
        reviewerId: user.id, // Current logged-in user is the reviewer
        communicationScore: parseFloat(formData.communicationScore),
        productivityScore: parseFloat(formData.productivityScore),
        teamworkScore: parseFloat(formData.teamworkScore),
        leadershipScore: parseFloat(formData.leadershipScore),
        comments: formData.comments
      };
      
      const res = await api.post('/performance/submit', payload);
      if (res.success) {
        onReviewAdded();
      } else {
        setError(res.message || 'Failed to submit review');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while submitting review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarInput = (field, currentScore) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleScoreChange(field, i)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
        >
          <Star 
            size={24} 
            fill={i <= currentScore ? "#f59e0b" : "none"} 
            color={i <= currentScore ? "#f59e0b" : "#d1d5db"} 
          />
        </button>
      );
    }
    return <div className="flex gap-1">{stars}</div>;
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
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px' }}>Add Performance Review</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="block text-sm font-medium mb-1">Employee to Review</label>
            <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="form-input w-full" required>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designation || 'No title'})</option>
              ))}
            </select>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: 'rgba(249,250,251,0.5)', borderRadius: '8px' }}>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium">Communication</label>
              {renderStarInput('communicationScore', formData.communicationScore)}
            </div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium">Productivity</label>
              {renderStarInput('productivityScore', formData.productivityScore)}
            </div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium">Teamwork</label>
              {renderStarInput('teamworkScore', formData.teamworkScore)}
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Leadership</label>
              {renderStarInput('leadershipScore', formData.leadershipScore)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Qualitative Feedback / Comments</label>
            <textarea 
              name="comments" 
              value={formData.comments} 
              onChange={handleChange} 
              className="form-input w-full" 
              rows="4" 
              placeholder="Provide constructive feedback..."
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
