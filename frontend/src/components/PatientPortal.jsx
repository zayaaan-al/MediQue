import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from './shared/ToastManager'

const PatientPortal = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  })
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isLogin) {
      // Login validation
      if (!formData.email || !formData.password) {
        toast.showError('Please fill in all required fields')
        return
      }

      // Check for admin credentials
      if (formData.email === 'admin222@gmail.com' && formData.password === 'admin@123') {
        const adminUser = {
          id: 'admin',
          name: 'System Administrator',
          email: 'admin222@gmail.com',
          userType: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        }
        localStorage.setItem('currentAdmin', JSON.stringify(adminUser))
        toast.showSuccess('Admin login successful! Redirecting...')
        setTimeout(() => {
          navigate('/admin')
        }, 1500)
        return
      }

      // Check if user is a registered patient
      const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients') || '[]')
      const patientExists = registeredPatients.find(patient => patient.email === formData.email)
      
      if (!patientExists) {
        toast.showWarning('Account not found. Please register first.')
        setIsLogin(false)
        return
      }
      
      if (patientExists.password !== formData.password) {
        toast.showError('Invalid password. Please try again.')
        return
      }
      
      // Successful patient login
      localStorage.setItem('currentPatient', JSON.stringify(patientExists))
      toast.showSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        navigate('/patient')
      }, 1500)
    } else {
      // Registration
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone || !formData.dateOfBirth) {
        toast.showError('Please fill in all required fields')
        return
      }

      if (formData.password.length < 6) {
        toast.showError('Password must be at least 6 characters long')
        return
      }

      const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients') || '[]')
      const patientExists = registeredPatients.find(patient => patient.email === formData.email)
      
      if (patientExists) {
        toast.showWarning('An account with this email already exists. Please login instead.')
        setIsLogin(true)
        return
      }
      
      // Add new patient
      const newPatient = {
        id: `P${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
        registeredAt: new Date().toISOString()
      }
      
      registeredPatients.push(newPatient)
      localStorage.setItem('registeredPatients', JSON.stringify(registeredPatients))
      
      toast.showSuccess('Account created successfully! Please sign in.')
      setIsLogin(true)
      setFormData({
        ...formData,
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        password: ''
      })
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    
    if (!forgotPasswordEmail) {
      toast.showError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast.showError('Please enter a valid email address')
      return
    }

    toast.showSuccess(`Password reset instructions have been sent to ${forgotPasswordEmail}`)
    setIsForgotPassword(false)
    setForgotPasswordEmail('')
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4 block">health_and_safety</span>
            <h1 className="text-3xl font-bold text-[#111618] dark:text-white mb-2">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Patient Portal' : 'Patient Registration'}
            </h1>
            <p className="text-[#617c89] dark:text-gray-400">
              {isForgotPassword ? 'Enter your email to receive reset instructions' : isLogin ? 'Sign in to access your patient dashboard' : 'Create your patient account'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
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
                      placeholder="Enter your email address"
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
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="John"
                          required={!isLogin}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Doe"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="+1 (555) 123-4567"
                        required={!isLogin}
                      />
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">mail</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">lock</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="font-medium text-primary hover:text-primary/80"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            )}

            {!isForgotPassword && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-primary hover:text-primary/80 ml-1"
                  >
                    {isLogin ? 'Register here' : 'Sign in'}
                  </button>
                </p>
              </div>
            )}

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

export default PatientPortal
