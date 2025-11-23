import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Eye, TrendingUp, Activity } from 'lucide-react'
import { getVisitorStats, getPageViewsByPage, type VisitorStats as VisitorStatsType } from '../services/api'

const VisitorStats = () => {
  const [stats, setStats] = useState<VisitorStatsType>({
    totalVisitors: 0,
    totalPageViews: 0,
    todayVisitors: 0,
    todayPageViews: 0
  })
  const [pageViews, setPageViews] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const [statsData, pageViewsData] = await Promise.all([
        getVisitorStats(),
        getPageViewsByPage()
      ])
      setStats(statsData)
      setPageViews(pageViewsData)
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.totalVisitors,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Page Views',
      value: stats.totalPageViews,
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Today\'s Visitors',
      value: stats.todayVisitors,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Today\'s Views',
      value: stats.todayPageViews,
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    }
  ]

  if (isLoading) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-effect rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ stroke: 'url(#gradient)' }} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: stat.color.split(' ')[1], stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: stat.color.split(' ')[3], stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Page Views Breakdown */}
      {Object.keys(pageViews).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-effect rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Eye size={20} className="text-primary-400" />
            Page Views Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(pageViews)
              .sort(([, a], [, b]) => b - a)
              .map(([page, views]) => {
                const maxViews = Math.max(...Object.values(pageViews))
                const percentage = (views / maxViews) * 100
                
                return (
                  <div key={page} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 capitalize">{page}</span>
                      <span className="text-white font-semibold">{views.toLocaleString()} views</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </motion.div>
      )}

      {/* Refresh Info */}
      <div className="text-center text-gray-500 text-sm">
        Stats auto-refresh every 30 seconds
      </div>
    </div>
  )
}

export default VisitorStats
