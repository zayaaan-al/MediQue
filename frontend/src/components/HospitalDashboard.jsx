import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HospitalDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('October 2023')
  const [selectedDate, setSelectedDate] = useState(9)

  const doctors = [
    {
      id: 'DR1023',
      name: 'Dr. Evelyn Reed',
      specialization: 'Cardiology',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 'DR1024',
      name: 'Dr. Marcus Thorne',
      specialization: 'Neurology',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 'DR1025',
      name: 'Dr. Lena Petrova',
      specialization: 'Pediatrics',
      status: 'On Leave',
      avatar: 'https://images.unsplash.com/photo-1594824475317-8cecd4e0e2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    }
  ]

  const appointmentRequests = [
    {
      id: 1,
      patientName: 'Alex Johnson',
      doctorName: 'Dr. Reed',
      reason: 'Annual Check-up',
      requestedTime: 'Oct 28, 2023, 10:00 AM',
      timeAgo: '1h ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      doctorName: 'Dr. Thorne',
      reason: 'Follow-up consultation',
      requestedTime: 'Oct 29, 2023, 2:30 PM',
      timeAgo: '3h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    }
  ]

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900/70 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
            <h1 className="text-xl font-black tracking-tighter text-slate-800 dark:text-white">MediConnect</h1>
          </div>
          <nav className="flex flex-col gap-2">
            <Link className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold" to="/hospital-dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="#">
              <span className="material-symbols-outlined">person</span>
              Doctor Management
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="#">
              <span className="material-symbols-outlined">calendar_month</span>
              Schedules
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="#">
              <span className="material-symbols-outlined">checklist</span>
              Appointments
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="#">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <Link className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" to="/">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Hospital Management Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, General Hospital!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
            </button>
            <img 
              alt="Admin Avatar" 
              className="h-12 w-12 rounded-full object-cover" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-2">
            {/* Doctor Management */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Doctor Management</h3>
                <button className="flex items-center gap-2 rounded-lg bg-primary py-2 px-4 font-semibold text-white hover:bg-primary/90 transition-colors text-sm">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Doctor
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                      <th className="py-2 pr-4">Doctor</th>
                      <th className="py-2 px-4">Specialization</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <img 
                              alt={doctor.name} 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={doctor.avatar}
                            />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">{doctor.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">ID: #{doctor.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{doctor.specialization}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            doctor.status === 'Active' 
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button className="p-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appointment Requests */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Appointment Requests</h3>
                <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <button className="px-3 py-1 text-sm font-semibold text-white bg-primary rounded-md">New</button>
                  <button className="px-3 py-1 text-sm font-semibold text-slate-600 dark:text-slate-300">All</button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {appointmentRequests.map((request) => (
                  <div key={request.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                    <img 
                      alt="Patient Avatar" 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={request.avatar}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{request.patientName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Wants to book with {request.doctorName}</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{request.timeAgo}</p>
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <p><span className="font-semibold">Reason:</span> {request.reason}</p>
                        <p><span className="font-semibold">Requested Time:</span> {request.requestedTime}</p>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-green-500 py-2 px-4 font-semibold text-white hover:bg-green-600 transition-colors text-sm">
                          Accept
                        </button>
                        <button className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-red-500 py-2 px-4 font-semibold text-white hover:bg-red-600 transition-colors text-sm">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-8">
            {/* Doctor Schedule Calendar */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Doctor Schedule</h3>
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <button className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{selectedMonth}</p>
                  <button className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-slate-500 dark:text-slate-400">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = i - 6 + 1
                    const isCurrentMonth = date > 0 && date <= 31
                    const isSelected = date === selectedDate
                    const isToday = date === 4
                    
                    return (
                      <div key={i} className="py-2 relative">
                        <span className={`z-10 relative ${isSelected ? 'text-white' : isCurrentMonth ? '' : 'text-slate-400 dark:text-slate-600'}`}>
                          {isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}
                        </span>
                        {isSelected && (
                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary"></span>
                        )}
                        {isToday && !isSelected && (
                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/20"></span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <button className="w-full mt-4 flex justify-center items-center gap-2 rounded-lg border border-primary py-2 px-4 font-semibold text-primary hover:bg-primary/5 transition-colors text-sm">
                Set Working Hours
              </button>
            </div>

            {/* AI Insights */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 mt-1">auto_awesome</span>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-white">AI Patient Load Insights</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                    Based on current trends, we predict a <strong>15% increase</strong> in patient requests next week.
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Consider adjusting schedules for Cardiology to manage the load.
                  </p>
                  <a className="font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block text-sm" href="#">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HospitalDashboard
