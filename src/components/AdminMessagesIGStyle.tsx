import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Calendar, ArrowLeft, Search, X, CheckCheck, Home, LogOut } from 'lucide-react'
import { getContactMessages, deleteContactMessage, markMessageAsRead, type ContactMessage } from '../services/api'
import { useToast } from '../hooks/useToast'
import Toast from './Toast'
import ConfirmDialog from './ConfirmDialog'

interface AdminMessagesIGStyleProps {
  onLogout?: () => void
  onBackToHome?: () => void
}

const AdminMessagesIGStyle = ({ onLogout, onBackToHome }: AdminMessagesIGStyleProps) => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast, hideToast, success, error: showError } = useToast()
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    messageId: number | null
  }>({ isOpen: false, messageId: null })

  useEffect(() => {
    loadMessages()
    // Poll for new messages every 30 seconds
    const interval = setInterval(loadMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedMessage])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      const data = await getContactMessages()
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      setMessages(sortedData)
    } catch (err) {
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
      success('Message deleted successfully!')
    } catch (err) {
      showError('Failed to delete message')
    }
  }

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    
    if (!message.isRead && message.id) {
      try {
        await markMessageAsRead(message.id)
        await loadMessages()
      } catch (err) {
        // Silent fail
      }
    }
  }

  const filteredMessages = messages
    .filter(msg => {
      if (filter === 'unread') return !msg.isRead
      if (filter === 'read') return msg.isRead
      return true
    })
    .filter(msg => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
      )
    })

  const unreadCount = messages.filter(msg => !msg.isRead).length

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
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
    <div className="h-screen bg-gray-900 flex flex-col">
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

      {/* Top Header Bar with Home & Logout */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-400">Message Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Full Screen Message Layout - No Padding, No Border Radius */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-gray-900">
          <div className="grid grid-cols-12 h-full">
            {/* Left Sidebar - Messages List */}
            <div className={`${selectedMessage ? 'hidden lg:flex' : 'flex'} col-span-12 lg:col-span-4 border-r border-gray-700/30 flex-col bg-gray-900/40`}>
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-700/30">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Messages</h2>
                  {unreadCount > 0 && (
                    <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-sky-500/30 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                
                {/* Search */}
                <div className="relative group">
                  <Search size={18} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-gray-800/60 border border-gray-700/40 rounded-lg sm:rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-500/60 focus:bg-gray-800/80 transition-all shadow-lg shadow-black/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                  {(['all', 'unread', 'read'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                        filter === f
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                          : 'bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-800/60 border border-gray-700/30'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                      <Mail size={32} className="sm:hidden text-gray-600" />
                      <Mail size={40} className="hidden sm:block text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">No messages found</p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">Your inbox is empty</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700/20">
                    {filteredMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        onClick={() => handleViewMessage(message)}
                        whileHover={{ backgroundColor: 'rgba(56, 189, 248, 0.08)' }}
                        className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                          selectedMessage?.id === message.id 
                            ? 'bg-gradient-to-r from-sky-500/15 to-blue-500/15 border-l-4 border-sky-500' 
                            : 'border-l-4 border-transparent'
                        } ${!message.isRead ? 'bg-sky-500/5' : ''}`}
                      >
                        <div className="flex gap-2.5 sm:gap-3">
                          {/* Avatar */}
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-lg ${
                            !message.isRead 
                              ? 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30' 
                              : 'bg-gradient-to-br from-gray-700 to-gray-800'
                          }`}>
                            {message.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                              <h3 className={`font-semibold truncate text-sm sm:text-base ${
                                !message.isRead ? 'text-white' : 'text-gray-300'
                              }`}>
                                {message.name}
                              </h3>
                              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                            <p className={`text-xs sm:text-sm truncate ${
                              !message.isRead ? 'text-gray-300 font-medium' : 'text-gray-400'
                            }`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {message.message}
                            </p>
                          </div>

                          {/* Unread Dot */}
                          {!message.isRead && (
                            <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Message Detail */}
            <div className={`${selectedMessage ? 'flex' : 'hidden lg:flex'} col-span-12 lg:col-span-8 flex-col bg-gray-900/20`}>
              {selectedMessage ? (
                <>
                  {/* Message Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-700/30 flex items-center justify-between bg-gray-900/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="lg:hidden p-2 hover:bg-gray-700/30 rounded-full transition-colors flex-shrink-0"
                      >
                        <ArrowLeft size={20} className="text-gray-400" />
                      </button>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg shadow-sky-500/30 flex-shrink-0">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-bold text-base sm:text-lg truncate">{selectedMessage.name}</h3>
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-sky-400 hover:text-sky-300 transition-colors truncate block"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id!)}
                      className="p-2 sm:p-2.5 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-all text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30 flex-shrink-0 ml-2"
                    >
                      <Trash2 size={18} className="sm:hidden" />
                      <Trash2 size={20} className="hidden sm:block" />
                    </button>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    <div className="max-w-3xl mx-auto">
                      {/* Message Bubble */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        {/* Subject Bubble */}
                        <div className="flex gap-2.5 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm sm:text-sm font-bold flex-shrink-0 shadow-lg shadow-sky-500/30">
                            {selectedMessage.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl rounded-tl-sm p-3.5 sm:p-5 shadow-2xl border border-gray-700/40">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs sm:text-sm font-bold text-sky-400">Subject:</span>
                                <span className="text-white font-semibold text-sm sm:text-lg truncate">{selectedMessage.subject}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 ml-2 sm:ml-3">
                              <Calendar size={12} className="sm:hidden text-gray-500 flex-shrink-0" />
                              <Calendar size={13} className="hidden sm:block text-gray-500 flex-shrink-0" />
                              <span className="text-xs text-gray-500 font-medium truncate">
                                {new Date(selectedMessage.createdAt || '').toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Message Bubble */}
                        <div className="flex gap-2.5 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl sm:rounded-2xl rounded-tl-sm p-4 sm:p-6 shadow-2xl border border-sky-500/20">
                              <p className="text-gray-100 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">
                                {selectedMessage.message}
                              </p>
                            </div>
                            {selectedMessage.isRead && (
                              <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 ml-2 sm:ml-3">
                                <CheckCheck size={14} className="sm:hidden text-sky-400" />
                                <CheckCheck size={15} className="hidden sm:block text-sky-400" />
                                <span className="text-xs text-gray-500 font-medium">Read</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="p-4 sm:p-6 border-t border-gray-700/30 bg-gray-900/30">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-3 sm:py-4 px-5 sm:px-6 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Mail size={20} className="sm:hidden" />
                      <Mail size={22} className="hidden sm:block" />
                      Reply via Gmail
                    </a>
                  </div>
                </>
              ) : (
                /* No Message Selected */
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-sky-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl border border-sky-500/20">
                      <Mail size={40} className="sm:hidden text-sky-500/50" />
                      <Mail size={56} className="hidden sm:block text-sky-500/50" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-3">Your Messages</h3>
                    <p className="text-gray-400 text-base sm:text-lg">Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMessagesIGStyle
