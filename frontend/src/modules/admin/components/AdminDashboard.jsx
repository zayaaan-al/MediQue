import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const AdminDashboard = () => {
  const toast = useToast()
  const [pendingApprovals, setPendingApprovals] = useState(0)
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [stats, setStats] = useState({
    totalHospitals: 0,
    approvedHospitals: 0,
    pendingHospitals: 0,
    totalDoctors: 0,
    totalPatients: 0
  })

  useEffect(() => {
    // Check admin authentication
    const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}')
    if (!admin.id) {
      // Redirect to login if not authenticated as admin
      toast.showError('Please login as admin to access this page')
      window.location.href = '/login'
      return
    }
    setCurrentAdmin(admin)

    // Load all data from localStorage
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const registeredDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients') || '[]')

    setHospitals(registeredHospitals)
    setDoctors(registeredDoctors)
    setPatients(registeredPatients)

    // Calculate statistics
    const pending = registeredHospitals.filter(h => h.status === 'pending').length
    const approved = registeredHospitals.filter(h => h.status === 'approved').length
    
    setPendingApprovals(pending)
    setStats({
      totalHospitals: registeredHospitals.length,
      approvedHospitals: approved,
      pendingHospitals: pending,
      totalDoctors: registeredDoctors.length,
      totalPatients: registeredPatients.length
    })
  }, [])


  // Get recent activities from actual data
  const getRecentActivities = () => {
    const activities = []
    
    // Recent patients
    const recentPatients = [...patients]
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
      .slice(0, 2)
    
    recentPatients.forEach(patient => {
      activities.push({
        id: `patient-${patient.id}`,
        type: 'patient',
        icon: 'person_add',
        message: `New patient ${patient.name} registered.`,
        time: getTimeAgo(patient.registeredAt)
      })
    })

    // Recent hospitals
    const recentHospitals = [...hospitals]
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
      .slice(0, 2)
    
    recentHospitals.forEach(hospital => {
      activities.push({
        id: `hospital-${hospital.id}`,
        type: 'hospital',
        icon: 'local_hospital',
        message: `Hospital ${hospital.hospitalName} ${hospital.status === 'approved' ? 'approved' : 'registered'}.`,
        time: getTimeAgo(hospital.registeredAt)
      })
    })

    return activities.slice(0, 5)
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  }

  const recentActivities = getRecentActivities()

  // Don't render anything if admin is not authenticated
  if (!currentAdmin) {
    return null
  }

  return (
    <Layout 
      userType="admin" 
      userName={currentAdmin.name || 'System Admin'} 
      userAvatar={currentAdmin.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />
      
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
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Admin Portal</h2>
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
              Add New Hospital
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f3f4] dark:bg-gray-800 text-[#111618] dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Pending Approvals Alert */}
          {pendingApprovals > 0 && (
            <div className="mb-6">
              <Link to="/admin/hospital-approvals" className="block">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-2xl">notification_important</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                        {pendingApprovals} Hospital Registration{pendingApprovals > 1 ? 's' : ''} Pending Approval
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Click here to review and approve hospital registrations
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-[#111618] dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-2">
              Hospital Registration Management
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
            <div className="flex flex-col gap-2 rounded-lg p-6 border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Total Hospitals</p>
              <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">{stats.totalHospitals}</p>
              <p className="text-[#617c89] dark:text-gray-400 text-sm font-medium leading-normal">Registered</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Approved Hospitals</p>
              <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">{stats.approvedHospitals}</p>
              <p className="text-[#078836] text-sm font-medium leading-normal">Active</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Pending Approvals</p>
              <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">{stats.pendingHospitals}</p>
              <p className="text-[#f59e0b] text-sm font-medium leading-normal">Needs review</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Total Doctors</p>
              <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">{stats.totalDoctors}</p>
              <p className="text-[#617c89] dark:text-gray-400 text-sm font-medium leading-normal">In system</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">Total Patients</p>
              <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">{stats.totalPatients}</p>
              <p className="text-[#617c89] dark:text-gray-400 text-sm font-medium leading-normal">Registered</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="flex flex-wrap gap-4 px-4 py-6">
            {/* Queue Performance Chart */}
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe2e6] dark:border-gray-700 p-6 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">System Performance</p>
              <p className="text-[#111618] dark:text-white tracking-light text-[24px] font-bold leading-tight truncate">
                Hospital Load Distribution
              </p>
              <div className="flex gap-1">
                <p className="text-[#617c89] dark:text-gray-400 text-base font-normal leading-normal">Last 24 hours</p>
                <p className="text-[#078836] text-base font-medium leading-normal">+5%</p>
              </div>
              <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4">
                <div className="bg-primary/30 w-full" style={{height: '80%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">General Hospital</p>
                <div className="bg-primary/30 w-full" style={{height: '60%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">City Medical</p>
                <div className="bg-primary/30 w-full" style={{height: '90%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">St. Luke's</p>
                <div className="bg-primary/30 w-full" style={{height: '45%'}}></div>
                <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Metro Care</p>
              </div>
            </div>

            {/* System Statistics */}
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dbe2e6] dark:border-gray-700 p-6 bg-white dark:bg-background-dark/50">
              <p className="text-[#111618] dark:text-white text-base font-medium leading-normal">System Statistics</p>
              <p className="text-[#111618] dark:text-white tracking-light text-[24px] font-bold leading-tight truncate">
                Platform Usage Overview
              </p>
              <div className="flex gap-1">
                <p className="text-[#617c89] dark:text-gray-400 text-base font-normal leading-normal">Last 30 Days</p>
                <p className="text-[#078836] text-base font-medium leading-normal">+12%</p>
              </div>
              <div className="flex min-h-[180px] items-center justify-center flex-1 flex-col gap-8 py-4">
                <div className="relative size-40">
                  <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#f0f3f4" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#4ade80" strokeDasharray="45 55" strokeDashoffset="25" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#fbbf24" strokeDasharray="30 70" strokeDashoffset="70" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#f87171" strokeDasharray="25 75" strokeDashoffset="40" strokeWidth="4"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#111618] dark:text-white">{stats.totalPatients + stats.totalDoctors + stats.totalHospitals}</span>
                    <span className="text-sm text-[#617c89] dark:text-gray-400">Total Users</span>
                  </div>
                </div>
                <div className="flex justify-around w-full">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-green-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">Patients</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-yellow-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">Doctors</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-400"></span>
                    <p className="text-[#617c89] dark:text-gray-400 text-[13px] font-medium">Hospitals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="p-4">
            <div className="rounded-lg border border-[#dbe2e6] dark:border-gray-700 p-6 bg-white dark:bg-background-dark/50">
              <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight mb-4">System Activities</h3>
              <div className="flex flex-col gap-4">
                {recentActivities.length > 0 ? recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${activity.isWarning ? 'bg-red-500/20' : 'bg-primary/20'}`}>
                      <span className={`material-symbols-outlined ${activity.isWarning ? 'text-red-500' : 'text-primary'}`}>
                        {activity.icon}
                      </span>
                    </div>
                    <p className="text-sm text-[#111618] dark:text-white flex-1">
                      {activity.message}
                    </p>
                    <p className="text-xs text-[#617c89] dark:text-gray-400">{activity.time}</p>
                  </div>
                )) : (
                  <p className="text-sm text-[#617c89] dark:text-gray-400 text-center py-4">No recent activities</p>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Data Tables */}
          <div className="p-4 space-y-6">
            {/* Hospitals Table */}
            <div className="rounded-lg border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50 overflow-hidden">
              <div className="p-6 border-b border-[#dbe2e6] dark:border-gray-700">
                <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight">Registered Hospitals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hospital Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {hospitals.length > 0 ? hospitals.map((hospital) => (
                      <tr key={hospital.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {hospital.hospitalPhoto ? (
                              <img src={hospital.hospitalPhoto} alt={hospital.hospitalName} className="w-8 h-8 rounded-full mr-3" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <span className="material-symbols-outlined text-primary text-sm">local_hospital</span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-[#111618] dark:text-white">{hospital.hospitalName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{hospital.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{hospital.city}, {hospital.state}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            hospital.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                            hospital.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          }`}>
                            {hospital.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">
                          {new Date(hospital.registeredAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-[#617c89] dark:text-gray-400">
                          No hospitals registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctors Table */}
            <div className="rounded-lg border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50 overflow-hidden">
              <div className="p-6 border-b border-[#dbe2e6] dark:border-gray-700">
                <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight">Registered Doctors</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Doctor Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {doctors.length > 0 ? doctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={doctor.avatar} alt={doctor.name} className="w-8 h-8 rounded-full mr-3" />
                            <span className="text-sm font-medium text-[#111618] dark:text-white">{doctor.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{doctor.specialization}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{doctor.hospital}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{doctor.experience} years</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">${doctor.consultationFee}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-[#617c89] dark:text-gray-400">
                          No doctors registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Patients Table */}
            <div className="rounded-lg border border-[#dbe2e6] dark:border-gray-700 bg-white dark:bg-background-dark/50 overflow-hidden">
              <div className="p-6 border-b border-[#dbe2e6] dark:border-gray-700">
                <h3 className="text-[#111618] dark:text-white text-lg font-bold leading-tight">Registered Patients</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {patients.length > 0 ? patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={patient.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'} alt={patient.name} className="w-8 h-8 rounded-full mr-3" />
                            <span className="text-sm font-medium text-[#111618] dark:text-white">{patient.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{patient.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{patient.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">{patient.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">
                          {new Date(patient.registeredAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-sm text-[#617c89] dark:text-gray-400">
                          No patients registered yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
