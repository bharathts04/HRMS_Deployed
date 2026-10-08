import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Building2 } from 'lucide-react';
import AddDepartmentModal from '../components/AddDepartmentModal';

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      if (res.success) {
        setDepartments(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(search.toLowerCase()) || 
    (dept.description && dept.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Departments</h1>
        {user?.role === 'ROLE_ADMIN' && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-sm">
            <Plus size={16} style={{ marginRight: '6px' }} />
            Add Department
          </button>
        )}
      </div>

      <div className="glass-card mb-4 p-4">
        <div className="flex items-center" style={{ position: 'relative', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '36px' }}
            placeholder="Search departments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div className="p-4 text-center">Loading departments...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map(dept => (
                  <tr key={dept.id}>
                    <td>#{dept.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-gray-400" />
                        {dept.name}
                      </div>
                    </td>
                    <td>{dept.description || 'N/A'}</td>
                    <td>{new Date(dept.createdDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">No departments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddDepartmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onDepartmentAdded={fetchDepartments}
      />
    </div>
  );
};

export default Departments;
