import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const DoctorManagement = () => {
  const toast = useToast()
  const [doctors, setDoctors] = useState([])
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('all')

  useEffect(() => {
    // Check admin authentication
    const admin = JSON.parse(localStorage.getItem('currentAdmin') || '{}')
    if (!admin.id) {
      toast.showError('Please login as admin to access this page')
      window.location.href = '/login'
      return
    }
    setCurrentAdmin(admin)

    // Load doctors from localStorage
    const registeredDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
    setDoctors(registeredDoctors)
  }, [])

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDetailsModal(true)
  }

  // Get unique specializations
  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))]

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = filterSpecialization === 'all' || doctor.specialization === filterSpecialization
    return matchesSearch && matchesSpecialization
  })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
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
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Doctor Management</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#f0f3f4] dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">medical_services</span>
                <span className="text-sm font-medium text-[#111618] dark:text-white">{doctors.length} Total Doctors</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              {/* Search and Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Doctors</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">search</span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Search by name or hospital"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Specialization</label>
                    <select
                      value={filterSpecialization}
                      onChange={(e) => setFilterSpecialization(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>
                          {spec === 'all' ? 'All Specializations' : spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img 
                          src={doctor.avatar} 
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#111618] dark:text-white">{doctor.name}</h3>
                          <p className="text-primary font-medium">{doctor.specialization}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.hospital}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(doctor.rating)}</div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {doctor.rating} ({doctor.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                          <span className="font-medium text-[#111618] dark:text-white">{doctor.experience} years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Consultation Fee:</span>
                          <span className="font-medium text-[#111618] dark:text-white">${doctor.consultationFee}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Next Available:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{doctor.nextAvailable}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetails(doctor)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">medical_services</span>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No doctors found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {doctors.length === 0 
                      ? 'No doctors have been added to the system yet.' 
                      : 'Try adjusting your search or filter criteria.'}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Doctor Profile</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <img 
                  src={selectedDoctor.avatar} 
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-[#111618] dark:text-white">{selectedDoctor.name}</h4>
                  <p className="text-primary font-medium text-lg">{selectedDoctor.specialization}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedDoctor.hospital}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">{renderStars(selectedDoctor.rating)}</div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDoctor.rating} ({selectedDoctor.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="font-semibold text-[#111618] dark:text-white">{selectedDoctor.experience} years</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consultation Fee</p>
                  <p className="font-semibold text-[#111618] dark:text-white">${selectedDoctor.consultationFee}</p>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-[#111618] dark:text-white mb-2">Qualifications</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.qualifications.map((qual, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {qual}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-[#111618] dark:text-white mb-2">About</h5>
                <p className="text-gray-600 dark:text-gray-400">{selectedDoctor.about}</p>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-[#111618] dark:text-white mb-4">Recent Reviews</h5>
                <div className="space-y-4">
                  {selectedDoctor.reviews.map((review) => (
                    <div key={review.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#111618] dark:text-white">{review.patient}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default DoctorManagement
