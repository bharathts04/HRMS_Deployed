import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  Users, Building2, UserCheck, UserX, Calendar, Clock, 
  UserPlus, DollarSign, TrendingUp, PieChart as PieIcon, 
  BarChart3, Activity 
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR') {
          const res = await api.get('/dashboard');
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setData({});
          }
        } else if (user?.id) {
          const res = await api.get(`/employees/${user.id}`);
          if (res.success) {
            setEmployeeProfile(res.data);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR') {
          setData({});
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading Executive Dashboard Analytics...
      </div>
    );
  }

  // Strictly bind to live database metrics (no fake inflation numbers)
  const totalEmployees = data?.totalEmployees ?? 0;
  const totalDepartments = data?.totalDepartments ?? 0;
  const todayPresentCount = data?.todayPresentCount ?? 0;
  const todayAbsentCount = data?.todayAbsentCount ?? 0;
  const onLeaveCount = data?.onLeaveCount ?? 0;
  const pendingLeaveRequests = data?.pendingLeaveRequests ?? 0;
  const newEmployeesThisMonth = data?.newEmployeesThisMonth ?? 0;
  const payrollStatus = data?.payrollStatus ?? 'Pending';

  // 1. Line Chart Data: Attendance Trend (Last 30 Days)
  const trendSource = data?.attendanceTrend || {};
  const attendanceTrendData = Object.keys(trendSource).length > 0 ? {
    labels: Object.keys(trendSource),
    datasets: [
      {
        label: 'Present Employees',
        data: Object.values(trendSource),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      },
    ],
  } : null;

  const attendanceTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: 'rgba(229, 231, 235, 0.5)' }, beginAtZero: true, ticks: { font: { size: 11 }, precision: 0 } },
    },
  };

  // 2. Doughnut Chart Data: Leave Status Distribution
  const leaveDistSource = data?.leaveStatusDistribution || { Approved: 0, Pending: 0, Rejected: 0 };
  const totalLeaves = Object.values(leaveDistSource).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);

  const leaveStatusData = totalLeaves > 0 ? {
    labels: Object.keys(leaveDistSource),
    datasets: [
      {
        data: Object.values(leaveDistSource),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  } : null;

  const leaveStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '72%',
  };

  // 3. Bar Chart Data: Total Employees per Department
  const deptStaffSource = data?.employeesByDepartment || {};
  const employeesByDeptData = Object.keys(deptStaffSource).length > 0 ? {
    labels: Object.keys(deptStaffSource),
    datasets: [
      {
        label: 'Total Employees',
        data: Object.values(deptStaffSource),
        backgroundColor: [
          'rgba(79, 70, 229, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(239, 68, 68, 0.85)',
          'rgba(14, 165, 233, 0.85)',
          'rgba(168, 85, 247, 0.85)',
        ],
        borderColor: [
          '#4f46e5',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#0ea5e9',
          '#a855f7',
        ],
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  } : null;

  const employeesByDeptOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Total Staff: ${context.raw}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12, weight: '600' } } },
      y: { grid: { color: 'rgba(229, 231, 235, 0.5)' }, beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  // 4. Stacked Progress Bars Data: Department Attendance
  const deptRatesSource = data?.departmentAttendanceRate || {};

  // Theme generator for 8 color-coded KPI cards
  const getCardTheme = (colorType) => {
    switch (colorType) {
      case 'green':
        return { color: '#10b981', badgeBg: 'rgba(16, 185, 129, 0.1)', badgeBorder: 'rgba(16, 185, 129, 0.3)', iconBg: 'rgba(16, 185, 129, 0.15)', label: 'Positive' };
      case 'red':
        return { color: '#ef4444', badgeBg: 'rgba(239, 68, 68, 0.1)', badgeBorder: 'rgba(239, 68, 68, 0.3)', iconBg: 'rgba(239, 68, 68, 0.15)', label: 'Alerts' };
      case 'orange':
        return { color: '#f59e0b', badgeBg: 'rgba(245, 158, 11, 0.1)', badgeBorder: 'rgba(245, 158, 11, 0.3)', iconBg: 'rgba(245, 158, 11, 0.15)', label: 'Pending' };
      case 'blue':
      default:
        return { color: '#3b82f6', badgeBg: 'rgba(59, 130, 246, 0.1)', badgeBorder: 'rgba(59, 130, 246, 0.3)', iconBg: 'rgba(59, 130, 246, 0.15)', label: 'Information' };
    }
  };

  const kpiCards = [
    { title: 'Total Employees', value: totalEmployees, icon: <Users size={20} />, type: 'blue' },
    { title: 'Departments', value: totalDepartments, icon: <Building2 size={20} />, type: 'blue' },
    { title: 'Present Today', value: todayPresentCount, icon: <UserCheck size={20} />, type: 'green' },
    { title: 'Absent Today', value: todayAbsentCount, icon: <UserX size={20} />, type: 'red' },
    { title: 'On Leave', value: onLeaveCount, icon: <Calendar size={20} />, type: 'blue' },
    { title: 'Pending Leave Requests', value: pendingLeaveRequests, icon: <Clock size={20} />, type: 'orange' },
    { title: 'New Employees This Month', value: newEmployeesThisMonth, icon: <UserPlus size={20} />, type: 'green' },
    { title: 'Payroll Status', value: payrollStatus, icon: <DollarSign size={20} />, type: (String(payrollStatus).toLowerCase().includes('pending')) ? 'orange' : 'green' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR' ? 'Executive HR Command Center' : 'My Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            {user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR'
              ? 'Real-time organizational analytics, attendance trends, and departmental staff distribution.'
              : 'Welcome to your employee self-service hub.'}
          </p>
        </div>
      </div>

      {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR') && (
        <div style={{ width: '100%' }}>
          {/* 1. TOP SECTION: 8 COLOR-CODED KPI CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
            width: '100%'
          }}>
            {kpiCards.map((card, idx) => {
              const theme = getCardTheme(card.type);
              return (
                <div 
                  key={idx} 
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px',
                    borderTop: `4px solid ${theme.color}`,
                    position: 'relative',
                    boxSizing: 'border-box',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={card.title}>
                      {card.title}
                    </div>
                    <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: theme.iconBg, color: theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {card.icon}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                      {card.value}
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      backgroundColor: theme.badgeBg,
                      color: theme.color,
                      border: `1px solid ${theme.badgeBorder}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {theme.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. MIDDLE SECTION: ATTENDANCE TREND (LINE) & LEAVE STATUS (DOUGHNUT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
            width: '100%'
          }}>
            {/* 30-Day Attendance Trend */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} style={{ color: '#6366f1' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Attendance Trend (Last 30 Days)</h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                  Line Chart
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                Instead of today's attendance only, show attendance over the last 30 days. This tells HR if attendance is improving.
              </p>
              
              <div style={{ position: 'relative', height: '260px', width: '100%', minHeight: '260px', overflow: 'hidden' }}>
                {attendanceTrendData ? (
                  <Line data={attendanceTrendData} options={attendanceTrendOptions} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>No attendance records available</div>
                )}
              </div>
            </div>

            {/* Leave Status Doughnut */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieIcon size={20} style={{ color: '#10b981' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Leave Status</h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  Doughnut Chart
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                Enterprise distribution of approved, pending, and rejected leave applications.
              </p>

              <div style={{ position: 'relative', height: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                {leaveStatusData ? (
                  <>
                    <Doughnut data={leaveStatusData} options={leaveStatusOptions} />
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalLeaves}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No leave requests submitted yet</div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                {Object.entries(leaveDistSource).map(([label, count], i) => {
                  const percentage = totalLeaves > 0 ? Math.round((Number(count) / totalLeaves) * 100) : 0;
                  const color = label.toUpperCase().includes('APPROV') ? '#10b981' : label.toUpperCase().includes('PEND') ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }}></span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label} {percentage}%</span>
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        ({count} applications)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. BOTTOM SECTION: EMPLOYEES PER DEPARTMENT (BAR) & DEPARTMENT ATTENDANCE (STACKED BAR) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '24px',
            width: '100%'
          }}>
            {/* Total Employees per Department Bar Chart */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} style={{ color: '#4f46e5' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Employees per Department</h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                  Bar Chart
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                Total staff distribution across organizational departments and divisions.
              </p>

              <div style={{ position: 'relative', height: '260px', width: '100%', minHeight: '260px', overflow: 'hidden' }}>
                {employeesByDeptData ? (
                  <Bar data={employeesByDeptData} options={employeesByDeptOptions} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No departmental staff records available</div>
                )}
              </div>
            </div>

            {/* Department-wise Attendance Progress Bars */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={20} style={{ color: '#4f46e5' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Department-wise Attendance</h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                  Stacked Bar
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                Instead of employee count. Easy to spot departments with poor attendance.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '12px 0', flex: 1, justifyContent: 'center' }}>
                {Object.keys(deptRatesSource).length > 0 ? (
                  Object.entries(deptRatesSource).map(([deptName, rate], idx) => {
                    const numRate = Number(rate) || 0;
                    const color = numRate >= 90 ? '#10b981' : numRate >= 85 ? '#3b82f6' : '#f59e0b';
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', width: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.95rem' }} title={deptName}>
                          {deptName}
                        </span>
                        
                        <div style={{ flex: 1, backgroundColor: 'rgba(229, 231, 235, 0.7)', borderRadius: '12px', height: '16px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{
                            width: `${Math.min(100, Math.max(0, numRate))}%`,
                            backgroundColor: color,
                            height: '100%',
                            borderRadius: '12px',
                            transition: 'width 0.8s ease-in-out'
                          }}></div>
                        </div>
                        
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', width: '50px', textAlign: 'right' }}>
                          {Math.round(numRate)}%
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '20px' }}>No department records available</div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span> ≥90% Excellent
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'inline-block' }}></span> 85-89% Normal
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span> &lt;85% Review Needed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Self-Service View */}
      {!(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR') && employeeProfile && (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            {employeeProfile.profilePhotoUrl ? (
              <img 
                src={`${API_BASE_URL}${employeeProfile.profilePhotoUrl}`} 
                alt="Profile" 
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px' }}>
                {employeeProfile.firstName?.charAt(0)}{employeeProfile.lastName?.charAt(0)}
              </div>
            )}
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              {employeeProfile.firstName} {employeeProfile.lastName}
            </h2>
            <span style={{ padding: '4px 12px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
              {employeeProfile.designation || 'Staff Member'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', backgroundColor: 'rgba(249, 250, 251, 0.6)', padding: '24px', borderRadius: '12px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Email Address</div>
              <div style={{ fontWeight: 600 }}>{employeeProfile.email}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Phone Number</div>
              <div style={{ fontWeight: 600 }}>{employeeProfile.phone || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Department</div>
              <div style={{ fontWeight: 600 }}>{employeeProfile.departmentName || 'Not assigned'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Joining Date</div>
              <div style={{ fontWeight: 600 }}>{employeeProfile.joiningDate || 'N/A'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Address</div>
              <div style={{ fontWeight: 600 }}>{employeeProfile.address || 'No address provided'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
