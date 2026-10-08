import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X } from 'lucide-react';

const EditEmployeeModal = ({ isOpen, onClose, employee, onEmployeeUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    departmentId: '',
    phone: '',
    address: ''
  });
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      if (employee) {
        setFormData({
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          designation: employee.designation || '',
          departmentId: employee.department?.id || employee.departmentId || '',
          phone: employee.phone || '',
          address: employee.address || ''
        });
      }
      setError('');
    }
  }, [isOpen, employee]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create payload. Ensure all required fields from EmployeeRequest are present
      const payload = {
        ...formData,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        userId: employee.userId,
        joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0]
      };
      
      const res = await api.put(`/employees/${employee.id}`, payload);
      if (res.success) {
        onEmployeeUpdated();
        onClose();
      } else {
        setError(res.message || 'Failed to update employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '28rem',
        padding: '24px',
        position: 'relative',
        backgroundColor: 'var(--bg-primary, #ffffff)',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer', border: 'none', background: 'transparent' }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Employee</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-input w-full" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="form-input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="form-input w-full">
              <option value="">Select Dept...</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input w-full" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="form-input w-full" rows="2" />
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
