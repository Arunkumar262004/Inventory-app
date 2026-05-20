import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            {!collapsed && <span className="logo-text">INVENTO</span>}
            <span className="logo-icon">⬡</span>
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">▦</span>
            {!collapsed && <span className="nav-label">Dashboard</span>}
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◈</span>
            {!collapsed && <span className="nav-label">Products</span>}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">◎</span>
            {!collapsed && <span className="nav-label">Orders</span>}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name ? user.name[0].toUpperCase() : 'A'}</div>
            {!collapsed && (
              <div className="user-details">
                <span className="user-name">{user.name || 'Admin'}</span>
                <span className="user-role">Administrator</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⏻</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;