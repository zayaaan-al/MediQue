import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const PatientManagement = () => {
  const toast = useToast()
  const [patients, setPatients] = useState([])
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Check admin authentication
    const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}')
    if (!admin.id) {
      toast.showError('Please login as admin to access this page')
      window.location.href = '/login'
      return
    }
    setCurrentAdmin(admin)

    // Load patients from localStorage
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients') || '[]')
    setPatients(registeredPatients)
  }, [])

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient)
    setShowDetailsModal(true)
  }

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase()
    return patient.name.toLowerCase().includes(searchLower) ||
           patient.email.toLowerCase().includes(searchLower) ||
           patient.phone.includes(searchTerm) ||
           patient.id.toString().includes(searchTerm)
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!currentAdmin) {
    return null
  }

  return (
    <Layout 
      userType="admin" 
      userName={currentAdmin.name || 'System Admin'} 
      userAvatar={currentAdmin.avatar}
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />
      
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark/50">
            <div className="flex items-center gap-4">
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Patient Management</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#f0f3f4] dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">group</span>
                <span className="text-sm font-medium text-[#111618] dark:text-white">{patients.length} Total Patients</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Patients</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Search by name, email, phone, or patient ID"
                  />
                </div>
              </div>

              {/* Patients Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={patient.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'} 
                                alt={patient.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-[#111618] dark:text-white">{patient.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {patient.firstName} {patient.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">
                            {patient.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">
                            {patient.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">
                            {patient.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617c89] dark:text-gray-400">
                            {formatDate(patient.registeredAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewDetails(patient)}
                              className="text-primary hover:text-primary/80 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">person_off</span>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No patients found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              {patients.length === 0 
                                ? 'No patients have registered yet.' 
                                : 'Try adjusting your search criteria.'}
                            </p>
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

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Patient Details</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <img 
                  src={selectedPatient.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'} 
                  alt={selectedPatient.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-[#111618] dark:text-white">{selectedPatient.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">Patient ID: {selectedPatient.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Registered: {formatDate(selectedPatient.registeredAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h5 className="font-semibold text-[#111618] dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person</span>
                    Personal Information
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">First Name</p>
                      <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.firstName}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Name</p>
                      <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.lastName}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                      <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.dateOfBirth || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                      <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h5 className="font-semibold text-[#111618] dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">contact_mail</span>
                    Contact Information
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.email}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {(selectedPatient.address || selectedPatient.city || selectedPatient.state) && (
                  <div>
                    <h5 className="font-semibold text-[#111618] dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">home</span>
                      Address Information
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                        <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.address || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">City</p>
                        <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.city || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">State</p>
                        <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.state || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Zip Code</p>
                        <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.zipCode || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {(selectedPatient.emergencyContact || selectedPatient.emergencyPhone) && (
                  <div>
                    <h5 className="font-semibold text-[#111618] dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">emergency</span>
                      Emergency Contact
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Contact Name</p>
                        <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.emergencyContact || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Contact Phone</p>
                        <p className="font-semibold text-[#111618] dark:text-white">{selectedPatient.emergencyPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default PatientManagement
