import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { currentUser } = useAuth()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Zen Chat', path: '/divine-chat' },
    { name: 'Meditation', path: '/meditation' },
    { name: 'Sound Healing', path: '/sound-healing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A192F]/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-24 h-24 flex items-center justify-center">
                <img 
                  src="/assets/nirvaha-logo.png" 
                  alt="Nirvaha" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-3xl font-bold tracking-wider ${scrolled ? 'text-white' : 'text-white'}`}>
                  NIRVAHA
                </span>
                <span className={`text-sm tracking-widest ${scrolled ? 'text-[#00D5B0]' : 'text-[#00D5B0]'}`}>
                  HARMONY OF MIND
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative group text-lg ${
                  scrolled ? 'text-white' : 'text-white'
                } hover:text-[#00D5B0] transition-colors`}
              >
                {link.name}
                <motion.div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#00D5B0] transform origin-left
                    ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0'}
                  `}
                  initial={false}
                  animate={{ scaleX: location.pathname === link.path ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
            {currentUser && (
              <Link 
                to="/profile" 
                className={`p-2 rounded-full transition-colors ${
                  scrolled ? 'hover:bg-[#00D5B0]/10' : 'hover:bg-[#00D5B0]/10'
                }`}
              >
                <UserCircleIcon className={`h-7 w-7 ${scrolled ? 'text-white' : 'text-white'} hover:text-[#00D5B0]`} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full ${scrolled ? 'text-white' : 'text-white'}`}
            >
              {isOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0A192F] rounded-2xl shadow-lg mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-white text-lg hover:bg-[#00D5B0]/10 hover:text-[#00D5B0] ${
                      location.pathname === link.path ? 'bg-[#00D5B0]/10 text-[#00D5B0]' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {currentUser && (
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-lg text-white text-lg hover:bg-[#00D5B0]/10 hover:text-[#00D5B0]"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar 