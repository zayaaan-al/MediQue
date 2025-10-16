import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation()
  
  // Don't show breadcrumb on home page
  if (location.pathname === '/') {
    return null
  }

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment)
    const breadcrumbs = [{ path: '/', label: 'Home', icon: 'home' }]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Generate human-readable labels
      let label = segment
      switch (segment) {
        case 'admin':
          label = 'Admin Portal'
          break
        case 'hospital':
          label = 'Hospital Portal'
          break
        case 'patient':
          label = 'Patient Portal'
          break
        case 'hospitals':
          label = 'Hospitals'
          break
        case 'doctors':
          label = 'Doctors'
          break
        case 'appointments':
          label = 'Appointments'
          break
        case 'queue':
          label = 'Queue Management'
          break
        case 'find-doctors':
          label = 'Make New Appointment'
          break
        case 'queue-status':
          label = 'Queue Status'
          break
        case 'medical-records':
          label = 'Medical Records'
          break
        case 'add':
          label = 'Add New'
          break
        default:
          label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      }

      breadcrumbs.push({
        path: currentPath,
        label,
        isLast: index === pathSegments.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <span className="material-symbols-outlined text-gray-400 mx-2 text-sm">
                  chevron_right
                </span>
              )}
              
              {crumb.isLast ? (
                <span className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  {crumb.icon && (
                    <span className="material-symbols-outlined text-lg">{crumb.icon}</span>
                  )}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  {crumb.icon && (
                    <span className="material-symbols-outlined text-lg">{crumb.icon}</span>
                  )}
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb
