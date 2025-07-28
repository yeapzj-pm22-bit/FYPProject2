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
const Admin = lazy(() => import('./Pages/AdminPortal/Admin'));
const HomePage = lazy(() => import('./Pages/HomePage/HomePage')); // now not used


function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Root path renders Admin */}
          <Route path="/" element={< Admin/>} />

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
           <Route path="schedule" element={<Schedule />} />
          </Route>


           {/*<Route path="view-users" element={<ViewUsers />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
