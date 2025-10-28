import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Star, Award, Calendar, Code, Edit2, Plus, Trash2, X, Save } from 'lucide-react'
import ProjectDetailModal from './ProjectDetailModal'
import AdminLogin from './AdminLogin'
import { 
  getPortfolioProjects, createPortfolioProject, updatePortfolioProject, deletePortfolioProject,
  getCertificates, createCertificate, updateCertificate, deleteCertificate,
  getTechStack, createTechStackItem, updateTechStackItem, deleteTechStackItem,
  uploadImage, 
  type PortfolioProject, type Certificate, type TechStackItem 
} from '../services/api'
import { getImageUrl } from '../utils/imageUtils'

// Helper functions to handle string | string[] types
const toArray = (value: string | string[] | undefined): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : [value]
  } catch {
    return value.split(',').map(s => s.trim())
  }
}

// Note: toString helper kept for future use when saving to database
// const toString = (value: string | string[]): string => {
//   if (Array.isArray(value)) return JSON.stringify(value)
//   return value
// }

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  github: string
  live: string
  stars: number
  category: string
}

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  
  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [showCertModal, setShowCertModal] = useState(false)
  
  // Tech Stack state
  const [techStackItems, setTechStackItems] = useState<TechStackItem[]>([])
  const [editingTechStack, setEditingTechStack] = useState<TechStackItem | null>(null)
  const [showTechModal, setShowTechModal] = useState(false)

  // Load all data from database
  useEffect(() => {
    loadProjects()
    loadCertificates()
    loadTechStack()
    
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

  const loadCertificates = async () => {
    try {
      const data = await getCertificates()
      setCertificates(data)
    } catch (error) {
      console.error('Failed to load certificates:', error)
      setCertificates([])
    }
  }

  const loadTechStack = async () => {
    try {
      const data = await getTechStack()
      setTechStackItems(data)
    } catch (error) {
      console.error('Failed to load tech stack:', error)
      setTechStackItems([])
    }
  }

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await getPortfolioProjects()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    setIsEditMode(true)
  }

  const handleAddProject = () => {
    setEditingProject({
      id: 0,
      title: '',
      description: '',
      category: 'Web Development',
      image: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      featured: false,
      displayOrder: projects.length + 1
    })
    setShowEditModal(true)
  }

  const handleEditProject = (project: PortfolioProject) => {
    setEditingProject(project)
    setShowEditModal(true)
  }

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus project ini?')) return

    try {
      setIsSaving(true)
      await deletePortfolioProject(id)
      await loadProjects()
      alert('Project berhasil dihapus!')
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Gagal menghapus project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProject = async () => {
    if (!editingProject) return

    try {
      setIsSaving(true)
      
      if (editingProject.id === 0) {
        // Create new project
        await createPortfolioProject(editingProject)
      } else {
        // Update existing project
        if (editingProject.id) {
          await updatePortfolioProject(editingProject.id, editingProject)
        }
      }

      await loadProjects()
      setShowEditModal(false)
      setEditingProject(null)
      alert('Project berhasil disimpan!')
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Gagal menyimpan project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProject) return

    try {
      const imageUrl = await uploadImage(file)
      setEditingProject({ ...editingProject, image: imageUrl })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Gagal upload gambar')
    }
  }

  const handleAddTechnology = () => {
    if (!editingProject) return
    const techs = toArray(editingProject.technologies)
    setEditingProject({
      ...editingProject,
      technologies: [...techs, '']
    })
  }

  const handleRemoveTechnology = (index: number) => {
    if (!editingProject) return
    const techs = toArray(editingProject.technologies)
    const newTechnologies = techs.filter((_: string, i: number) => i !== index)
    setEditingProject({ ...editingProject, technologies: newTechnologies })
  }

  const handleTechnologyChange = (index: number, value: string) => {
    if (!editingProject) return
    const techs = toArray(editingProject.technologies)
    const newTechnologies = [...techs]
    newTechnologies[index] = value
    setEditingProject({ ...editingProject, technologies: newTechnologies })
  }

  // ==================== CERTIFICATES HANDLERS ====================
  
  const handleAddCertificate = () => {
    setEditingCertificate({
      title: '',
      issuer: '',
      date: '',
      description: '',
      image: '',
      verificationUrl: '',
      skills: [],
      displayOrder: certificates.length + 1
    })
    setShowCertModal(true)
  }

  const handleEditCertificate = (cert: Certificate) => {
    setEditingCertificate(cert)
    setShowCertModal(true)
  }

  const handleDeleteCertificate = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus sertifikat ini?')) return

    try {
      setIsSaving(true)
      await deleteCertificate(id)
      await loadCertificates()
      alert('Sertifikat berhasil dihapus!')
    } catch (error) {
      console.error('Failed to delete certificate:', error)
      alert('Gagal menghapus sertifikat')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCertificate = async () => {
    if (!editingCertificate) return

    try {
      setIsSaving(true)
      
      if (editingCertificate.id) {
        await updateCertificate(editingCertificate.id, editingCertificate)
      } else {
        await createCertificate(editingCertificate)
      }

      await loadCertificates()
      setShowCertModal(false)
      setEditingCertificate(null)
      alert('Sertifikat berhasil disimpan!')
    } catch (error) {
      console.error('Failed to save certificate:', error)
      alert('Gagal menyimpan sertifikat')
    } finally {
      setIsSaving(false)
    }
  }

  // ==================== TECH STACK HANDLERS ====================
  
  const handleAddTechStack = () => {
    setEditingTechStack({
      name: '',
      icon: '',
      color: 'from-blue-500 to-blue-600',
      category: 'Frontend Development',
      displayOrder: techStackItems.length + 1
    })
    setShowTechModal(true)
  }

  const handleEditTechStack = (tech: TechStackItem) => {
    setEditingTechStack(tech)
    setShowTechModal(true)
  }

  const handleDeleteTechStack = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus teknologi ini?')) return

    try {
      setIsSaving(true)
      await deleteTechStackItem(id)
      await loadTechStack()
      alert('Teknologi berhasil dihapus!')
    } catch (error) {
      console.error('Failed to delete tech stack:', error)
      alert('Gagal menghapus teknologi')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveTechStack = async () => {
    if (!editingTechStack) return

    try {
      setIsSaving(true)
      
      if (editingTechStack.id) {
        await updateTechStackItem(editingTechStack.id, editingTechStack)
      } else {
        await createTechStackItem(editingTechStack)
      }

      await loadTechStack()
      setShowTechModal(false)
      setEditingTechStack(null)
      alert('Teknologi berhasil disimpan!')
    } catch (error) {
      console.error('Failed to save tech stack:', error)
      alert('Gagal menyimpan teknologi')
    } finally {
      setIsSaving(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const tabs = [
    { id: 'projects', label: 'Projects', icon: <Code size={20} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={20} /> },
    { id: 'techstack', label: 'Tech Stack', icon: <Star size={20} /> }
  ]

  const renderProjects = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Edit Mode Header */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Portfolio Management</h3>
              <p className="text-gray-400">Add, edit, or delete your projects</p>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddProject}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-3 rounded-lg font-medium shadow-lg"
              >
                <Plus size={20} />
                Add Project
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading projects...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect rounded-xl overflow-hidden group card-hover relative"
            >
              {/* Edit Mode Controls */}
              {isEditMode && (
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditProject(project)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-lg"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteProject(project.id!)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg"
                    disabled={isSaving}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              )}

              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-primary-600 to-purple-600 relative overflow-hidden">
                {project.image ? (
                  <img src={getImageUrl(project.image)} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">
                          {project.category === 'Web Development' && '🌐'}
                          {project.category === 'Data Science' && '📊'}
                          {project.category === 'Machine Learning' && '🤖'}
                          {project.category === 'Desktop Application' && '💻'}
                          {project.category === 'System Programming' && '⚙️'}
                        </div>
                        <div className="text-sm opacity-80">{project.category}</div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Overlay with links */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  {project.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <Github size={20} />
                    </motion.a>
                  )}
                  
                  {project.liveUrl && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  )}
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </div>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {toArray(project.technologies).map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full border border-primary-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                {!isEditMode && (
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                    
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Live
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )

  const renderCertificates = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Edit Mode Header */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Certificates Management</h3>
              <p className="text-gray-400">Add, edit, or delete your certificates</p>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddCertificate}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 transition-colors text-white px-6 py-3 rounded-lg font-medium shadow-lg"
              >
                <Plus size={20} />
                Add Certificate
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-effect rounded-xl overflow-hidden relative"
          >
            {/* Edit Mode Controls */}
            {isEditMode && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditCertificate(cert)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-lg"
                >
                  <Edit2 size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteCertificate(cert.id!)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow-lg"
                  disabled={isSaving}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            )}

            {/* Certificate Image/Icon */}
            <div className="h-48 bg-gradient-to-br from-yellow-600 to-orange-600 relative overflow-hidden flex items-center justify-center">
              {cert.image ? (
                <img src={getImageUrl(cert.image)} alt={cert.title} className="w-full h-full object-cover" />
              ) : (
                <Award size={80} className="text-white/30" />
              )}
            </div>
            
            {/* Certificate Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{cert.title}</h3>
              
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <span className="font-medium text-sm">{cert.issuer}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span className="text-sm">{cert.date}</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                {cert.description}
              </p>

              {/* Skills */}
              {cert.skills && toArray(cert.skills).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {toArray(cert.skills).slice(0, 3).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                  {toArray(cert.skills).length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                      +{toArray(cert.skills).length - 3}
                    </span>
                  )}
                </div>
              )}

              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm transition-colors font-medium"
                >
                  <ExternalLink size={14} />
                  Verify Certificate
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderTechStack = () => {
    // Group tech stack items by category
    const categories = techStackItems.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    }, {} as Record<string, TechStackItem[]>)

    const uniqueCategories = Object.keys(categories)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Edit Mode Header */}
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Tech Stack Management</h3>
                <p className="text-gray-400">Add, edit, or delete your technologies</p>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTechStack}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                >
                  <Plus size={20} />
                  Add Tech Stack
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            Technologies & <span className="gradient-text">Tools</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of technologies, frameworks, and tools I work with
          </p>
        </motion.div>

        {/* Unified Tech Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4"
        >
          {techStackItems.map((tech, index) => (
            <motion.div
              key={tech.id || `tech-${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.03,
                type: "spring",
                stiffness: 300
              }}
              className="group relative"
            >
              {/* Edit Mode Controls */}
              {isEditMode && (
                <div className="absolute -top-2 -right-2 z-20 flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditTechStack(tech)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-lg"
                  >
                    <Edit2 size={12} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteTechStack(tech.id!)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white shadow-lg"
                    disabled={isSaving}
                  >
                    <Trash2 size={12} />
                  </motion.button>
                </div>
              )}

              {/* Tech Box */}
              <div className="glass-effect rounded-xl p-3 text-center card-hover cursor-pointer relative overflow-hidden">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                
                {/* Tech Icon */}
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${tech.color} flex items-center justify-center text-white text-lg transition-colors duration-300 relative z-10`}>
                  {tech.icon}
                </div>
                
                {/* Tech Name */}
                <div className="text-white font-medium text-xs group-hover:text-primary-300 transition-colors duration-300 relative z-10 leading-tight">
                  {tech.name}
                </div>
                
                {/* Category Badge - Shows on Hover */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                  {tech.category}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Legend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          {uniqueCategories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
              className="flex items-center gap-2 glass-effect px-3 py-2 rounded-lg"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-purple-500"></div>
              <span className="text-gray-300 text-sm font-medium">{category}</span>
              <span className="text-gray-500 text-xs">({categories[category].length})</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 glass-effect px-6 py-3 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{techStackItems.length}+</div>
              <div className="text-gray-400 text-sm">Technologies</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{uniqueCategories.length}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">3+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <section id="portfolio" className="section-padding bg-dark-200/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            My <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my work, achievements, and technical expertise
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 hover:bg-blue-700 transition-colors text-white shadow-lg'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'certificates' && renderCertificates()}
            {activeTab === 'techstack' && renderTechStack()}
          </div>
        </AnimatePresence>

        {/* GitHub CTA */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/DzakaAl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Github size={24} />
              View All Projects on GitHub
            </motion.a>
          </motion.div>
        )}
        
        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* Admin Login Modal */}
        <AdminLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Edit Project Modal */}
        <AnimatePresence>
          {showEditModal && editingProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingProject.id === 0 ? 'Add New Project' : 'Edit Project'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Enter project title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Description</label>
                    <textarea
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                      placeholder="Enter project description"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Desktop Application">Desktop Application</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="System Programming">System Programming</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Project Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                    {editingProject.image && (
                      <div className="mt-3">
                        <img src={getImageUrl(editingProject.image)} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Technologies</label>
                    <div className="space-y-2">
                      {toArray(editingProject.technologies).map((tech: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => handleTechnologyChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                            placeholder="Technology name"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveTechnology(index)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddTechnology}
                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Technology
                      </motion.button>
                    </div>
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={editingProject.githubUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Live URL (Optional)</label>
                    <input
                      type="url"
                      value={editingProject.liveUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="https://demo.example.com"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-5 h-5 bg-gray-800 border-gray-700 rounded"
                    />
                    <label htmlFor="featured" className="text-gray-300 font-medium">
                      Featured Project
                    </label>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Display Order</label>
                    <input
                      type="number"
                      value={editingProject.displayOrder}
                      onChange={(e) => setEditingProject({ ...editingProject, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Display order (lower = first)"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProject}
                      disabled={isSaving}
                      className="flex-1 bg-green-600 hover:bg-green-700 transition-colors text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Project
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Modal */}
        <AnimatePresence>
          {showCertModal && editingCertificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => setShowCertModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingCertificate.id ? 'Edit Certificate' : 'Add New Certificate'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCertModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Certificate Title</label>
                    <input
                      type="text"
                      value={editingCertificate.title}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Enter certificate title"
                    />
                  </div>

                  {/* Issuer */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Issuer</label>
                    <input
                      type="text"
                      value={editingCertificate.issuer}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="e.g. Google, Coursera, Dicoding"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Date</label>
                    <input
                      type="text"
                      value={editingCertificate.date}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="e.g. Jan 2024"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Description</label>
                    <textarea
                      value={editingCertificate.description}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                      placeholder="Enter certificate description"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Image URL (Optional)</label>
                    <input
                      type="text"
                      value={editingCertificate.image || ''}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, image: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="https://example.com/certificate.jpg"
                    />
                  </div>

                  {/* Verification URL */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Verification URL (Optional)</label>
                    <input
                      type="url"
                      value={editingCertificate.verificationUrl || ''}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, verificationUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="https://credential.example.com/verify/..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveCertificate}
                      disabled={isSaving}
                      className="flex-1 bg-green-600 hover:bg-green-700 transition-colors text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Certificate
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCertModal(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech Stack Modal */}
        <AnimatePresence>
          {showTechModal && editingTechStack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => setShowTechModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingTechStack.id === 0 ? 'Add New Technology' : 'Edit Technology'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTechModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Technology Name</label>
                    <input
                      type="text"
                      value={editingTechStack.name}
                      onChange={(e) => setEditingTechStack({ ...editingTechStack, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="e.g. React, Python, TensorFlow"
                    />
                  </div>

                  {/* Icon (Emoji) */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Icon (Emoji)</label>
                    <input
                      type="text"
                      value={editingTechStack.icon}
                      onChange={(e) => setEditingTechStack({ ...editingTechStack, icon: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="e.g. ⚛️, 🐍, 🤖"
                      maxLength={2}
                    />
                    <p className="text-gray-500 text-sm mt-1">Use an emoji to represent this technology</p>
                  </div>

                  {/* Color (Tailwind Gradient) */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Color (Tailwind Gradient)</label>
                    <select
                      value={editingTechStack.color}
                      onChange={(e) => setEditingTechStack({ ...editingTechStack, color: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    >
                      <option value="from-blue-500 to-blue-600">Blue</option>
                      <option value="from-green-500 to-green-600">Green</option>
                      <option value="from-red-500 to-red-600">Red</option>
                      <option value="from-yellow-500 to-yellow-600">Yellow</option>
                      <option value="from-purple-500 to-purple-600">Purple</option>
                      <option value="from-pink-500 to-pink-600">Pink</option>
                      <option value="from-indigo-500 to-indigo-600">Indigo</option>
                      <option value="from-orange-500 to-orange-600">Orange</option>
                      <option value="from-teal-500 to-teal-600">Teal</option>
                      <option value="from-cyan-500 to-cyan-600">Cyan</option>
                    </select>
                    {/* Preview */}
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm mb-2">Preview:</p>
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${editingTechStack.color} flex items-center justify-center text-2xl`}>
                        {editingTechStack.icon}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Category</label>
                    <select
                      value={editingTechStack.category}
                      onChange={(e) => setEditingTechStack({ ...editingTechStack, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Programming">Programming Languages</option>
                      <option value="ML">Machine Learning & AI</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cloud">Cloud & DevOps</option>
                      <option value="Tools">Tools & Others</option>
                    </select>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Display Order</label>
                    <input
                      type="number"
                      value={editingTechStack.displayOrder}
                      onChange={(e) => setEditingTechStack({ ...editingTechStack, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Display order (lower = first)"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveTechStack}
                      disabled={isSaving}
                      className="flex-1 bg-green-600 hover:bg-green-700 transition-colors text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Technology
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowTechModal(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Portfolio
