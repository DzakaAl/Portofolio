import { useState, useEffect } from 'react'
import { Mail } from 'lucide-react'
import { isAuthenticated, logout } from '../utils/auth'
import AdminMessagesIGStyle from './AdminMessagesIGStyle'
import AdminLogin from './AdminLogin'

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const checkAuth = isAuthenticated()
    setIsAdmin(checkAuth)
    
    if (!checkAuth) {
      setShowLoginModal(true)
    }

    // Listen for login/logout events
    const handleLoginEvent = () => {
      setIsAdmin(true)
    }
    
    const handleLogoutEvent = () => {
      setIsAdmin(false)
      setShowLoginModal(true)
    }
    
    window.addEventListener('adminLoginSuccess', handleLoginEvent)
    window.addEventListener('adminLogout', handleLogoutEvent)
    
    return () => {
      window.removeEventListener('adminLoginSuccess', handleLoginEvent)
      window.removeEventListener('adminLogout', handleLogoutEvent)
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsAdmin(true)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    logout()
    setIsAdmin(false)
    setShowLoginModal(true)
    window.dispatchEvent(new Event('adminLogout'))
  }

  const handleBackToHome = () => {
    // Use base URL for proper navigation on GitHub Pages
    const baseUrl = import.meta.env.BASE_URL || '/'
    window.location.href = baseUrl
  }

  if (!isAdmin) {
    return (
      <>
        <div className="min-h-screen bg-dark-300 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={40} className="text-sky-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Message Panel</h1>
            <p className="text-gray-400 mb-6">Please login to access the message panel</p>
          </div>
        </div>
        
        <AdminLogin
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false)
            handleBackToHome()
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-900">
      {/* Full Screen Content - No Header, No Padding */}
      <AdminMessagesIGStyle onLogout={handleLogout} onBackToHome={handleBackToHome} />
    </div>
  )
}

export default AdminPanel
