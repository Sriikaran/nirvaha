import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const DivineChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  const messagesEndRef = useRef(null)
  const websocketRef = useRef(null)
  const chatId = useRef(crypto.randomUUID())

  // Add initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        text: "Namaste! I am your spiritual guide. How may I assist you on your journey today?",
        isBot: true
      }
    ])
  }, [])

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

  const handleVoiceInput = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // WebSocket connection
  const connectWebSocket = (message) => {
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
          systemPrompt: "You are a spiritual guide providing wisdom and guidance. Focus on meditation, mindfulness, and inner peace. Maintain a compassionate and enlightening tone.",
          message: message,
        })
      )
    })

    websocketRef.current.onmessage = (event) => {
      console.log("Received message:", event.data);
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'error') {
          setIsTyping(false);
          addMessage("I apologize, but I'm having trouble connecting. Please try again in a moment.", true);
          return;
        }
    
        if (data.message || data.content) {
          setIsTyping(false);
    
          setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
    
            if (lastMessage && lastMessage.isBot) {
              return [
                ...prevMessages.slice(0, -1),
                { ...lastMessage, text: lastMessage.text + " " + (data.message || data.content) }
              ];
            } else {
              return [...prevMessages, { id: prevMessages.length + 1, text: data.message || data.content, isBot: true }];
            }
          });
        }
      } catch (e) {
        if (event.data !== '[DONE]') {
          setIsTyping(false);
    
          setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
    
            if (lastMessage && lastMessage.isBot) {
              return [
                ...prevMessages.slice(0, -1),
                { ...lastMessage, text: lastMessage.text + " " + event.data }
              ];
            } else {
              return [...prevMessages, { id: prevMessages.length + 1, text: event.data, isBot: true }];
            }
          });
        }
      }
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsTyping(false)
      addMessage("I apologize, but I'm having trouble connecting. Please try again in a moment.", true)
    }

    websocketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed", event.code)
      setIsTyping(false)
      if (event.code !== 1000) {
        addMessage("The connection was interrupted. Please try again.", true)
      }
    }

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    addMessage(inputMessage, false)
    setInputMessage('')
    connectWebSocket(inputMessage)
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
          className="w-full h-full object-cover opacity-20"
        >
          <source 
            src=".\videos\meditation-bg.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-dark-300/90" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
            Zen Chat 
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ZenChat is an AI assistant offering calm, insightful, and supportive conversations. Share your thoughts, seek guidance, and find peace within.
          </p>
        </motion.div>

        {/* Chat Interface */}
        <div className="bg-dark-100/80 backdrop-blur-lg rounded-3xl p-8 border border-primary/20 shadow-xl">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto mb-8 space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  message.isBot 
                    ? 'bg-primary/30 text-white' 
                    : 'bg-primary text-dark-300'
                }`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-primary/30 text-white rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "How can I find inner peace?",
              "What is meditation?",
              "How to handle stress?",
              "Guide me to mindfulness"
            ].map((response, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className="px-4 py-2 bg-primary/30 text-white rounded-full hover:bg-primary/40 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {response}
              </motion.button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleVoiceInput}
              className="p-3 rounded-full bg-primary/30 text-white hover:bg-primary/40 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </motion.button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              placeholder="Type your message..."
              className="flex-1 bg-dark-200/80 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
            <motion.button
              onClick={handleSubmit}
              className="p-3 rounded-full bg-primary text-dark-300 hover:bg-primary/90 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DivineChat







