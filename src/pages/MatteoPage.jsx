import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// 🤖 Logo do Matteo
const MatteoFace = ({ className, mood = 'happy' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="25" width="60" height="50" rx="15" fill="currentColor" />
    <circle cx="38" cy="45" r="6" fill="white" />
    <circle cx="62" cy="45" r="6" fill="white" />
    {mood === 'happy' && (
      <path d="M40 60C40 60 45 65 50 65C55 65 60 60 60 60" stroke="white" strokeWidth="4" strokeLinecap="round" />
    )}
    {mood === 'thinking' && (
      <path d="M38 62H62" stroke="white" strokeWidth="4" strokeLinecap="round" />
    )}
    {mood === 'love' && (
      <path d="M40 58C40 58 45 68 50 68C55 68 60 58 60 58" stroke="white" strokeWidth="4" strokeLinecap="round" />
    )}
    <path d="M50 25V15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="12" r="5" fill={mood === 'thinking' ? '#FBBF24' : '#10B981'} className={mood === 'thinking' ? 'animate-pulse' : ''} />
  </svg>
)

// Ícones
const Icons = {
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
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
      <rect x="4" y="2" width="16" height="20" rx="2"></rect>
      <line x1="8" y1="6" x2="16" y2="6"></line>
      <line x1="8" y1="10" x2="8" y2="10"></line>
      <line x1="12" y1="10" x2="12" y2="10"></line>
      <line x1="16" y1="10" x2="16" y2="10"></line>
      <line x1="8" y1="14" x2="8" y2="14"></line>
      <line x1="12" y1="14" x2="12" y2="14"></line>
      <line x1="16" y1="14" x2="16" y2="14"></line>
      <line x1="8" y1="18" x2="8" y2="18"></line>
      <line x1="12" y1="18" x2="12" y2="18"></line>
      <line x1="16" y1="18" x2="16" y2="18"></line>
    </svg>
  ),
  Brain: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  )
}

