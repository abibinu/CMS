// Layout component
// Shared layout with sidebar navigation, top bar with user info, and logout functionality

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import api from '../../api/axios';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'Guest';

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Optional: Call backend logout endpoint if available
      // We will skip the API call for logout if refresh token is not stored locally
      
      // Clear authentication data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('role');
      localStorage.removeItem('staff_id');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="layout-container">
      {/* Sidebar navigation for role-specific features */}
      <Sidebar role={role} />
      
      <div className="main-content">
        {/* Top bar with user profile and logout */}
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
        
        {/* Main content area for dashboard pages */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
