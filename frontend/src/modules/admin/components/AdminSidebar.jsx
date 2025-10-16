import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const AdminSidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/hospitals', icon: 'apartment', label: 'Hospitals' },
    { path: '/admin/hospital-approvals', icon: 'approval', label: 'Hospital Approvals' },
    { path: '/admin/doctors', icon: 'group', label: 'Doctors' },
    { path: '/admin/patients', icon: 'personal_injury', label: 'Patients' },
    { path: '/admin/appointments', icon: 'calendar_month', label: 'Appointments' },
    { path: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
    { path: '/admin/settings', icon: 'settings', label: 'Settings' }
  ]

  return (
    <aside className="w-64 bg-white dark:bg-background-dark/50 p-4 flex flex-col justify-between border-r border-[#dbe2e6] dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")'}}></div>
          <div className="flex flex-col">
            <h1 className="text-[#111618] dark:text-white text-base font-medium leading-normal">System Admin</h1>
            <p className="text-[#617c89] dark:text-gray-400 text-sm font-normal leading-normal">admin@medique.com</p>
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
      <Link to="/" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
        <span className="truncate">Logout</span>
      </Link>
    </aside>
  )
}

export default AdminSidebar
