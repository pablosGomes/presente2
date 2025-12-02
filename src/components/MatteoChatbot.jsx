import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Logo Premium Minimalista
const MatteoLogo = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" rx="30" fill="currentColor" />
    <path d="M30 65V35L50 55L70 35V65" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MatteoChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Oi Gehh! Sou o Matteo. Como você tá hoje, princesa? ❤️", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const messagesEndRef = useRef(null)

  const PUBLIC_VAPID_KEY = "BNk4aicprxA7dA5JE-_fOb2Cb-T4Wm-0fB4CuU5eYlw8yMuqwkTEjJPrbD-Zs0fU2i9B_Zo76yqvxyQlSl4UV68"
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          if (Notification.permission === 'granted') subscribeUserToPush()
        })
        .catch(console.error);
    }
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  const askPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') subscribeUserToPush();
  }

  const subscribeUserToPush = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });
      
      await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub })
      });
    } catch (e) {
      console.error('Erro Push:', e);
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => scrollToBottom(), [messages])

  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId })
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      return data.response
    } catch {
      return "Minha conexão caiu rapidinho! Tenta de novo? ❤️"
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const currentInput = input
    setInput('')
    setMessages(prev => [...prev, { text: currentInput, sender: 'user' }])
    setIsTyping(true)

    const response = await sendMessageToAPI(currentInput)
    setIsTyping(false)
    setMessages(prev => [...prev, { text: response, sender: 'bot' }])
  }

  const handleQuickReply = (text) => {
    setInput(text)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <>
      {/* Botão Flutuante Premium */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-[24px] shadow-lg shadow-rose-500/40 flex items-center justify-center text-white z-50 hover:scale-105 transition-transform backdrop-blur-sm border border-white/10"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <MatteoLogo className="w-8 h-8 text-white/90" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[380px] h-[600px] max-h-[85vh] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-black/5 flex flex-col z-50 overflow-hidden border border-white/50 ring-1 ring-black/5"
          >
            {/* Header Glass */}
            <div className="bg-white/40 backdrop-blur-md p-5 flex items-center justify-between border-b border-white/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MatteoLogo className="w-12 h-12 text-rose-500" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-[3px] border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-gray-800 text-lg tracking-tight">Matteo</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">IA Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => askPermission()}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-gray-400 hover:text-rose-500"
                title="Ativar Notificações"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-transparent to-white/40 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 px-5 rounded-[24px] text-[15px] leading-relaxed shadow-sm relative ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-br-sm shadow-rose-500/20'
                        : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 px-5 rounded-[24px] rounded-bl-sm border border-gray-100/50 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area Premium */}
            <div className="p-4 bg-white/60 backdrop-blur-xl border-t border-white/50">
              {/* Chips */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1 px-1">
                {['👋 Oi Matteo!', '🎁 Presente', '❤️ Te amo'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => handleQuickReply(t)}
                    className="whitespace-nowrap px-4 py-1.5 bg-white/80 hover:bg-white text-gray-600 hover:text-rose-600 text-xs font-medium rounded-full border border-gray-200/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-white p-2 pr-2 rounded-[24px] shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 focus-within:border-rose-200 focus-within:ring-4 focus-within:ring-rose-50 transition-all duration-300">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    input.trim() 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 rotate-0 hover:scale-105' 
                      : 'bg-gray-100 text-gray-300 rotate-90 cursor-not-allowed'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
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
