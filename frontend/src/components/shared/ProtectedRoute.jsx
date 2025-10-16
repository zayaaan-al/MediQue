import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, userType }) => {
  const checkAuthentication = () => {
    if (userType === 'patient') {
      const currentPatient = localStorage.getItem('currentPatient')
      return currentPatient !== null
    } else if (userType === 'hospital') {
      const currentHospital = localStorage.getItem('currentHospital')
      return currentHospital !== null
    } else if (userType === 'admin') {
      // For demo purposes, admin access is always allowed
      // In production, this would check admin authentication
      return true
    }
    return false
  }

  const isAuthenticated = checkAuthentication()

  if (!isAuthenticated) {
    if (userType === 'patient') {
      return <Navigate to="/login" replace />
    } else if (userType === 'hospital') {
      return <Navigate to="/hospital-auth" replace />
    } else if (userType === 'admin') {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
