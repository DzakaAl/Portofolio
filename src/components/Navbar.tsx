import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Lock, LogOut, Mail } from 'lucide-react'
import { isAuthenticated, logout } from '../utils/auth'
import { getContactMessages, type ContactMessage } from '../services/api'
import AdminLogin from './AdminLogin'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkAuth = isAuthenticated()
    setIsAdmin(checkAuth)

    // Load unread count if admin
    if (checkAuth) {
      loadUnreadCount()
      // Poll every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [])

  const loadUnreadCount = async () => {
    try {
      const messages: ContactMessage[] = await getContactMessages()
      const unread = messages.filter(msg => !msg.isRead).length
      setUnreadCount(unread)
    } catch (err) {
      // Silent fail
    }
  }

  const handleLoginSuccess = () => {
    setIsAdmin(true)
    setShowLoginModal(false)
    // Trigger a custom event to notify other components
    window.dispatchEvent(new Event('adminLoginSuccess'))
  }

  const handleLogout = async () => {
    await logout()
    setIsAdmin(false)
    // Trigger a custom event to notify other components
    window.dispatchEvent(new Event('adminLogout'))
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <>
      {/* Login Modal */}
      <AdminLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-effect' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold gradient-text cursor-pointer flex-shrink-0"
              onClick={() => scrollToSection('#home')}
            >
              Portofolio
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                {isAdmin ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const baseUrl = import.meta.env.BASE_URL || '/'
                        window.location.href = baseUrl + 'admin'
                      }}
                      className="relative flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
                    >
                      <Mail size={16} />
                      Messages
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
                    >
                      <LogOut size={16} />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
                  >
                    <Lock size={16} />
                    Login
                  </motion.button>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center gap-2">
              {isAdmin && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const baseUrl = import.meta.env.BASE_URL || '/'
                    window.location.href = baseUrl + 'admin'
                  }}
                  className="relative p-2"
                  title="Messages"
                >
                  <Mail size={20} className="text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse text-[10px]">
                      {unreadCount > 9 ? '9' : unreadCount}
                    </span>
                  )}
                </motion.button>
              )}
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>  
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden glass-effect"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {item.name}
              </motion.button>
            ))}
            
            <div className="pt-2 border-t border-gray-700/50">
              {isAdmin ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowLoginModal(true)
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-all"
                >
                  <Lock size={18} />
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  )
}

export default Navbar
