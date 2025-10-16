import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from './shared/ToastManager'

const HospitalAuth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const toast = useToast()
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    // Registration fields
    hospitalName: '',
    licenseNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    hospitalEmail: '',
    adminFirstName: '',
    adminLastName: '',
    adminPhone: '',
    confirmPassword: '',
    hospitalPhoto: null
  })
  
  const [photoPreview, setPhotoPreview] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
          hospitalPhoto: base64String
        }))
        setPhotoPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isLogin) {
      // Login validation
      if (!formData.email || !formData.password) {
        toast.showError('Please fill in all required fields')
        return
      }
      
      // Check if hospital is registered (simulate checking database)
      const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
      const hospitalExists = registeredHospitals.find(hospital => hospital.hospitalEmail === formData.email)
      
      if (!hospitalExists) {
        toast.showWarning('Hospital not found. Please register first before logging in.')
        setIsLogin(false) // Switch to registration form
        return
      }
      
      if (hospitalExists.password !== formData.password) {
        toast.showError('Invalid password. Please try again.')
        return
      }
      
      // Check approval status
      if (hospitalExists.status === 'pending') {
        toast.showInfo('Your hospital registration is still pending admin approval. Please wait for approval before logging in.')
        return
      }
      
      if (hospitalExists.status === 'rejected') {
        toast.showError(`Your hospital registration was rejected. Reason: ${hospitalExists.rejectionReason || 'No reason provided'}. Please contact support for assistance.`)
        return
      }
      
      if (hospitalExists.status !== 'approved') {
        toast.showWarning('Your hospital account is not approved. Please contact support for assistance.')
        return
      }
      
      // Successful login
      localStorage.setItem('currentHospital', JSON.stringify(hospitalExists))
      toast.showSuccess('Hospital login successful! Redirecting...')
      setTimeout(() => {
        window.location.href = '/hospital'
      }, 1500)
    } else {
      // Registration validation
      const requiredFields = ['hospitalName', 'licenseNumber', 'address', 'city', 'state', 'zipCode', 'phone', 'hospitalEmail', 'adminFirstName', 'adminLastName', 'adminPhone', 'password', 'confirmPassword']
      const missingFields = requiredFields.filter(field => !formData[field])
      
      if (missingFields.length > 0) {
        toast.showError(`Please fill in the following required fields: ${missingFields.join(', ')}`)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.showError('Passwords do not match')
        return
      }

      // Check if hospital already exists
      const registeredHospitals = JSON.parse(localStorage.getItem('registeredHospitals') || '[]')
      const hospitalExists = registeredHospitals.find(hospital => hospital.hospitalEmail === formData.hospitalEmail || hospital.licenseNumber === formData.licenseNumber)
      
      if (hospitalExists) {
        toast.showWarning('A hospital with this email or license number already exists. Please login instead.')
        setIsLogin(true)
        return
      }
      
      // Add new hospital
      const newHospital = {
        id: Date.now(),
        hospitalName: formData.hospitalName,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        hospitalEmail: formData.hospitalEmail,
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminPhone: formData.adminPhone,
        password: formData.password,
        status: 'pending', // Pending admin approval
        registeredAt: new Date().toISOString()
      }
      
      registeredHospitals.push(newHospital)
      localStorage.setItem('registeredHospitals', JSON.stringify(registeredHospitals))
      
      toast.showSuccess('Hospital registration successful! Please wait for admin approval before you can login.')
      setIsLogin(true)
      // Clear form
      setFormData({
        email: '',
        password: '',
        hospitalName: '',
        licenseNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        hospitalEmail: '',
        adminFirstName: '',
        adminLastName: '',
        adminPhone: '',
        confirmPassword: '',
        hospitalPhoto: null
      })
      setPhotoPreview(null)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Hospital logging in with ${provider}`)
    toast.showInfo(`${provider} login for hospitals would be implemented here`)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    
    if (!forgotPasswordEmail) {
      toast.showError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast.showError('Please enter a valid email address')
      return
    }

    // Simulate password reset email
    toast.showSuccess(`Password reset instructions have been sent to ${forgotPasswordEmail}`)
    setIsForgotPassword(false)
    setForgotPasswordEmail('')
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4 block">local_hospital</span>
            <h1 className="text-3xl font-bold text-[#111618] dark:text-white mb-2">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Hospital Portal Login' : 'Hospital Registration'}
            </h1>
            <p className="text-[#617c89] dark:text-gray-400">
              {isForgotPassword ? 'Enter your email to receive reset instructions' : isLogin ? 'Access your hospital management dashboard' : 'Register your hospital with Medique'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {isForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">email</span>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter your hospital email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Send Reset Instructions
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {isLogin ? (
                // Login Form
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hospital Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="hospital@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </>
              ) : (
                // Registration Form
                <>
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
                          value={formData.hospitalName}
                          onChange={handleInputChange}
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
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
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
                        value={formData.address}
                        onChange={handleInputChange}
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
                          value={formData.city}
                          onChange={handleInputChange}
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
                          value={formData.state}
                          onChange={handleInputChange}
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
                          value={formData.zipCode}
                          onChange={handleInputChange}
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
                        value={formData.phone}
                        onChange={handleInputChange}
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
                      value={formData.hospitalEmail}
                      onChange={handleInputChange}
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

                  {/* Admin Information */}
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
                          value={formData.adminFirstName}
                          onChange={handleInputChange}
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
                          value={formData.adminLastName}
                          onChange={handleInputChange}
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
                        value={formData.adminPhone}
                        onChange={handleInputChange}
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
                          value={formData.password}
                          onChange={handleInputChange}
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
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                {isLogin ? 'Login to Hospital Portal' : 'Register Hospital'}
              </button>

              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
            )}

            {isLogin && !isForgotPassword && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>

                  <button 
                    onClick={() => handleSocialLogin('Microsoft')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                    </svg>
                    Microsoft
                  </button>
                </div>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have a hospital account? " : "Already have an account? "}
                {isLogin ? (
                  <Link
                    to="/signup"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Register Hospital
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Login Here
                  </button>
                )}
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospitalAuth
