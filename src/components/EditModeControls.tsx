import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { isAuthenticated } from '../utils/auth'
import { useToast } from '../hooks/useToast'
import Toast from './Toast'
import ConfirmDialog from './ConfirmDialog'

const EditModeControls = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const { toast, hideToast, success, error: showError } = useToast()

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = isAuthenticated()
    setIsAdmin(isAuth)
    // Don't auto-enable edit mode, let user click Edit Mode button
    setIsEditMode(false)
    
    // Listen for login/logout events
    const handleLoginEvent = () => {
      setIsAdmin(true)
      setIsEditMode(false) // Don't auto-enable, require user to click Edit Mode
    }
    
    const handleLogoutEvent = () => {
      setIsAdmin(false)
      setIsEditMode(false)
    }

    const handleEditModeChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsEditMode(customEvent.detail.isEditMode)
    }
    
    window.addEventListener('adminLoginSuccess', handleLoginEvent)
    window.addEventListener('adminLogout', handleLogoutEvent)
    window.addEventListener('editModeChange', handleEditModeChange)
    
    return () => {
      window.removeEventListener('adminLoginSuccess', handleLoginEvent)
      window.removeEventListener('adminLogout', handleLogoutEvent)
      window.removeEventListener('editModeChange', handleEditModeChange)
    }
  }, [])

  const handleToggleEditMode = () => {
    const newMode = !isEditMode
    setIsEditMode(newMode)
    // Dispatch event to notify all components
    window.dispatchEvent(new CustomEvent('editModeChange', { detail: { isEditMode: newMode } }))
  }

  const handleSave = async () => {
    try {
      // Dispatch save event for components that need it
      window.dispatchEvent(new Event('saveEditChanges'))
      
      // Wait a bit for save to complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Show success toast
      success('✅ Perubahan berhasil disimpan!')
    } catch (error) {
      showError('❌ Gagal menyimpan. Silakan coba lagi.')
    }
  }

  const handleCancelEdit = () => {
    setShowCancelConfirm(true)
  }

  const confirmCancel = () => {
    setShowCancelConfirm(false)
    setIsEditMode(false)
    // Dispatch event to notify all components
    window.dispatchEvent(new CustomEvent('editModeChange', { detail: { isEditMode: false } }))
  }

  const cancelCancel = () => {
    setShowCancelConfirm(false)
  }

  // Don't show controls on admin panel page
  if (window.location.pathname === '/admin') {
    return null
  }

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      
      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Keluar dari Edit Mode?"
        message="Yakin ingin keluar dari mode edit? Perubahan yang belum disimpan akan hilang."
        onConfirm={confirmCancel}
        onCancel={cancelCancel}
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="warning"
      />

      {/* Edit Mode Active - Save/Cancel buttons */}
      {isAdmin && isEditMode && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-20 right-2 sm:right-4 z-[60] flex flex-col sm:flex-row gap-2"
        >
          <button
            onClick={handleSave}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <span>💾</span> 
            <span className="hidden sm:inline">Simpan</span>
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <span>❌</span>
            <span className="hidden sm:inline">Batal</span>
          </button>
        </motion.div>
      )}

      {/* Edit Mode Toggle - Only when logged in but not editing */}
      {isAdmin && !isEditMode && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={handleToggleEditMode}
          className="fixed top-20 right-2 sm:right-4 z-[60] px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all text-sm sm:text-base whitespace-nowrap"
        >
          <span>✏️</span>
          <span className="hidden sm:inline">Edit Mode</span>
        </motion.button>
      )}
    </>
  )
}

export default EditModeControls
