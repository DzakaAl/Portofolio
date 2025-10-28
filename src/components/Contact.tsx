import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, Github, Instagram, Linkedin, Twitter, Globe } from 'lucide-react'
import AdminLogin from './AdminLogin'
import { getContactInfo, submitContactMessage, updateContactInfo, type ContactInfo } from '../services/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [editedContactInfo, setEditedContactInfo] = useState<ContactInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadContactInfo()
    
    // Listen for login/logout events from Navbar
    const handleLoginEvent = () => {
      setIsEditMode(true)
    }
    
    const handleLogoutEvent = () => {
      setIsEditMode(false)
    }
    
    window.addEventListener('adminLoginSuccess', handleLoginEvent)
    window.addEventListener('adminLogout', handleLogoutEvent)
    
    return () => {
      window.removeEventListener('adminLoginSuccess', handleLoginEvent)
      window.removeEventListener('adminLogout', handleLogoutEvent)
    }
  }, [])

  const loadContactInfo = async () => {
    try {
      setIsLoading(true)
      const data = await getContactInfo()
      setContactInfo(data)
      setEditedContactInfo(data)
    } catch (error) {
      console.error('Failed to load contact info:', error)
      // Set empty fallback data
      const fallback: ContactInfo = {
        email: 'dzakaalfikri@gmail.com',
        location: 'Yogyakarta, Indonesia',
        github: 'https://github.com/dzaka',
        linkedin: 'https://linkedin.com/in/dzaka',
        twitter: '',
        instagram: 'https://instagram.com/dzaka',
        website: ''
      }
      setContactInfo(fallback)
      setEditedContactInfo(fallback)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    setIsEditMode(true)
  }

  const handleSaveContactInfo = async () => {
    if (!editedContactInfo) return
    
    try {
      await updateContactInfo(editedContactInfo)
      setContactInfo(editedContactInfo)
      console.log('Contact info updated successfully')
    } catch (error) {
      console.error('Failed to update contact info:', error)
      alert('Failed to save changes. Please try again.')
      // Revert to original data
      setEditedContactInfo(contactInfo)
    }
  }

  const handleContactFieldBlur = () => {
    // Auto-save when field loses focus
    if (isEditMode && editedContactInfo && contactInfo) {
      // Check if data has changed
      if (JSON.stringify(editedContactInfo) !== JSON.stringify(contactInfo)) {
        handleSaveContactInfo()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      await submitContactMessage(formData)
      setFormData({ name: '', email: '', subject: '', message: '' })
      alert('Thank you for your message! I\'ll get back to you soon.')
    } catch (error) {
      console.error('Failed to submit message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayInfo = isEditMode && editedContactInfo ? editedContactInfo : contactInfo

  if (isLoading) {
    return (
      <section id="contact" className="section-padding">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading contact information...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects.
            Let's create something amazing together!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Let's Connect</h3>
              <p className="text-gray-300 mb-8">
                I'm currently open to new opportunities and exciting projects. 
                Whether you have a project in mind or just want to chat about technology, 
                feel free to reach out!
              </p>
            </div>

            {/* Contact Items */}
            <div className="space-y-6">
              {/* Email */}
              <motion.div
                whileHover={{ x: isEditMode ? 0 : 10 }}
                className="flex items-center gap-4 p-4 glass-effect rounded-lg"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  {isEditMode && editedContactInfo ? (
                    <input
                      type="email"
                      value={editedContactInfo.email}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, email: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-400">{displayInfo?.email}</p>
                  )}
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                whileHover={{ x: isEditMode ? 0 : 10 }}
                className="flex items-center gap-4 p-4 glass-effect rounded-lg"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">Location</h4>
                  {isEditMode && editedContactInfo ? (
                    <input
                      type="text"
                      value={editedContactInfo.location}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, location: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-400">{displayInfo?.location}</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-white font-medium mb-4">
                {isEditMode ? 'Edit Social Media Links' : 'Follow Me'}
              </h4>
              
              {isEditMode && editedContactInfo ? (
                <div className="space-y-3">
                  {/* GitHub */}
                  <div className="flex items-center gap-3">
                    <Github size={20} className="text-gray-400" />
                    <input
                      type="url"
                      value={editedContactInfo.github}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, github: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      placeholder="GitHub URL"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* LinkedIn */}
                  <div className="flex items-center gap-3">
                    <Linkedin size={20} className="text-gray-400" />
                    <input
                      type="url"
                      value={editedContactInfo.linkedin}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, linkedin: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      placeholder="LinkedIn URL"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Twitter */}
                  <div className="flex items-center gap-3">
                    <Twitter size={20} className="text-gray-400" />
                    <input
                      type="url"
                      value={editedContactInfo.twitter}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, twitter: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      placeholder="Twitter URL"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Instagram */}
                  <div className="flex items-center gap-3">
                    <Instagram size={20} className="text-gray-400" />
                    <input
                      type="url"
                      value={editedContactInfo.instagram}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, instagram: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      placeholder="Instagram URL"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Website */}
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-gray-400" />
                    <input
                      type="url"
                      value={editedContactInfo.website}
                      onChange={(e) => setEditedContactInfo({ ...editedContactInfo, website: e.target.value })}
                      onBlur={handleContactFieldBlur}
                      placeholder="Website URL"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  {displayInfo?.github && (
                    <motion.a
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      href={displayInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      <Github size={20} />
                    </motion.a>
                  )}

                  {displayInfo?.linkedin && (
                    <motion.a
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      href={displayInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      <Linkedin size={20} />
                    </motion.a>
                  )}

                  {displayInfo?.twitter && (
                    <motion.a
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      href={displayInfo.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      <Twitter size={20} />
                    </motion.a>
                  )}

                  {displayInfo?.instagram && (
                    <motion.a
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      href={displayInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      <Instagram size={20} />
                    </motion.a>
                  )}

                  {displayInfo?.website && (
                    <motion.a
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      href={displayInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      <Globe size={20} />
                    </motion.a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-300 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-300 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-8 border-t border-gray-700"
        >
          <p className="text-gray-400">
            © 2025 M. Dzaka Al Fikri. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </motion.div>

        {/* Admin Login Modal */}
        <AdminLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </section>
  )
}

export default Contact
