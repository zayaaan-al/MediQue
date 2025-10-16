import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const HomeButton = () => {
  const location = useLocation()
  
  // Don't show the home button on the landing page itself
  if (location.pathname === '/') {
    return null
  }

  return (
    <Link
      to="/"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 group"
      title="Back to Home"
    >
      <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
        home
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Back to Home
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </Link>
  )
}

export default HomeButton
