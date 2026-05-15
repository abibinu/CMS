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

// Simple Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Check role if we want strict access
  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes enclosed in Layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          {/* Default redirect (could be smarter based on role) */}
          <Route index element={<Navigate to="/administrator-dashboard" replace />} />
          
          {/* Dashboards */}
          <Route path="administrator-dashboard/*" element={<AdminDashboard />} />
          <Route path="receptionist-dashboard/*" element={<ReceptionistDashboard />} />
          <Route path="doctor-dashboard/*" element={<DoctorDashboard />} />
          <Route path="pharmacist-dashboard/*" element={<PharmacistDashboard />} />
          <Route path="labtechnician-dashboard/*" element={<LabTechnicianDashboard />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
