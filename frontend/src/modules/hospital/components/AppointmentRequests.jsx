import React, { useState, useEffect } from 'react'
import HospitalSidebar from './HospitalSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const AppointmentRequests = () => {
  const toast = useToast()
  const [requests, setRequests] = useState([])
  const [currentHospital, setCurrentHospital] = useState(null)
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Load current hospital and appointment requests
  useEffect(() => {
    const hospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
    setCurrentHospital(hospital)

    if (hospital.hospitalName) {
      // Load all appointment requests
      const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
      
      // Filter requests for this hospital
      const hospitalRequests = allRequests.filter(req => req.hospitalName === hospital.hospitalName)
      
      // Calculate time ago
      const requestsWithTimeAgo = hospitalRequests.map(req => ({
        ...req,
        timeAgo: getTimeAgo(req.createdAt)
      }))
      
      setRequests(requestsWithTimeAgo)
    }
  }, [])

  // Helper function to calculate time ago
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
    return `${diffDays}d ago`
  }

  const handleApprove = (requestId) => {
    const request = requests.find(req => req.id === requestId)
    
    // Update in localStorage
    const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
    const updatedRequests = allRequests.map(req => 
      req.id === requestId ? { ...req, status: 'approved', approvedAt: new Date().toISOString() } : req
    )
    localStorage.setItem('appointmentRequests', JSON.stringify(updatedRequests))
    
    // Update local state
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved', approvedAt: new Date().toISOString() } : req
    ))
    
    // Show success message
    toast.showSuccess(`Appointment approved for ${request.patientName}! Patient will be notified.`)
    
    setSelectedRequest(null)
  }

  const handleReject = (requestId, reason = '') => {
    const request = requests.find(req => req.id === requestId)
    
    // Update in localStorage
    const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
    const updatedRequests = allRequests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected', rejectionReason: reason, rejectedAt: new Date().toISOString() } : req
    )
    localStorage.setItem('appointmentRequests', JSON.stringify(updatedRequests))
    
    // Update local state
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected', rejectionReason: reason, rejectedAt: new Date().toISOString() } : req
    ))
    
    // Show rejection message
    toast.showWarning(`Appointment rejected for ${request.patientName}. Patient will be notified.`)
    
    setSelectedRequest(null)
  }

  const handleReschedule = (requestId) => {
    const request = requests.find(req => req.id === requestId)
    toast.showInfo(`Reschedule functionality for ${request.patientName} would open a calendar picker here.`)
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    }
  }

  return (
    <Layout 
      userType="hospital" 
      userName={currentHospital?.hospitalName || 'Hospital'} 
      userAvatar={currentHospital?.hospitalPhoto}
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <HospitalSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark/50">
          <div className="flex items-center gap-4">
            <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Appointment Requests</h2>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Requests</option>
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
                      {requests.filter(r => r.status === 'pending').length}
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
                      {requests.filter(r => r.status === 'approved').length}
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
                      {requests.filter(r => r.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-500 text-2xl">today</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today's Total</p>
                    <p className="text-xl font-bold text-[#111618] dark:text-white">{requests.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-6">
                  {filter === 'all' ? 'All Appointment Requests' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
                </h3>
                
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <img 
                          src={request.avatar} 
                          alt={request.patientName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-[#111618] dark:text-white">{request.patientName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {request.patientId}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{request.timeAgo}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Doctor</p>
                              <p className="font-medium text-[#111618] dark:text-white">{request.doctorName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{request.specialization}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Appointment</p>
                              <p className="font-medium text-[#111618] dark:text-white">{request.date}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{request.time}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Patient</p>
                              <p className="font-medium text-[#111618] dark:text-white">{request.patientName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {request.patientId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reason</p>
                              <p className="font-medium text-[#111618] dark:text-white">{request.reason}</p>
                            </div>
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">check</span>
                                Approve
                              </button>
                              <button
                                onClick={() => setSelectedRequest(request)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                                Reject
                              </button>
                              <button 
                                onClick={() => handleReschedule(request.id)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                Reschedule
                              </button>
                            </div>
                          )}

                          {request.status === 'approved' && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              <span className="text-sm font-medium">Appointment confirmed and patient notified</span>
                            </div>
                          )}

                          {request.status === 'rejected' && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              <span className="text-sm font-medium">
                                Appointment rejected{request.rejectionReason && `: ${request.rejectionReason}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">inbox</span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No requests found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {filter === 'all' ? 'No appointment requests available.' : `No ${filter} requests found.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#111618] dark:text-white">Reject Appointment</h3>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to reject the appointment request from {selectedRequest.patientName}?
            </p>
            <form onSubmit={(e) => {
              e.preventDefault()
              const reason = e.target.reason.value
              handleReject(selectedRequest.id, reason)
            }}>
              <textarea
                name="reason"
                placeholder="Reason for rejection (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white mb-4"
                rows="3"
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Layout>
  )
}

export default AppointmentRequests
