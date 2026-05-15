// Main application component with routing configuration
// Handles authentication, protected routes, and role-based dashboard routing

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import { 
  AdminDashboard, 
  ReceptionistDashboard, 
  DoctorDashboard, 
  PharmacistDashboard, 
  LabTechnicianDashboard 
} from './pages/Dashboard/Dashboards';

// Protected Route component - checks authentication and optionally validates user role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  // Redirect to login if no authentication token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Validate user role for stricter access control
  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes with shared layout (sidebar, header, etc.) */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          {/* Default redirect to administrator dashboard */}
          <Route index element={<Navigate to="/administrator-dashboard" replace />} />
          
          {/* Role-specific dashboards */}
          <Route path="administrator-dashboard/*" element={<AdminDashboard />} />      {/* Admin management */}
          <Route path="receptionist-dashboard/*" element={<ReceptionistDashboard />} /> {/* Patient & appointment management */}
          <Route path="doctor-dashboard/*" element={<DoctorDashboard />} />             {/* Consultation workspace */}
          <Route path="pharmacist-dashboard/*" element={<PharmacistDashboard />} />     {/* Inventory & dispensing */}
          <Route path="labtechnician-dashboard/*" element={<LabTechnicianDashboard />} /> {/* Lab tests */}
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
