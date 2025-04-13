import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const SoundHealing = () => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volumes, setVolumes] = useState({
    alpha: 0.5,
    beta: 0.5,
    gamma: 0.5,
    delta: 0.5
  })
  const audioRefs = {
    alpha: useRef(null),
    beta: useRef(null),
    gamma: useRef(null),
    delta: useRef(null)
  }

  const frequencies = [
    {
      id: 1,
      name: "ALPHA WAVES",
      frequency: "8 - 12HZ",
      duration: "1 hour",
      benefits: "Relaxation ,Pain relief ,Stress reduction ,Improving sleep quality",
      description: "When you get in the alpha state of mind, your brain is relaxed and focused on the present moment.",
      color: "from-blue-500/20 to-primary/20"
    },
    {
      id: 2,
      name: "BETA WAVES ",
      frequency: "12 – 30HZ",
      duration: "1 hour",
      benefits: "Keeping your attention focused ,Analytical thinking and solving problems ,Stimulating energy and action",
      description: "Beta is a higher frequency brainwave associated with our normal waking state when we are actively engaged in thinking or a task.",
      color: "from-green-500/20 to-primary/20"
    },
    {
      id: 3,
      name: "GAMMA WAVES",
      frequency: "38 - 45HZ",
      duration: "1 hour",
      benefits: "Peak concentration ,Brain synchronization ,Better memory ,Faster cognition",
      description: "The gamma state of mind is thought to involve the synchronization of the brain's hemispheres and the balancing of all the brainwaves simultaneously.",
      color: "from-pink-500/20 to-primary/20"
    },
    {
      id: 4,
      name: "DELTA WAVES ",
      frequency: "0.5 - 4HZ",
      duration: "1 hour",
      benefits: "Increasing deep sleep ,Healing and pain relief ,Access to the unconscious mind",
      description: "The delta state of mind is associated with the deep, dreamless state of sleep which is crucial for restoration and the release of human growth hormone (HGM).",
      color: "from-purple-500/20 to-primary/20"
    }
  ]

  // Add useEffect for audio setup
  useEffect(() => {
    // Create audio elements for each frequency
    audioRefs.alpha.current = new Audio('/sounds/ALPHA.mp3')
    audioRefs.beta.current = new Audio('/sounds/BETA.mp3')
    audioRefs.gamma.current = new Audio('/sounds/GAMMA.mp3')
    audioRefs.delta.current = new Audio('/sounds/DELTA.mp3')

    // Enable looping for all tracks
    Object.values(audioRefs).forEach(ref => {
      if (ref.current) {
        ref.current.loop = true
      }
    })
    
    // Cleanup on unmount
    return () => {
      Object.values(audioRefs).forEach(ref => {
        if (ref.current) {
          ref.current.pause()
          ref.current = null
        }
      })
    }
  }, [])

  // Handle play/pause for specific frequency
  const togglePlay = (trackId) => {
    const frequencyMap = {
      1: 'alpha',
      2: 'beta',
      3: 'gamma',
      4: 'delta'
    }
    const frequency = frequencyMap[trackId]

    // Stop all other tracks first
    Object.entries(audioRefs).forEach(([freq, ref]) => {
      if (ref.current && freq !== frequency) {
        ref.current.pause()
      }
    })

    const audioRef = audioRefs[frequency].current
    if (audioRef) {
      if (currentTrack === frequency && isPlaying) {
        audioRef.pause()
        setIsPlaying(false)
      } else {
        audioRef.play()
        setCurrentTrack(frequency)
        setIsPlaying(true)
      }
    }
  }

  // Handle volume change for specific frequency
  const handleVolumeChange = (trackId, e) => {
    const frequencyMap = {
      1: 'alpha',
      2: 'beta',
      3: 'gamma',
      4: 'delta'
    }
    const frequency = frequencyMap[trackId]
    const newVolume = parseFloat(e.target.value)
    setVolumes(prev => ({
      ...prev,
      [frequency]: newVolume
    }))
    if (audioRefs[frequency].current) {
      audioRefs[frequency].current.volume = newVolume
    }
  }

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source 
            src=".\videos\sound-healing-bg.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-dark-300/70" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
            Sacred Sound Healing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the healing power of sacred frequencies. Each tone is carefully crafted to resonate with your body's natural energy centers.
          </p>
        </motion.div>

        {/* Frequency Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {frequencies.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${track.color} backdrop-blur-lg rounded-3xl p-8 border border-primary/20`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">{track.name}</h3>
                <span className="text-primary font-medium">{track.frequency}</span>
              </div>
              <p className="text-gray-400 mb-6">{track.description}</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{track.duration}</span>
                  <motion.button
                    onClick={() => togglePlay(track.id)}
                    className={`p-3 rounded-full ${
                      currentTrack === (track.id === 1 ? 'alpha' : track.id === 2 ? 'beta' : track.id === 3 ? 'gamma' : 'delta') && isPlaying
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-primary hover:bg-primary/90'
                    } text-dark-300 transition-all`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentTrack === (track.id === 1 ? 'alpha' : track.id === 2 ? 'beta' : track.id === 3 ? 'gamma' : 'delta') && isPlaying ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </motion.button>
                </div>
                {currentTrack === (track.id === 1 ? 'alpha' : track.id === 2 ? 'beta' : track.id === 3 ? 'gamma' : 'delta') && isPlaying && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Volume</span>
                      <span className="text-gray-400">{Math.round(volumes[track.id === 1 ? 'alpha' : track.id === 2 ? 'beta' : track.id === 3 ? 'gamma' : 'delta'] * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volumes[track.id === 1 ? 'alpha' : track.id === 2 ? 'beta' : track.id === 3 ? 'gamma' : 'delta']}
                      onChange={(e) => handleVolumeChange(track.id, e)}
                      className="w-full h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div 
          className="bg-dark-100/50 backdrop-blur-lg rounded-3xl p-12 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8">Benefits of Sound Healing</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Stress Reduction",
                  description: "Sacred frequencies help reduce stress and anxiety levels"
                },
                {
                  title: "Energy Balance",
                  description: "Align and balance your body's natural energy centers"
                },
                {
                  title: "Deep Healing",
                  description: "Promote cellular healing and spiritual transformation"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SoundHealing 