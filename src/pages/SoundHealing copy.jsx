import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const SoundHealing = () => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volumes, setVolumes] = useState({
    432: 0.5,
    528: 0.5,
    639: 0.5,
    741: 0.5
  })
  const audioRefs = {
    432: useRef(null),
    528: useRef(null),
    639: useRef(null),
    741: useRef(null)
  }

  const frequencies = [
    {
      id: 1,
      name: "432 Hz Miracle Tone",
      frequency: "432 Hz",
      duration: "1 hour",
      benefits: "Universal healing, Pure effects, Natural frequency of the universe",
      description: "Known as the miracle tone, 432 Hz resonates with the universe's natural frequency.",
      color: "from-blue-500/20 to-primary/20"
    },
    {
      id: 2,
      name: "528 Hz Love Frequency",
      frequency: "528 Hz",
      duration: "1 hour",
      benefits: "DNA repair, Transformation, Miracles",
      description: "The frequency of love and miracles, helping in cellular healing and transformation.",
      color: "from-green-500/20 to-primary/20"
    },
    {
      id: 3,
      name: "639 Hz Heart Chakra",
      frequency: "639 Hz",
      duration: "1 hour",
      benefits: "Relationships, Love, Heart Chakra healing",
      description: "Connects with the heart chakra, promoting love and positive relationships.",
      color: "from-pink-500/20 to-primary/20"
    },
    {
      id: 4,
      name: "DELTA WAVES (0.5 - 4HZ)",
      frequency: "0.5 - 4HZ",
      duration: "1 hour",
      benefits: "Spiritual awakening, Intuition, Expression",
      description: "Increasing deep sleep ,Healing and pain relief ,Anti-aging: cortisol reduction/DHEA increase",
      color: "from-purple-500/20 to-primary/20"
    }
  ]

  // Add useEffect for audio setup
  useEffect(() => {
    // Create audio elements for each frequency
    audioRefs[432].current = new Audio('/sounds/432hz-miracle-tone.mp3')
    audioRefs[528].current = new Audio('/sounds/528hz-love-frequency.mp3')
    audioRefs[639].current = new Audio('/sounds/639hz-heart-chakra.mp3')
    audioRefs[741].current = new Audio('/sounds/741hz-spiritual-detox.mp3')

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
  const togglePlay = (frequency) => {
    // Stop all other tracks first
    Object.entries(audioRefs).forEach(([freq, ref]) => {
      if (ref.current && freq !== frequency.toString()) {
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
  const handleVolumeChange = (frequency, e) => {
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
                    onClick={() => togglePlay(parseInt(track.frequency))}
                    className={`p-3 rounded-full ${
                      currentTrack === parseInt(track.frequency) && isPlaying
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-primary hover:bg-primary/90'
                    } text-dark-300 transition-all`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentTrack === parseInt(track.frequency) && isPlaying ? (
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-gray-400">{Math.round(volumes[parseInt(track.frequency)] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumes[parseInt(track.frequency)]}
                    onChange={(e) => handleVolumeChange(parseInt(track.frequency), e)}
                    className="w-full h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
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