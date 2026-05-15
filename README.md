<div align="center">

# Clinic Management System

[![Status](https://img.shields.io/badge/Status-Completed-green?style=flat-square)](https://github.com)
[![Modules](https://img.shields.io/badge/Modules-5-green?style=flat-square)](https://github.com)
[![Epics](https://img.shields.io/badge/Epics-12-orange?style=flat-square)](https://github.com)
[![Institute](https://img.shields.io/badge/Faith%20Infotech%20Academy-Technopark%2C%20TVM-purple?style=flat-square)](https://github.com)

*A full-featured clinic management platform covering administration, appointments, billing, pharmacy, and laboratory workflows.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Modules](#-modules)
  - [Administrator Module](#-administrator-module)
  - [Receptionist Module](#-receptionist-module)
  - [Doctor Module](#-doctor-module)
  - [Pharmacist Module](#-pharmacist-module)
  - [Lab Technician Module](#-lab-technician-module)
- [API Reference](#-api-reference)
- [Jira Planning Summary](#-jira-planning-summary)

---

## 🏥 Overview

**MacFast CMS** is a comprehensive Clinic Management System designed to streamline day-to-day operations across all departments of a medical clinic. Built with role-based access control, it serves five distinct user roles — each with dedicated workflows and a tailored set of API endpoints.

| Property | Detail |
|---|---|
| **Project Type** | Clinic Management System (CMS) |
| **Planning Batch** | Week 1 — Faith Infotech Academy |
| **Location** | Technopark, Thiruvananthapuram |
| **Architecture** | REST API + Role-Based UI Modules |
| **Auth Strategy** | JWT-based Authentication |

---

## 🧩 Modules

---

### 🔐 Administrator Module

The control center of MacFast CMS. Admins manage staff, doctors, roles, and system-wide configurations.

#### Epic: Authentication & Access Control
> *As an admin, I want to log in securely so that I can access the system.*

- JWT-based authentication with hashed password validation
- Session management and secure token invalidation
- Forgot password flow and error handling (invalid credentials, inactive accounts)

#### Epic: Staff Management
> *Manage staff profiles from onboarding to deactivation.*

- Create, update, and soft-delete staff accounts (`IsActive = 0`)
- Assign roles on creation from `TblRole`
- Password hashed before storage in `TblStaff`
- Search and filter staff by name or role

#### Epic: Doctor Management
> *Maintain accurate doctor profiles tied to staff accounts.*

- Link `DoctorId` → `StaffId` in `TblDoctor`
- Assign specializations from `TblSpecialization`
- Deactivated doctors excluded from appointment scheduling
- Full CRUD for medical specializations

#### Epic: Role Management
> *Define system access levels for all staff types.*

| Default Roles |
|---|
| Administrator |
| Receptionist |
| Doctor |
| Pharmacist |
| Lab Technician |

---

### 🗂️ Receptionist Module

The front desk of the clinic. Receptionists handle patient registration, appointment scheduling, and billing.

#### Epic: Patient Registration & Management
> *Register and maintain patient records.*

- Auto-generate `PatientId` and assign `MembershipId`
- Validate mobile number format and required fields
- Search patients by name, ID, or mobile number

#### Epic: Appointment Scheduling
> *Book, update, and cancel patient appointments.*

- Check doctor availability before booking
- Auto-generate `TokenNumber` per appointment
- Filter appointments by date, patient, doctor, or status
- Cancel sets `ConsultationStatus = 'Cancelled'`

#### Epic: Consultation Billing
> *Generate and manage bills after consultations.*

- Pull consultation fee from `TblDoctor`
- Include registration and additional charges
- Print-ready bill generation
- Query bills by date range

---

### 🩺 Doctor Module

Doctors record diagnoses, write prescriptions, and order lab tests — all linked to appointment IDs.

#### Epic: Consultation Notes & Diagnosis
> *Document patient symptoms, diagnoses, and clinical notes.*

- Store symptoms, diagnosis, and notes in `TblConsultation`
- View date-wise consultation history per patient or per doctor

#### Epic: Medicine Prescription
> *Prescribe medications for pharmacist dispensing.*

- Multi-medicine prescriptions per appointment
- Fields: medicine, dosage, frequency, duration
- Full history by patient, doctor, or appointment

#### Epic: Lab Test Prescription
> *Order lab tests and review results.*

- Multi-test prescriptions linked to `AppointmentId`
- View test results filtered by patient or appointment date

---

### 💊 Pharmacist Module

Pharmacists manage the medicine catalog, track inventory, and dispense medications against active prescriptions.

#### Epic: Medicine Management
> *Maintain the complete medicine catalog.*

- Fields: name, category, manufacturing date, expiry date, unit, status
- Soft-deactivation of discontinued medicines
- Full CRUD via REST endpoints

#### Epic: Medicine Inventory Management
> *Track stock and fulfil prescriptions.*

- Real-time stock level tracking with low-stock flagging
- Retrieve prescriptions by patient ID or mobile
- Deduct inventory on dispensing (Issuance recorded in `TblMedicineStock`)
- Generate and print medicine bill

---

### 🔬 Lab Technician Module

Lab technicians process test orders, record results, and make reports available for doctors.

#### Epic: Lab Test Management
> *Register and maintain the test catalog.*

- Fields: test name, category, amount, reference ranges, sample type
- Soft-deactivation of discontinued tests
- Full CRUD via REST endpoints

#### Epic: Lab Test Prescription & Results
> *View orders, record results, and publish reports.*

- Search prescriptions by patient ID or mobile
- Record `LabTestValue` and `Remarks` per test
- Results linked to `AppointmentId` for full traceability
- Query results by date range

---

## 📡 API Reference

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Staff login |

</details>

<details>
<summary><strong>Staff</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/staff` | Create staff |
| `PUT` | `/api/staff/{staffId}` | Update staff |
| `PATCH` | `/api/staff/{staffId}/deactivate` | Deactivate staff |
| `GET` | `/api/staff` | List all staff |
| `GET` | `/api/staff/{staffId}` | Get staff by ID |

</details>

<details>
<summary><strong>Doctors</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/doctors` | Create doctor profile |
| `PUT` | `/api/doctors/{doctorId}` | Update doctor |
| `PATCH` | `/api/doctors/{doctorId}/deactivate` | Deactivate doctor |

</details>

<details>
<summary><strong>Specializations</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/specializations` | Add specialization |
| `PUT` | `/api/specializations/{specializationId}` | Update specialization |
| `GET` | `/api/specializations` | List specializations |

</details>

<details>
<summary><strong>Patients</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/patients` | Register patient |
| `PUT` | `/api/patients/{patientId}` | Update patient |
| `GET` | `/api/patients` | List all patients |
| `GET` | `/api/patients/{patientId}` | Get patient by ID |

</details>

<details>
<summary><strong>Appointments</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/appointments` | Schedule appointment |
| `PUT` | `/api/appointments/{appointmentId}` | Update appointment |
| `PATCH` | `/api/appointments/{appointmentId}/cancel` | Cancel appointment |
| `GET` | `/api/appointments?date={date}` | List by date |
| `GET` | `/api/appointments/patient/{patientId}` | List by patient |
| `GET` | `/api/appointments/doctor/{doctorId}` | List by doctor |
| `GET` | `/api/appointments?status={status}` | Filter by status |

</details>

<details>
<summary><strong>Billing</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/billing` | Generate bill |
| `PUT` | `/api/billing/{appointmentId}` | Update bill |
| `GET` | `/api/billing/{appointmentId}` | Get bill |
| `GET` | `/api/billing?startDate=&endDate=` | List by date range |

</details>

<details>
<summary><strong>Consultations</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/consultations` | Add consultation note |
| `GET` | `/api/consultations/patient/{patientId}` | History by patient |
| `GET` | `/api/consultations/doctor/{doctorId}` | History by doctor |
| `GET` | `/api/consultations/history/appointment/{appointmentId}` | History by appointment |

</details>

<details>
<summary><strong>Prescriptions — Medicine</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/prescriptions/medicine` | Create prescription |
| `PUT` | `/api/prescriptions/medicine/{prescriptionId}` | Update prescription |
| `GET` | `/api/prescriptions/medicine/appointment/{appointmentId}` | By appointment |
| `GET` | `/api/prescriptions/medicine/patient/{patientId}` | By patient |
| `GET` | `/api/prescriptions/medicine/history/patient/{patientId}` | History by patient |
| `GET` | `/api/prescriptions/medicine/history/doctor/{doctorId}` | History by doctor |

</details>

<details>
<summary><strong>Prescriptions — Lab Tests</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/prescriptions/labtest` | Create lab test prescription |
| `PUT` | `/api/prescriptions/labtest/{prescriptionId}` | Update prescription |
| `GET` | `/api/prescriptions/labtest/appointment/{appointmentId}` | By appointment |
| `GET` | `/api/prescriptions/labtest/patient/{patientId}` | By patient |

</details>

<details>
<summary><strong>Medicines & Inventory</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/medicines` | Add medicine |
| `PUT` | `/api/medicines/{medicineId}` | Update medicine |
| `GET` | `/api/medicines` | List all medicines |
| `GET` | `/api/medicines/{medicineId}` | Get by ID |
| `PATCH` | `/api/medicines/{medicineId}/deactivate` | Deactivate medicine |
| `POST` | `/api/inventory/medicine` | Add inventory item |
| `PUT` | `/api/inventory/medicine/{medicineStockId}` | Update quantity |
| `GET` | `/api/inventory/medicine` | List all inventory |
| `GET` | `/api/inventory/medicine/{medicineId}` | Get by medicine |
| `PATCH` | `/api/inventory/medicine/{medicineStockId}/flag-low` | Flag low stock |

</details>

<details>
<summary><strong>Lab Tests & Results</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/labtests` | Add lab test |
| `PUT` | `/api/labtests/{labTestId}` | Update lab test |
| `GET` | `/api/labtests` | List all lab tests |
| `GET` | `/api/labtests/{labTestId}` | Get by ID |
| `PATCH` | `/api/labtests/{labTestId}/deactivate` | Deactivate test |
| `PUT` | `/api/labtests/results/{labTestPrescriptionId}` | Record result |
| `GET` | `/api/labtests/results/appointment/{appointmentId}` | Result by appointment |
| `GET` | `/api/labtests/results?startDate=&endDate=` | Results by date range |
| `PATCH` | `/api/labtests/{labTestPrescriptionId}/deactivate` | Deactivate prescription |

</details>

---

<div align="center">

 Done at: Faith Infotech Academy · Technopark, Thiruvananthapuram


</div>
