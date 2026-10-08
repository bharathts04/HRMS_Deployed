import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Download, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees?size=50');
      if (res.success) {
        setEmployees(res.data.content || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/export/employees/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV', error);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await api.delete(`/employees/${employeeId}`);
      if (res.success) {
        fetchEmployees();
      } else {
        alert(res.message || 'Failed to delete employee');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(search.toLowerCase()) || 
    emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Employee Directory</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn btn-secondary text-sm">
            <Download size={16} style={{ marginRight: '6px' }} />
            Export CSV
          </button>
          {['ROLE_ADMIN', 'ROLE_HR'].includes(user?.role) && (
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary text-sm">
              <Plus size={16} style={{ marginRight: '6px' }} />
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="glass-card mb-4 p-4">
        <div className="flex items-center" style={{ position: 'relative', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '36px' }}
            placeholder="Search employees..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div className="p-4 text-center">Loading employees...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Email</th>
                {['ROLE_ADMIN', 'ROLE_HR'].includes(user?.role) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>#{index + 1}</td>
                    <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.designation || 'N/A'}</td>
                    <td>{emp.departmentName || 'N/A'}</td>
                    <td>{emp.email || 'N/A'}</td>
                    {['ROLE_ADMIN', 'ROLE_HR'].includes(user?.role) && (
                      <td>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => { setSelectedEmployee(emp); setIsEditModalOpen(true); }} 
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          {(user?.role === 'ROLE_ADMIN' || (user?.role === 'ROLE_HR' && emp.userRole !== 'ROLE_ADMIN' && emp.userRole !== 'ROLE_HR')) && (
                            <button 
                              onClick={() => handleDelete(emp.id)} 
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={['ROLE_ADMIN', 'ROLE_HR'].includes(user?.role) ? "6" : "5"} className="text-center p-4">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onEmployeeAdded={fetchEmployees}
      />
      
      <EditEmployeeModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        employee={selectedEmployee}
        onEmployeeUpdated={fetchEmployees}
      />
    </div>
  );
};

export default Employees;
