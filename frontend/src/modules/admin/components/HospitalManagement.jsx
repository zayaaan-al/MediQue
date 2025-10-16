import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const HospitalManagement = () => {
  const toast = useToast()
  const [hospitals, setHospitals] = useState([])
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)

  useEffect(() => {
    // Check admin authentication
    const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}')
    if (!admin.id) {
      toast.showError('Please login as admin to access this page')
      window.location.href = '/login'
      return
    }
    setCurrentAdmin(admin)

    // Load only approved hospitals from localStorage
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const approvedHospitals = registeredHospitals
      .filter(hospital => hospital.status === 'approved')
      .map(hospital => ({
        id: hospital.id,
        name: hospital.hospitalName,
        location: `${hospital.city}, ${hospital.state}`,
        doctors: Math.floor(Math.random() * 50) + 10, // Simulated data
        patients: Math.floor(Math.random() * 1000) + 500, // Simulated data
        status: 'Active',
        capacity: `${Math.floor(Math.random() * 40) + 60}%`, // Simulated data
        image: hospital.hospitalPhoto || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        email: hospital.hospitalEmail,
        phone: hospital.phone,
        address: hospital.address,
        licenseNumber: hospital.licenseNumber,
        adminName: `${hospital.adminFirstName} ${hospital.adminLastName}`,
        adminPhone: hospital.adminPhone,
        approvedAt: hospital.approvedAt
      }))
    
    setHospitals(approvedHospitals)
  }, [])

  const refreshHospitalsList = () => {
    // Refresh the hospitals list from localStorage
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const approvedHospitals = registeredHospitals
      .filter(hospital => hospital.status === 'approved')
      .map(hospital => ({
        id: hospital.id,
        name: hospital.hospitalName,
        location: `${hospital.city}, ${hospital.state}`,
        doctors: Math.floor(Math.random() * 50) + 10,
        patients: Math.floor(Math.random() * 1000) + 500,
        status: 'Active',
        capacity: `${Math.floor(Math.random() * 40) + 60}%`,
        image: hospital.hospitalPhoto || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        email: hospital.hospitalEmail,
        phone: hospital.phone,
        address: hospital.address,
        licenseNumber: hospital.licenseNumber,
        adminName: `${hospital.adminFirstName} ${hospital.adminLastName}`,
        adminPhone: hospital.adminPhone,
        approvedAt: hospital.approvedAt
      }))
    
    setHospitals(approvedHospitals)
  }

  const handleViewDetails = (hospital) => {
    setSelectedHospital(hospital)
    setShowDetailsModal(true)
  }


  const handleDeleteHospital = (hospital) => {
    setSelectedHospital(hospital)
    setShowDeleteModal(true)
  }


  const handleDeleteConfirm = () => {
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const updatedHospitals = registeredHospitals.filter(hospital => hospital.id !== selectedHospital.id)
    
    localStorage.setItem('registeredHospitals', JSON.stringify(updatedHospitals))
    
    // Refresh the hospitals list
    refreshHospitalsList()
    setShowDeleteModal(false)
    setSelectedHospital(null)
    toast.showSuccess('Hospital deleted successfully!')
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
            <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Hospital Management</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={refreshHospitalsList}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh List
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {hospitals.length} Approved Hospital{hospitals.length !== 1 ? 's' : ''}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#111618] dark:text-white mb-2">Hospital Network</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor all approved hospitals in the network</p>
          </div>

          {hospitals.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">local_hospital</span>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Approved Hospitals</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Hospitals will appear here after they register and are approved by admin.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={refreshHospitalsList}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Check for New Approvals
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500 text-2xl">group</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Doctors</p>
                  <p className="text-xl font-bold text-[#111618] dark:text-white">{hospitals.reduce((sum, h) => sum + h.doctors, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-500 text-2xl">personal_injury</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
                  <p className="text-xl font-bold text-[#111618] dark:text-white">{hospitals.reduce((sum, h) => sum + h.patients, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500 text-2xl">trending_up</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Capacity</p>
                  <p className="text-xl font-bold text-[#111618] dark:text-white">62%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${hospital.image})`}}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#111618] dark:text-white">{hospital.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{hospital.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      hospital.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }`}>
                      {hospital.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Doctors</span>
                      <span className="font-medium text-[#111618] dark:text-white">{hospital.doctors}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Patients</span>
                      <span className="font-medium text-[#111618] dark:text-white">{hospital.patients}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
                      <span className="font-medium text-[#111618] dark:text-white">{hospital.capacity}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleViewDetails(hospital)}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDeleteHospital(hospital)}
                      className="p-2 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-red-600 dark:text-red-400">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
              </div>
            </>
          )}
        </main>
      </div>
      </div>

      {/* Hospital Details Modal */}
      {showDetailsModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Hospital Details</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Hospital Name</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedHospital.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedHospital.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Doctors</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedHospital.doctors}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Patients</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedHospital.patients}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedHospital.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                  }`}>
                    {selectedHospital.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Hospital Modal */}
      {showDeleteModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Delete Hospital</h3>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete <strong>{selectedHospital.name}</strong>? This action cannot be undone and will also remove all associated doctors and data.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default HospitalManagement
