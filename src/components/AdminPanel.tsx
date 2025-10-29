import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, LogOut, Home } from 'lucide-react'
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
    window.location.href = '/'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-dark-300 to-gray-900">
      {/* Admin Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-gray-700/30 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Mail size={18} className="sm:hidden text-white" />
                <Mail size={20} className="hidden sm:block text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Admin Panel</h1>
                <p className="text-xs text-gray-400 font-medium hidden sm:block">Message Management</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToHome}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg sm:rounded-xl text-sm font-medium transition-all border border-gray-600/30 hover:border-gray-600"
              >
                <Home size={16} className="sm:hidden" />
                <Home size={18} className="hidden sm:block" />
                <span className="hidden md:inline">Back</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-500/30"
              >
                <LogOut size={16} className="sm:hidden" />
                <LogOut size={18} className="hidden sm:block" />
                <span className="hidden md:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="pt-14 sm:pt-16">
        <AdminMessagesIGStyle />
      </div>
    </div>
  )
}

export default AdminPanel
