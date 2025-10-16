import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const HospitalSidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/hospital', icon: 'dashboard', label: 'Dashboard' },
    { path: '/hospital/doctors', icon: 'person', label: 'Doctor Management' },
    { path: '/hospital/appointments', icon: 'calendar_month', label: 'Appointments' },
    { path: '/hospital/queue', icon: 'groups', label: 'Live Queue' },
    { path: '/hospital/schedules', icon: 'schedule', label: 'Schedules' },
    { path: '/hospital/reports', icon: 'analytics', label: 'Reports' },
    { path: '/hospital/settings', icon: 'settings', label: 'Settings' }
  ]

  return (
    <aside className="w-64 bg-white dark:bg-slate-900/70 p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 dark:text-white">MediConnect</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`} 
              to={item.path}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="/hospital/settings">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
        <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="/">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </Link>
      </div>
    </aside>
  )
}

export default HospitalSidebar
