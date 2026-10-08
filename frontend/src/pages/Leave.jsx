import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Leave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [formData, setFormData] = useState({
    type: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchLeaves();
    if (['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'].includes(user?.role)) {
      fetchPendingLeaves();
    }
  }, [user]);

  const fetchPendingLeaves = async () => {
    try {
      setLoadingPending(true);
      const res = await api.get('/leaves/status?status=PENDING&size=50');
      if (res.success) {
        setPendingLeaves(res.data.content || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchLeaves = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/leaves/employee/${user.id}`);
      if (res.success) {
        setLeaves(res.data.content || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);
      await api.post('/leaves/apply', {
        employeeId: user.id,
        ...formData
      });
      alert('Leave applied successfully');
      setFormData({ type: 'CASUAL', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      alert(err.message || 'Failed to apply for leave');
    } finally {
      setApplying(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      const res = await api.put(`/leaves/${leaveId}/status?status=${status}&approverId=${user.id}`);
      if (res.success) {
        fetchPendingLeaves();
        fetchLeaves(); // In case they approved their own somehow
      } else {
        alert(res.message || 'Failed to update leave status');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update leave status');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'].includes(user?.role) && (
        <div>
          <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Leave Management (Pending)</h2>
          <div className="glass-card table-container">
            {loadingPending ? (
              <div className="p-4 text-center">Loading pending leaves...</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.length > 0 ? (
                    pendingLeaves.map(leave => (
                      <tr key={leave.id}>
                        <td>#{leave.employeeId}</td>
                        <td style={{ fontWeight: 500 }}>{leave.type}</td>
                        <td>{leave.startDate} to {leave.endDate}</td>
                        <td>{leave.reason || 'N/A'}</td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                              className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                              className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">No pending leave requests.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
      <div>
        <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Apply for Leave</h2>
        <div className="glass-card" style={{ padding: '24px' }}>
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="block text-sm font-medium mb-1">Leave Type</label>
              <select 
                className="form-input"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="CASUAL">Casual</option>
                <option value="SICK">Sick</option>
                <option value="PAID">Paid</option>
                <option value="MATERNITY">Maternity</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input 
                type="date" 
                className="form-input" 
                required
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input 
                type="date" 
                className="form-input" 
                required
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea 
                className="form-input" 
                rows="3"
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={applying}>
              {applying ? 'Applying...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>My Leave History</h2>
        <div className="glass-card table-container">
          {loading ? (
            <div className="p-4 text-center">Loading leaves...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Approver</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map(leave => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 500 }}>{leave.type}</td>
                      <td>{leave.startDate} to {leave.endDate}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          backgroundColor: leave.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : 
                                         leave.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: leave.status === 'APPROVED' ? 'var(--secondary-color)' : 
                               leave.status === 'REJECTED' ? 'var(--danger-color)' : '#f59e0b'
                        }}>
                          {leave.status}
                        </span>
                      </td>
                      <td>{leave.approvedByName || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4">No leave records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Leave;
