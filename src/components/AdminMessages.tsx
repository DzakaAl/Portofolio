import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Trash2, Calendar, Eye, User, X } from 'lucide-react'
import { getContactMessages, deleteContactMessage, markMessageAsRead, type ContactMessage } from '../services/api'
import { useToast } from '../hooks/useToast'
import Toast from './Toast'
import ConfirmDialog from './ConfirmDialog'

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [showModal, setShowModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast, hideToast, success, error: showError } = useToast()
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    messageId: number | null
  }>({ isOpen: false, messageId: null })

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    // Scroll to bottom when message selected
    if (selectedMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedMessage])

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      const data = await getContactMessages()
      // Sort by newest first
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      setMessages(sortedData)
    } catch (error) {
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMessage = async (id: number) => {
    setConfirmDialog({ isOpen: true, messageId: id })
  }

  const confirmDelete = async () => {
    const id = confirmDialog.messageId
    if (!id) return

    try {
      await deleteContactMessage(id)
      await loadMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      success('✅ Message deleted successfully!')
    } catch (err) {
      showError('Failed to delete message')
    }
  }

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    
    // Mark as read if unread
    if (!message.isRead && message.id) {
      try {
        await markMessageAsRead(message.id)
        await loadMessages()
      } catch (err) {
        // Silent fail
      }
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.isRead
    if (filter === 'read') return msg.isRead
    return true
  })

  const unreadCount = messages.filter(msg => !msg.isRead).length

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-300 py-20 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      <Toast {...toast} onClose={hideToast} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={() => {
          confirmDelete()
          setConfirmDialog({ isOpen: false, messageId: null })
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, messageId: null })}
        type="danger"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Contact Messages
              </h1>
              <p className="text-gray-400">
                You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-sky-600 text-white'
                    : 'glass-effect text-gray-300 hover:text-white'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-sky-600 text-white'
                    : 'glass-effect text-gray-300 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'read'
                    ? 'bg-sky-600 text-white'
                    : 'glass-effect text-gray-300 hover:text-white'
                }`}
              >
                Read ({messages.length - unreadCount})
              </button>
            </div>
          </div>
        </motion.div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <Mail size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No messages found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'You haven\'t received any messages yet.'
                : `You have no ${filter} messages.`
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-effect rounded-xl p-6 cursor-pointer transition-all hover:shadow-xl ${
                  !message.isRead ? 'border-l-4 border-sky-500' : ''
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Read/Unread Indicator */}
                      <div className={`w-3 h-3 rounded-full ${
                        message.isRead ? 'bg-gray-600' : 'bg-sky-500 animate-pulse'
                      }`}></div>
                      
                      {/* Name */}
                      <h3 className="text-lg font-semibold text-white">
                        {message.name}
                      </h3>
                      
                      {/* Unread Badge */}
                      {!message.isRead && (
                        <span className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs rounded-full border border-sky-500/30">
                          New
                        </span>
                      )}
                    </div>

                    {/* Email & Date */}
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        {message.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(message.createdAt)}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mb-2">
                      <span className="text-gray-500 text-sm font-medium">Subject: </span>
                      <span className="text-white">{message.subject}</span>
                    </div>

                    {/* Message Preview */}
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {message.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewMessage(message)
                      }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                      title="View message"
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMessage(message.id!)
                      }}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        <AnimatePresence>
          {showModal && selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <User size={24} className="text-sky-400" />
                      <h2 className="text-2xl font-bold text-white">
                        {selectedMessage.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="hover:text-sky-400 transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Subject */}
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Subject</h3>
                  <p className="text-lg text-white font-semibold">{selectedMessage.subject}</p>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Message</h3>
                  <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    Reply via Email
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleDeleteMessage(selectedMessage.id!)
                    }}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={20} />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminMessages
