import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Star, Calendar, Code2, Users, GitBranch, Award } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GitHubStats {
  commits: number
  contributors: number
  lastUpdate: string
  stars: number
}

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  github: string
  live: string
  stars: number
  category: string
  image?: string
  featured?: boolean
}

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    commits: 0,
    contributors: 0,
    lastUpdate: new Date().getFullYear().toString(),
    stars: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // Fetch real GitHub stats when modal opens
  useEffect(() => {
    if (!isOpen || !project?.github) return

    const fetchGitHubStats = async () => {
      try {
        setIsLoadingStats(true)
        
        // Extract owner and repo from GitHub URL
        const match = project.github.match(/github\.com\/([^\/]+)\/([^\/]+)/)
        if (!match) return

        const [, owner, repo] = match
        const repoName = repo.replace('.git', '')

        // Fetch repository data
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`)
        if (!repoResponse.ok) throw new Error('Failed to fetch repo data')
        
        const repoData = await repoResponse.json()

        // Fetch contributors count
        const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=1`)
        const contributorsCount = contributorsResponse.ok 
          ? parseInt(contributorsResponse.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1] || '1')
          : 1

        // Fetch commits count (approximate)
        const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=1`)
        const commitsCount = commitsResponse.ok
          ? parseInt(commitsResponse.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1] || '1')
          : 0

        setGithubStats({
          commits: commitsCount,
          contributors: contributorsCount,
          lastUpdate: new Date(repoData.updated_at).getFullYear().toString(),
          stars: repoData.stargazers_count || 0
        })
      } catch (error) {
        console.error('Error fetching GitHub stats:', error)
        // Keep default mock values on error
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchGitHubStats()
  }, [isOpen, project?.github])

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

  // Use real GitHub stats if available, otherwise show loading or defaults
  const displayStats = githubStats.commits > 0 ? githubStats : {
    commits: 0,
    contributors: 0,
    lastUpdate: new Date().getFullYear().toString(),
    stars: githubStats.stars
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
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-gray-900"
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

            {/* Theme Toggle Button - Removed, now in Navbar */}

            {/* Header with Background Image */}
            <div className="relative h-64 bg-gradient-to-br from-primary-600 to-purple-600 p-6">
              {project.image && (
                <>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
                </>
              )}
              {!project.image && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-600"></div>
              )}
              <div className="relative z-10 h-full flex align-self-stretch">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">
                      {project.category === 'Web Development' && '🌐'}
                      {project.category === 'Data Science' && '📊'}
                      {project.category === 'Machine Learning' && '🤖'}
                      {project.category === 'Desktop Application' && '💻'}
                      {project.category === 'System Programming' && '⚙️'}
                      {project.category === 'Mobile Development' && '📱'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                        {project.featured && (
                          <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            <Award size={12} />
                            Featured
                          </div>
                        )}
                      </div>
                      <p className="text-white/80">{project.category}</p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 text-white/90">
                    {isLoadingStats ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Loading stats...</span>
                      </div>
                    ) : (
                      <>
                        {displayStats.commits > 0 && (
                          <div className="flex items-center gap-2">
                            <GitBranch size={16} />
                            <span className="text-sm">{displayStats.commits.toLocaleString()} commits</span>
                          </div>
                        )}
                        {displayStats.contributors > 0 && (
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span className="text-sm">{displayStats.contributors} contributor{displayStats.contributors > 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span className="text-sm">Updated {displayStats.lastUpdate}</span>
                        </div>
                        {displayStats.stars > 0 && (
                          <div className="flex items-center gap-2">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm">{displayStats.stars} star{displayStats.stars > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-12rem)] overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-white">
                  <Code2 size={20} className="text-primary-400" />
                  Project Overview
                </h3>
                <p className="leading-relaxed whitespace-pre-wrap text-gray-300">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full border bg-primary-500/20 text-primary-300 border-primary-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Moved to Bottom */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Project Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium shadow-lg bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      <Github size={20} />
                      View Source Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all font-medium shadow-lg"
                    >
                      <ExternalLink size={20} />
                      View Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProjectDetailModal