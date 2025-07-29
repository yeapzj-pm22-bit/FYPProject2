import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Login from './Pages/UserManagement/Login';
import Register from './Pages/UserManagement/Register';
import ForgetPasswordForEmail from './Pages/UserManagement/ForgetPasswordForEmail';
import ResetPassword from './Pages/UserManagement/ResetPassword';
import ProfilePage from './Pages/UserManagement/ProfilePage';
import CreateUser from './Pages/AdminPortal/CreateUser';
import UserList from './Pages/AdminPortal/UserList';
import VerificationICList from './Pages/AdminPortal/VerificationICList';
import MedicalRecordForm from './Pages/AdminPortal/MedicalRecordForm';
import MedicalRecordList from './Pages/AdminPortal/MedicalRecordList';
import MedicalRecordEditForm from './Pages/AdminPortal/MedicalRecordEditForm';
import Medicine from './Pages/AdminPortal/Medicine';
import MedicineList from './Pages/AdminPortal/MedicineList';
import Inventory from './Pages/AdminPortal/Inventory';
import InventoryList from './Pages/AdminPortal/InventoryList';
import RestockMedicineRequest from './Pages/AdminPortal/RestockMedicineRequest';
import Schedule from './Pages/AdminPortal/Schedule';
import DispenseList from './Pages/AdminPortal/DispenseList';
import RefillRequestList from './Pages/AdminPortal/RefillRequestList';
import AppointmentList from './Pages/AdminPortal/AppointmentList';
import Testing from './Pages/AdminPortal/Testing';
import Testing2 from './Pages/AdminPortal/Testing2';



import AppointmentAndMedicalRecord from './Pages/HomePage/AppointmentAndMedicalRecord';
import BookAppointment from './Pages/HomePage/BookAppointment';
import Login2 from './Pages/HomePage/Login';
import Register2 from './Pages/HomePage/Register';
import Profile from './Pages/HomePage/Profile';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Admin = lazy(() => import('./Pages/AdminPortal/Admin'));
const HomePage = lazy(() => import('./Pages/HomePage/HomePage')); // now not used

const PatientHomePage = lazy(() => import('./Pages/HomePage/PatientHomePage'));


function App() {
  return (
  <>
    <ToastContainer  position="top-center"/>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Root path renders Admin */}
          <Route path="/" element={< PatientHomePage/>} />
          <Route path="/AppointmentAndMedicalRecord" element={<AppointmentAndMedicalRecord />} />
          <Route path="/BookAppointment" element={<BookAppointment />} />
          <Route path="/Login" element={<Login2 />} />
          <Route path="/Register" element={<Register2 />} />
          <Route path="/Profile" element={<Profile />} />
          {/* Other routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPasswordForEmail" element={<ForgetPasswordForEmail />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/profilePage" element={<ProfilePage />} />

          <Route path="/" element={<Admin />}>
             <Route path="create-user" element={<CreateUser />} />
             <Route path="list-user" element={<UserList />} / >
             <Route path="ic-verify" element={<VerificationICList />} />
             <Route path="create-medical" element={<MedicalRecordForm />} />
             <Route path="medical-list" element={<MedicalRecordList />} />
             <Route path="medical-edit" element={<MedicalRecordEditForm />} />
             <Route path="medicine" element={<Medicine />} />
             <Route path="medicine-list" element={<MedicineList />} />
             <Route path="inventory" element={<Inventory />} />
             <Route path="inventory-list" element={<InventoryList />} />
             <Route path="restock-list" element={<RestockMedicineRequest />} />
             <Route path="dispense-list" element={<DispenseList />} />
             <Route path="refill-request" element={<RefillRequestList />} />
             <Route path="appointment-list" element={<AppointmentList />} />
             <Route path="testing" element={<Testing />} />
             <Route path="Testing2" element={<Testing2 />} />
           <Route path="schedule" element={<Schedule />} />
          </Route>


           {/*<Route path="view-users" element={<ViewUsers />} /> */}
        </Routes>
      </Suspense>
    </Router>
    </>
  );
}

export default App;
