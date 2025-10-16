import React, { useState, useEffect } from 'react'
import PatientSidebar from './PatientSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const Appointments = () => {
  const toast = useToast()
  const [currentPatient, setCurrentPatient] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [hospitalDoctors, setHospitalDoctors] = useState([])
  const [showDoctorsModal, setShowDoctorsModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Load current patient data
  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem('currentPatient') || '{}')
    setCurrentPatient(patient)
  }, [])

  // Load approved hospitals
  useEffect(() => {
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const approvedHospitals = registeredHospitals.filter(hospital => hospital.status === 'approved')
    setHospitals(approvedHospitals)
  }, [])

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital)
    
    // Load doctors for this hospital
    const allDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
    const doctors = allDoctors.filter(doctor => doctor.hospital === hospital.hospitalName)
    setHospitalDoctors(doctors)
    setShowDoctorsModal(true)
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

    toast.showSuccess(`Appointment request sent to ${selectedDoctor.name}! Date: ${bookingData.date} at ${bookingData.time}`)
    
    setShowBookingModal(false)
    setSelectedDoctor(null)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`material-symbols-outlined text-sm ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        star
      </span>
    ))
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
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">My Appointments</h2>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#111618] dark:text-white mb-2">Available Hospitals</h3>
                <p className="text-gray-600 dark:text-gray-400">Select a hospital to view available doctors and book appointments</p>
              </div>

              {hospitals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hospitals.map((hospital) => (
                    <div 
                      key={hospital.id} 
                      onClick={() => handleHospitalClick(hospital)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {hospital.hospitalPhoto ? (
                          <img
                            src={hospital.hospitalPhoto}
                            alt={hospital.hospitalName}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-2xl">local_hospital</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-[#111618] dark:text-white mb-1">{hospital.hospitalName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{hospital.city}, {hospital.state}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">License: {hospital.licenseNumber}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Address:</span>
                          <span className="font-medium text-[#111618] dark:text-white text-right">{hospital.address}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                          <span className="font-medium text-[#111618] dark:text-white">{hospital.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-primary font-medium">Click to view doctors</span>
                        <span className="material-symbols-outlined text-primary">arrow_forward</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">local_hospital</span>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Hospitals Available</h3>
                  <p className="text-gray-500 dark:text-gray-500">There are currently no approved hospitals in the system.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Doctors Modal */}
      {showDoctorsModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white">{selectedHospital.hospitalName}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Available Doctors</p>
                </div>
                <button 
                  onClick={() => {
                    setShowDoctorsModal(false)
                    setSelectedHospital(null)
                    setHospitalDoctors([])
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {hospitalDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hospitalDoctors.map((doctor) => (
                    <div key={doctor.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-[#111618] dark:text-white">{doctor.name}</h4>
                          <p className="text-primary font-medium">{doctor.specialization}</p>
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
                      </div>

                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-gray-400 text-4xl mb-3 block">person_off</span>
                  <p className="text-gray-500 dark:text-gray-400">No doctors available at this hospital</p>
                </div>
              )}
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
                  onClick={() => {
                    setShowBookingModal(false)
                    setSelectedDoctor(null)
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#111618] dark:text-white">{selectedDoctor.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDoctor.specialization}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Time</label>
                  <input
                    type="time"
                    name="time"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Visit</label>
                  <textarea
                    name="reason"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Describe your symptoms or reason for the appointment..."
                    required
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false)
                      setSelectedDoctor(null)
                    }}
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
    </Layout>
  )
}

export default Appointments
