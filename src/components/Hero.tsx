import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Github, Instagram, Mail, Download, ChevronDown } from 'lucide-react'

const Hero = () => {
  const [currentTitle, setCurrentTitle] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Static personal info
  const personalInfo = {
    name: "M. Dzaka Al Fikri",
    title: "Data Scientist & Web Developer",
    bio: "I'm a Bangkit Academy graduate currently pursuing my degree in Informatics at Ahmad Dahlan University (UAD). My journey in technology started with a passion for solving real-world problems through code and data.",
    email: "dzakaal20@gmail.com",
    github: "https://github.com/DzakaAl",
    linkedin: "https://www.linkedin.com/in/m-dzaka-al-fikri-7bba421a4/",
    instagram: "https://www.instagram.com/moredzl/",
    avatar: "https://avatars.githubusercontent.com/u/121382679?v=4"
  }
  
  const titles = useMemo(() => [
    'Data Enthusiast',
    'Web Developer',
  ], [])

  // Typing animation effect
  useEffect(() => {
    const currentWord = titles[currentTitle]
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText !== currentWord) {
        setDisplayText(currentWord.slice(0, displayText.length + 1))
      } else if (isDeleting && displayText !== '') {
        setDisplayText(currentWord.slice(0, displayText.length - 1))
      } else if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1500)
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setCurrentTitle((prev) => (prev + 1) % titles.length)
      }
    }, isDeleting ? 50 : 150)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTitle, titles])

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about')
    aboutSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('#portfolio')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const downloadCV = () => {
    // Create a link to your CV file in the public folder
    const cvUrl = '/CV_M_Dzaka_Al_Fikri.pdf' // Put your CV in public folder
    
    // Try to download, if file doesn't exist, show alert
    fetch(cvUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const link = document.createElement('a')
          link.href = cvUrl
          link.download = 'CV_M_Dzaka_Al_Fikri.pdf'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          alert('CV file not found. Please add CV_M_Dzaka_Al_Fikri.pdf to the public folder.')
        }
      })
      .catch(() => {
        alert('CV file not found. Please add CV_M_Dzaka_Al_Fikri.pdf to the public folder.')
      })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                Hi, I'm{' '}
                <span className="gradient-text">{personalInfo.name}</span>
              </h1>
              
              <div className="h-16 flex items-center justify-center lg:justify-start">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-400">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </h2>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-300 mb-8 max-w-2xl"
            >
              {personalInfo.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all justify-center"
                onClick={scrollToProjects}
              >
                View My Work
                <ChevronDown size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-primary-500 text-primary-400 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-colors justify-center"
                onClick={downloadCV}
              >
                Download CV
                <Download size={20} />
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={24} />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href={personalInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram size={24} />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href={`mailto:${personalInfo.email}`}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Mail size={24} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Content - Avatar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-dark-200 p-4">
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl">⚛️</span>
              </motion.div>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">🚀</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero