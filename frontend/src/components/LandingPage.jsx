import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from './shared/Layout'

const LandingPage = () => {
  const navigate = useNavigate()
  
  // Check if user is logged in
  const currentPatient = JSON.parse(localStorage.getItem('currentPatient') || '{}')
  const currentHospital = JSON.parse(localStorage.getItem('currentHospital') || '{}')
  const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin') || '{}')
  
  let userType = null
  let userName = null
  let userAvatar = null
  
  if (currentPatient.id) {
    userType = 'patient'
    userName = currentPatient.name
    userAvatar = currentPatient.avatar
  } else if (currentHospital.id) {
    userType = 'hospital'
    userName = currentHospital.hospitalName
    userAvatar = currentHospital.hospitalPhoto
  } else if (currentAdmin.id) {
    userType = 'admin'
    userName = currentAdmin.name
    userAvatar = currentAdmin.avatar
  }

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('currentPatient')
    localStorage.removeItem('currentHospital')
    localStorage.removeItem('currentAdmin')
    
    // Navigate to main landing page and force reload for clean state
    window.location.href = '/'
  }

  return (
    <Layout 
      userType={userType}
      userName={userName}
      userAvatar={userAvatar}
      showFooter={true} 
      footerVariant="default" 
      showBreadcrumb={false} 
      showHomeButton={false}
    >
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">

        {/* Main Content */}
        <main className="flex flex-col flex-1">
          <div className="px-4 lg:px-40 flex flex-1 justify-center pt-24">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {/* Hero Section */}
              <div className="@container">
                <div className="@[480px]:p-4">
                  <div className="flex min-h-[600px] flex-col gap-8 bg-cover bg-center bg-no-repeat @[480px]:gap-10 @[480px]:rounded-xl items-center justify-center p-8 bg-gradient-to-br from-blue-900/80 via-primary/70 to-teal-800/80" style={{backgroundImage: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(15, 118, 110, 0.8) 100%), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'}}>
                    <div className="flex flex-col gap-4 text-center">
                      <div className="mb-4">
                        <span className="inline-block p-4 bg-white/20 rounded-full backdrop-blur-sm">
                          <span className="material-symbols-outlined text-white text-5xl">health_and_safety</span>
                        </span>
                      </div>
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl drop-shadow-lg">
                        Medique
                      </h1>
                      <h2 className="text-white text-xl font-semibold @[480px]:text-2xl mb-2">
                        Revolutionizing Healthcare Management
                      </h2>
                      <p className="text-white/90 text-base font-normal leading-relaxed @[480px]:text-lg max-w-4xl">
                        Experience a seamless, efficient, and modern approach to managing hospital appointments and patient flow. Our AI-powered system is designed to reduce wait times, improve patient satisfaction, and increase operational efficiency for healthcare providers.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                      {userType === 'patient' ? (
                        <>
                          <Link to="/patient/appointments" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">calendar_add_on</span>
                            <span className="truncate">Make Appointment</span>
                          </Link>
                          <Link to="/patient/find-doctors" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">search</span>
                            <span className="truncate">Find Doctors</span>
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <span className="material-symbols-outlined mr-2">logout</span>
                            <span className="truncate">Sign Out</span>
                          </button>
                        </>
                      ) : userType === 'hospital' ? (
                        <>
                          <Link to="/hospital/doctors" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">person</span>
                            <span className="truncate">Manage Doctors</span>
                          </Link>
                          <Link to="/hospital/appointments" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">calendar_month</span>
                            <span className="truncate">View Appointments</span>
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <span className="material-symbols-outlined mr-2">logout</span>
                            <span className="truncate">Sign Out</span>
                          </button>
                        </>
                      ) : userType === 'admin' ? (
                        <>
                          <Link to="/admin/hospitals" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">apartment</span>
                            <span className="truncate">Manage Hospitals</span>
                          </Link>
                          <Link to="/admin/hospital-approvals" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">approval</span>
                            <span className="truncate">Hospital Approvals</span>
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <span className="material-symbols-outlined mr-2">logout</span>
                            <span className="truncate">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/patient-portal" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">person</span>
                            <span className="truncate">Patient Portal</span>
                          </Link>
                          <Link to="/hospital-portal" className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 @[480px]:h-14 @[480px]:px-10 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <span className="material-symbols-outlined mr-2">local_hospital</span>
                            <span className="truncate">Hospital Portal</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div id="features" className="flex flex-col gap-10 px-4 py-16 @container">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h1 className="text-3xl font-bold tracking-tight @[480px]:text-4xl @[480px]:font-black max-w-[720px]">
                    Core Features of Our Automation System
                  </h1>
                  <p className="text-base font-normal leading-normal max-w-[720px] text-[#617c89] dark:text-white/60">
                    Our platform is packed with features designed to streamline the entire appointment and queuing process for both patients and hospitals.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-0">
                  <div className="group flex flex-1 gap-6 rounded-2xl border border-[#dbe2e6] dark:border-white/10 bg-white dark:bg-white/5 p-8 flex-col hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-primary/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                          alt="AI-Powered Scheduling"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-4 left-4 p-3 bg-primary rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-white text-2xl">neurology</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">AI-Powered Scheduling</h2>
                      <p className="text-[#617c89] dark:text-white/60 text-base font-normal leading-relaxed">
                        Our intelligent system analyzes historical data and real-time conditions to predict appointment durations and optimize schedules, minimizing patient wait times.
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex flex-1 gap-6 rounded-2xl border border-[#dbe2e6] dark:border-white/10 bg-white dark:bg-white/5 p-8 flex-col hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-green-100 to-teal-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                          alt="Real-Time Queue Updates"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-4 left-4 p-3 bg-teal-600 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-white text-2xl">update</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">Real-Time Queue Updates</h2>
                      <p className="text-[#617c89] dark:text-white/60 text-base font-normal leading-relaxed">
                        Patients can track their position in the queue from their mobile devices, receiving timely updates and notifications as their turn approaches.
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex flex-1 gap-6 rounded-2xl border border-[#dbe2e6] dark:border-white/10 bg-white dark:bg-white/5 p-8 flex-col hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                          alt="Automated Reminders"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-4 left-4 p-3 bg-purple-600 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-white text-2xl">notifications_active</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">Automated Reminders</h2>
                      <p className="text-[#617c89] dark:text-white/60 text-base font-normal leading-relaxed">
                        Reduce no-shows and keep patients informed with automated appointment reminders and pre-visit instructions sent via SMS or email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div id="benefits" className="px-4 py-20">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold tracking-tight @[480px]:text-4xl @[480px]:font-black mb-4">
                    Transforming Healthcare for Everyone
                  </h2>
                  <p className="text-base font-normal leading-normal max-w-2xl mx-auto text-[#617c89] dark:text-white/60">
                    Our platform delivers measurable benefits to both patients and healthcare providers, creating a win-win ecosystem.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                  <div className="group flex flex-col gap-6">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-50 to-primary/10">
                        <img 
                          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1931&q=80" 
                          alt="Happy patients using mobile app"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full">
                          <span className="material-symbols-outlined text-primary text-2xl">sentiment_very_satisfied</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">Benefits for Patients</h3>
                      <p className="text-[#617c89] dark:text-white/60 text-base leading-relaxed">
                        Enjoy a stress-free hospital experience with reduced waiting times, transparent communication, and the convenience of managing your appointments from anywhere.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-primary">schedule</span>
                          <span className="text-sm font-medium">Reduced Wait Times</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-green-600">smartphone</span>
                          <span className="text-sm font-medium">Mobile Convenience</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-purple-600">notifications</span>
                          <span className="text-sm font-medium">Smart Reminders</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-orange-600">visibility</span>
                          <span className="text-sm font-medium">Full Transparency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group flex flex-col gap-6">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-teal-50 to-teal-100">
                        <img 
                          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                          alt="Medical professionals using technology"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-600/30 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full">
                          <span className="material-symbols-outlined text-teal-600 text-2xl">trending_up</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">Benefits for Hospitals</h3>
                      <p className="text-[#617c89] dark:text-white/60 text-base leading-relaxed">
                        Optimize your hospital's workflow, reduce administrative overhead, and improve patient throughput with our intelligent automation tools.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-teal-600">speed</span>
                          <span className="text-sm font-medium">Improved Efficiency</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-indigo-600">analytics</span>
                          <span className="text-sm font-medium">Data Insights</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-rose-600">savings</span>
                          <span className="text-sm font-medium">Cost Reduction</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-amber-600">groups</span>
                          <span className="text-sm font-medium">Better Patient Flow</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight @[480px]:text-4xl @[480px]:font-black mb-4">
                      What Our Users Are Saying
                    </h2>
                    <p className="text-base font-normal leading-normal max-w-2xl mx-auto text-[#617c89] dark:text-white/60">
                      Real feedback from patients, doctors, and healthcare administrators who have transformed their experience with Medique.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex flex-col items-center text-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                            <img 
                              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" 
                              alt="Sarah L."
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-full">
                            <span className="material-symbols-outlined text-white text-sm">star</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-yellow-400 text-lg">star</span>
                            ))}
                          </div>
                          <blockquote className="text-[#617c89] dark:text-white/60 text-base leading-relaxed italic">
                            "The real-time queue updates are a game-changer! I could see exactly when my turn was, which made the whole process so much less stressful."
                          </blockquote>
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Sarah L.</p>
                            <p className="text-sm text-primary font-medium">Patient</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex flex-col items-center text-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-teal-500/20 group-hover:ring-teal-500/40 transition-all duration-300">
                            <img 
                              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                              alt="Dr. Michael Chen"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 p-2 bg-teal-600 rounded-full">
                            <span className="material-symbols-outlined text-white text-sm">medical_services</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-yellow-400 text-lg">star</span>
                            ))}
                          </div>
                          <blockquote className="text-[#617c89] dark:text-white/60 text-base leading-relaxed italic">
                            "This system has significantly reduced our administrative workload and improved our clinic's efficiency. Our staff and patients are much happier."
                          </blockquote>
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Dr. Michael Chen</p>
                            <p className="text-sm text-teal-600 font-medium">Cardiologist</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 md:col-span-2 lg:col-span-1">
                      <div className="flex flex-col items-center text-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300">
                            <img 
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" 
                              alt="Rodriguez Family"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 p-2 bg-purple-600 rounded-full">
                            <span className="material-symbols-outlined text-white text-sm">family_restroom</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-yellow-400 text-lg">star</span>
                            ))}
                          </div>
                          <blockquote className="text-[#617c89] dark:text-white/60 text-base leading-relaxed italic">
                            "Booking appointments for our kids has never been easier. The automated reminders are a lifesaver for our busy family schedule."
                          </blockquote>
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">The Rodriguez Family</p>
                            <p className="text-sm text-purple-600 font-medium">Family of 4</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
        </div>
      </div>
    </Layout>
  )
}

export default LandingPage
