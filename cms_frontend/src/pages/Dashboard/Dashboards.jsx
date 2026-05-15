// Dashboard routing for all clinic roles
// Each role has its own dashboard with specific features and workflows

import React from 'react';

import { Routes, Route } from 'react-router-dom';
import StaffManagement from './Admin/StaffManagement';
import StaffForm from './Admin/StaffForm';
import DoctorManagement from './Admin/DoctorManagement';
import DoctorForm from './Admin/DoctorForm';
import SpecializationsList from './Admin/SpecializationsList';
import SpecializationForm from './Admin/SpecializationForm';
import RolesList from './Admin/RolesList';
import { useNavigate } from 'react-router-dom';

// Reusable dashboard card component
const DashboardCard = ({ title, description, link }) => {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ cursor: link ? 'pointer' : 'default' }} onClick={() => link && navigate(link)}>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
};

// =====================
// ADMINISTRATOR DASHBOARD
// =====================
// Manages system-wide operations: staff, doctors, roles, specializations

const AdminHome = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Administrator Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Staff Management" description="Add, update, or deactivate clinic staff members." link="staff" />
      <DashboardCard title="Doctor Profiles" description="Manage doctors and their consultation fees." link="doctors" />
      <DashboardCard title="Specializations" description="Manage medical specializations." link="specializations" />
      <DashboardCard title="System Roles" description="View available role-based access levels." link="roles" />
    </div>
  </div>
);

export const AdminDashboard = () => (
  <Routes>
    <Route index element={<AdminHome />} />
    {/* Staff management routes */}
    <Route path="staff" element={<StaffManagement />} />
    <Route path="staff/new" element={<StaffForm />} />
    <Route path="staff/edit" element={<StaffForm />} />
    
    {/* Doctor management routes */}
    <Route path="doctors" element={<DoctorManagement />} />
    <Route path="doctors/new" element={<DoctorForm />} />
    <Route path="doctors/edit" element={<DoctorForm />} />

    {/* Specialization management routes */}
    <Route path="specializations" element={<SpecializationsList />} />
    <Route path="specializations/new" element={<SpecializationForm />} />
    <Route path="specializations/edit" element={<SpecializationForm />} />

    {/* Roles view route */}
    <Route path="roles" element={<RolesList />} />
  </Routes>
);

import PatientsList from './Receptionist/PatientsList';
import PatientForm from './Receptionist/PatientForm';
import AppointmentsList from './Receptionist/AppointmentsList';
import AppointmentForm from './Receptionist/AppointmentForm';
import BillingList from './Receptionist/BillingList';
import BillingForm from './Receptionist/BillingForm';

// =====================
// RECEPTIONIST DASHBOARD
// =====================
// Manages patient registration, appointments, and billing

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
    {/* Patient management routes */}
    <Route path="patients" element={<PatientsList />} />
    <Route path="patients/new" element={<PatientForm />} />
    <Route path="patients/edit" element={<PatientForm />} />
    
    {/* Appointment management routes */}
    <Route path="appointments" element={<AppointmentsList />} />
    <Route path="appointments/new" element={<AppointmentForm />} />
    <Route path="appointments/edit" element={<AppointmentForm />} />
    
    <Route path="billing" element={<BillingList />} />
    <Route path="billing/new" element={<BillingForm />} />
    <Route path="billing/edit" element={<BillingForm />} />
  </Routes>
);

import DoctorAppointments from './Doctor/DoctorAppointments';
import ConsultationWorkspace from './Doctor/ConsultationWorkspace';
import PatientHistory from './Doctor/PatientHistory';

export const DoctorDashboard = () => (
  <Routes>
    <Route index element={<DoctorAppointments />} />
    <Route path="consult/:id" element={<ConsultationWorkspace />} />
    <Route path="history" element={<PatientHistory />} />
  </Routes>
);

import InventoryList from './Pharmacist/InventoryList';
import InventoryForm from './Pharmacist/InventoryForm';
import DispenseQueue from './Pharmacist/DispenseQueue';
import CategoriesList from './Pharmacist/CategoriesList';
import CategoryForm from './Pharmacist/CategoryForm';

const PharmacistHome = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Pharmacist Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Dispense Queue" description="Process active medicine prescriptions." link="dispense" />
      <DashboardCard title="Inventory" description="Manage medicine stock and re-order levels." link="inventory" />
      <DashboardCard title="Medicine Categories" description="Manage medicine classification categories." link="categories" />
    </div>
  </div>
);

export const PharmacistDashboard = () => (
  <Routes>
    <Route index element={<PharmacistHome />} />
    <Route path="inventory" element={<InventoryList />} />
    <Route path="inventory/new" element={<InventoryForm />} />
    <Route path="inventory/edit" element={<InventoryForm />} />
    <Route path="dispense" element={<DispenseQueue />} />

    <Route path="categories" element={<CategoriesList />} />
    <Route path="categories/new" element={<CategoryForm />} />
    <Route path="categories/edit" element={<CategoryForm />} />
  </Routes>
);

import PendingTests from './LabTechnician/PendingTests';
import LabTestsList from './LabTechnician/LabTestsList';
import LabTestManagement from './LabTechnician/LabTestManagement';
import LabTestForm from './LabTechnician/LabTestForm';

const LabTechnicianHome = () => (
  <div>
    <h1 style={{ marginBottom: '1.5rem' }}>Lab Technician Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <DashboardCard title="Pending Tests" description="View and record results for pending lab tests." />
      <DashboardCard title="Lab Tests Reference" description="View the dictionary of available lab tests." />
      <DashboardCard title="Dictionary Management" description="Add, edit, or deactivate lab tests." />
    </div>
  </div>
);

export const LabTechnicianDashboard = () => (
  <Routes>
    <Route index element={<LabTechnicianHome />} />
    <Route path="pending" element={<PendingTests />} />
    <Route path="reference" element={<LabTestsList />} />
    <Route path="management" element={<LabTestManagement />} />
    <Route path="management/new" element={<LabTestForm />} />
    <Route path="management/edit" element={<LabTestForm />} />
  </Routes>
);
