# Postman API Testing Guide
This document provides a comprehensive guide for testing all backend functionalities of the MacFast CMS using Postman.

## Global Setup
- **Base URL:** `http://127.0.0.1:8000/api`
- **Authentication:** Most endpoints require a JWT token. First, hit the login endpoint, copy the `access_token` from the response, and then for all subsequent requests, go to the **Authorization** tab in Postman, select **Bearer Token**, and paste the token.
- **Content-Type:** For POST, PUT, and PATCH requests, go to the **Headers** tab and ensure `Content-Type` is set to `application/json`. Alternatively, in the **Body** tab, select `raw` and `JSON` from the dropdown.

---

## 1. Authentication & Admin Operations

### Login
- **Method:** `POST`
- **URL:** `/auth/login/`
- **Body:**
```json
{
    "username": "admin",
    "password": "password123"
}
```
> [!TIP]
> Copy the `access_token` from the response and use it as your Bearer Token for all following requests. You will also receive a `refresh` token for logging out.

### Logout (Token Blacklisting)
- **Method:** `POST`
- **URL:** `/auth/logout/`
- **Body:**
```json
{
    "refresh": "<paste_refresh_token_here>"
}
```

### Create Staff
- **Method:** `POST`
- **URL:** `/staff/`
- **Body:**
```json
{
    "FullName": "John Doe",
    "Gender": "Male",
    "MobileNumber": "1234567890",
    "UserName": "johndoe",
    "Password": "securepassword",
    "RoleId": 1,
    "IsActive": true
}
```
> [!NOTE]
> The backend will automatically intercept this and securely hash the password before saving it to the database.

### Create Doctor Profile
- **Method:** `POST`
- **URL:** `/doctors/`
- **Body:**
```json
{
    "ConsultationFee": "500.00",
    "SpecializationId": 1,
    "StaffId": 1,
    "IsActive": true
}
```

---

## 2. Receptionist Operations

### Register Patient
- **Method:** `POST`
- **URL:** `/patients/`
- **Body:**
```json
{
    "PatientName": "Jane Smith",
    "DateOfBirth": "1990-05-15",
    "Gender": "Female",
    "MobileNumber": "9876543210",
    "Address": "123 Main St",
    "IsActive": true
}
```

### Book Appointment (Auto-Token Generation)
- **Method:** `POST`
- **URL:** `/appointments/`
- **Body:**
```json
{
    "AppointmentDate": "2026-05-20",
    "PatientId": 1,
    "DoctorId": 1
}
```
> [!IMPORTANT]
> **Logic Verification:** Do NOT provide a `TokenNumber` or `ConsultationStatus`. The backend will check if the doctor is active, automatically calculate the next available token number for that date, and assign it to the response.

### Cancel Appointment
- **Method:** `PATCH`
- **URL:** `/appointments/1/cancel/`
- **Body:** `None` (Empty body)
> Updates the `ConsultationStatus` to "Cancelled".

### Generate Bill (Auto-Fee Extraction)
- **Method:** `POST`
- **URL:** `/billing/`
- **Body:**
```json
{
    "AppointmentId": 1,
    "RegistrationCharge": 100.00,
    "AdditionalCharges": 50.00
}
```
> [!IMPORTANT]
> **Logic Verification:** The backend will completely ignore any `ConsultationFee` or `TotalAmount` you send here. It will automatically traverse to the Doctor's profile, fetch their specific consultation fee, and securely calculate the `TotalAmount`.

---

## 3. Doctor Operations

### Add Consultation Notes
- **Method:** `POST`
- **URL:** `/consultations/`
- **Body:**
```json
{
    "Symptoms": "Fever, Headache",
    "Diagnosis": "Viral Infection",
    "Notes": "Rest for 3 days",
    "AppointmentId": 1
}
```

### Prescribe Medicines (Batch Creation)
- **Method:** `POST`
- **URL:** `/prescriptions/medicine/`
- **Body:** (Notice this is a JSON Array `[...]`)
```json
[
    {
        "MedicineId": 1,
        "Dosage": "500mg",
        "Frequency": "1-0-1",
        "Duration": "5 Days",
        "AppointmentId": 1
    },
    {
        "MedicineId": 2,
        "Dosage": "10mg",
        "Frequency": "0-0-1",
        "Duration": "5 Days",
        "AppointmentId": 1
    }
]
```
> [!IMPORTANT]
> **Logic Verification:** Sending an array will trigger the custom `many=True` logic we built, creating multiple prescription records in a single request.

### Prescribe Lab Tests (Batch Creation)
- **Method:** `POST`
- **URL:** `/prescriptions/labtest/`
- **Body:** (Array format)
```json
[
    {
        "LabTestId": 1,
        "Remarks": "Fasting required",
        "AppointmentId": 1
    }
]
```

---

## 4. Pharmacist Operations

### Add Inventory
- **Method:** `POST`
- **URL:** `/pharmacist/inventory/`
- **Body:**
```json
{
    "StockInHand": 500,
    "ReOrderLevel": 50,
    "MedicineId": 1,
    "IsActive": true
}
```

### Dispense Medicine
- **Method:** `POST`
- **URL:** `/pharmacist/inventory/1/dispense/` *(Where 1 is the Inventory/Stock ID)*
- **Body:**
```json
{
    "quantity": 10,
    "prescriptionId": 1
}
```
> [!IMPORTANT]
> **Logic Verification:** The backend will verify if `StockInHand` is sufficient and if the `prescriptionId` is valid, and then deduct the quantity from the database stock level.

### Check Low Stock
- **Method:** `GET`
- **URL:** `/pharmacist/inventory/low_stock/`

---

## 5. Lab Technician Operations

### Record Lab Test Result
- **Method:** `PUT`
- **URL:** `/labtests/results/1/` *(Where 1 is the LabTestPrescriptionId)*
- **Body:**
```json
{
    "LabTestValue": "14.5 g/dL",
    "Remarks": "Normal range"
}
```
