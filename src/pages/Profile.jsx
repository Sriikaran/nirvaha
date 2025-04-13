import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../config/supabase'

const Profile = () => {
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('progress')
  const [tooltipVisible, setTooltipVisible] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // User statistics state
  const [userStats, setUserStats] = useState([
    {
      key: 'meditationTime',
      value: '0m',
      label: 'Meditation Time',
      description: 'Total time you have spent meditating across all sessions'
    },
    {
      key: 'sessionsCompleted',
      value: 0,
      label: 'Sessions Completed',
      description: 'Number of meditation sessions you have fully completed'
    },
    {
      key: 'streakDays',
      value: 0,
      label: 'Streak Days',
      description: 'Number of consecutive days you have meditated without breaking the streak'
    },
    {
      key: 'achievements',
      value: 0,
      label: 'Achievements',
      description: 'Milestones and badges earned based on your meditation activity'
    }
  ])
  
  // User activities state
  const [recentActivities, setRecentActivities] = useState([])
  const [achievements, setAchievements] = useState([])
  const [weeklyProgressData, setWeeklyProgressData] = useState([
    { day: 'Mon', minutes: 0 },
    { day: 'Tue', minutes: 0 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 0 },
    { day: 'Sat', minutes: 0 },
    { day: 'Sun', minutes: 0 }
  ])
  
  // Get the maximum value for scaling the chart (default to 30 min if all are 0)
  const maxMinutes = Math.max(...weeklyProgressData.map(day => day.minutes), 30)

  // Protect the route
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth')
    } else {
      fetchUserData()
    }
  }, [currentUser, navigate])
  
  // Format minutes into hours and minutes
  const formatMeditationTime = (totalMinutes) => {
    if (totalMinutes < 60) return `${totalMinutes}m`
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }
  
  // Fetch user's meditation data, sessions, streaks, and achievements
  const fetchUserData = async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      
      // 1. Fetch user's meditation sessions
      const { data: meditationSessions, error: meditationError } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('completed_at', { ascending: false })
      
      if (meditationError) throw meditationError
      
      // 2. Fetch user's achievements
      const { data: userAchievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', currentUser.id)
      
      if (achievementsError) throw achievementsError
      
      // 3. Calculate statistics
      // Total meditation time in minutes
      const totalMeditationMinutes = meditationSessions?.reduce((total, session) => {
        return total + (session.duration_minutes || 0)
      }, 0) || 0
      
      // Sessions completed
      const completedSessions = meditationSessions?.filter(session => session.completed)?.length || 0
      
      // Calculate streak days
      const streakDays = calculateStreakDays(meditationSessions)
      
      // Count achievements
      const achievementsCount = userAchievements?.length || 0
      
      // Update user stats
      setUserStats(prevStats => [
        { ...prevStats[0], value: formatMeditationTime(totalMeditationMinutes) },
        { ...prevStats[1], value: completedSessions },
        { ...prevStats[2], value: streakDays },
        { ...prevStats[3], value: achievementsCount }
      ])
      
      // 4. Process recent activities
      const recentActivitiesData = processRecentActivities(meditationSessions)
      setRecentActivities(recentActivitiesData)
      
      // 5. Process achievements
      const achievementsData = processAchievements(userAchievements)
      setAchievements(achievementsData)
      
      // 6. Calculate weekly meditation progress
      const weeklyData = calculateWeeklyProgress(meditationSessions)
      setWeeklyProgressData(weeklyData)
      
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }
  
  // Calculate streak days based on meditation sessions
  const calculateStreakDays = (sessions) => {
    if (!sessions || sessions.length === 0) return 0
    
    // Sort sessions by date in ascending order
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.completed_at) - new Date(b.completed_at)
    )
    
    // Group sessions by day
    const sessionsByDay = {}
    sortedSessions.forEach(session => {
      if (!session.completed_at) return
      
      const dateStr = new Date(session.completed_at).toLocaleDateString()
      sessionsByDay[dateStr] = true
    })
    
    // Get unique dates
    const dates = Object.keys(sessionsByDay).map(dateStr => new Date(dateStr))
    
    if (dates.length === 0) return 0
    
    // Calculate current streak
    let currentStreak = 1
    let maxStreak = 1
    
    // Check if the most recent session is from today or yesterday
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const mostRecentDate = new Date(Math.max(...dates))
    mostRecentDate.setHours(0, 0, 0, 0)
    
    // If the most recent session is older than yesterday, streak is broken
    if (mostRecentDate < yesterday) {
      return 0
    }
    
    // Calculate streak by checking consecutive days
    for (let i = dates.length - 2; i >= 0; i--) {
      const currentDate = new Date(dates[i])
      const nextDate = new Date(dates[i + 1])
      
      // Check if dates are consecutive
      const diffDays = Math.round((nextDate - currentDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        break
      }
    }
    
    return maxStreak
  }
  
  // Process meditation sessions into recent activities
  const processRecentActivities = (sessions) => {
    if (!sessions || sessions.length === 0) {
      return [
        {
          type: 'info',
          title: 'No activities yet',
          duration: 'Start meditating',
          date: 'Just now',
          icon: '🧘‍♀️'
        }
      ]
    }
    
    // Take the 5 most recent sessions
    return sessions.slice(0, 5).map(session => {
      // Calculate relative time
      const date = new Date(session.completed_at || session.created_at)
      const relativeTime = getRelativeTimeString(date)
      
      return {
        type: 'meditation',
        title: session.title || 'Meditation Session',
        duration: `${session.duration_minutes} minutes`,
        date: relativeTime,
        icon: '🧘‍♀️'
      }
    })
  }
  
  // Calculate relative time string
  const getRelativeTimeString = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffDay > 30) {
      return date.toLocaleDateString()
    } else if (diffDay > 0) {
      return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`
    } else {
      return 'Just now'
    }
  }
  
  // Process user achievements
  const processAchievements = (userAchievements) => {
    if (!userAchievements || userAchievements.length === 0) {
      return [
        {
          title: 'First Meditation',
          description: 'Complete your first meditation session',
          progress: 0,
          icon: '🌱'
        }
      ]
    }
    
    return userAchievements.map(item => {
      const achievement = item.achievement || {}
      
      return {
        title: achievement.title || 'Achievement',
        description: achievement.description || '',
        progress: item.progress || 0,
        icon: achievement.icon || '✨'
      }
    })
  }
  
  // Calculate weekly meditation progress
  const calculateWeeklyProgress = (sessions) => {
    if (!sessions || sessions.length === 0) {
      return weeklyProgressData // Return default empty data
    }
    
    // Get the current week's dates
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Create array of dates for the current week (Monday to Sunday)
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      // Adjust for day of week (0 = Monday in our UI, but 1 = Monday in JS Date)
      // Convert our display format (Mon-Sun) to JS date format (0=Sun, 1=Mon)
      const dayOffset = i === 6 ? 0 : i + 1 // Make Sunday the last day
      const diff = currentDay - dayOffset
      date.setDate(today.getDate() - diff)
      date.setHours(0, 0, 0, 0)
      weekDates[i] = date
    }
    
    // Initialize minutes for each day
    const weekData = [
      { day: 'Mon', minutes: 0 },
      { day: 'Tue', minutes: 0 },
      { day: 'Wed', minutes: 0 },
      { day: 'Thu', minutes: 0 },
      { day: 'Fri', minutes: 0 },
      { day: 'Sat', minutes: 0 },
      { day: 'Sun', minutes: 0 }
    ]
    
    // Sum up meditation minutes for each day of the week
    sessions.forEach(session => {
      if (!session.completed_at) return
      
      const sessionDate = new Date(session.completed_at)
      sessionDate.setHours(0, 0, 0, 0)
      
      // Find which day of the week this session belongs to
      for (let i = 0; i < 7; i++) {
        if (sessionDate.getTime() === weekDates[i].getTime()) {
          weekData[i].minutes += (session.duration_minutes || 0)
          break
        }
      }
    })
    
    return weekData
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to logout')
    }
  }

  // If no user, don't render anything
  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header with Logout */}
        <motion.div 
          className="bg-dark-100 rounded-3xl p-8 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary/50 flex items-center justify-center text-4xl">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.username || 'User'} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  currentUser.email?.[0].toUpperCase() || '🧘‍♀️'
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userProfile?.username || currentUser.user_metadata?.username || 'User'}
                </h1>
                <p className="text-gray-400">
                  {currentUser.email}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 rounded-xl
                       hover:from-primary/20 hover:to-primary/10 transition-all duration-300 flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium">Sign Out</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid with Tooltips */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {userStats.map((stat, index) => (
            <div 
              key={stat.key} 
              className="bg-dark-100 rounded-2xl p-6 border border-primary/20 relative group"
              onMouseEnter={() => setTooltipVisible(stat.key)}
              onMouseLeave={() => setTooltipVisible(null)}
            >
              <div className="flex items-center mb-2">
                <h3 className="text-gray-400 capitalize">{stat.label}</h3>
                <div className="ml-2 text-gray-500 cursor-help">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  stat.value
                )}
              </p>
              
              {/* Tooltip */}
              <AnimatePresence>
                {tooltipVisible === stat.key && (
                  <motion.div 
                    className="absolute z-20 bottom-full left-0 mb-2 p-3 bg-dark-200 rounded-lg shadow-lg border border-primary/20 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-gray-300">{stat.description}</p>
                    <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-dark-200 border-r border-b border-primary/20"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="bg-dark-100 rounded-3xl p-8 border border-primary/20">
          <div className="flex space-x-4 mb-8">
            {['progress', 'activities', 'achievements'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-lg transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-dark-300'
                    : 'text-gray-400 hover:text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-dark-200 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Weekly Progress</h3>
                  
                  {loading ? (
                    <div className="h-64 bg-dark-300/50 rounded-xl flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {/* Progress Chart */}
                      <div className="h-80 pt-6">
                        <div className="h-64 relative flex items-end justify-between gap-2">
                          {weeklyProgressData.map((day, index) => {
                            const heightPercentage = (day.minutes / maxMinutes) * 100;
                            return (
                              <div key={day.day} className="flex flex-col items-center flex-1">
                                <motion.div 
                                  className={`w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary relative group ${day.minutes === 0 ? 'opacity-30' : ''}`}
                                  style={{ height: day.minutes === 0 ? '5%' : `${heightPercentage}%` }}
                                  initial={{ height: 0 }}
                                  animate={{ height: day.minutes === 0 ? '5%' : `${heightPercentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                >
                                  {/* Minutes tooltip on hover */}
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-100 px-2 py-1 rounded text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {day.minutes} min
                                  </div>
                                  
                                  {/* Glow effect */}
                                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary to-transparent opacity-30 rounded-t-lg"></div>
                                </motion.div>
                                <div className="text-gray-400 text-sm mt-2">{day.day}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Stats Legend */}
                      <div className="flex justify-center items-center mt-4 gap-6">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                          <span className="text-gray-400 text-sm">Daily Meditation Minutes</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                          <span className="text-gray-400 text-sm">Weekly Average: {Math.round(weeklyProgressData.reduce((sum, day) => sum + day.minutes, 0) / weeklyProgressData.length)} min</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {loading ? (
                  // Loading skeleton for activities
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="bg-dark-200 rounded-2xl p-6 flex items-center justify-between animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        <div>
                          <div className="w-32 h-5 bg-gray-700 rounded mb-2"></div>
                          <div className="w-20 h-4 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="w-16 h-4 bg-gray-700 rounded"></div>
                    </div>
                  ))
                ) : (
                  recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="bg-dark-200 rounded-2xl p-6 flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{activity.icon}</div>
                        <div>
                          <h3 className="text-white font-semibold">{activity.title}</h3>
                          <p className="text-gray-400">{activity.duration}</p>
                        </div>
                      </div>
                      <span className="text-gray-400">{activity.date}</span>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {loading ? (
                  // Loading skeleton for achievements
                  [...Array(2)].map((_, index) => (
                    <div key={index} className="bg-dark-200 rounded-2xl p-6 animate-pulse">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        <div>
                          <div className="w-32 h-5 bg-gray-700 rounded mb-2"></div>
                          <div className="w-40 h-4 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full"></div>
                      <div className="mt-2 ml-auto w-10 h-4 bg-gray-700 rounded"></div>
                    </div>
                  ))
                ) : (
                  achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      className="bg-dark-200 rounded-2xl p-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div>
                          <h3 className="text-white font-semibold">{achievement.title}</h3>
                          <p className="text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="mt-2 text-right text-sm text-primary">{achievement.progress}%</div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Profile 