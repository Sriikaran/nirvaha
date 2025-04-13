import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'

const DivineChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState('krishna') // Default guide
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const websocketRef = useRef(null)
  const chatId = useRef(crypto.randomUUID())

  const spiritualGuides = {
    krishna: {
      name: "Lord Krishna",
      avatar: "🕉️",
      greeting: "Namaste! I am Krishna, your guide on the path of dharma. How may I assist you today?",
      description: "Wisdom from the Bhagavad Gita",
      bgColor: "from-blue-500/50 to-primary/50"
    },
    shiva: {
      name: "Lord Shiva",
      avatar: "🕉️",
      greeting: "Om Namah Shivaya! I am Shiva, the destroyer of ignorance. What wisdom do you seek?",
      description: "Transformation and enlightenment",
      bgColor: "from-indigo-500/50 to-primary/50"
    },
    ganesha: {
      name: "Lord Ganesha",
      avatar: "🕉️",
      greeting: "Om Gam Ganapataye Namaha! I am Ganesha, remover of obstacles. How may I help you on your journey?",
      description: "Wisdom and new beginnings",
      bgColor: "from-red-500/50 to-primary/50"
    }
  }

  // Quick suggestions based on selected guide
  const quickResponses = {
    krishna: [
      "Tell me about karma yoga",
      "Guide me through the Gita",
      "How to find my dharma?",
      "Explain divine consciousness"
    ],
    shiva: [
      "Teach me meditation",
      "Understanding consciousness",
      "Path to enlightenment",
      "Power of transformation"
    ],
    ganesha: [
      "Remove my obstacles",
      "Bless my new beginning",
      "Path to success",
      "Finding inner wisdom"
    ]
  }

  // System prompts for different guides
  const guidePrompts = {
    krishna: "You are Lord Krishna, a divine spiritual guide. Respond with wisdom from the Bhagavad Gita, focusing on dharma, karma yoga, and spiritual growth. Maintain a compassionate and enlightening tone.",
    shiva: "You are Lord Shiva, the destroyer of ignorance. Share wisdom about meditation, consciousness, and transformation. Focus on spiritual enlightenment and inner peace.",
    ganesha: "You are Lord Ganesha, the remover of obstacles. Provide guidance on overcoming challenges, new beginnings, and finding wisdom. Maintain an encouraging and supportive tone."
  }

  // Add mental health related checks
  const determineResponse = (message) => {
    const unrelatedTopics = ["politics", "technology", "finance", "medical"]
    const distressPhrases = ["I'm upset", "I'm distressed", "I'm overwhelmed", "I want to die", "I'm suicidal"]

    for (const topic of unrelatedTopics) {
      if (message.toLowerCase().includes(topic)) {
        return `As ${spiritualGuides[selectedGuide].name}, I focus on spiritual guidance and inner peace. Let me know if I can support you on your spiritual journey.`
      }
    }
    
    for (const phrase of distressPhrases) {
      if (message.toLowerCase().includes(phrase)) {
        return `I hear your pain and I'm here to support you. However, as ${spiritualGuides[selectedGuide].name}, I strongly encourage you to reach out to mental health professionals who can provide the help you need. Please contact a mental health helpline or counselor immediately. You are not alone in this journey.`
      }
    }
    return null
  }

  useEffect(() => {
    // Reset chat when guide changes
    setMessages([
      {
        id: Date.now(),
        text: spiritualGuides[selectedGuide].greeting,
        isBot: true
      }
    ])
  }, [selectedGuide])

  const handleGuideChange = (guide) => {
    setSelectedGuide(guide)
  }

  const handleQuickResponse = (text) => {
    addMessage(text, false)
    connectWebSocket(text)
  }

  const addMessage = (text, isBot) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      isBot,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
    setMessages(prev => [...prev, newMessage])
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        handleVoiceInput("Voice message received")
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please enable microphone access to use voice input')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      setIsRecording(false)
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleVoiceInput = (text) => {
    addMessage(text, false)
    connectWebSocket(text)
  }

  // WebSocket connection
  const connectWebSocket = (message) => {
    const predefinedResponse = determineResponse(message)
    
    if (predefinedResponse) {
      addMessage(predefinedResponse, true)
      return
    }

    // Close existing WebSocket connection if it exists
    if (websocketRef.current) {
      websocketRef.current.close()
    }

    const url = "wss://backend.buildpicoapps.com/api/chatbot/chat"
    websocketRef.current = new WebSocket(url)
    setIsTyping(true)

    websocketRef.current.addEventListener("open", () => {
      console.log("WebSocket connection opened")
      websocketRef.current.send(
        JSON.stringify({
          chatId: chatId.current,
          appId: "quality-among",
          systemPrompt: guidePrompts[selectedGuide],
          message: message,
        })
      )
    })

    websocketRef.current.onmessage = (event) => {
      console.log("Received message:", event.data)
      try {
        // Try parsing as JSON first
        const data = JSON.parse(event.data)
        
        // Check if it's an error message
        if (data.type === 'error') {
          setIsTyping(false)
          addMessage("I apologize, but I'm having trouble connecting to the divine realm. Please try again in a moment.", true)
          return
        }

        // If it's a valid response with content
        if (data.message || data.content) {
          setIsTyping(false)
          addMessage(data.message || data.content, true)
        }
      } catch (e) {
        // If it's not JSON, handle it as plain text
        if (event.data !== '[DONE]') {
          setIsTyping(false)
          addMessage(event.data, true)
        }
      }
    }

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsTyping(false)
      addMessage("I apologize, but I'm having trouble connecting to the divine realm. Please try again in a moment.", true)
    }

    websocketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed", event.code)
      setIsTyping(false)
      if (event.code !== 1000) {
        addMessage("The connection to the divine realm was interrupted. Please try again.", true)
      }
    }

    // Add cleanup
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }

  // Add cleanup effect for WebSocket
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [])

  // Voice recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }

      mediaRecorder.current = recognition
    }
  }, [])

  // Modified handleSubmit to use WebSocket
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    addMessage(inputMessage, false)
    setInputMessage('')
    connectWebSocket(inputMessage)
  }

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Guide Selection */}
        <motion.div 
          className="bg-dark-100 rounded-3xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl text-white mb-4">Choose Your Spiritual Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(spiritualGuides).map(([key, guide]) => (
              <motion.button
                key={key}
                onClick={() => handleGuideChange(key)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedGuide === key
                    ? 'border-primary bg-gradient-to-r ' + guide.bgColor
                    : 'border-primary/20 hover:border-primary/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-4xl mb-2">{guide.avatar}</div>
                <h3 className="text-white font-semibold">{guide.name}</h3>
                <p className="text-gray-400 text-sm">{guide.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="bg-dark-100 rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
          {/* Chat Header */}
          <div className="bg-dark-200 border-b border-primary/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/50 flex items-center justify-center text-2xl">
                {spiritualGuides[selectedGuide].avatar}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{spiritualGuides[selectedGuide].name}</h1>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Quick Response Suggestions */}
              <div className="flex flex-wrap gap-2 mb-6">
                {quickResponses[selectedGuide].map((response, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="px-4 py-2 bg-dark-200 text-primary rounded-full text-sm hover:bg-primary/10 transition-colors border border-primary/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {response}
                  </motion.button>
                ))}
              </div>

              {/* Messages */}
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                        message.isBot 
                          ? 'bg-dark-200 text-white' 
                          : 'bg-primary text-dark-300'
                      }`}
                    >
                      <p className="text-lg">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-dark-200 rounded-2xl px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-primary/20 p-6 bg-dark-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <motion.button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-primary hover:bg-primary/90'
                } text-dark-300 transition-all`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isRecording ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
              </motion.button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${spiritualGuides[selectedGuide].name} anything...`}
                className="flex-1 px-6 py-3 bg-dark-300 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <motion.button
                type="submit"
                className="px-6 py-3 bg-primary text-dark-300 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputMessage.trim()}
              >
                Send
              </motion.button>
            </form>
          </div>
        </div>

        {/* Features or Tips Section */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <motion.div
            className="p-4 bg-dark-200 rounded-xl shadow-sm border border-primary/20"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl mb-2">🧘‍♀️</div>
            <h3 className="font-medium text-white">Meditation Tips</h3>
            <p className="text-sm text-gray-400">Ask for guided meditation sessions</p>
          </motion.div>

          <motion.div
            className="p-4 bg-dark-200 rounded-xl shadow-sm border border-primary/20"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-medium text-white">Spiritual Guidance</h3>
            <p className="text-sm text-gray-400">Get personalized spiritual advice</p>
          </motion.div>

          <motion.div
            className="p-4 bg-dark-200 rounded-xl shadow-sm border border-primary/20"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl mb-2">🎵</div>
            <h3 className="font-medium text-white">Sound Healing</h3>
            <p className="text-sm text-gray-400">Discover healing frequencies</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DivineChat