const MatteoPage = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1,
      text: "Oi Gehh! 🤖💙\n\nSou o Matteo, sua IA pessoal! Fui criado pelo Pablo especialmente pra você.\n\nPosso fazer várias coisas:\n🔍 Pesquisar na internet\n🌤️ Ver o clima\n📅 Te contar a data/hora\n🧠 Lembrar das nossas conversas\n📝 Salvar recados no mural\n🔢 Fazer cálculos\n\nComo você tá hoje, princesa?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingStatus, setTypingStatus] = useState('')
  const [mood, setMood] = useState('happy')
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
      if (parsed.length > 0 && !currentConversationId) {
        // Criar nova conversa por padrão
        createNewConversation()
      }
    } else {
      createNewConversation()
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
    if (currentConversationId && messages.length > 1) {
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
      messages: [{
        id: 1,
        text: "Oi Gehh! 🤖💙 Como posso te ajudar hoje, princesa?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }],
      lastMessage: 'Nova conversa iniciada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setConversations(prev => [newConv, ...prev])
    setCurrentConversationId(newId)
    setSessionId(newSessionId)
    setMessages(newConv.messages)
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
      createNewConversation()
    }
  }

  const sendMessageToAPI = async (message) => {
    try {
      setMood('thinking')
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
      
      setMood(tpmMode ? 'love' : 'happy')
      return data.response
    } catch {
      setMood('happy')
      return "Minha conexão caiu rapidinho! Tenta de novo? ❤️"
    } finally {
      setTypingStatus('')
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
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

    // Atualizar título da conversa com a primeira mensagem
    if (messages.length <= 2) {
      const title = currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : '')
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId ? { ...conv, title } : conv
      ))
    }
  }

  const handleQuickAction = (action) => {
    const actions = {
      'search': 'Pesquisa sobre ',
      'weather': 'Como tá o clima em São Paulo?',
      'date': 'Que dia é hoje?',
      'calculate': 'Quanto é ',
      'memories': 'O que você lembra sobre mim?',
      'mural': 'O que tem no mural?'
    }
    setInput(actions[action] || '')
    inputRef.current?.focus()
  }

  const toggleTpmMode = () => {
    setTpmMode(!tpmMode)
    setMood(tpmMode ? 'happy' : 'love')
    
    const modeMessage = {
      id: Date.now(),
      text: tpmMode 
        ? "Modo normal ativado! Mas continuo aqui pra você, princesa 💙"
        : "🆘 MODO CARINHO ATIVADO! 🆘\n\nPrincesa, tô aqui pra você agora! Vou te dar todo carinho do mundo. Quer desabafar? Tô ouvindo... 💙🫂",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, modeMessage])
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

  return (
    <div className={`h-screen w-screen flex overflow-hidden transition-colors duration-500 ${tpmMode ? 'bg-gradient-to-br from-pink-100 via-pink-50 to-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-white'}`}>
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed lg:relative left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50 flex flex-col shadow-2xl lg:shadow-none"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-poppins font-bold text-gray-800 text-lg">Conversas</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Icons.Close />
                  </button>
                </div>
                
                <button
                  onClick={createNewConversation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all hover:-translate-y-0.5"
                >
                  <Icons.Plus />
                  Nova conversa
                </button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversations.map(conv => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => loadConversation(conv)}
                    className={`group p-3 rounded-2xl cursor-pointer transition-all ${
                      currentConversationId === conv.id 
                        ? 'bg-rose-50 border-2 border-rose-200' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate text-sm">{conv.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-400">{formatDate(conv.updatedAt)}</span>
                        <button
                          onClick={(e) => deleteConversation(conv.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {conversations.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Icons.Chat />
                    <p className="mt-2 text-sm">Nenhuma conversa ainda</p>
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200/50">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  <Icons.Home />
                  Voltar ao início
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        
        {/* Header */}
        <header className={`px-4 py-3 border-b backdrop-blur-xl transition-colors duration-500 ${tpmMode ? 'bg-pink-50/80 border-pink-200/50' : 'bg-white/80 border-gray-200/50'}`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Icons.Menu />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${tpmMode ? 'bg-pink-200' : 'bg-rose-100'}`}>
                    <MatteoFace className={`w-8 h-8 ${tpmMode ? 'text-pink-600' : 'text-rose-600'}`} mood={mood} />
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-[3px] border-white rounded-full transition-colors ${
                    mood === 'thinking' ? 'bg-yellow-400 animate-pulse' : tpmMode ? 'bg-pink-400' : 'bg-emerald-400'
                  }`}></span>
                </div>
                <div>
                  <h1 className="font-poppins font-bold text-gray-800 text-lg">Matteo</h1>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tpmMode ? 'text-pink-600 bg-pink-100' : 'text-rose-500 bg-rose-50'}`}>
                    {tpmMode ? '🫂 Modo Carinho' : '🤖 IA Completa'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={toggleTpmMode}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                tpmMode 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40' 
                  : 'hover:bg-pink-50 text-pink-400 hover:text-pink-600'
              }`}
              title={tpmMode ? "Desativar Modo Carinho" : "🆘 Modo Carinho (TPM)"}
            >
              <Icons.Heart />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] lg:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'bot' && (
                    <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${tpmMode ? 'bg-pink-100' : 'bg-rose-100'}`}>
                      <MatteoFace className={`w-5 h-5 ${tpmMode ? 'text-pink-600' : 'text-rose-600'}`} mood={mood} />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1">
                    <div
                      className={`p-4 rounded-3xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-br-lg shadow-lg shadow-rose-500/20'
                          : `${tpmMode ? 'bg-pink-50 border-pink-100' : 'bg-white border-gray-100'} text-gray-700 rounded-bl-lg border shadow-sm`
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-xs text-gray-400 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-end gap-2">
                  <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${tpmMode ? 'bg-pink-100' : 'bg-rose-100'}`}>
                    <MatteoFace className={`w-5 h-5 ${tpmMode ? 'text-pink-600' : 'text-rose-600'}`} mood="thinking" />
                  </div>
                  <div className={`p-4 rounded-3xl rounded-bl-lg border shadow-sm ${tpmMode ? 'bg-pink-50 border-pink-100' : 'bg-white border-gray-100'}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></span>
                        <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                      </div>
                      {typingStatus && (
                        <span className="text-xs text-gray-500">{typingStatus}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: 'search', icon: <Icons.Search />, label: 'Pesquisar' },
                { id: 'weather', icon: <Icons.Weather />, label: 'Clima' },
                { id: 'date', icon: <Icons.Calendar />, label: 'Data/Hora' },
                { id: 'calculate', icon: <Icons.Calculator />, label: 'Calcular' },
                { id: 'memories', icon: <Icons.Brain />, label: 'Memórias' },
                { id: 'mural', icon: <Icons.Clipboard />, label: 'Mural' },
              ].map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 text-sm font-medium rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <footer className={`px-4 py-4 border-t backdrop-blur-xl transition-colors duration-500 ${tpmMode ? 'bg-pink-50/80 border-pink-200/50' : 'bg-white/80 border-gray-200/50'}`}>
          <div className="max-w-4xl mx-auto">
            <div className={`flex items-end gap-3 p-2 rounded-3xl border shadow-sm transition-all duration-300 ${
              tpmMode ? 'bg-pink-50 border-pink-200 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100' : 'bg-white border-gray-200 focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-100'
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
                placeholder="Digite uma mensagem..."
                rows={1}
                className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[15px] resize-none max-h-32"
                style={{ minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-3 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                  input.trim()
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icons.Send />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Matteo pode cometer erros. Criado com 💙 pelo Pablo.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MatteoPage

