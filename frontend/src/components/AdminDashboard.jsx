import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Patients', value: '1,234', change: '+2.5%', positive: true },
    { title: 'Total Doctors', value: '56', change: '+1.2%', positive: true },
    { title: 'Total Hospitals', value: '25', change: '+3', positive: true },
    { title: 'Average Wait Time', value: '15 min', change: '+3%', positive: true }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      icon: 'calendar_add_on',
      message: 'New appointment scheduled for Jane Doe with Dr. Smith.',
      time: '5 min ago'
    },
    {
      id: 2,
      type: 'patient',
      icon: 'person_add',
      message: 'New patient John Doe registered.',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'warning',
      icon: 'warning',
      message: 'Cardiology department is at 95% capacity.',
      time: '2 hours ago',
      isWarning: true
    },
    {
      id: 4,
      type: 'schedule',
      icon: 'edit_calendar',
      message: "Dr. Emily White's schedule has been updated.",
      time: 'Yesterday'
    }
  ]

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-background-dark/50 p-4 flex flex-col justify-between border-r border-[#dbe2e6] dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-[#111618] dark:text-white text-base font-medium leading-normal">Admin</h1>
              <p className="text-[#617c89] dark:text-gray-400 text-sm font-normal leading-normal">admin@hospital.com</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary" to="/admin-dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-white hover:bg-primary/10 rounded-lg" to="#">
              <span className="material-symbols-outlined">apartment</span>
              <p className="text-sm font-medium leading-normal">Hospitals</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-white hover:bg-primary/10 rounded-lg" to="#">
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium leading-normal">Doctors</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-white hover:bg-primary/10 rounded-lg" to="#">
              <span className="material-symbols-outlined">personal_injury</span>
              <p className="text-sm font-medium leading-normal">Patients</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-white hover:bg-primary/10 rounded-lg" to="#">
              <span className="material-symbols-outlined">calendar_month</span>
              <p className="text-sm font-medium leading-normal">Appointments</p>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-white hover:bg-primary/10 rounded-lg" to="#">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
          </nav>
        </div>
        <Link to="/" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Logout</span>
        </Link>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark/50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#111618] dark:text-white">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Hospi-Manager</h2>
            </div>
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#617c89] dark:text-gray-400 flex border-none bg-[#f0f3f4] dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f3f4] dark:bg-gray-800 focus:border-none h-full placeholder:text-[#617c89] dark:placeholder-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                  placeholder="Search" 
                />
              </div>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4">
              <span className="material-symbols-outlined text-base">add</span>
              Add New Doctor
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f3f4] dark:bg-gray-800 text-[#111618] dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-[#111618] dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-2">
            Hospital Admin Dashboard
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-2 rounded-lg p-6 border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50">
                <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">{stat.title}</p>
                <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">{stat.value}</p>
                <p className={`text-base font-medium leading-normal ${stat.positive ? 'text-[#078836]' : 'text-red-500'}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="flex flex-wrap gap-4 px-4 py-6">
            {/* Queue Performance Chart */}
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe2e6] dark:border-gray-700 p-6 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Queue Performance</p>
              <p className="text-[#111618] dark:text-white tracking-light text-[24px] font-bold leading-tight truncate">
                Live Wait Times by Department
              </p>
              <div className="flex gap-1">
                <p className="text-[#617c89] dark:text-gray-400 text-base font-normal leading-normal">Last 24 hours</p>
                <p className="text-[#078836] text-base font-medium leading-normal">+5%</p>
              </div>
              <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4">
                <div className="bg-primary/30 w-full" style={{height: '50%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Cardiology</p>
                <div className="bg-primary/30 w-full" style={{height: '20%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Neurology</p>
                <div className="bg-primary/30 w-full" style={{height: '70%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Orthopedics</p>
                <div className="bg-primary/30 w-full" style={{height: '40%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Pediatrics</p>
              </div>
            </div>

            {/* Appointment Statistics */}
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe2e6] dark:border-gray-700 p-6 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Appointment Statistics</p>
              <p className="text-[#111618] dark:text-white tracking-light text-[24px] font-bold leading-tight truncate">
                Appointment Status Overview
              </p>
              <div className="flex gap-1">
                <p className="text-[#617c89] dark:text-gray-400 text-base font-normal leading-normal">Last 30 Days</p>
                <p className="text-[#e73508] text-base font-medium leading-normal">-2%</p>
              </div>
              <div className="flex min-h-[180px] items-center justify-center flex-1 flex-col gap-8 py-4">
                <div className="relative size-40">
                  <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#f0f3f4" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#4ade80" strokeDasharray="60 40" strokeDashoffset="25" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#fbbf24" strokeDasharray="25 75" strokeDashoffset="90" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#f87171" strokeDasharray="10 90" strokeDashoffset="65" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#60a5fa" strokeDasharray="5 95" strokeDashoffset="55" strokeWidth="4"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#111618] dark:text-white">452</span>
                    <span className="text-sm text-[#617c89] dark:text-gray-400">Total</span>
                  </div>
                </div>
                <div className="flex justify-around w-full">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-green-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">Completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-yellow-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">Scheduled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">Canceled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-blue-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">No-Show</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="p-4">
            <div className="rounded-lg border border-[#dbe2e6] dark:border-gray-700 p-6 bg-white dark:bg-background-dark/50">
              <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight mb-4">Recent Activities</h3>
              <div className="flex flex-col gap-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${activity.isWarning ? 'bg-red-500/20' : 'bg-primary/20'}`}>
                      <span className={`material-symbols-outlined ${activity.isWarning ? 'text-red-500' : 'text-primary'}`}>
                        {activity.icon}
                      </span>
                    </div>
                    <p className="text-sm text-[#111618] dark:text-white flex-1">
                      {activity.message.split(' ').map((word, index) => {
                        if (word.includes('Jane') || word.includes('John') || word.includes('Dr.') || word.includes('95%') || word.includes('Emily')) {
                          return <span key={index} className={`font-semibold ${activity.isWarning && word.includes('95%') ? 'text-red-500' : 'text-[#343a40] dark:text-white'}`}>{word} </span>
                        }
                        return word + ' '
                      })}
                    </p>
                    <p className="text-xs text-[#617c89] dark:text-gray-400">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
