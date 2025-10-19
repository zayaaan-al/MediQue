import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const PatientSidebar = () => {
  const location = useLocation()
  const [currentPatient, setCurrentPatient] = useState(null)

  useEffect(() => {
    // Load current patient data
    const patient = JSON.parse(localStorage.getItem('currentPatient') || '{}')
    setCurrentPatient(patient)
  }, [])

  const menuItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/patient', icon: 'dashboard', label: 'Dashboard' },
    { path: '/patient/appointments', icon: 'calendar_add_on', label: 'Book Appointment' },
    { path: '/patient/appointment-status', icon: 'event_available', label: 'Appointment Status' },
    { path: '/patient/find-doctors', icon: 'search', label: 'Find Doctors' },
    { path: '/patient/queue-status', icon: 'groups', label: 'Queue Status' },
    { path: '/patient/medical-records', icon: 'folder_open', label: 'Medical Records' },
    { path: '/patient/prescriptions', icon: 'medication', label: 'Prescriptions' },
    { path: '/patient/billing', icon: 'receipt', label: 'Billing & Payments' },
    { path: '/patient/profile', icon: 'person', label: 'Profile Settings' }
  ]

  return (
    <aside className="w-64 bg-white dark:bg-background-dark/50 p-4 flex flex-col justify-between border-r border-[#dbe2e6] dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: `url("${currentPatient?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'}")`}}></div>
          <div className="flex flex-col">
            <h1 className="text-[#111618] dark:text-white text-base font-medium leading-normal">{currentPatient?.name || 'Patient'}</h1>
            <p className="text-[#617c89] dark:text-gray-400 text-sm font-normal leading-normal">Patient ID: #{currentPatient?.id || 'Not logged in'}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-[#111618] dark:text-white hover:bg-primary/10'
              }`} 
              to={item.path}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p className="text-sm font-medium leading-normal">{item.label}</p>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-white hover:bg-primary/10 rounded-lg" to="/patient/help">
          <span className="material-symbols-outlined">help</span>
          <p className="text-sm font-medium leading-normal">Help & Support</p>
        </Link>
      </div>
    </aside>
  )
}

export default PatientSidebar
