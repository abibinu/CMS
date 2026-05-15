# Frontend Functionality Testing Guide

This guide will walk you through a complete end-to-end test of the React frontend we have built so far. By following these steps, you will verify the Login flow, the Axios Security Interceptors, dynamic routing, the Staff Management module, the Receptionist module, the Doctor module, and the new Pharmacist module.

---

## 💻 How to Setup and Run the React Project on a New Device

If you are moving to a brand new computer and want to run this React frontend project from scratch, follow these steps:

1. **Install Node.js:**
   - Make sure [Node.js](https://nodejs.org/) is installed on the new device. You can verify this by running `node -v` and `npm -v` in the terminal.

2. **Copy the Project:**
   - Clone your GitHub repository or copy the entire `CMS_PROJECT` folder to the new device.

3. **Install Dependencies:**
   - Open a terminal and navigate into the frontend folder:
     ```powershell
     cd path/to/CMS_PROJECT/cms_frontend
     ```
   - Run the install command to download all the required packages (`react`, `axios`, `react-router-dom`, etc.) into a new `node_modules` folder:
     ```powershell
     npm install
     ```

4. **Start the Development Server:**
   - Once installation is complete, start the Vite development server:
     ```powershell
     npm run dev
     ```
   - Open your browser to `http://localhost:5173/` or the port provided in the terminal.

*(Note: Don't forget that the Django Backend also needs to be running (`python manage.py runserver`) for the API calls to work!)*

---

## 📱 How to Access from Another Device (Mobile/Laptop on same Wi-Fi)

If you simply want to *view* the app on your phone while the server runs on your main computer:

1. Find your Computer's Local IP Address (e.g., `192.168.1.5`).
2. Open `cms_frontend/src/api/axios.js` and change `baseURL: 'http://127.0.0.1:8000/api'` to `baseURL: 'http://<YOUR-IP>:8000/api'`.
3. Run the backend with `python manage.py runserver 0.0.0.0:8000`.
4. Run the frontend with `npm run dev -- --host`.
5. Open the network URL provided by Vite in your phone's browser!

---

## Prerequisite: Ensure Both Servers are Running Locally

Before testing the frontend, ensure both your backend and frontend are actively serving requests.

1. **Backend:** Open a terminal, activate your virtual environment, and run:
   ```powershell
   cd cms_backend
   python manage.py runserver
   ```

2. **Frontend:** Open a separate terminal and run:
   ```powershell
   cd cms_frontend
   npm run dev
   ```

---

## Step 1: Test the Authentication & Security Flow

### A. The Login Page
1. Open your browser and navigate to the frontend URL.
2. You should see the custom, glassmorphism **Clinic Management System** login card.
3. Enter invalid credentials to test the error handling. You should see an error message gracefully appear below the title indicating invalid credentials.
4. Enter your valid **Administrator** credentials (e.g., `admin` / `admin`).
5. Click **Sign In**.

### B. Verification of Security Mechanics
1. Upon successful login, you should instantly be redirected to `/administrator-dashboard`.
2. **Technical Check:** Open your browser's Developer Tools (F12) -> Application Tab -> Local Storage.
3. Verify that `access_token` and `role` are stored here. This proves our custom Axios instance successfully parsed and saved the token.

---

## Step 2: Test the Role-Based Layout

1. Look at the **Sidebar** on the left.
2. Because you logged in as an Administrator, the sidebar dynamically rendered options specific to your role: **Staff Management** and **Doctor Profiles**. (Other roles will see different links).
3. Look at the **Top Navigation Bar**. On the far right, you should see your Role badge (`Administrator`) and a **Logout** icon.

---

## Step 3: Test the Staff Management Module

### A. Add a Receptionist User
*To test the Receptionist module, we first need a Receptionist account!*
1. In the sidebar, click on **Staff Management**.
2. Click the blue **+ Add Staff** button in the top right.
3. Fill out the form fields. 
   - Choose `receptionist` for the Username.
   - Choose `receptionist` for the Password.
   - For **Role**, select **Receptionist**.
4. Click **Save Staff Member**.
5. Verify the new Receptionist appears in the data table!

---

## Step 4: Test the Receptionist Module

*First, **Logout** as the Administrator and **Login** using your new Receptionist account (`receptionist` / `receptionist`). Notice the sidebar now shows Receptionist-specific links!*

### A. Patient Registration
1. Click **Patient Registration** in the sidebar.
2. Click **+ Register Patient**.
3. Fill in the details (Name, DOB, Mobile, Gender, Address). 
4. Click **Save Patient**. 
5. Test the real-time search bar on the list page by typing the patient's name or mobile number.

### B. Appointment Scheduling
1. Click **Appointments** in the sidebar.
2. Click **+ Book Appointment**.
3. In the dropdown, select the **Patient** you just registered.
4. *(Note: If the Doctor dropdown is empty, you need to log back in as an Administrator, add a Staff member with the 'Doctor' role, and then create their Doctor Profile in the backend first)*.
5. Select the **Doctor** and the **Date**.
6. Click **Book Appointment**.
7. In the Appointments list, notice that the **Token Number** was automatically generated by the backend!
8. Click the **Edit** (pencil) icon next to the appointment and change the status to **Completed**, then click Update.

### C. Consultation Billing
1. Click **Billing** in the sidebar.
2. Click **+ Generate Bill**.
3. In the "Select Completed Appointment" dropdown, select the appointment you just marked as 'Completed'.
4. Enter a **Registration Charge** (e.g., `100`) and **Additional Charges** (e.g., `50`).
5. Click **Generate Bill**.
6. Look at the Billing List table. Notice the **Total Amount** was automatically calculated by adding your charges with the Doctor's Consultation Fee behind the scenes!

---

## Step 5: Test the Doctor Module

*To test this module, you must first have a Staff account with the 'Doctor' role, and you must have linked them to a Specialization in the Backend. If you don't have one, log in as an Administrator and create one first. Once created, use the Receptionist account to book a 'Scheduled' appointment with that specific Doctor.*

### A. Accessing the Doctor's Queue
1. **Logout** and log back in using the **Doctor's** credentials.
2. You will be routed to the Doctor Dashboard, showing "My Consultation Queue".
3. Verify that the table only displays appointments specifically assigned to *this* doctor that are marked as **Scheduled**.
4. Click the **Consult** button next to a patient in the queue.

### B. The Unified Consultation Workspace
1. You will be taken to a large, comprehensive workspace.
2. **Clinical Notes:** Fill out some dummy data in the `Symptoms` and `Diagnosis` text areas.
3. **Medicines:** Click **+ Add Medicine**. Notice how it dynamically adds a row!
   - Select a medicine from the dropdown (this fetches live from the pharmacist's database).
   - Enter a Dosage, Frequency, and Duration.
   - Click the Trash icon if you want to test removing a row.
4. **Lab Tests:** Click **+ Add Lab Test**.
   - Select a lab test from the dropdown (this fetches live from the lab technician's database).
5. Click **Submit & Complete Consultation** at the bottom of the screen.
6. **Verification:** You should be redirected back to your queue, and that patient should no longer be in the queue because their status was automatically updated to `Completed`!

---

## Step 6: Test the Pharmacist Module

*First, log in as an Administrator and create a staff member with the **Pharmacist** role. Then, log out and log back in using those Pharmacist credentials.*

### A. Inventory Management
1. Click **Inventory** in the sidebar.
2. Click the blue **+ Add Medicine** button.
3. Fill out the medicine details (Name, Category, Expiry Date).
   - *(Note: If the Category dropdown is empty, you need to use your Django Admin panel or backend APIs to create a Medicine Category first!)*
4. Under "Initial Stock Levels", type `100` for the Purchase Quantity. Notice the "Stock In Hand" updates automatically.
5. Set the Re-Order Level to `20`.
6. Click **Save Medicine & Stock**.
7. In the Inventory List table, verify your new medicine appears with an "In Stock" badge.

### B. The Dispense Queue
1. Click **Dispense Queue** in the sidebar.
2. If you completed Step 5 (Doctor Module) successfully, you should see a card here representing the patient you just diagnosed, along with the medicines you prescribed!
3. Look at the prescribed dosage/duration.
4. Type a quantity into the "Dispense Qty" input field for that medicine.
5. Click the blue **Dispense** button.
6. **Verification:** 
   - A success alert should pop up.
   - The prescription should vanish from the queue (because it was marked as inactive).
   - Click back to the **Inventory** tab. You should see the Stock In Hand has been accurately reduced by the quantity you just dispensed!

---

## Step 7: Test Logout
1. In the top right corner of the screen, click the **Logout** icon.
2. You should be immediately redirected back to the `/login` page.
3. **Technical Check:** If you check Local Storage again (F12), the `access_token` and `role` will be completely wiped out. Try pressing your browser's "Back" button; the `ProtectedRoute` wrapper will block you from seeing the dashboard and force you back to login!
