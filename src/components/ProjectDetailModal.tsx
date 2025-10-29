import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Star, Calendar, Code2, Users, GitBranch } from 'lucide-react'
import { useEffect } from 'react'

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

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  // Add ESC key handler
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!project) return null

  const projectDetails = {
    1: {
      longDescription: "Website profil desa komprehensif yang dibangun menggunakan Vue.js sebagai framework utama. Menampilkan informasi lengkap tentang Padukuhan Krapakan, termasuk sejarah, demografi, potensi desa, dan informasi pemerintahan. Website ini didesain responsif dengan antarmuka yang user-friendly untuk memberikan informasi yang mudah diakses oleh masyarakat.",
      features: ["Halaman beranda dengan overview desa", "Profil sejarah dan budaya", "Informasi demografi penduduk", "Galeri foto dan dokumentasi", "Kontak pemerintahan desa", "Design responsif untuk semua device"],
      challenges: ["Mengorganisir informasi kompleks dalam struktur yang mudah dipahami", "Implementasi design yang menarik dengan Vue.js", "Optimasi performa untuk loading yang cepat"],
      learnings: ["Arsitektur komponen Vue.js", "State management dalam Vue", "Responsive web design principles", "User experience design"]
    },
    2: {
      longDescription: "Sistem manajemen perpustakaan digital yang dikembangkan untuk Perpustakaan Tadika Mesra. Sistem ini memungkinkan pengelolaan koleksi buku, peminjaman, pengembalian, dan tracking status buku secara real-time. Dibangun dengan PHP dan MySQL untuk backend yang robust dan reliable.",
      features: ["Dashboard admin untuk pengelolaan buku", "Sistem peminjaman dan pengembalian otomatis", "Tracking status buku real-time", "Laporan statistik peminjaman", "Manajemen anggota perpustakaan", "Notifikasi keterlambatan pengembalian"],
      challenges: ["Implementasi sistem database yang efisien", "Menangani concurrent requests untuk peminjaman", "Design interface yang intuitive untuk librarian"],
      learnings: ["Database design dan normalisasi", "PHP backend development", "Session management", "CRUD operations yang kompleks"]
    },
    3: {
      longDescription: "Platform reservasi lapangan badminton online dengan sistem booking yang user-friendly. Memungkinkan pengguna untuk melihat jadwal ketersediaan lapangan, melakukan booking, dan mengelola reservasi mereka. Interface yang clean dan responsive memberikan pengalaman booking yang seamless.",
      features: ["Kalender booking interaktif", "Real-time availability checking", "User registration dan login", "Manajemen reservasi personal", "Payment integration ready", "Admin panel untuk pengelolaan lapangan"],
      challenges: ["Implementasi sistem kalender yang interaktif", "Handling collision dalam booking", "Responsive design untuk berbagai screen size"],
      learnings: ["JavaScript DOM manipulation", "Date/time handling in web apps", "User interface design", "Form validation dan handling"]
    },
    4: {
      longDescription: "Proyek analisis sentimen menggunakan machine learning untuk menganalisis keluhan dan curahan hati pengguna. Menggunakan teknik Natural Language Processing (NLP) untuk memahami emosi dan sentimen dari teks input, kemudian memberikan insights dan rekomendasi yang relevan.",
      features: ["Preprocessing teks untuk analisis sentimen", "Model machine learning untuk klasifikasi emosi", "Visualisasi hasil analisis", "Dashboard untuk monitoring sentimen", "API endpoint untuk integrasi", "Real-time sentiment analysis"],
      challenges: ["Preprocessing data teks Bahasa Indonesia", "Training model dengan dataset yang seimbang", "Handling various emotional expressions", "Model optimization untuk akurasi tinggi"],
      learnings: ["Natural Language Processing techniques", "Machine learning model training", "Data preprocessing dan cleaning", "Python libraries untuk ML (scikit-learn, pandas)", "Model evaluation dan validation"]
    },
    5: {
      longDescription: "Proyek comprehensive data analysis tentang pola rental sepeda menggunakan Python. Analisis mencakup trend temporal, pola seasonal, faktor weather impact, dan customer behavior. Menggunakan visualisasi data yang interaktif untuk mengekstrak insights bisnis yang actionable.",
      features: ["Exploratory Data Analysis (EDA) komprehensif", "Visualisasi trend temporal dan seasonal", "Analisis korelasi faktor weather", "Customer segmentation analysis", "Predictive modeling untuk demand forecasting", "Interactive dashboard dengan Jupyter"],
      challenges: ["Cleaning dan preprocessing dataset besar", "Handling missing values dan outliers", "Creating meaningful visualizations", "Statistical analysis yang valid"],
      learnings: ["Pandas untuk data manipulation", "Matplotlib dan Seaborn untuk visualisasi", "Statistical analysis techniques", "Data storytelling dan presentation", "Jupyter notebook untuk data science workflow"]
    }
  }

  const currentDetails = projectDetails[project.id as keyof typeof projectDetails] || {
    longDescription: project.description,
    features: ["Feature information not available"],
    challenges: ["Challenge information not available"],
    learnings: ["Learning information not available"]
  }

  const mockStats = {
    commits: Math.floor(Math.random() * 50) + 10,
    contributors: Math.floor(Math.random() * 5) + 1,
    lastUpdate: "2024"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors shadow-lg"
              type="button"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br from-primary-600 to-purple-600 p-6">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 h-full flex items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">
                      {project.category === 'Web Development' && '🌐'}
                      {project.category === 'Data Science' && '📊'}
                      {project.category === 'Desktop Application' && '💻'}
                      {project.category === 'System Programming' && '⚙️'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                      <p className="text-white/80">{project.category}</p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <GitBranch size={16} />
                      <span className="text-sm">{mockStats.commits} commits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span className="text-sm">{mockStats.contributors} contributors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm">Updated {mockStats.lastUpdate}</span>
                    </div>
                    {project.stars > 0 && (
                      <div className="flex items-center gap-2">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm">{project.stars} stars</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Github size={16} />
                    Code
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-12rem)] overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Code2 size={20} className="text-primary-400" />
                  Project Overview
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {currentDetails.longDescription}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full border border-primary-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {currentDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-primary-400 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Technical Challenges</h3>
                <ul className="space-y-2">
                  {currentDetails.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-yellow-400 mt-1">⚡</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learnings */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Key Learnings</h3>
                <ul className="space-y-2">
                  {currentDetails.learnings.map((learning, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400 mt-1">✓</span>
                      {learning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProjectDetailModal