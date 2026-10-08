import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X } from 'lucide-react';

const GeneratePayrollModal = ({ onClose, onPayrollGenerated }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    paymentDate: new Date().toISOString().split('T')[0],
    basic: '',
    bonus: 0,
    allowance: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees?size=100'); // fetch a lot
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
        month: formData.month,
        year: parseInt(formData.year),
        paymentDate: formData.paymentDate,
        basic: formData.basic ? parseFloat(formData.basic) : null,
        bonus: formData.bonus ? parseFloat(formData.bonus) : 0,
        allowance: formData.allowance ? parseFloat(formData.allowance) : 0
      };
      
      const res = await api.post('/payroll/generate', payload);
      if (res.success) {
        onPayrollGenerated();
      } else {
        setError(res.message || 'Failed to generate payroll');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while generating payroll');
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
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '24px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px' }}>Generate Payroll</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="form-input w-full" required>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designation || 'No title'})</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <select name="month" value={formData.month} onChange={handleChange} className="form-input w-full" required>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="form-input w-full" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Payment Date</label>
            <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="form-input w-full" required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="block text-sm font-medium mb-1">Basic Salary (Optional)</label>
              <input type="number" step="0.01" name="basic" value={formData.basic} onChange={handleChange} className="form-input w-full" placeholder="Defaults to 40%" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bonus</label>
              <input type="number" step="0.01" name="bonus" value={formData.bonus} onChange={handleChange} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Allowance</label>
              <input type="number" step="0.01" name="allowance" value={formData.allowance} onChange={handleChange} className="form-input w-full" />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Payroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayrollModal;
