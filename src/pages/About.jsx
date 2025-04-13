import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const About = () => {
  const features = [
    {
      icon: "🧘‍♀️",
      title: "Guided Meditation",
      description: "Expert-led sessions for all experience levels"
    },
    {
      icon: "🎵",
      title: "Sound Healing",
      description: "Sacred frequencies for deep healing and transformation"
    },
    {
      icon: "🤖",
      title: "AI Spiritual Guide",
      description: "24/7 support for your spiritual journey"
    },
    {
      icon: "✨",
      title: "Energy Healing",
      description: "Chakra balancing and energy alignment"
    }
  ]

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
            About Nirvaha
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the story behind our mission to bring inner peace and spiritual harmony to the world through technology and ancient wisdom.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="bg-dark-100 rounded-3xl p-12 mb-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              At Nirvaha, we believe in bridging the gap between ancient spiritual wisdom and modern technology. 
              Our mission is to make spiritual growth and inner peace accessible to everyone, anywhere in the world.
              Through our platform, we combine traditional meditation practices, sacred sound healing, and artificial 
              intelligence to create a unique and personalized spiritual journey for each seeker.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-dark-100 rounded-2xl p-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Founder Section */}
        <motion.div
          className="bg-dark-100 rounded-3xl overflow-hidden mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="md:flex">
            <div className="md:w-1/2 relative aspect-square">
              <img 
                src="/assets/team/founder.jpg" 
                alt="Sai Eshwar - Founder of Nirvaha"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="p-12 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">Meet Our Founder</h2>
              <h3 className="text-xl text-primary mb-4">Sai Eshwar</h3>
              <p className="text-gray-400 mb-6">
                E Sai Eshwar is an aspiring entrepreneur passionate about innovation, sustainability, and mental health. As the Founder of GuideBazaar, I share insights on startups, technology, and competitions. My work blends technology with tradition, developing a mental health app inspired by ancient Indian wisdom and the Bhagavad Gita for personalized support. I thrive as a community builder, fostering connections between students and industry experts through my role at MentorX. Recognized in programs like Microsoft Startup Hub, IIT-G Disrupt, and TSIC Social Innovation, I continuously push the boundaries of impact-driven innovation. Let's connect to collaborate on mental health technology and entrepreneurship!
              </p>
              <p className="text-gray-400">
                "Our goal is to create a space where technology serves as a gateway to spiritual growth, 
                making the transformative power of meditation and sound healing available to everyone, 
                anywhere in the world."
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="bg-dark-100 rounded-3xl p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Begin Your Journey Today</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of others who have found their path to inner peace and spiritual growth with Nirvaha.
            </p>
            <Link 
              to="/divine-chat"
              className="inline-block px-8 py-3 bg-primary text-dark-300 rounded-full font-medium hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              Start Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About 