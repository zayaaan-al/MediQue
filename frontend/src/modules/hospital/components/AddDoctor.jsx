import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HospitalSidebar from './HospitalSidebar'
import Layout from '../../../components/shared/Layout'
import { useToast } from '../../../components/shared/ToastManager'

const AddDoctor = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    licenseNumber: '',
    consultationFee: '',
    doctorPhoto: null,
    workingHours: {
      monday: { start: '', end: '', available: true },
      tuesday: { start: '', end: '', available: true },
      wednesday: { start: '', end: '', available: true },
      thursday: { start: '', end: '', available: true },
      friday: { start: '', end: '', available: true },
      saturday: { start: '', end: '', available: false },
      sunday: { start: '', end: '', available: false }
    }
  })

  const [photoPreview, setPhotoPreview] = useState(null)

  const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Psychiatry', 'Radiology', 'Anesthesiology', 'Emergency Medicine', 'Internal Medicine'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.showError('Please select a valid image file (JPEG, PNG, or GIF)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.showError('Please select an image smaller than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target.result
        setFormData(prev => ({
          ...prev,
          doctorPhoto: base64String
        }))
        setPhotoPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScheduleChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'specialization', 'experience', 'qualification', 'licenseNumber', 'consultationFee']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.showError(`Please fill in the following required fields: ${missingFields.join(', ')}`)
      return
    }

    // Validate working hours
    const hasWorkingHours = Object.values(formData.workingHours).some(day => day.available && day.start && day.end)
    if (!hasWorkingHours) {
      toast.showError('Please set at least one working day with start and end times')
      return
    }

    // Get current hospital info
    const currentHospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
    if (!currentHospital.hospitalName) {
      toast.showError('Hospital information not found. Please login again.')
      return
    }

    // Check if doctor email already exists
    const existingDoctors = JSON.parse(localStorage.getItem('hospitalDoctors') || '[]')
    const emailExists = existingDoctors.some(doctor => doctor.email === formData.email)
    
    if (emailExists) {
      toast.showError('A doctor with this email already exists. Please use a different email.')
      return
    }

    // Create doctor object
    const newDoctor = {
      id: Date.now(),
      name: `Dr. ${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      experience: parseInt(formData.experience),
      qualification: formData.qualification,
      qualifications: formData.qualification.split(',').map(q => q.trim()),
      licenseNumber: formData.licenseNumber,
      consultationFee: parseInt(formData.consultationFee),
      workingHours: formData.workingHours,
      hospital: currentHospital.hospitalName,
      hospitalId: currentHospital.id,
      rating: 0, // Initial rating
      reviewCount: 0,
      reviews: [],
      avatar: formData.doctorPhoto || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`, // Use uploaded photo or default
      about: `${formData.specialization} specialist with ${formData.experience} years of experience.`,
      nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      addedAt: new Date().toISOString()
    }

    // Save to localStorage
    existingDoctors.push(newDoctor)
    localStorage.setItem('hospitalDoctors', JSON.stringify(existingDoctors))
    
    console.log('Doctor added successfully:', newDoctor)
    toast.showSuccess('Doctor added successfully! Redirecting to dashboard...')
    
    // Redirect to hospital dashboard after a short delay
    setTimeout(() => {
      navigate('/hospital')
    }, 1500)
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.location.href = '/hospital/doctors'
    }
  }

  return (
    <Layout 
      userType="hospital" 
      userName="General Hospital" 
      userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      footerVariant="default"
    >
      <div className="relative flex min-h-screen w-full">
        <HospitalSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark/50">
          <div className="flex items-center gap-4">
            <Link to="/hospital/doctors" className="text-primary hover:text-primary/80">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Add New Doctor</h2>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="doctor@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Doctor Photo */}
                <div>
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-4">Doctor Photo</h3>
                  <div className="flex items-center space-x-6">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload doctor's professional photo (Max 5MB, JPEG/PNG/GIF)
                      </p>
                    </div>
                    {photoPreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={photoPreview}
                          alt="Doctor preview"
                          className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select specialization</option>
                        {specializations.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="5"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="MBBS, MD"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="License number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Consultation Fee ($)</label>
                      <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="150"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h3 className="text-xl font-semibold text-[#111618] dark:text-white mb-4">Working Hours</h3>
                  <div className="space-y-4">
                    {Object.entries(formData.workingHours).map(([day, schedule]) => (
                      <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-24">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={schedule.available}
                              onChange={(e) => handleScheduleChange(day, 'available', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{day}</span>
                          </label>
                        </div>
                        {schedule.available && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Time</label>
                              <input
                                type="time"
                                value={schedule.start}
                                onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Time</label>
                              <input
                                type="time"
                                value={schedule.end}
                                onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-600 dark:text-white"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      </div>
    </Layout>
  )
}

export default AddDoctor
