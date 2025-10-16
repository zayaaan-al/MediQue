import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navigation = ({ userType = null, userName = null, userAvatar = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if dark mode is already enabled
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('darkMode') === 'true'
  })
  const location = useLocation()
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('currentPatient')
    localStorage.removeItem('currentHospital')
    localStorage.removeItem('currentAdmin')
    
    // Navigate to main landing page and force reload for clean state
    window.location.href = '/'
  }

  const getProfileMenuItems = () => {
    if (userType === 'patient') {
      return [
        { path: '/patient', label: 'Dashboard', icon: 'dashboard' },
        { path: '/patient/profile', label: 'Profile Settings', icon: 'person' },
        { path: '/patient/appointments', label: 'My Appointments', icon: 'calendar_month' },
        { path: '/patient/medical-records', label: 'Medical Records', icon: 'folder_open' }
      ]
    } else if (userType === 'hospital') {
      return [
        { path: '/hospital', label: 'Dashboard', icon: 'dashboard' },
        { path: '/hospital/profile', label: 'Hospital Profile', icon: 'local_hospital' },
        { path: '/hospital/doctors', label: 'Manage Doctors', icon: 'person' },
        { path: '/hospital/appointments', label: 'Appointments', icon: 'calendar_month' }
      ]
    } else if (userType === 'admin') {
      return [
        { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/admin/hospitals', label: 'Manage Hospitals', icon: 'apartment' },
        { path: '/admin/settings', label: 'Settings', icon: 'settings' }
      ]
    }
    return []
  }

  // Initialize dark mode on component mount
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Close profile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const getNavigationItems = () => {
    const homeItem = { path: '/', label: 'Home', icon: 'home' }
    
    if (userType === 'admin') {
      return [
        homeItem,
        { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/admin/hospitals', label: 'Hospitals', icon: 'apartment' },
        { path: '/admin/settings', label: 'Settings', icon: 'settings' }
      ]
    } else if (userType === 'hospital') {
      return [
        homeItem,
        { path: '/hospital', label: 'Dashboard', icon: 'dashboard' },
        { path: '/hospital/doctors', label: 'Doctors', icon: 'person' },
        { path: '/hospital/appointments', label: 'Appointments', icon: 'calendar_month' },
        { path: '/hospital/queue', label: 'Queue', icon: 'groups' }
      ]
    } else if (userType === 'patient') {
      return [
        homeItem,
        { path: '/patient', label: 'Dashboard', icon: 'dashboard' },
        { path: '/patient/appointments', label: 'Make New Appointment', icon: 'calendar_add_on' },
        { path: '/patient/find-doctors', label: 'Find Doctors', icon: 'search' },
        { path: '/patient/queue-status', label: 'Queue Status', icon: 'groups' }
      ]
    }
    return [
      { path: '/#features', label: 'Features', icon: null },
      { path: '/#benefits', label: 'Benefits', icon: null },
      { path: '/#pricing', label: 'Pricing', icon: null },
      { path: '/#contact', label: 'Contact', icon: null }
    ]
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 text-primary">
              <div className="size-8">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_543)">
                    <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
                  </g>
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
                {userType ? 'Medique' : 'Medique'}
              </h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path || 
                              (item.path.startsWith('/#') && location.pathname === '/' && location.hash === item.path.substring(1))
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={(e) => {
                    if (item.path.startsWith('/#')) {
                      e.preventDefault()
                      const targetId = item.path.substring(2)
                      const element = document.getElementById(targetId)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                        window.history.pushState(null, '', item.path)
                      }
                    }
                  }}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {item.icon && <span className="material-symbols-outlined text-lg">{item.icon}</span>}
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* User Section or Auth Buttons */}
            {userType && userName ? (
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
                </button>
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img
                      src={userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userType}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">
                      {isProfileMenuOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <img
                            src={userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                            alt={userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {getProfileMenuItems().map((item, index) => (
                          <Link
                            key={index}
                            to={item.path}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                        >
                          <span className="material-symbols-outlined text-lg">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.path || 
                                (item.path.startsWith('/#') && location.pathname === '/' && location.hash === item.path.substring(1))
                
                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false)
                      if (item.path.startsWith('/#')) {
                        e.preventDefault()
                        const targetId = item.path.substring(2)
                        const element = document.getElementById(targetId)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                          window.history.pushState(null, '', item.path)
                        }
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon && <span className="material-symbols-outlined text-lg">{item.icon}</span>}
                    {item.label}
                  </Link>
                )
              })}
              
              {!userType && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-center bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navigation
