import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// 🤖 NOVO LOGO: Rosto do Matteo (Robô Minimalista)
const MatteoFace = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cabeça */}
    <rect x="20" y="25" width="60" height="50" rx="15" fill="currentColor" />
    {/* Olhos */}
    <circle cx="38" cy="45" r="6" fill="white" />
    <circle cx="62" cy="45" r="6" fill="white" />
    {/* Boca (Sorriso) */}
    <path d="M40 60C40 60 45 65 50 65C55 65 60 60 60 60" stroke="white" strokeWidth="4" strokeLinecap="round" />
    {/* Antena */}
    <path d="M50 25V15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="12" r="5" fill="#10B981" /> 
  </svg>
)

const MatteoChatbot = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Oi Gehh! Sou o Matteo, sua IA pessoal! 🤖💙\n\nPosso pesquisar coisas na internet, ver o clima, fazer cálculos e muito mais! Como você tá hoje, princesa?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingStatus, setTypingStatus] = useState('')
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const [tpmMode, setTpmMode] = useState(false)
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
      setTypingStatus('Pensando...')
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId, tpm_mode: tpmMode })
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      
      // Mostrar ferramentas usadas
      if (data.tools_used && data.tools_used.length > 0) {
        const toolNames = {
          'search_web': '🔍 Pesquisando na web',
          'get_weather': '🌤️ Verificando clima',
          'get_current_datetime': '📅 Verificando data/hora',
          'search_memories': '🧠 Buscando memórias',
          'save_to_mural': '📝 Salvando no mural',
          'read_mural': '📋 Lendo mural',
          'calculate': '🔢 Calculando'
        }
        const toolsText = data.tools_used.map(t => toolNames[t] || t).join(', ')
        setTypingStatus(toolsText)
        await new Promise(r => setTimeout(r, 500))
      }
      
      return data.response
    } catch {
      return "Minha conexão caiu rapidinho! Tenta de novo? ❤️"
    } finally {
      setTypingStatus('')
    }
  }

  const activateTpmMode = () => {
    setTpmMode(true)
    setMessages(prev => [...prev, { 
      text: "🆘 MODO TPM ATIVADO! 🆘\n\nPrincesa, tô aqui pra você agora! Vou te dar todo carinho do mundo. Quer desabafar? Tô ouvindo... 💙🫂", 
      sender: 'bot' 
    }])
  }

  const deactivateTpmMode = () => {
    setTpmMode(false)
    setMessages(prev => [...prev, { 
      text: "Modo normal ativado! Mas continuo aqui pra você, princesa 💙", 
      sender: 'bot' 
    }])
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
      {/* Botão Flutuante (Corrigido e Novo Ícone) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-full shadow-lg shadow-rose-500/40 flex items-center justify-center text-white z-50 hover:scale-105 transition-transform backdrop-blur-sm border border-white/20"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {isOpen ? (
          // Ícone de Fechar (X arredondado)
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Novo Ícone do Matteo
          <MatteoFace className="w-9 h-9 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[380px] h-[600px] max-h-[85vh] bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl shadow-black/10 flex flex-col z-50 overflow-hidden border border-white/50 ring-1 ring-black/5"
          >
            {/* Header Glass */}
            <div className={`backdrop-blur-md p-5 flex items-center justify-between border-b border-white/20 transition-all duration-500 ${tpmMode ? 'bg-pink-100/80' : 'bg-white/50'}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${tpmMode ? 'bg-pink-200 animate-pulse' : 'bg-rose-100'}`}>
                    <MatteoFace className={`w-8 h-8 transition-colors duration-500 ${tpmMode ? 'text-pink-600' : 'text-rose-600'}`} />
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-[3px] border-white rounded-full transition-colors duration-500 ${tpmMode ? 'bg-pink-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-gray-800 text-lg tracking-tight">Matteo</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-500 ${tpmMode ? 'text-pink-600 bg-pink-100 animate-pulse' : 'text-rose-500 bg-rose-50'}`}>
                      {tpmMode ? '🫂 Modo Carinho' : '🤖 IA Completa'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Botão de Emergência TPM */}
                <button 
                  onClick={() => tpmMode ? deactivateTpmMode() : activateTpmMode()}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    tpmMode 
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40 animate-pulse hover:bg-pink-600' 
                      : 'hover:bg-pink-50 text-pink-400 hover:text-pink-600'
                  }`}
                  title={tpmMode ? "Desativar Modo TPM" : "🆘 Botão de Emergência - Modo TPM"}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    {tpmMode && <path d="M12 8v4M12 16h.01"/>}
                  </svg>
                </button>

                <button 
                  onClick={() => askPermission()}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors text-rose-400 hover:text-rose-600"
                  title="Ativar Notificações"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </button>

                {/* Botão para abrir tela completa */}
                <button 
                  onClick={() => navigate('/matteo')}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors text-blue-400 hover:text-blue-600"
                  title="Abrir tela completa"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
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
                        : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 px-5 rounded-[24px] rounded-bl-sm border border-gray-100 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '75ms'}}></span>
                        <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                      </div>
                      {typingStatus && (
                        <span className="text-xs text-gray-500 animate-pulse">{typingStatus}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area Premium */}
            <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/50">
              {/* Chips */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1 px-1">
                {[
                  '👋 Oi Matteo!', 
                  '🌤️ Como tá o clima?', 
                  '🔍 Pesquisa algo',
                  '❤️ Te amo',
                  '📅 Que dia é hoje?'
                ].map(t => (
                  <button 
                    key={t} 
                    onClick={() => handleQuickReply(t)}
                    className="whitespace-nowrap px-4 py-1.5 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 text-xs font-medium rounded-full border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-white p-1.5 pr-1.5 rounded-[24px] shadow-sm border border-gray-200 focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-100 transition-all duration-300">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 min-w-0 px-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`w-10 h-10 min-w-[40px] flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    input.trim() 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-100' 
                      : 'bg-gray-100 text-gray-400 scale-95'
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={input.trim() ? 'translate-x-0.5 translate-y-0.5' : ''}>
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
