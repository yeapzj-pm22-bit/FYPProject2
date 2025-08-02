import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Admin,Doctor,Pharmarcist Side
import AdminLayout from './Pages/Admin/AdminLayout';
import Schedule2 from './Pages/Admin/Schedule';
import Dashboard from './Pages/Admin/Dashboard';
import UserList from './Pages/Admin/UserList';
import SecurityTest from './Components/SecurityTest';
import MedicalRecordList from './Pages/Admin/MedicalRecordList';
import MedicineList from './Pages/Admin/MedicineList';
import DispenseList from './Pages/Admin/DispenseList';
import InventoryList from './Pages/Admin/InventoryList';
import PaymentList from './Pages/Admin/PaymentList';
import Report from './Pages/Admin/Report';
//Admin,Doctor,Pharmarcist Side

//Patient Side
import AppointmentAndMedicalRecord from './Pages/HomePage/AppointmentAndMedicalRecord';
import BookAppointment from './Pages/HomePage/BookAppointment';
import Profile from './Pages/HomePage/Profile';
import Billing from './Pages/HomePage/Billing';
import Payment from './Pages/HomePage/Payment';
import LoginRegister from './Pages/HomePage/Login_Register_forget';
//Patient Side

import TestRegistration from './Pages/BlockchianTest/TestRegistration.js';

const PatientHomePage = lazy(() => import('./Pages/HomePage/PatientHomePage'));

function App() {
  return (
  <>
        <ToastContainer position="top-center" />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public Patient-Side Pages */}
              <Route path="/admin" element={<AdminLayout currentPage="appointments" onPageChange={(newPage) => console.log("Page changed to", newPage)} />}>
                {/* These are nested routes inside AdminLayout */}
                <Route index element={<Dashboard />} />
                <Route path="medical-list" element={<MedicalRecordList />} />
                <Route path="medicine-list" element={<MedicineList />} />
                <Route path="inventory-list" element={<InventoryList />} />
                <Route path="dispense-list" element={<DispenseList />} />
//                <Route path="dashboard" element={<Dashboard />} />

                <Route path="schedule" element={<Schedule2 />} />
                <Route path="userlist" element={<UserList />} />

                <Route path="medicalRecordList" element={<MedicalRecordList />} />
                <Route path="medicineList" element={<MedicineList />} />
                <Route path="dispenseList" element={<DispenseList />} />
                <Route path="inventoryList" element={<InventoryList />} />
                <Route path="paymentList" element={<PaymentList />} />
                 <Route path="report" element={<Report />} />
              </Route>

              //Patient Side
              <Route path="/PatientHomePage" element={<PatientHomePage />} />
              {/* Non-AdminLayout routes
               <Route path="/" element={<SecurityTest  />} /> */}
               <Route path="/" element={<SecurityTest  />} />
              <Route path="/AppointmentAndMedicalRecord" element={<AppointmentAndMedicalRecord />} />
              <Route path="/BookAppointment" element={<BookAppointment />} />

              <Route path="/Profile" element={<Profile />} />
              <Route path="/Billing" element={<Billing />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/loginRegister" element={<LoginRegister />} />
               //Patient Side

               //TESTING SIDE
               <Route path="/TestRegistration" element={<TestRegistration />} />
               //TESTING SIDE

            </Routes>
          </Suspense>
        </Router>

      </>
  );
}

export default App;
