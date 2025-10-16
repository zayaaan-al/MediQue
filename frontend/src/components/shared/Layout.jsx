import React from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import HomeButton from './HomeButton'
import Breadcrumb from './Breadcrumb'

const Layout = ({ 
  children, 
  userType = null, 
  userName = null, 
  userAvatar = null, 
  footerVariant = 'default',
  showFooter = true,
  showHomeButton = true,
  showBreadcrumb = true,
  breadcrumbItems = null
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navigation 
        userType={userType} 
        userName={userName} 
        userAvatar={userAvatar} 
      />
      {showBreadcrumb && <Breadcrumb customItems={breadcrumbItems} />}
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer variant={footerVariant} />}
      {showHomeButton && <HomeButton />}
    </div>
  )
}

export default Layout
