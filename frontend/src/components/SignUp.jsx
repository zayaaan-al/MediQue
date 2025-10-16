import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from './shared/ToastManager'

const SignUp = () => {
  const [userType, setUserType] = useState('patient') // 'patient' or 'hospital'
  const toast = useToast()
  const navigate = useNavigate()
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: ''
  })
  const [hospitalData, setHospitalData] = useState({
    // Hospital Information
    hospitalName: '',
    licenseNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    hospitalEmail: '',
    hospitalPhoto: null,
    // Administrator Information
    adminFirstName: '',
    adminLastName: '',
    adminPhone: '',
    password: '',
    confirmPassword: ''
  })
  const [photoPreview, setPhotoPreview] = useState(null)

  const handlePatientInputChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    })
  }

  const handleHospitalInputChange = (e) => {
    setHospitalData({
      ...hospitalData,
      [e.target.name]: e.target.value
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.showError('Please select a valid image file (JPEG, PNG, or GIF)')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.showError('Please select an image smaller than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
        setHospitalData({
          ...hospitalData,
          hospitalPhoto: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePatientSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!patientData.firstName || !patientData.lastName || !patientData.email || !patientData.password || !patientData.phone || !patientData.dateOfBirth) {
      toast.showError('Please fill in all required fields')
      return
    }

    if (patientData.password.length < 6) {
      toast.showError('Password must be at least 6 characters long')
      return
    }

    // Check if patient already exists
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients') || '[]')
    const patientExists = registeredPatients.find(patient => patient.email === patientData.email)
    
    if (patientExists) {
      toast.showWarning('A patient with this email already exists. Please login instead.')
      return
    }

    // Create new patient
    const newPatient = {
      id: `P${Date.now()}`,
      name: `${patientData.firstName} ${patientData.lastName}`,
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      email: patientData.email,
      password: patientData.password,
      phone: patientData.phone,
      dateOfBirth: patientData.dateOfBirth,
      registeredAt: new Date().toISOString()
    }

    // Save to localStorage
    registeredPatients.push(newPatient)
    localStorage.setItem('registeredPatients', JSON.stringify(registeredPatients))
    
    toast.showSuccess('Patient registration successful! Please sign in to continue.')
    
    // Clear form
    setPatientData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      dateOfBirth: ''
    })
    
    // Redirect to sign in page
    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  const handleHospitalSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!hospitalData.hospitalName || !hospitalData.hospitalEmail || !hospitalData.password || !hospitalData.licenseNumber || !hospitalData.address || !hospitalData.city || !hospitalData.state || !hospitalData.phone || !hospitalData.adminFirstName || !hospitalData.adminLastName || !hospitalData.adminPhone || !hospitalData.confirmPassword) {
      toast.showError('Please fill in all required fields')
      return
    }

    if (hospitalData.password.length < 6) {
      toast.showError('Password must be at least 6 characters long')
      return
    }

    if (hospitalData.password !== hospitalData.confirmPassword) {
      toast.showError('Passwords do not match')
      return
    }

    // Check if hospital already exists
    const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
    const hospitalExists = registeredHospitals.find(hospital => 
      hospital.email === hospitalData.hospitalEmail || hospital.licenseNumber === hospitalData.licenseNumber
    )
    
    if (hospitalExists) {
      toast.showWarning('A hospital with this email or license number already exists. Please login instead.')
      return
    }

    // Create new hospital
    const newHospital = {
      id: `H${Date.now()}`,
      hospitalName: hospitalData.hospitalName,
      email: hospitalData.hospitalEmail,
      password: hospitalData.password,
      licenseNumber: hospitalData.licenseNumber,
      address: hospitalData.address,
      city: hospitalData.city,
      state: hospitalData.state,
      zipCode: hospitalData.zipCode,
      phone: hospitalData.phone,
      hospitalPhoto: hospitalData.hospitalPhoto,
      adminFirstName: hospitalData.adminFirstName,
      adminLastName: hospitalData.adminLastName,
      adminPhone: hospitalData.adminPhone,
      status: 'pending',
      registeredAt: new Date().toISOString()
    }

    // Save to localStorage
    registeredHospitals.push(newHospital)
    localStorage.setItem('registeredHospitals', JSON.stringify(registeredHospitals))
    
    toast.showSuccess('Hospital registration successful! Please wait for admin approval. You can now sign in once approved.')
    
    // Clear form
    setHospitalData({
      hospitalName: '',
      licenseNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      hospitalEmail: '',
      hospitalPhoto: null,
      adminFirstName: '',
      adminLastName: '',
      adminPhone: '',
      password: '',
      confirmPassword: ''
    })
    setPhotoPreview(null)
    
    // Redirect to sign in page
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4 block">
              {userType === 'patient' ? 'health_and_safety' : 'local_hospital'}
            </span>
            <h1 className="text-3xl font-bold text-[#111618] dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-[#617c89] dark:text-gray-400">
              Join our healthcare platform and get started today
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="mb-8">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setUserType('patient')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  userType === 'patient'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span className="material-symbols-outlined mr-2">person</span>
                Patient Registration
              </button>
              <button
                onClick={() => setUserType('hospital')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  userType === 'hospital'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span className="material-symbols-outlined mr-2">local_hospital</span>
                Hospital Registration
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            {userType === 'patient' ? (
              // Patient Registration Form
              <form onSubmit={handlePatientSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">person</span>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={patientData.firstName}
                        onChange={handlePatientInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">person</span>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={patientData.lastName}
                        onChange={handlePatientInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">email</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={patientData.email}
                      onChange={handlePatientInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">lock</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={patientData.password}
                      onChange={handlePatientInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">phone</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={patientData.phone}
                        onChange={handlePatientInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">calendar_today</span>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={patientData.dateOfBirth}
                        onChange={handlePatientInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Create Patient Account
                </button>
              </form>
            ) : (
              // Hospital Registration Form
              <form onSubmit={handleHospitalSubmit} className="space-y-6">
                {/* Hospital Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#111618] dark:text-white">Hospital Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hospital Name *
                      </label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={hospitalData.hospitalName}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="General Hospital"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Number *
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={hospitalData.licenseNumber}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="HL123456789"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={hospitalData.address}
                      onChange={handleHospitalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="123 Healthcare Ave"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={hospitalData.city}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="New York"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={hospitalData.state}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="NY"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={hospitalData.zipCode}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hospital Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={hospitalData.phone}
                      onChange={handleHospitalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hospital Email *
                  </label>
                  <input
                    type="email"
                    name="hospitalEmail"
                    value={hospitalData.hospitalEmail}
                    onChange={handleHospitalInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="hospital@example.com"
                    required
                  />
                </div>

                {/* Hospital Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hospital Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload hospital logo or building photo (Max 5MB, JPEG/PNG/GIF)
                      </p>
                    </div>
                    {photoPreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={photoPreview}
                          alt="Hospital preview"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Administrator Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#111618] dark:text-white">Administrator Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="adminFirstName"
                        value={hospitalData.adminFirstName}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="John"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="adminLastName"
                        value={hospitalData.adminLastName}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Phone *
                    </label>
                    <input
                      type="tel"
                      name="adminPhone"
                      value={hospitalData.adminPhone}
                      onChange={handleHospitalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="+1 (555) 987-6543"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={hospitalData.password}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Create password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={hospitalData.confirmPassword}
                        onChange={handleHospitalInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Register Hospital
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 ml-1"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
