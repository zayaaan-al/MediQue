import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const HospitalApprovals = () => {
  const toast = useToast()
  const [pendingHospitals, setPendingHospitals] = useState([])
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    // Check admin authentication
    const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}')
    if (!admin.id) {
      toast.showError('Please login as admin to access this page')
      window.location.href = '/login'
      return
    }
    setCurrentAdmin(admin)

    // Load pending hospitals from localStorage
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const pending = registeredHospitals.filter(hospital => hospital.status === 'pending')
    setPendingHospitals(pending)
  }, [])

  const handleApprove = (hospitalId) => {
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const updatedHospitals = registeredHospitals.map(hospital => 
      hospital.id === hospitalId 
        ? { ...hospital, status: 'approved', approvedAt: new Date().toISOString() }
        : hospital
    )
    
    localStorage.setItem('registeredHospitals', JSON.stringify(updatedHospitals))
    
    // Update local state
    setPendingHospitals(prev => prev.filter(hospital => hospital.id !== hospitalId))
    
    const approvedHospital = registeredHospitals.find(h => h.id === hospitalId)
    toast.showSuccess(`Hospital "${approvedHospital.hospitalName}" has been approved successfully!`)
    setShowDetailsModal(false)
    setSelectedHospital(null)
  }

  const handleReject = (hospitalId, reason) => {
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const updatedHospitals = registeredHospitals.map(hospital => 
      hospital.id === hospitalId 
        ? { 
            ...hospital, 
            status: 'rejected', 
            rejectedAt: new Date().toISOString(),
            rejectionReason: reason
          }
        : hospital
    )
    
    localStorage.setItem('registeredHospitals', JSON.stringify(updatedHospitals))
    
    // Update local state
    setPendingHospitals(prev => prev.filter(hospital => hospital.id !== hospitalId))
    
    const rejectedHospital = registeredHospitals.find(h => h.id === hospitalId)
    toast.showWarning(`Hospital "${rejectedHospital.hospitalName}" has been rejected.`)
    setShowRejectModal(false)
    setShowDetailsModal(false)
    setSelectedHospital(null)
    setRejectionReason('')
  }

  const handleViewDetails = (hospital) => {
    setSelectedHospital(hospital)
    setShowDetailsModal(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
            <div className="flex items-center gap-4">
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Hospital Approvals</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                {pendingHospitals.length} Pending
              </span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {pendingHospitals.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">check_circle</span>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Pending Approvals</h3>
                <p className="text-gray-500 dark:text-gray-500">All hospital registrations have been processed.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Review Required</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Please review each hospital registration carefully before approval. Verify license numbers and contact information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {pendingHospitals.map((hospital) => (
                    <div key={hospital.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            {hospital.hospitalPhoto ? (
                              <img
                                src={hospital.hospitalPhoto}
                                alt={hospital.hospitalName}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-primary text-2xl">local_hospital</span>
                            )}
                            <div>
                              <h3 className="text-xl font-semibold text-[#111618] dark:text-white">{hospital.hospitalName}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">License: {hospital.licenseNumber}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Hospital Information</h4>
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p><span className="font-medium">Address:</span> {hospital.address}</p>
                                <p><span className="font-medium">City:</span> {hospital.city}, {hospital.state} {hospital.zipCode}</p>
                                <p><span className="font-medium">Phone:</span> {hospital.phone}</p>
                                <p><span className="font-medium">Email:</span> {hospital.hospitalEmail}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Administrator</h4>
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p><span className="font-medium">Name:</span> {hospital.adminFirstName} {hospital.adminLastName}</p>
                                <p><span className="font-medium">Phone:</span> {hospital.adminPhone}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>Registered on {formatDate(hospital.registeredAt)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-6">
                          <button
                            onClick={() => handleViewDetails(hospital)}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleApprove(hospital.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedHospital(hospital)
                              setShowRejectModal(true)
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Hospital Registration Details</h3>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {selectedHospital.hospitalPhoto && (
                  <div className="flex justify-center">
                    <img
                      src={selectedHospital.hospitalPhoto}
                      alt={selectedHospital.hospitalName}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Hospital Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hospital Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.hospitalName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">License Number</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.licenseNumber}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedHospital.address}<br />
                        {selectedHospital.city}, {selectedHospital.state} {selectedHospital.zipCode}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hospital Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.hospitalEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Administrator Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.adminFirstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.adminLastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      <p className="text-gray-900 dark:text-white">{selectedHospital.adminPhone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Registration Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Date</label>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedHospital.registeredAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                        Pending Approval
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => handleApprove(selectedHospital.id)}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Approve Hospital
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Reject Hospital
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-[#111618] dark:text-white">Reject Hospital Registration</h3>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to reject the registration for "{selectedHospital.hospitalName}"?
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Rejection
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    rows="3"
                    placeholder="Please provide a reason for rejection..."
                    required
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (rejectionReason.trim()) {
                      handleReject(selectedHospital.id, rejectionReason)
                    } else {
                      toast.showError('Please provide a reason for rejection')
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HospitalApprovals
