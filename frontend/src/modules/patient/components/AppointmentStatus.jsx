import React, { useState, useEffect } from 'react'
import PatientSidebar from './PatientSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const AppointmentStatus = () => {
  const toast = useToast()
  const [currentPatient, setCurrentPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')

  // Load current patient and their appointments
  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem('currentPatient') || '{}')
    setCurrentPatient(patient)

    if (patient.id) {
      // Load all appointment requests
      const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
      
      // Filter appointments for this patient
      const patientAppointments = allRequests.filter(req => req.patientId === patient.id)
      
      // Sort by creation date (newest first)
      const sortedAppointments = patientAppointments.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      
      setAppointments(sortedAppointments)
    }
  }, [])

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    return apt.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'schedule'
      case 'approved': return 'check_circle'
      case 'rejected': return 'cancel'
      default: return 'help'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Layout 
      userType="patient" 
      userName={currentPatient?.name || 'Patient'} 
      userAvatar={currentPatient?.avatar}
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <PatientSidebar />
      
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark/50">
            <div className="flex items-center gap-4">
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">My Appointment Status</h2>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-500 text-2xl">pending</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-[#111618] dark:text-white">
                        {appointments.filter(a => a.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                      <p className="text-xl font-bold text-[#111618] dark:text-white">
                        {appointments.filter(a => a.status === 'approved').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                      <p className="text-xl font-bold text-[#111618] dark:text-white">
                        {appointments.filter(a => a.status === 'rejected').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-500 text-2xl">calendar_month</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-xl font-bold text-[#111618] dark:text-white">{appointments.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointments List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-6">
                    {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
                  </h3>
                  
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              appointment.status === 'approved' ? 'bg-green-100 dark:bg-green-900/50' :
                              appointment.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/50' :
                              'bg-yellow-100 dark:bg-yellow-900/50'
                            }`}>
                              <span className={`material-symbols-outlined text-2xl ${
                                appointment.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                                appointment.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                                'text-yellow-600 dark:text-yellow-400'
                              }`}>
                                {getStatusIcon(appointment.status)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg text-[#111618] dark:text-white">{appointment.doctorName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.hospitalName}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Appointment Date</p>
                                <p className="font-medium text-[#111618] dark:text-white">{appointment.date}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.time}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Reason</p>
                                <p className="font-medium text-[#111618] dark:text-white">{appointment.reason}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Request Sent</p>
                                <p className="font-medium text-[#111618] dark:text-white">{formatDate(appointment.createdAt)}</p>
                              </div>
                            </div>

                            {/* Status Messages */}
                            {appointment.status === 'pending' && (
                              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-sm">schedule</span>
                                <span className="text-sm text-yellow-800 dark:text-yellow-300">
                                  Your appointment request is pending review by the hospital.
                                </span>
                              </div>
                            )}

                            {appointment.status === 'approved' && (
                              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">check_circle</span>
                                <span className="text-sm text-green-800 dark:text-green-300">
                                  Your appointment has been confirmed! Please arrive 15 minutes early.
                                </span>
                              </div>
                            )}

                            {appointment.status === 'rejected' && (
                              <div className="flex flex-col gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">cancel</span>
                                  <span className="text-sm font-medium text-red-800 dark:text-red-300">
                                    Your appointment request was not approved.
                                  </span>
                                </div>
                                {appointment.rejectionReason && (
                                  <p className="text-sm text-red-700 dark:text-red-300 ml-6">
                                    Reason: {appointment.rejectionReason}
                                  </p>
                                )}
                                <p className="text-sm text-red-700 dark:text-red-300 ml-6">
                                  Please contact the hospital or try booking a different time slot.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">event_busy</span>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No appointments found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {filter === 'all' 
                          ? "You haven't booked any appointments yet." 
                          : `No ${filter} appointments found.`}
                      </p>
                      {appointments.length === 0 && (
                        <button
                          onClick={() => window.location.href = '/patient/appointments'}
                          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Book Your First Appointment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default AppointmentStatus
