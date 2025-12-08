import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// 🤖 Logo do Matteo
const MatteoLogo = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  
  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="matteoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
        <rect x="20" y="25" width="60" height="50" rx="15" fill="url(#matteoGradient)" />
        <circle cx="38" cy="45" r="6" fill="white" />
        <circle cx="62" cy="45" r="6" fill="white" />
        <circle cx="40" cy="45" r="2" fill="#1a1a2e" />
        <circle cx="64" cy="45" r="2" fill="#1a1a2e" />
        <path d="M40 60C40 60 45 65 50 65C55 65 60 60 60 60" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 25V15" stroke="url(#matteoGradient)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="50" cy="12" r="5" fill="#10B981" />
      </svg>
    </div>
  )
}

// Ícones
const Icons = {
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Weather: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Calculator: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/><line x1="16" y1="18" x2="16" y2="18.01"/>
    </svg>
  ),
  Brain: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  ),
  Clipboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Sparkles: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

const MatteoPage = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingStatus, setTypingStatus] = useState('')
  const [tpmMode, setTpmMode] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [sessionId, setSessionId] = useState(() => `session_${Date.now()}`)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

  // Carregar conversas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('matteo_conversations')
    if (saved) {
      const parsed = JSON.parse(saved)
      setConversations(parsed)
    }
  }, [])

  // Salvar conversas no localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('matteo_conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  // Atualizar conversa atual quando mensagens mudam
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages, 
              lastMessage: messages[messages.length - 1]?.text?.substring(0, 50) + '...',
              updatedAt: new Date().toISOString()
            }
          : conv
      ))
    }
  }, [messages, currentConversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => scrollToBottom(), [messages])

  const createNewConversation = () => {
    const newId = `conv_${Date.now()}`
    const newSessionId = `session_${Date.now()}`
    const newConv = {
      id: newId,
      sessionId: newSessionId,
      title: 'Nova conversa',
      messages: [],
      lastMessage: 'Nova conversa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setConversations(prev => [newConv, ...prev])
    setCurrentConversationId(newId)
    setSessionId(newSessionId)
    setMessages([])
    setSidebarOpen(false)
  }

  const loadConversation = (conv) => {
    setCurrentConversationId(conv.id)
    setSessionId(conv.sessionId)
    setMessages(conv.messages || [])
    setSidebarOpen(false)
  }

  const deleteConversation = (convId, e) => {
    e.stopPropagation()
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (currentConversationId === convId) {
      setCurrentConversationId(null)
      setMessages([])
    }
  }

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
          'search_web': '🔍 Pesquisando na web...',
          'get_weather': '🌤️ Verificando clima...',
          'get_current_datetime': '📅 Verificando data/hora...',
          'search_memories': '🧠 Buscando memórias...',
          'save_to_mural': '📝 Salvando no mural...',
          'read_mural': '📋 Lendo mural...',
          'calculate': '🔢 Calculando...'
        }
        for (const tool of data.tools_used) {
          setTypingStatus(toolNames[tool] || tool)
          await new Promise(r => setTimeout(r, 800))
        }
      }
      
      return data.response
    } catch {
      return "Minha conexão caiu rapidinho! Tenta de novo? ❤️"
    } finally {
      setTypingStatus('')
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    // Criar conversa se não existir
    if (!currentConversationId) {
      const newId = `conv_${Date.now()}`
      const newSessionId = `session_${Date.now()}`
      const newConv = {
        id: newId,
        sessionId: newSessionId,
        title: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [],
        lastMessage: input.substring(0, 50),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setConversations(prev => [newConv, ...prev])
      setCurrentConversationId(newId)
      setSessionId(newSessionId)
    }
    
    const currentInput = input
    setInput('')
    
    const userMessage = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    const response = await sendMessageToAPI(currentInput)
    
    const botMessage = {
      id: Date.now() + 1,
      text: response,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
    
    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])

    // Atualizar título da conversa
    if (messages.length === 0) {
      const title = currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : '')
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId ? { ...conv, title } : conv
      ))
    }
  }

  const handleSuggestion = (text) => {
    setInput(text)
    inputRef.current?.focus()
  }

  const toggleTpmMode = () => {
    setTpmMode(!tpmMode)
    
    if (!tpmMode) {
      const modeMessage = {
        id: Date.now(),
        text: "🆘 MODO CARINHO ATIVADO! 🆘\n\nPrincesa, tô aqui pra você agora! Vou te dar todo carinho do mundo. Quer desabafar? Tô ouvindo... 💙🫂",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, modeMessage])
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Hoje'
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem'
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  // Sugestões iniciais
  const suggestions = [
    { icon: <Icons.Globe />, text: "Pesquisa sobre Taylor Swift", color: "from-blue-500 to-cyan-500" },
    { icon: <Icons.Weather />, text: "Como tá o clima em São Paulo?", color: "from-amber-500 to-orange-500" },
    { icon: <Icons.Brain />, text: "O que você lembra sobre mim?", color: "from-purple-500 to-pink-500" },
    { icon: <Icons.Calculator />, text: "Quanto é 15% de 350?", color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className={`h-screen w-screen flex overflow-hidden transition-colors duration-500 ${tpmMode ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100' : 'bg-[#0f0f0f]'}`}>
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative left-0 top-0 h-full w-72 bg-[#171717] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10 hover:border-white/20"
          >
            <Icons.Plus />
            Nova conversa
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {conversations.map(conv => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => loadConversation(conv)}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  currentConversationId === conv.id 
                    ? 'bg-white/10' 
                    : 'hover:bg-white/5'
                }`}
              >
                <Icons.Chat />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 truncate">{conv.title}</p>
                  <p className="text-xs text-white/40 truncate">{formatDate(conv.updatedAt)}</p>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Icons.Trash />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={toggleTpmMode}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              tpmMode 
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Icons.Heart />
            {tpmMode ? 'Modo Carinho Ativo' : 'Modo Carinho'}
          </button>
          
          <button
            onClick={() => navigate('/presente')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all border border-white/10"
          >
            <Icons.Home />
            Voltar ao início
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        
        {/* Header */}
        <header className={`px-4 py-3 border-b flex items-center gap-4 ${tpmMode ? 'bg-pink-50/80 border-pink-200' : 'bg-[#171717] border-white/10'}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${tpmMode ? 'hover:bg-pink-100 text-pink-600' : 'hover:bg-white/10 text-white'}`}
          >
            {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
          
          <div className="flex items-center gap-3">
            <MatteoLogo size="sm" />
            <div>
              <h1 className={`font-semibold ${tpmMode ? 'text-pink-800' : 'text-white'}`}>Matteo</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${tpmMode ? 'bg-pink-400' : 'bg-emerald-400'}`}></span>
                <span className={`text-xs ${tpmMode ? 'text-pink-600' : 'text-white/50'}`}>
                  {tpmMode ? 'Modo Carinho' : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            // Tela inicial - estilo ChatGPT/Gemini
            <div className="h-full flex flex-col items-center justify-center px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
              >
                <MatteoLogo size="xl" className="mx-auto mb-6" />
                
                <h2 className={`text-3xl font-bold mb-2 ${tpmMode ? 'text-pink-800' : 'text-white'}`}>
                  Olá, Gehh! 💙
                </h2>
                <p className={`text-lg mb-8 ${tpmMode ? 'text-pink-600' : 'text-white/50'}`}>
                  Sou o Matteo, sua IA pessoal. Como posso te ajudar hoje?
                </p>

                {/* Sugestões */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {suggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSuggestion(suggestion.text)}
                      className={`group flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${
                        tpmMode 
                          ? 'bg-white/80 hover:bg-white border border-pink-200 hover:border-pink-300' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${suggestion.color} text-white`}>
                        {suggestion.icon}
                      </div>
                      <span className={`text-sm ${tpmMode ? 'text-gray-700' : 'text-white/80'}`}>
                        {suggestion.text}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Capacidades */}
                <div className={`mt-8 flex flex-wrap justify-center gap-2 ${tpmMode ? 'text-pink-500' : 'text-white/40'}`}>
                  <span className="flex items-center gap-1 text-xs"><Icons.Globe /> Busca na Web</span>
                  <span className="text-xs">•</span>
                  <span className="flex items-center gap-1 text-xs"><Icons.Weather /> Clima</span>
                  <span className="text-xs">•</span>
                  <span className="flex items-center gap-1 text-xs"><Icons.Brain /> Memória</span>
                  <span className="text-xs">•</span>
                  <span className="flex items-center gap-1 text-xs"><Icons.Calculator /> Cálculos</span>
                </div>
              </motion.div>
            </div>
          ) : (
            // Lista de mensagens
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : tpmMode ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-violet-500 to-purple-600'
                  }`}>
                    {msg.sender === 'user' ? (
                      <span className="text-white text-sm font-medium">G</span>
                    ) : (
                      <MatteoLogo size="sm" className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className={`flex-1 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        : tpmMode 
                          ? 'bg-pink-100 text-gray-800' 
                          : 'bg-white/10 text-white/90'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs mt-1 ${tpmMode ? 'text-pink-400' : 'text-white/30'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${tpmMode ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                    <MatteoLogo size="sm" className="w-5 h-5" />
                  </div>
                  <div className={`p-4 rounded-2xl ${tpmMode ? 'bg-pink-100' : 'bg-white/10'}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className={`w-2 h-2 rounded-full animate-bounce ${tpmMode ? 'bg-pink-400' : 'bg-violet-400'}`}></span>
                        <span className={`w-2 h-2 rounded-full animate-bounce ${tpmMode ? 'bg-pink-400' : 'bg-violet-400'}`} style={{animationDelay: '150ms'}}></span>
                        <span className={`w-2 h-2 rounded-full animate-bounce ${tpmMode ? 'bg-pink-400' : 'bg-violet-400'}`} style={{animationDelay: '300ms'}}></span>
                      </div>
                      {typingStatus && (
                        <span className={`text-sm ${tpmMode ? 'text-pink-600' : 'text-white/50'}`}>{typingStatus}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className={`px-4 py-4 border-t ${tpmMode ? 'bg-pink-50/80 border-pink-200' : 'bg-[#171717] border-white/10'}`}>
          <div className="max-w-3xl mx-auto">
            <div className={`flex items-end gap-3 p-3 rounded-2xl border transition-all ${
              tpmMode 
                ? 'bg-white border-pink-200 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-200' 
                : 'bg-white/5 border-white/10 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20'
            }`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Pergunte qualquer coisa..."
                rows={1}
                className={`flex-1 px-2 py-2 bg-transparent outline-none text-[15px] resize-none max-h-32 ${
                  tpmMode ? 'text-gray-800 placeholder-gray-400' : 'text-white placeholder-white/40'
                }`}
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  input.trim()
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
                    : tpmMode ? 'bg-pink-100 text-pink-300' : 'bg-white/5 text-white/20'
                }`}
              >
                <Icons.Send />
              </button>
            </div>
            <p className={`text-center text-xs mt-3 ${tpmMode ? 'text-pink-400' : 'text-white/30'}`}>
              Matteo pode cometer erros. Criado com 💙 pelo Pablo.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MatteoPage
