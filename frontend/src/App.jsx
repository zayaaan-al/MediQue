import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PatientLogin from './components/PatientLogin'
import HospitalAuth from './components/HospitalAuth'
import SignUp from './components/SignUp'
import PaymentPage from './components/PaymentPage'
import ProtectedRoute from './components/shared/ProtectedRoute'
import { ToastProvider } from './components/shared/ToastManager'

// Admin Module
import AdminDashboard from './modules/admin/components/AdminDashboard'
import HospitalManagement from './modules/admin/components/HospitalManagement'
import HospitalApprovals from './modules/admin/components/HospitalApprovals'

// Hospital Module
import HospitalDashboard from './modules/hospital/components/HospitalDashboard'
import AddDoctor from './modules/hospital/components/AddDoctor'
import AppointmentRequests from './modules/hospital/components/AppointmentRequests'
import QueueManagement from './components/QueueManagement'

// Patient Module
import PatientDashboard from './modules/patient/components/PatientDashboard'
import DoctorsList from './modules/patient/components/DoctorsList'
import Appointments from './modules/patient/components/Appointments'
import PatientProfile from './modules/patient/components/PatientProfile'

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/hospital-auth" element={<HospitalAuth />} />
          <Route path="/payment" element={<PaymentPage />} />
          
          {/* Admin Module Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/hospitals" element={<HospitalManagement />} />
          <Route path="/admin/hospital-approvals" element={<HospitalApprovals />} />
          <Route path="/admin/doctors" element={<AdminDashboard />} />
          <Route path="/admin/patients" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Hospital Module Routes */}
          <Route path="/hospital" element={<ProtectedRoute userType="hospital"><HospitalDashboard /></ProtectedRoute>} />
          <Route path="/hospital/doctors" element={<ProtectedRoute userType="hospital"><HospitalDashboard /></ProtectedRoute>} />
          <Route path="/hospital/doctors/add" element={<ProtectedRoute userType="hospital"><AddDoctor /></ProtectedRoute>} />
          <Route path="/hospital/appointments" element={<ProtectedRoute userType="hospital"><AppointmentRequests /></ProtectedRoute>} />
          <Route path="/hospital/queue" element={<ProtectedRoute userType="hospital"><QueueManagement /></ProtectedRoute>} />
          <Route path="/hospital/schedules" element={<ProtectedRoute userType="hospital"><HospitalDashboard /></ProtectedRoute>} />
          <Route path="/hospital/reports" element={<ProtectedRoute userType="hospital"><HospitalDashboard /></ProtectedRoute>} />
          <Route path="/hospital/settings" element={<ProtectedRoute userType="hospital"><HospitalDashboard /></ProtectedRoute>} />
          
          {/* Patient Module Routes */}
          <Route path="/patient" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/find-doctors" element={<ProtectedRoute userType="patient"><DoctorsList /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute userType="patient"><Appointments /></ProtectedRoute>} />
          <Route path="/patient/queue-status" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/medical-records" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/prescriptions" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/billing" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute userType="patient"><PatientProfile /></ProtectedRoute>} />
          <Route path="/patient/help" element={<ProtectedRoute userType="patient"><PatientDashboard /></ProtectedRoute>} />
          
          {/* Legacy Routes for Backward Compatibility */}
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/queue-management" element={<QueueManagement />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
