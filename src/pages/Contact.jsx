import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branch: '',
    currentYear: '',
    domain: '',
    priorExperience: '',
    linkedin: '',
    github: '',
    questions: ''
  })

  const domains = [
    'Web Development',
    'Machine Learning',
    'UI/UX Designer',
    'Data Analytics'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Redirect to the Zoho form
    window.open('https://forms.zohopublic.in/saieshwarerelli10gm1/form/InternshipOpportunitiesatNIRVAHA/formperma/svJExoTEaaUdA3cO9RRE0B7GsuAbZOj1QB7LLAVavzc', '_blank')
  }

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover opportunities to grow with Nirvaha
          </p>
        </motion.div>

        {/* Internship Section */}
        <motion.div
          className="bg-dark-100 rounded-3xl p-12 mb-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl">🌟</div>
              <div>
                <h2 className="text-3xl font-bold text-white">Internship Opportunities</h2>
                <p className="text-gray-400">Risk Guard Enterprise x NIRVAHA is offering a 45-day internship</p>
              </div>
            </div>

            <div className="bg-dark-200 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">What We Offer:</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  Real-world experience
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  Official offer letter
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  Growth opportunities
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  45-day structured program
                </li>
              </ul>
            </div>

            <div className="bg-dark-200 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Available Domains:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {domains.map((domain, index) => (
                  <div 
                    key={index}
                    className="bg-dark-100 rounded-xl p-4 text-center text-gray-400"
                  >
                    {domain}
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleSubmit}
              className="w-full bg-primary text-dark-300 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply for Internship
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              icon: "📧",
              title: "Email",
              info: "soulverse23@gmail.com",
              link: "mailto:soulverse23@gmail.com"
            },
            {
              icon: "📱",
              title: "Phone",
              info: "+91 7780754541",
              link: "tel:+917780754541"
            },
            {
              icon: "📍",
              title: "Location",
              info: "Hyderabad, India",
              link: "#"
            }
          ].map((info, index) => (
            <motion.a
              key={index}
              href={info.link}
              className="bg-dark-100 rounded-2xl p-8 text-center hover:bg-dark-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
              <p className="text-gray-400">{info.info}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="bg-dark-100 rounded-3xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "What is the internship duration?",
                a: "The internship program runs for 45 days."
              },
              {
                q: "Is this a paid internship?",
                a: "Please check the detailed information in the application form for compensation details."
              },
              {
                q: "What are the eligibility criteria?",
                a: "We welcome students from various branches. Specific requirements are listed in the application form."
              },
              {
                q: "Will I receive a certificate?",
                a: "Yes, successful interns receive an official offer letter and completion certificate."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-primary/20 pb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact 