import React, { useState, useEffect } from 'react'
import PatientSidebar from './PatientSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const DoctorsList = () => {
  const toast = useToast()
  const [doctors, setDoctors] = useState([])
  const [currentPatient, setCurrentPatient] = useState(null)

  // Load current patient data
  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem('currentPatient') || '{}')
    setCurrentPatient(patient)
  }, [])

  // Load doctors from localStorage on component mount
  useEffect(() => {
    const loadDoctors = () => {
      const storedDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
      
      // Get approved hospitals to filter doctors
      const approvedHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
        .filter(hospital => hospital.status === 'approved')
      
      // Only show doctors from approved hospitals
      const validDoctors = storedDoctors.filter(doctor => 
        approvedHospitals.some(hospital => hospital.hospitalName === doctor.hospital)
      )
      
      setDoctors(validDoctors)
    }
    
    loadDoctors()
  }, [])

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  // Get unique specializations from available doctors
  const specializations = ['All', ...new Set(doctors.map(doctor => doctor.specialization))]

  const filteredDoctors = doctors
    .filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(doctor => 
      selectedSpecialization === '' || selectedSpecialization === 'All' || 
      doctor.specialization === selectedSpecialization
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating
        case 'experience': return b.experience - a.experience
        case 'fee': return a.consultationFee - b.consultationFee
        default: return 0
      }
    })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor)
    setShowBookingModal(true)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    if (!currentPatient) {
      toast.showError('Please login to book appointments')
      return
    }

    const bookingData = {
      id: Date.now(),
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAvatar: currentPatient.avatar,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      hospitalName: selectedDoctor.hospital,
      date: formData.get('date'),
      time: formData.get('time'),
      reason: formData.get('reason'),
      requestedTime: `${formData.get('date')}, ${formData.get('time')}`,
      status: 'pending',
      timeAgo: 'Just now',
      createdAt: new Date().toISOString()
    }

    // Validation
    if (!bookingData.date || !bookingData.time || !bookingData.reason) {
      toast.showError('Please fill in all required fields')
      return
    }

    // Save appointment request to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
    existingRequests.push(bookingData)
    localStorage.setItem('appointmentRequests', JSON.stringify(existingRequests))

    console.log('Booking appointment:', bookingData)
    toast.showSuccess(`Appointment request sent to ${selectedDoctor.name}! Date: ${bookingData.date} at ${bookingData.time}`)
    
    setShowBookingModal(false)
    setSelectedDoctor(null)
  }

  const handleCloseModal = () => {
    setSelectedDoctor(null)
    setShowBookingModal(false)
  }

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
            <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Make New Appointment</h2>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Doctors</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">search</span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Search by doctor name or specialization"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="experience">Most Experienced</option>
                    <option value="fee">Lowest Fee</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDoctor(doctor)}
                        className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">
                  {doctors.length === 0 ? 'medical_services' : 'search_off'}
                </span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {doctors.length === 0 ? 'No doctors available' : 'No doctors found'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {doctors.length === 0 
                    ? 'Doctors will appear here once hospitals add them to their staff.' 
                    : 'Try adjusting your search criteria.'
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && !showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Doctor Profile</h3>
                <button 
                  onClick={() => setSelectedDoctor(null)}
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

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleBookAppointment(selectedDoctor)}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Book Appointment</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={selectedDoctor.avatar} 
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#111618] dark:text-white">{selectedDoctor.name}</h4>
                    <p className="text-primary text-sm">{selectedDoctor.specialization}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Time</label>
                  <select 
                    name="time"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Visit</label>
                  <textarea
                    name="reason"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    rows="3"
                    placeholder="Describe your symptoms or reason for consultation"
                    required
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  )
}

export default DoctorsList
