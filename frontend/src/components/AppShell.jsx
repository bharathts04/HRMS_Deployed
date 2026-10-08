import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AppShell.module.css';
import { LayoutDashboard, Users, Clock, Calendar, LogOut, DollarSign, Target, FileText, Building2 } from 'lucide-react';

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { name: 'Employees', path: '/employees', icon: <Users size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'] },
    { name: 'Departments', path: '/departments', icon: <Building2 size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
    { name: 'Attendance', path: '/attendance', icon: <Clock size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { name: 'Leave', path: '/leave', icon: <Calendar size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { name: 'Payroll', path: '/payroll', icon: <DollarSign size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_EMPLOYEE'] },
    { name: 'Performance', path: '/performance', icon: <Target size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          HRMS Portal
        </div>
        <nav className={styles.nav}>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {item.icon}
              <span style={{ marginLeft: '12px' }}>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div style={{ fontWeight: 500 }}>Welcome back, {user?.firstName}</div>
          <div className={styles.userInfo}>
            <NavLink to="/profile" className={styles.avatar} style={{ textDecoration: 'none', cursor: 'pointer' }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </NavLink>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
              <LogOut size={16} style={{ marginRight: '6px' }} />
              Logout
            </button>
          </div>
        </header>
        
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShell;
