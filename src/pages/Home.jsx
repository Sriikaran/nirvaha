import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Home = () => {
  return (
    <div className="relative bg-dark-300 text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source 
              src="\meditation.mp4" 
              type="video/mp4" 
            />
          </video>
          <div className="absolute inset-0 bg-dark-300/80" /> {/* Dark overlay */}
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
              Welcome to Nirvaha
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12">
              Ancient Wisdom for Modern Life
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/auth">
                <motion.button
                  className="px-8 py-3 bg-primary text-dark-300 rounded-full font-medium text-lg hover:bg-primary/90 transition-all w-full md:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Journey
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  className="px-8 py-3 bg-dark-100 text-white rounded-full font-medium text-lg hover:bg-dark-200 transition-all w-full md:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark-200 via-dark-300 to-dark-100" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
              Our Services
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover our range of spiritual and wellness offerings designed to help you find inner peace
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧘‍♀️",
                title: "Guided Meditation",
                description: "Experience deep meditation with divine guidance",
                path: "/meditation"
              },
              {
                icon: "🎵",
                title: "Sound Healing",
                description: "Heal through sacred frequencies and vibrations",
                path: "/sound-healing"
              },
              {
                icon: "💫",
                title: "Divine Chat",
                description: "Connect with spiritual wisdom through AI",
                path: "/divine-chat"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-100/50 backdrop-blur-lg rounded-3xl p-8 border border-primary/10 hover:border-primary/30 transition-all group"
              >
                <Link to={service.path} className="block">
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">
                    {service.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary group-hover:translate-x-2 transition-transform">
                    <span className="mr-2">Learn More</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-dark-100 py-24 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-primary">Begin Your Spiritual Journey Today</h2>
          <p className="text-xl mb-8 text-gray-400">Join thousands of others who have found their path to enlightenment</p>
          <Link 
            to="/divine-chat" 
            className="inline-block bg-primary text-dark-300 px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
          >
            Start Now
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Home