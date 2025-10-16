import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const QueueManagement = () => {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    setCurrentDate(date)
  }, [])

  const [queueData, setQueueData] = useState([])

  useEffect(() => {
    // Load real queue data from appointment requests
    const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
    const approvedRequests = allRequests
      .filter(request => request.status === 'approved')
      .map((request, index) => ({
        id: `#${request.id}`,
        name: request.patientName,
        arrivalTime: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        reason: request.reason,
        doctor: request.doctorName,
        waitTime: `${Math.floor(Math.random() * 60) + 10} min`, // Simulated wait time
        status: index === 0 ? 'In Progress' : 'Waiting',
        statusColor: index === 0 ? 'blue' : 'yellow'
      }))
    
    setQueueData(approvedRequests)
  }, [])

  const stats = [
    { title: 'Average Wait Time', value: queueData.length > 0 ? '25 min' : '0 min', change: '0%', positive: true },
    { title: 'Patients Waiting', value: queueData.filter(q => q.status === 'Waiting').length.toString(), change: '0%', positive: true },
    { title: 'Total in Queue', value: queueData.length.toString(), change: '0%', positive: true }
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'}}></div>
            <h1 className="text-[#111618] dark:text-white text-lg font-bold">St. Luke's Hospital</h1>
          </div>
        </div>
        <div className="flex flex-col flex-1 p-4 gap-4">
          <div className="flex flex-col gap-2">
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" to="/hospital-dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary rounded-lg" to="/queue-management">
              <span className="material-symbols-outlined">groups</span>
              <span className="text-sm font-medium">Queue</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" to="#">
              <span className="material-symbols-outlined">bed</span>
              <span className="text-sm font-medium">Patients</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 text-[#111618] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" to="#">
              <span className="material-symbols-outlined">bar_chart</span>
              <span className="text-sm font-medium">Reports</span>
            </Link>
          </div>
          <div className="mt-auto">
            <button className="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">New Appointment</span>
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")'}}></div>
            <div className="flex flex-col">
              <p className="text-[#111618] dark:text-white text-sm font-medium">Dr. Evelyn Reed</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black text-[#111618] dark:text-white tracking-tight">
                Live Patient Queue - Emergency
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Real-time updates of patient flow and wait times. Last updated: <span className="text-primary font-medium">Just now</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[#111618] dark:text-white text-sm font-medium">
                <span className="font-bold">Date:</span>
                <span className="ml-1">{currentDate}</span>
              </p>
              <button className="flex items-center justify-center gap-2 min-w-[84px] cursor-pointer rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-[#111618] dark:text-white text-sm font-bold">
                <span className="material-symbols-outlined">refresh</span>
                <span className="truncate">Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-base font-medium">{stat.title}</p>
                <p className="text-[#111618] dark:text-white tracking-tight text-3xl font-bold">{stat.value}</p>
                <p className={`text-sm font-medium flex items-center gap-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="material-symbols-outlined text-base">
                    {stat.positive ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[300px]">
                <label className="flex flex-col h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-gray-700 items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-gray-700 focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                      placeholder="Search for a patient by name or ID" 
                    />
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4">
                  <span className="material-symbols-outlined text-[#111618] dark:text-white text-xl">filter_list</span>
                  <p className="text-[#111618] dark:text-white text-sm font-medium">Filter</p>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4">
                  <span className="material-symbols-outlined text-[#111618] dark:text-white text-xl">sort</span>
                  <p className="text-[#111618] dark:text-white text-sm font-medium">Sort by: Wait Time</p>
                </button>
              </div>
            </div>
          </div>

          {/* AI Suggestion Banner */}
          <div className="bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 mb-6 flex items-center gap-4">
            <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-300">auto_awesome</span>
            <p className="text-indigo-800 dark:text-indigo-200 text-sm font-medium flex-1">
              <span className="font-bold">AI Suggestion:</span> Move Patient <span className="font-bold">#60234</span> (P. Sherman) to Radiology Queue to optimize flow. Expected wait time reduction: 7 mins.
            </p>
            <button className="flex items-center justify-center rounded-lg h-8 px-3 bg-indigo-500 text-white text-xs font-bold">
              Accept
            </button>
            <button className="text-indigo-800 dark:text-indigo-200">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Live Queue Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Patient Name / ID</th>
                    <th scope="col" className="px-6 py-3">Arrival Time</th>
                    <th scope="col" className="px-6 py-3">Reason for Visit</th>
                    <th scope="col" className="px-6 py-3">Assigned Doctor</th>
                    <th scope="col" className="px-6 py-3">Wait Time</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queueData.map((patient, index) => (
                    <tr key={patient.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {patient.name} ({patient.id})
                      </td>
                      <td className="px-6 py-4">{patient.arrivalTime}</td>
                      <td className="px-6 py-4">{patient.reason}</td>
                      <td className="px-6 py-4">{patient.doctor}</td>
                      <td className={`px-6 py-4 font-bold ${
                        patient.statusColor === 'red' ? 'text-red-500' : 
                        patient.statusColor === 'amber' ? 'text-amber-500' : 
                        patient.statusColor === 'green' ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {patient.waitTime}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-full ${
                          patient.statusColor === 'red' ? 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300' :
                          patient.statusColor === 'amber' ? 'text-amber-700 bg-amber-100 dark:bg-amber-900 dark:text-amber-300' :
                          patient.statusColor === 'blue' ? 'text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' :
                          'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            patient.statusColor === 'red' ? 'bg-red-500' :
                            patient.statusColor === 'amber' ? 'bg-amber-500' :
                            patient.statusColor === 'blue' ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}></span>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="font-medium text-primary dark:text-primary hover:underline">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QueueManagement
