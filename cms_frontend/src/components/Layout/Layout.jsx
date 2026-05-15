import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import api from '../../api/axios';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'Guest';

  const handleLogout = async () => {
    try {
      // Assuming you have the refresh token stored. If not, just clear local storage.
      // We will skip the API call for logout if refresh token is not stored locally.
      localStorage.removeItem('access_token');
      localStorage.removeItem('role');
      localStorage.removeItem('staff_id');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="layout-container">
      <Sidebar role={role} />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h2>Dashboard</h2>
          </div>
          <div className="topbar-actions">
            <div className="user-profile">
              <User size={20} />
              <span>{role}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
