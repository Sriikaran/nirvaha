import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Internships', path: '/contact', isHighlight: true },
     
    ],
    features: [
      { name: 'Meditation', path: '/meditation' },
      { name: 'Sound Healing', path: '/sound-healing' },
      { name: 'Divine Chat', path: '/divine-chat' },
      { name: 'Profile', path: '/profile' }
    ],
    social: [
    
      { name: 'LinkedIn', path: 'https://www.linkedin.com/company/soulverse23/' },
      { name: 'Instagram', path: 'https://www.instagram.com/_nirvaha_/' }
    ]
  }

  return (
    <footer className="bg-dark-100 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 block">
              Nirvaha
            </Link>
            <p className="text-gray-400 mb-6">
              Bridging ancient wisdom with modern technology for spiritual growth.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className={`text-gray-400 hover:text-primary transition-colors ${
                      link.isHighlight ? 'flex items-center gap-2 text-primary' : ''
                    }`}
                  >
                    {link.name}
                    {link.isHighlight && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              {footerLinks.features.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Internship Highlight */}
          <div>
            <h3 className="text-white font-semibold mb-4">Join Our Team</h3>
            <div className="bg-dark-200 rounded-xl p-6 border border-primary/20">
              <h4 className="text-primary font-semibold mb-2">45-Day Internship Program</h4>
              <p className="text-gray-400 text-sm mb-4">
                Available positions in Web Development, ML, UI/UX, and Data Analytics.
              </p>
              <motion.a
                href="https://forms.zohopublic.in/saieshwarerelli10gm1/form/InternshipOpportunitiesatNIRVAHA/formperma/svJExoTEaaUdA3cO9RRE0B7GsuAbZOj1QB7LLAVavzc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-dark-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Nirvaha. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.social.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 