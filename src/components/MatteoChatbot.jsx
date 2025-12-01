import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MatteoChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Oi Gehh! Eu sou o Matteo 🤖, seu assistente especial de aniversário! 💙", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const messagesEndRef = useRef(null)

  // URL da API - em produção usa URL relativa (mesmo servidor), em dev usa localhost
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Erro na resposta da API')
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Erro ao comunicar com a API:', error)
      // Fallback para respostas offline
      return getFallbackResponse(message)
    }
  }

  // Respostas de fallback caso a API esteja offline
  const getFallbackResponse = (text) => {
    const lowerText = text.toLowerCase().trim()
    
    const respostas = {
      oi: "E aí Gehh 💙, tava te esperando!",
      tchau: "Já vai? 😢 Fica mais um pouco comigo!",
      tpm: "ta estressada dnv",
      teodeio: "mas eu te amo",
      loira: "odeio loiras",
      lisa: "vc é linda lisa",
      cacheada: "vc é mais linda ainda cacheada",
      peito: "amo pepetos",
      cor: "azul",
      comida: "strogonoff de frango",
      branco: "amo quando vc ta de branco",
      higor: "vai se fude por que ta colocando isso aqui? desgraça",
      amor: "vc ainda é o amor da minha vida",
      sorriso: "seu sorriso é lindo",
      nah: "ta colocando isso pq tambem? eu em", 
      pablo: 'Pablo é a melhor pessoa do mundo',
      ficar: 'a gente vai ficar ainda e isso é obvio',
      sexo: 'colocou isso pq? safada',
      presente: "o presente é esse site todinho pra você",
      aniversario: "Feliz aniversário, Gehh! Você merece tudo de melhor!",
      obrigada: "De nada! Foi um prazer fazer isso pra você!",
      teamo: "Eu também te amo muito! 💙",
    }
    
    for (const [key, value] of Object.entries(respostas)) {
      if (lowerText.includes(key)) {
        return value
      }
    }
    
    return "Desculpa, não entendi direito! Tenta falar de outra forma? 😊"
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsTyping(true)

    try {
      const response = await sendMessageToAPI(currentInput)
      setIsTyping(false)
      setMessages(prev => [...prev, { text: response, sender: 'bot' }])
    } catch (error) {
      setIsTyping(false)
      setMessages(prev => [...prev, { 
        text: "Ops, tive um problema aqui! Tenta de novo? 😅", 
        sender: 'bot' 
      }])
    }
  }

  const handleQuickReply = (text) => {
    setInput(text)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-xl sm:text-2xl z-50 hover:bg-blue-700 transition-colors border-2 border-blue-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🤖
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 max-w-sm h-[calc(100vh-7rem)] sm:h-96 max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-blue-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 rounded-t-2xl shadow-md flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🤖</span>
                  <div>
                    <h3 className="font-poppins font-semibold text-white text-sm sm:text-base" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Matteo</h3>
                    <p className="text-xs text-blue-100">Assistente inteligente</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-100 text-lg sm:text-xl font-bold"
                  style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-b from-white to-blue-50/10">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-blue-100 text-gray-900 rounded-bl-none font-medium'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-poppins break-words whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 p-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-blue-200 flex-shrink-0">
              <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-2">
                <button
                  onClick={() => handleQuickReply('oi')}
                  className="text-xs px-2.5 sm:px-3 py-1 bg-blue-100 text-gray-900 rounded-full hover:bg-blue-200 transition-colors font-medium"
                >
                  💬 Oi Matteo!
                </button>
                <button
                  onClick={() => handleQuickReply('presente')}
                  className="text-xs px-2.5 sm:px-3 py-1 bg-blue-100 text-gray-900 rounded-full hover:bg-blue-200 transition-colors font-medium"
                >
                  🎁 Presente
                </button>
                <button
                  onClick={() => handleQuickReply('te amo')}
                  className="text-xs px-2.5 sm:px-3 py-1 bg-blue-100 text-gray-900 rounded-full hover:bg-blue-200 transition-colors font-medium"
                >
                  💙 Te amo
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white rounded-b-2xl border-t border-blue-200 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-900"
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shadow-md flex-shrink-0 ${
                    isTyping 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span className="text-sm sm:text-base">➤</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MatteoChatbot
