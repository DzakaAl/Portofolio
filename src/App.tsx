import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import AdminPanel from './components/AdminPanel'
import EditModeControls from './components/EditModeControls'
import { trackVisitor, trackPageView } from './services/api'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const isAdmin = localStorage.getItem('portfolio_admin_auth') === 'true'
    
    if (!isAdmin) {
      trackVisitor()
      trackPageView('home')
    }
    
    const path = window.location.pathname
    const basePath = import.meta.env.BASE_URL || '/'
    const relativePath = path.replace(basePath, '/').replace(/\/+/g, '/')
    
    if (relativePath.includes('admin') || path.includes('admin')) {
      setCurrentPage('admin')
      if (!isAdmin) {
        trackPageView('admin')
      }
    } else {
      setCurrentPage('home')
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const basePath = import.meta.env.BASE_URL || '/'
      const relativePath = path.replace(basePath, '/').replace(/\/+/g, '/')
      
      if (relativePath.includes('admin') || path.includes('admin')) {
        setCurrentPage('admin')
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
        </div>
      </div>
    )
  }

  // Render Admin Panel
  if (currentPage === 'admin') {
    return <AdminPanel />
  }

  return (
    <div className="bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 min-h-screen">
      <Navbar />
      <EditModeControls />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Contact />
      </main>
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default App