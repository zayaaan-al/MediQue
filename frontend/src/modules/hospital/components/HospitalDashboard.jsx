import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HospitalSidebar from './HospitalSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const HospitalDashboard = () => {
  const toast = useToast()
  const [selectedMonth, setSelectedMonth] = useState('October 2023')
  const [selectedDate, setSelectedDate] = useState(9)
  const [doctors, setDoctors] = useState([])
  const [currentHospital, setCurrentHospital] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    consultationFee: ''
  })

  // Load current hospital data
  useEffect(() => {
    const hospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
    setCurrentHospital(hospital)
  }, [])

  // Load doctors for current hospital
  useEffect(() => {
    const loadHospitalDoctors = () => {
      const currentHospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
      const allDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
      
      if (currentHospital.hospitalName) {
        const hospitalDoctors = allDoctors
          .filter(doctor => doctor.hospital === currentHospital.hospitalName)
          .map(doctor => ({
            id: doctor.id,
            name: doctor.name,
            specialization: doctor.specialization,
            status: 'Active', // Default status
            avatar: doctor.avatar
          }))
        
        setDoctors(hospitalDoctors)
      }
    }
    
    loadHospitalDoctors()
  }, [])

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setEditFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      experience: doctor.experience.toString(),
      qualification: doctor.qualification,
      consultationFee: doctor.consultationFee.toString()
    })
    setShowEditModal(true)
  }

  const handleDeleteDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDeleteModal(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    
    const allDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
    const updatedDoctors = allDoctors.map(doctor => {
      if (doctor.id === selectedDoctor.id) {
        return {
          ...doctor,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          name: `Dr. ${editFormData.firstName} ${editFormData.lastName}`,
          email: editFormData.email,
          phone: editFormData.phone,
          specialization: editFormData.specialization,
          experience: parseInt(editFormData.experience),
          qualification: editFormData.qualification,
          qualifications: editFormData.qualification.split(',').map(q => q.trim()),
          consultationFee: parseInt(editFormData.consultationFee),
          about: `${editFormData.specialization} specialist with ${editFormData.experience} years of experience.`
        }
      }
      return doctor
    })
    
    localStorage.setItem('hospitalDoctors', JSON.stringify(updatedDoctors))
    
    // Reload doctors
    const currentHospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
    const hospitalDoctors = updatedDoctors
      .filter(doctor => doctor.hospital === currentHospital.hospitalName)
      .map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        status: 'Active',
        avatar: doctor.avatar
      }))
    
    setDoctors(hospitalDoctors)
    setShowEditModal(false)
    setSelectedDoctor(null)
    toast.showSuccess('Doctor updated successfully!')
  }

  const handleDeleteConfirm = () => {
    const allDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
    const updatedDoctors = allDoctors.filter(doctor => doctor.id !== selectedDoctor.id)
    
    localStorage.setItem('hospitalDoctors', JSON.stringify(updatedDoctors))
    
    // Reload doctors
    const currentHospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
    const hospitalDoctors = updatedDoctors
      .filter(doctor => doctor.hospital === currentHospital.hospitalName)
      .map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        status: 'Active',
        avatar: doctor.avatar
      }))
    
    setDoctors(hospitalDoctors)
    setShowDeleteModal(false)
    setSelectedDoctor(null)
    toast.showSuccess('Doctor deleted successfully!')
  }

  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    })
  }

  // Load appointment requests from localStorage
  const [appointmentRequests, setAppointmentRequests] = useState([])

  useEffect(() => {
    const loadAppointmentRequests = () => {
      const currentHospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
      const allRequests = JSON.parse(localStorage.getItem('appointmentRequests') || '[]')
      
      // Filter requests for current hospital
      const hospitalRequests = allRequests.filter(request => 
        request.hospitalName === currentHospital.hospitalName
      )
      
      setAppointmentRequests(hospitalRequests)
    }
    
    loadAppointmentRequests()
  }, [])

  const todayStats = [
    { title: 'Today\'s Appointments', value: appointmentRequests.length.toString(), change: '0', positive: true },
    { title: 'Pending Requests', value: appointmentRequests.filter(req => req.status === 'pending').length.toString(), change: '0', positive: true },
    { title: 'Available Doctors', value: doctors.length.toString(), change: '0', positive: true },
    { title: 'Total Requests', value: appointmentRequests.length.toString(), change: '0', positive: true }
  ]

  return (
    <Layout 
      userType="hospital" 
      userName={currentHospital?.hospitalName || 'Hospital'} 
      userAvatar={currentHospital?.hospitalPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <HospitalSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Hospital Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, General Hospital!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-md">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
            </button>
            <img 
              alt="Admin Avatar" 
              className="h-12 w-12 rounded-full object-cover" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            />
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</p>
              <p className="text-slate-800 dark:text-white text-2xl font-bold mt-1">{stat.value}</p>
              <p className={`text-sm font-medium mt-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from yesterday
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-2">
            {/* Doctor Management */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Doctor Management</h3>
                <Link to="/hospital/doctors/add" className="flex items-center gap-2 rounded-lg bg-primary py-2 px-4 font-semibold text-white hover:bg-primary/90 transition-colors text-sm">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Doctor
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                      <th className="py-2 pr-4">Doctor</th>
                      <th className="py-2 px-4">Specialization</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <tr key={doctor.id} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <img 
                                alt={doctor.name} 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={doctor.avatar}
                              />
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-white">{doctor.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">ID: #{doctor.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{doctor.specialization}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              doctor.status === 'Active' 
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                                : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                            }`}>
                              {doctor.status}
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <button 
                              onClick={() => {
                                // Get full doctor data from localStorage
                                const allDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
                                const fullDoctor = allDoctors.find(d => d.id === doctor.id)
                                if (fullDoctor) handleEditDoctor(fullDoctor)
                              }}
                              className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteDoctor(doctor)}
                              className="p-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center">
                          <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">medical_services</span>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">No doctors added yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Add your first doctor to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appointment Requests */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Appointment Requests</h3>
                <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <button className="px-3 py-1 text-sm font-semibold text-white bg-primary rounded-md">New</button>
                  <button className="px-3 py-1 text-sm font-semibold text-slate-600 dark:text-slate-300">All</button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {appointmentRequests.length > 0 ? (
                  appointmentRequests.map((request) => (
                    <div key={request.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                      <img 
                        alt="Patient Avatar" 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={request.patientAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{request.patientName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Wants to book with {request.doctorName}</p>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{request.timeAgo}</p>
                        </div>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          <p><span className="font-semibold">Reason:</span> {request.reason}</p>
                          <p><span className="font-semibold">Requested Time:</span> {request.requestedTime}</p>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-green-500 py-2 px-4 font-semibold text-white hover:bg-green-600 transition-colors text-sm">
                            Accept
                          </button>
                          <button className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-red-500 py-2 px-4 font-semibold text-white hover:bg-red-600 transition-colors text-sm">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-gray-400 text-4xl mb-3 block">event_available</span>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">No appointment requests</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Requests will appear here when patients book appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/hospital/queue" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">View Live Queue</span>
                </Link>
                <Link to="/hospital/appointments" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Manage Schedules</span>
                </Link>
                <Link to="/hospital/reports" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">View Reports</span>
                </Link>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 mt-1">auto_awesome</span>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-white">AI Insights</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                    Based on current trends, we predict a <strong>15% increase</strong> in patient requests next week.
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Consider adjusting schedules for Cardiology to manage the load.
                  </p>
                  <button className="font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-3 text-sm">
                    View Detailed Analysis
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {doctors.length > 0 ? (
                  doctors.map((doctor, index) => (
                    <div key={doctor.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 dark:text-white">{doctor.name} - {doctor.specialization}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Available Today</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <span className="material-symbols-outlined text-gray-400 text-3xl mb-2 block">schedule</span>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No doctors scheduled</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">Add doctors to see their schedules</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Edit Doctor</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                    <select
                      name="specialization"
                      value={editFormData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Anesthesiology">Anesthesiology</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={editFormData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={editFormData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="MBBS, MD"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Consultation Fee ($)</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={editFormData.consultationFee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Update Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Doctor Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#111618] dark:text-white">Delete Doctor</h3>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete <strong>{selectedDoctor.name}</strong>? This action cannot be undone.
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

export default HospitalDashboard
