import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PatientSidebar from './PatientSidebar'
import Layout from '../../../components/shared/Layout'

const PatientDashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [currentPatient, setCurrentPatient] = useState(null)

  useEffect(() => {
    // Load current patient data
    const patient = JSON.parse(localStorage.getItem('currentPatient') || '{}')
    setCurrentPatient(patient)

    // Load real appointment requests for this patient
    if (patient.id) {
      const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
      const patientRequests = allRequests.filter(request => 
        request.patientId === patient.id && request.status === 'approved'
      )
      setUpcomingAppointments(patientRequests)
    }
  }, [])

  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Load recent activity based on patient's appointment requests
    if (currentPatient?.id) {
      const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
      const patientRequests = allRequests
        .filter(request => request.patientId === currentPatient.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5) // Show last 5 activities
        .map(request => ({
          id: request.id,
          type: 'appointment',
          message: `Appointment request ${request.status} with ${request.doctorName}`,
          time: request.timeAgo || 'Recently',
          icon: request.status === 'approved' ? 'check_circle' : 
                request.status === 'rejected' ? 'cancel' : 'schedule'
        }))
      
      setRecentActivity(patientRequests)
    }
  }, [currentPatient])

  // Calculate real stats based on patient data
  const quickStats = [
    { 
      title: 'Upcoming Appointments', 
      value: upcomingAppointments.length.toString(), 
      icon: 'calendar_today', 
      color: 'blue' 
    },
    { 
      title: 'Total Requests', 
      value: recentActivity.length.toString(), 
      icon: 'check_circle', 
      color: 'green' 
    },
    { 
      title: 'Pending Requests', 
      value: recentActivity.filter(activity => activity.icon === 'schedule').length.toString(), 
      icon: 'pending', 
      color: 'orange' 
    },
    { 
      title: 'Approved Requests', 
      value: recentActivity.filter(activity => activity.icon === 'check_circle').length.toString(), 
      icon: 'groups', 
      color: 'purple' 
    }
  ]

  return (
    <Layout 
      userType="patient" 
      userName={currentPatient?.name || 'Patient'} 
      userAvatar={currentPatient?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'}
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <PatientSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark/50">
          <div className="flex items-center gap-4">
            <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Patient Portal</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111618] dark:text-white mb-2">Welcome back, {currentPatient?.name?.split(' ')[0] || 'Patient'}!</h1>
              <p className="text-gray-600 dark:text-gray-400">Here's your health dashboard overview</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50' :
                      stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/50' :
                      stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/50' :
                      'bg-purple-100 dark:bg-purple-900/50'
                    }`}>
                      <span className={`material-symbols-outlined text-xl ${
                        stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        stat.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`}>
                        {stat.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#111618] dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming Appointments */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Upcoming Appointments</h3>
                  </div>
                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <img 
                            src={appointment.patientAvatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'} 
                            alt={appointment.doctorName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#111618] dark:text-white">{appointment.doctorName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.hospitalName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">{appointment.requestedTime}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                            }`}>
                              {appointment.status}
                            </span>
                            <div className="flex gap-2 mt-2">
                              <button className="text-primary hover:text-primary/80 text-sm">Reschedule</button>
                              <button className="text-red-500 hover:text-red-600 text-sm">Cancel</button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <span className="material-symbols-outlined text-gray-400 text-4xl mb-3 block">event_available</span>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">No upcoming appointments</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Book your first appointment to get started</p>
                        <Link to="/patient/appointments" className="inline-block mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                          Make New Appointment
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <span className="material-symbols-outlined text-primary text-lg">{activity.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[#111618] dark:text-white">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <span className="material-symbols-outlined text-gray-400 text-3xl mb-2 block">history</span>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs">Your appointment activities will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-[#111618] dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/patient/appointments" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <span className="material-symbols-outlined text-primary">calendar_add_on</span>
                      <span className="text-sm font-medium text-[#111618] dark:text-white">Make New Appointment</span>
                    </Link>
                    <Link to="/patient/queue-status" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <span className="material-symbols-outlined text-primary">groups</span>
                      <span className="text-sm font-medium text-[#111618] dark:text-white">Check Queue Status</span>
                    </Link>
                    <Link to="/patient/medical-records" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <span className="material-symbols-outlined text-primary">folder_open</span>
                      <span className="text-sm font-medium text-[#111618] dark:text-white">Medical Records</span>
                    </Link>
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-1">health_and_safety</span>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Health Tip of the Day</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Stay hydrated! Drinking 8 glasses of water daily helps maintain optimal body function and supports your immune system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 mt-1">emergency</span>
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Emergency Contact</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                        For medical emergencies, call immediately:
                      </p>
                      <a href="tel:911" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        <span className="material-symbols-outlined text-sm">call</span>
                        Call 911
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </Layout>
  )
}

export default PatientDashboard
