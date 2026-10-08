import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // In a real app, you'd use a date picker, keeping it simple for the demo
  const [startDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [endDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/attendance/history/${user.id}?startDate=${startDate}&endDate=${endDate}`);
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await api.post(`/attendance/check-in/${user.id}`);
      fetchHistory();
    } catch (err) {
      alert(err.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await api.post(`/attendance/check-out/${user.id}`);
      fetchHistory();
    } catch (err) {
      alert(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Attendance Tracker</h1>
      
      <div className="glass-card mb-4 p-4 flex gap-4 items-center">
        <button 
          className="btn btn-primary" 
          onClick={handleCheckIn} 
          disabled={actionLoading}
        >
          <Clock size={16} style={{ marginRight: '6px' }} />
          Check In
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleCheckOut} 
          disabled={actionLoading}
        >
          <Clock size={16} style={{ marginRight: '6px' }} />
          Check Out
        </button>
      </div>

      <div className="glass-card table-container">
        <h3 className="mb-4">Recent Attendance History</h3>
        {loading ? (
          <div className="p-4 text-center">Loading history...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map(record => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 500 }}>{record.date}</td>
                    <td>{record.checkInTime || '-'}</td>
                    <td>{record.checkOutTime || '-'}</td>
                    <td>
                      {record.status === 'PRESENT' ? (
                        <span style={{ color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Present
                        </span>
                      ) : (
                        <span style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={14} /> Absent
                        </span>
                      )}
                      {record.isLate && <span style={{ fontSize: '0.75rem', color: '#f59e0b', marginLeft: '8px' }}>(Late)</span>}
                    </td>
                    <td>{record.workingHours ? record.workingHours.toFixed(2) + 'h' : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">No attendance records found for this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
