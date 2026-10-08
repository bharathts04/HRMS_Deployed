import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Download, Plus } from 'lucide-react';
import GeneratePayrollModal from '../components/GeneratePayrollModal';
import { generatePayslipPdf } from '../utils/pdfGenerator';

const Payroll = () => {
  const { user } = useAuth();
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const isAdminOrHR = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR';

  useEffect(() => {
    fetchPayroll();
  }, [user]);

  const fetchPayroll = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const endpoint = isAdminOrHR ? '/payroll/all' : `/payroll/history/${user.id}`;
      const res = await api.get(endpoint);
      if (res.success) {
        setPayrollHistory(res.data.content || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{isAdminOrHR ? 'Company Payrolls' : 'My Payroll'}</h1>
        {isAdminOrHR && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="mr-2" /> Generate Payroll
          </button>
        )}
      </div>
      
      <div className="glass-card table-container">
        {loading ? (
          <div className="p-4 text-center">Loading payroll data...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Payment Date</th>
                <th>Basic</th>
                <th>Deductions (Tax + PF)</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payrollHistory.length > 0 ? (
                payrollHistory.map(record => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 500 }}>
                      {isAdminOrHR && <div className="text-sm text-gray-500">{record.employeeName}</div>}
                      {record.month} {record.year}
                    </td>
                    <td>{record.paymentDate}</td>
                    <td>${record.basic?.toFixed(2)}</td>
                    <td style={{ color: 'var(--danger-color)' }}>
                      ${((record.tax || 0) + (record.pf || 0)).toFixed(2)}
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                      ${record.netSalary?.toFixed(2)}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary text-sm" 
                        style={{ padding: '6px 10px' }} 
                        onClick={() => generatePayslipPdf(record)}
                      >
                        <Download size={14} style={{ marginRight: '4px' }} /> Slip
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No payroll records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <GeneratePayrollModal 
          onClose={() => setShowModal(false)} 
          onPayrollGenerated={() => {
            setShowModal(false);
            fetchPayroll();
          }} 
        />
      )}
    </div>
  );
};

export default Payroll;
