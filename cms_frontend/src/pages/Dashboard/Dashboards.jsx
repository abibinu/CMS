import React from 'react';

import { Routes, Route } from 'react-router-dom';
import StaffManagement from './Admin/StaffManagement';
import StaffForm from './Admin/StaffForm';

const DashboardCard = ({ title, description }) => (
  <div className="card">
    <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)' }}>{description}</p>
  </div>
);

const AdminHome = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Administrator Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Staff Management" description="Add, update, or deactivate clinic staff members." />
      <DashboardCard title="Doctor Profiles" description="Manage doctors and their specializations." />
      <DashboardCard title="System Roles" description="Configure role-based access for the system." />
    </div>
  </div>
);

export const AdminDashboard = () => (
  <Routes>
    <Route index element={<AdminHome />} />
    <Route path="staff" element={<StaffManagement />} />
    <Route path="staff/new" element={<StaffForm />} />
    <Route path="staff/edit" element={<StaffForm />} />
  </Routes>
);

import PatientsList from './Receptionist/PatientsList';
import PatientForm from './Receptionist/PatientForm';
import AppointmentsList from './Receptionist/AppointmentsList';
import AppointmentForm from './Receptionist/AppointmentForm';
import BillingList from './Receptionist/BillingList';
import BillingForm from './Receptionist/BillingForm';

const ReceptionistHome = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Receptionist Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Patient Registration" description="Register new patients and manage existing records." />
      <DashboardCard title="Appointments" description="Schedule and manage doctor appointments." />
      <DashboardCard title="Billing" description="Generate and print consultation bills." />
    </div>
  </div>
);

export const ReceptionistDashboard = () => (
  <Routes>
    <Route index element={<ReceptionistHome />} />
    <Route path="patients" element={<PatientsList />} />
    <Route path="patients/new" element={<PatientForm />} />
    <Route path="patients/edit" element={<PatientForm />} />
    
    <Route path="appointments" element={<AppointmentsList />} />
    <Route path="appointments/new" element={<AppointmentForm />} />
    <Route path="appointments/edit" element={<AppointmentForm />} />
    
    <Route path="billing" element={<BillingList />} />
    <Route path="billing/new" element={<BillingForm />} />
  </Routes>
);

import DoctorAppointments from './Doctor/DoctorAppointments';
import ConsultationWorkspace from './Doctor/ConsultationWorkspace';

export const DoctorDashboard = () => (
  <Routes>
    <Route index element={<DoctorAppointments />} />
    <Route path="consult/:id" element={<ConsultationWorkspace />} />
  </Routes>
);

import InventoryList from './Pharmacist/InventoryList';
import InventoryForm from './Pharmacist/InventoryForm';
import DispenseQueue from './Pharmacist/DispenseQueue';

const PharmacistHome = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Pharmacist Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Dispense Queue" description="Process active medicine prescriptions." />
      <DashboardCard title="Inventory" description="Manage medicine stock and re-order levels." />
    </div>
  </div>
);

export const PharmacistDashboard = () => (
  <Routes>
    <Route index element={<PharmacistHome />} />
    <Route path="inventory" element={<InventoryList />} />
    <Route path="inventory/new" element={<InventoryForm />} />
    <Route path="dispense" element={<DispenseQueue />} />
  </Routes>
);

export const LabTechnicianDashboard = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Lab Technician Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Lab Tests" description="Manage available lab tests and pricing." />
      <DashboardCard title="Test Results" description="Record results for patient prescriptions." />
    </div>
  </div>
);
