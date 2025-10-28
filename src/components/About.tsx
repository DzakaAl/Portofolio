import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AdminLogin from './AdminLogin'
import { isAuthenticated } from '../utils/auth'
import { getAboutContent, updateAboutContent, uploadImage, AboutContent } from '../services/api'
import { getImageUrl } from '../utils/imageUtils'

const About = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editableContent, setEditableContent] = useState<AboutContent>({
    profileImage: "/profileNobg.png",
    name: "M. Dzaka Al Fikri",
    title: "Machine Learning Engineer",
    subtitle: "Full Stack Developer",
    location: "Yogyakarta, Indonesia",
    certification: "Certified TensorFlow Developer",
    availability: "Available for Full-time",
    summary1: "Hi! I'm M. Dzaka Al Fikri, a passionate Machine Learning Engineer and Full Stack Developer specializing in creating intelligent, scalable solutions that bridge AI innovation with real-world applications.",
    summary2: "As a Certified TensorFlow Developer, I bring expertise in deep learning, computer vision, and neural networks, combined with strong full-stack development skills. My approach focuses on delivering production-ready solutions using cutting-edge technologies like TensorFlow, React, Vue.js, and Google Cloud Platform.",
    summary3: "With 20+ completed projects and 19 professional certifications from Coursera, DeepLearning.AI, and Google Cloud, I continuously expand my skill set to stay at the forefront of technology. I'm committed to transforming complex problems into elegant, efficient solutions.",
    strengths: [
      { icon: '🚀', text: 'Fast Learner' },
      { icon: '🎯', text: 'Problem Solver' },
      { icon: '🤝', text: 'Team Player' },
      { icon: '💡', text: 'Innovative Thinker' },
    ],
    stats: [
      { value: '20+', label: 'Projects', color: 'from-blue-400 to-cyan-400' },
      { value: '19', label: 'Certificates', color: 'from-purple-400 to-pink-400' },
      { value: '15+', label: 'Technologies', color: 'from-green-400 to-emerald-400' },
      { value: '100%', label: 'Commitment', color: 'from-orange-400 to-red-400' },
    ]
  })

  // Load content from API on mount
  useEffect(() => {
    loadContent()
  }, [])

  useEffect(() => {
    setIsAdmin(isAuthenticated())
    
    // Listen for login/logout events from Navbar
    const handleLoginEvent = () => {
      setIsAdmin(true)
      setIsEditMode(true)
    }
    
    const handleLogoutEvent = () => {
      setIsAdmin(false)
      setIsEditMode(false)
    }
    
    window.addEventListener('adminLoginSuccess', handleLoginEvent)
    window.addEventListener('adminLogout', handleLogoutEvent)
    
    return () => {
      window.removeEventListener('adminLoginSuccess', handleLoginEvent)
      window.removeEventListener('adminLogout', handleLogoutEvent)
    }
  }, [])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      const content = await getAboutContent()
      setEditableContent(content)
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsAdmin(true)
    setShowLoginModal(false)
    setIsEditMode(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Upload to server
        const imageUrl = await uploadImage(file)
        setEditableContent(prev => ({
          ...prev,
          profileImage: imageUrl
        }))
      } catch (error) {
        console.error('Failed to upload image:', error)
        // Fallback to base64
        const reader = new FileReader()
        reader.onloadend = () => {
          setEditableContent(prev => ({
            ...prev,
            profileImage: reader.result as string
          }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleContentChange = (field: string, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      await updateAboutContent(editableContent)
      setIsEditMode(false)
      alert('Perubahan berhasil disimpan ke database! ✅')
    } catch (error) {
      console.error('Failed to save changes:', error)
      alert('Gagal menyimpan perubahan. Coba lagi. ❌')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    loadContent()
    setIsEditMode(false)
  }

  if (isLoading) {
    return (
      <section id="about" className="section-padding bg-gradient-to-b from-dark-200/50 via-dark-100/50 to-dark-200/50 relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat konten...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-dark-200/50 via-dark-100/50 to-dark-200/50 relative overflow-hidden">
      {/* Login Modal */}
      <AdminLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Control Panel - Save/Cancel buttons only */}
      {isAdmin && isEditMode && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed top-20 right-4 z-40 flex gap-2"
        >
          <button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <span>💾</span> Simpan
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all"
          >
            <span>❌</span> Batal
          </button>
        </motion.div>
      )}

      {/* Edit Mode Toggle - Only when logged in but not editing */}
      {isAdmin && !isEditMode && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setIsEditMode(true)}
          className="fixed top-20 right-4 z-40 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all"
        >
          <span>✏️</span> Edit Mode
        </motion.button>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20"
          >
            <span className="text-blue-400 font-medium">👋 Get to Know Me</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transforming ideas into intelligent solutions through code and creativity
          </p>
        </motion.div>

        {/* Main Content - Simplified */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="relative group h-full">
                {/* Glowing Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 h-full flex flex-col">
                  {/* Profile Image */}
                  <div className="relative mb-6 group/image">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                      <img
                        src={getImageUrl(editableContent.profileImage)}
                        alt={editableContent.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Edit Overlay */}
                      {isEditMode && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                          <label className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2">
                            <span>📷</span> Ganti Foto
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {/* Status Badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Open to Opportunities
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mt-8">
                    {isEditMode ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editableContent.name}
                          onChange={(e) => handleContentChange('name', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/50 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama Lengkap"
                        />
                        <input
                          type="text"
                          value={editableContent.title}
                          onChange={(e) => handleContentChange('title', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/50 rounded-lg text-blue-400 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Jabatan Utama"
                        />
                        <input
                          type="text"
                          value={editableContent.subtitle}
                          onChange={(e) => handleContentChange('subtitle', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-blue-500/50 rounded-lg text-gray-400 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Jabatan Kedua"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-white mb-3">{editableContent.name}</h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 mb-2">
                          <span className="text-blue-400 text-sm font-medium">🎯 {editableContent.title}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{editableContent.subtitle}</p>
                      </>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 mt-6 pt-6 border-t border-gray-700/50">
                    {isEditMode ? (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400">📍</span>
                          <input
                            type="text"
                            value={editableContent.location}
                            onChange={(e) => handleContentChange('location', e.target.value)}
                            className="flex-1 px-3 py-1 bg-gray-700/50 border border-blue-500/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Lokasi"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400">🎓</span>
                          <input
                            type="text"
                            value={editableContent.certification}
                            onChange={(e) => handleContentChange('certification', e.target.value)}
                            className="flex-1 px-3 py-1 bg-gray-700/50 border border-blue-500/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Sertifikasi"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400">💼</span>
                          <input
                            type="text"
                            value={editableContent.availability}
                            onChange={(e) => handleContentChange('availability', e.target.value)}
                            className="flex-1 px-3 py-1 bg-gray-700/50 border border-blue-500/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Status Ketersediaan"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 text-gray-300">
                          <span className="text-blue-400">📍</span>
                          <span className="text-sm">{editableContent.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <span className="text-blue-400">🎓</span>
                          <span className="text-sm">{editableContent.certification}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <span className="text-blue-400">💼</span>
                          <span className="text-sm">{editableContent.availability}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Links - Connected to other pages */}
                  <div className="mt-auto pt-6 border-t border-gray-700/50">
                    <p className="text-gray-400 text-xs mb-3 text-center">Quick Navigation</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a 
                        href="#portfolio" 
                        className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-center text-xs text-blue-400 transition-all group/link"
                      >
                        <span className="group-hover/link:scale-110 inline-block transition-transform">💼</span> Projects
                      </a>
                      <a 
                        href="#contact" 
                        className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-center text-xs text-purple-400 transition-all group/link"
                      >
                        <span className="group-hover/link:scale-110 inline-block transition-transform">📧</span> Contact
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">👨‍💻</span>
                  Professional Summary
                  {isEditMode && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
                      Mode Edit
                    </span>
                  )}
                </h3>
                <div className="space-y-4 text-gray-300 leading-relaxed flex-grow">
                  {isEditMode ? (
                    <>
                      <textarea
                        value={editableContent.summary1}
                        onChange={(e) => handleContentChange('summary1', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                      <textarea
                        value={editableContent.summary2}
                        onChange={(e) => handleContentChange('summary2', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                      <textarea
                        value={editableContent.summary3}
                        onChange={(e) => handleContentChange('summary3', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                    </>
                  ) : (
                    <>
                      <p>
                        {editableContent.summary1.split(' ').map((word, i) => {
                          if (['M. Dzaka Al Fikri', 'Machine Learning Engineer', 'Full Stack Developer'].some(highlight => editableContent.summary1.includes(highlight) && word.includes(highlight.split(' ')[0]))) {
                            return <span key={i} className="text-white font-semibold">{word} </span>
                          }
                          return word + ' '
                        })}
                      </p>
                      <p>
                        {editableContent.summary2}
                      </p>
                      <p>
                        {editableContent.summary3}
                      </p>
                    </>
                  )}
                </div>

                {/* Key Strengths */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Key Strengths</h4>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          const newStrength = { icon: '⭐', text: 'New Strength' }
                          setEditableContent(prev => ({
                            ...prev,
                            strengths: [...prev.strengths, newStrength]
                          }))
                        }}
                        className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded text-green-400 text-xs"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {editableContent.strengths.map((strength, index) => (
                      <div key={index} className="relative group/strength">
                        {isEditMode ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 border border-blue-500/50 rounded-lg">
                            <input
                              type="text"
                              value={strength.icon}
                              onChange={(e) => {
                                const newStrengths = [...editableContent.strengths]
                                newStrengths[index].icon = e.target.value
                                setEditableContent(prev => ({ ...prev, strengths: newStrengths }))
                              }}
                              className="w-8 px-1 py-1 bg-gray-600/50 border border-gray-500/50 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                              maxLength={2}
                            />
                            <input
                              type="text"
                              value={strength.text}
                              onChange={(e) => {
                                const newStrengths = [...editableContent.strengths]
                                newStrengths[index].text = e.target.value
                                setEditableContent(prev => ({ ...prev, strengths: newStrengths }))
                              }}
                              className="flex-1 px-2 py-1 bg-gray-600/50 border border-gray-500/50 rounded text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => {
                                const newStrengths = editableContent.strengths.filter((_, i) => i !== index)
                                setEditableContent(prev => ({ ...prev, strengths: newStrengths }))
                              }}
                              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded text-red-400 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-blue-500/40 transition-colors">
                            <span>{strength.icon}</span>
                            <span className="text-sm text-gray-300">{strength.text}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Stats */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Stats</h4>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          const newStat = { value: '0', label: 'New Stat', color: 'from-blue-400 to-cyan-400' }
                          setEditableContent(prev => ({
                            ...prev,
                            stats: [...prev.stats, newStat]
                          }))
                        }}
                        className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded text-green-400 text-xs"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {editableContent.stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative group/stat"
                      >
                        {isEditMode ? (
                          <div className="text-center p-3 bg-gray-700/50 border border-blue-500/50 rounded-xl space-y-2">
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...editableContent.stats]
                                newStats[index].value = e.target.value
                                setEditableContent(prev => ({ ...prev, stats: newStats }))
                              }}
                              className="w-full px-2 py-1 bg-gray-600/50 border border-gray-500/50 rounded text-center text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...editableContent.stats]
                                newStats[index].label = e.target.value
                                setEditableContent(prev => ({ ...prev, stats: newStats }))
                              }}
                              className="w-full px-2 py-1 bg-gray-600/50 border border-gray-500/50 rounded text-center text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <select
                              value={stat.color}
                              onChange={(e) => {
                                const newStats = [...editableContent.stats]
                                newStats[index].color = e.target.value
                                setEditableContent(prev => ({ ...prev, stats: newStats }))
                              }}
                              className="w-full px-2 py-1 bg-gray-600/50 border border-gray-500/50 rounded text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="from-blue-400 to-cyan-400">Blue</option>
                              <option value="from-purple-400 to-pink-400">Purple</option>
                              <option value="from-green-400 to-emerald-400">Green</option>
                              <option value="from-orange-400 to-red-400">Orange</option>
                              <option value="from-yellow-400 to-amber-400">Yellow</option>
                              <option value="from-indigo-400 to-purple-400">Indigo</option>
                            </select>
                            <button
                              onClick={() => {
                                const newStats = editableContent.stats.filter((_, i) => i !== index)
                                setEditableContent(prev => ({ ...prev, stats: newStats }))
                              }}
                              className="w-full px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded text-red-400 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all">
                            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                              {stat.value}
                            </div>
                            <div className="text-gray-400 text-xs">{stat.label}</div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
