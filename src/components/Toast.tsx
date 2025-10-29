import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const config = {
    success: {
      icon: <CheckCircle size={20} />,
      gradient: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-300'
    },
    error: {
      icon: <XCircle size={20} />,
      gradient: 'from-red-500 to-rose-600',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-300'
    },
    info: {
      icon: <Info size={20} />,
      gradient: 'from-sky-500 to-blue-600',
      bg: 'bg-sky-500/20',
      border: 'border-sky-500/50',
      text: 'text-sky-300'
    }
  }

  const { icon, gradient, bg, border, text } = config[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed top-6 right-6 z-[9999] max-w-md"
        >
          <div className={`${bg} backdrop-blur-xl border ${border} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Gradient Top Bar */}
            <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
            
            <div className="p-4 flex items-start gap-3">
              {/* Icon */}
              <div className={`${text} mt-0.5`}>
                {icon}
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className={`${text} font-medium text-sm leading-relaxed`}>
                  {message}
                </p>
              </div>
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
