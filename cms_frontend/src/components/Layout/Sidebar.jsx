import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Users, Calendar, Pill, TestTube, FileText } from 'lucide-react';

const Sidebar = ({ role }) => {
  
  const getLinks = () => {
    switch(role.toLowerCase()) {
      case 'administrator':
        return [
          { name: 'Staff Management', path: '/administrator-dashboard/staff', icon: <Users size={20}/> },
          { name: 'Doctor Profiles', path: '/administrator-dashboard/doctors', icon: <Activity size={20}/> }
        ];
      case 'receptionist':
        return [
          { name: 'Patients', path: '/receptionist-dashboard/patients', icon: <Users size={20}/> },
          { name: 'Appointments', path: '/receptionist-dashboard/appointments', icon: <Calendar size={20}/> },
          { name: 'Billing', path: '/receptionist-dashboard/billing', icon: <FileText size={20}/> }
        ];
      case 'doctor':
        return [
          { name: 'My Appointments', path: '/doctor-dashboard/appointments', icon: <Calendar size={20}/> },
          { name: 'Patient History', path: '/doctor-dashboard/history', icon: <FileText size={20}/> }
        ];
      case 'pharmacist':
        return [
          { name: 'Inventory', path: '/pharmacist-dashboard/inventory', icon: <Pill size={20}/> },
          { name: 'Dispense', path: '/pharmacist-dashboard/dispense', icon: <FileText size={20}/> }
        ];
      case 'lab technician':
        return [
          { name: 'Test Queue', path: '/labtechnician-dashboard/pending', icon: <TestTube size={20}/> },
          { name: 'Test Dictionary', path: '/labtechnician-dashboard/management', icon: <FileText size={20}/> }
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const basePath = `/${role.replace(' ', '').toLowerCase()}-dashboard`;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Activity size={28} color="var(--primary)" />
        <h2>Clinic System</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to={basePath} end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity size={20} />
          <span>Overview</span>
        </NavLink>
        {links.map((link, idx) => (
          <NavLink key={idx} to={link.path} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
