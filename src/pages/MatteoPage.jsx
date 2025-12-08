import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Flower from '../components/Flower'
import Petal from '../components/Petal'

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

  // Elementos decorativos
  const flowers = useMemo(() => [
    { id: 1, delay: 0.2, size: 35, x: 5, y: 10 },
    { id: 2, delay: 0.5, size: 40, x: 95, y: 15 },
    { id: 3, delay: 0.8, size: 30, x: 3, y: 85 },
    { id: 4, delay: 1.1, size: 38, x: 97, y: 80 },
  ], [])

  const petals = useMemo(() => 
    Array.from({ length: tpmMode ? 25 : 15 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
      left: Math.random() * 100,
    })), [tpmMode]
  )

  const particles = useMemo(() => 
    Array.from({ length: tpmMode ? 20 : 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: tpmMode 
        ? ['#FFB6C1', '#FFC0CB', '#FFD1DC', '#FFE4E1', '#FF69B4', '#FF1493'][Math.floor(Math.random() * 6)]
        : ['#5BA3D0', '#4A9BC8', '#6BA8D4', '#8B5CF6', '#A855F7', '#6366F1'][Math.floor(Math.random() * 6)]
    })), [tpmMode]
  )

  // Carregar conversas do banco de dados
  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/conversations`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      // Fallback para localStorage se API falhar
      const saved = localStorage.getItem('matteo_conversations')
      if (saved) {
        const parsed = JSON.parse(saved)
        setConversations(parsed)
      }
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  // Atualizar conversa atual quando mensagens mudam
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]?.text?.substring(0, 50) + '...'
      
      // Atualizar no banco
      fetch(`${API_URL}/api/conversations/${currentConversationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ last_message: lastMessage })
      }).catch(console.error)
      
      // Atualizar estado local
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages, 
              lastMessage,
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

  const createNewConversation = async () => {
    const newId = `conv_${Date.now()}`
    const newSessionId = `session_${Date.now()}`
    
    try {
      const response = await fetch(`${API_URL}/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newId,
          session_id: newSessionId,
          title: 'Nova conversa'
        })
      })
      
      if (response.ok) {
        const newConv = await response.json()
        setConversations(prev => [newConv, ...prev])
        setCurrentConversationId(newId)
        setSessionId(newSessionId)
        setMessages([])
        setSidebarOpen(false)
      } else {
        // Fallback local se API falhar
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
    } catch (error) {
      console.error('Erro ao criar conversa:', error)
      // Fallback local
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
  }

  const loadConversation = async (conv) => {
    try {
      // Buscar conversa completa com mensagens do banco
      const response = await fetch(`${API_URL}/api/conversations/${conv.id}`)
      if (response.ok) {
        const fullConv = await response.json()
        setCurrentConversationId(fullConv.id)
        setSessionId(fullConv.sessionId)
        setMessages(fullConv.messages || [])
      } else {
        // Fallback para dados locais
        setCurrentConversationId(conv.id)
        setSessionId(conv.sessionId)
        setMessages(conv.messages || [])
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error)
      // Fallback para dados locais
      setCurrentConversationId(conv.id)
      setSessionId(conv.sessionId)
      setMessages(conv.messages || [])
    }
    setSidebarOpen(false)
  }

  const deleteConversation = async (convId, e) => {
    e.stopPropagation()
    
    try {
      const response = await fetch(`${API_URL}/api/conversations/${convId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== convId))
        if (currentConversationId === convId) {
          setCurrentConversationId(null)
          setMessages([])
        }
      } else {
        // Fallback local se API falhar
        setConversations(prev => prev.filter(c => c.id !== convId))
        if (currentConversationId === convId) {
          setCurrentConversationId(null)
          setMessages([])
        }
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      // Fallback local
      setConversations(prev => prev.filter(c => c.id !== convId))
      if (currentConversationId === convId) {
        setCurrentConversationId(null)
        setMessages([])
      }
    }
  }

  const sendMessageToAPI = async (message) => {
    try {
      setTypingStatus('Pensando...')
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          session_id: sessionId, 
          conversation_id: currentConversationId,
          tpm_mode: tpmMode 
        })
      })
      
      if (!response.ok) throw new Error()
      const data = await response.json()
      
      // Atualizar conversation_id se foi criado
      if (data.conversation_id && !currentConversationId) {
        setCurrentConversationId(data.conversation_id)
      }
      
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
      const title = input.substring(0, 30) + (input.length > 30 ? '...' : '')
      
      try {
        const response = await fetch(`${API_URL}/api/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newId,
            session_id: newSessionId,
            title: title
          })
        })
        
        if (response.ok) {
          const newConv = await response.json()
          setConversations(prev => [newConv, ...prev])
          setCurrentConversationId(newId)
          setSessionId(newSessionId)
        } else {
          // Fallback local
          const newConv = {
            id: newId,
            sessionId: newSessionId,
            title: title,
            messages: [],
            lastMessage: input.substring(0, 50),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          setConversations(prev => [newConv, ...prev])
          setCurrentConversationId(newId)
          setSessionId(newSessionId)
        }
      } catch (error) {
        console.error('Erro ao criar conversa:', error)
        // Fallback local
        const newConv = {
          id: newId,
          sessionId: newSessionId,
          title: title,
          messages: [],
          lastMessage: input.substring(0, 50),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setConversations(prev => [newConv, ...prev])
        setCurrentConversationId(newId)
        setSessionId(newSessionId)
      }
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

    // Atualizar título da conversa se for a primeira mensagem
    if (messages.length === 0 && currentConversationId) {
      const title = currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : '')
      
      // Atualizar no banco
      fetch(`${API_URL}/api/conversations/${currentConversationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      }).catch(console.error)
      
      // Atualizar estado local
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
    <div className={`h-screen w-screen flex overflow-hidden transition-all duration-700 ${
      tpmMode 
        ? 'bg-gradient-to-br from-pink-100 via-rose-50 via-pink-50 to-rose-100' 
        : 'bg-gradient-to-br from-azul-claro via-violet-100 via-purple-50 to-azul-bebe'
    }`}>
      
      {/* Elementos decorativos */}
      {/* Pétalas caindo */}
      {petals.map((petal) => (
        <Petal key={petal.id} delay={petal.delay} left={petal.left} />
      ))}

      {/* Flores decorativas */}
      {flowers.map((flower) => (
        <Flower key={flower.id} delay={flower.delay} size={flower.size} x={flower.x} y={flower.y} />
      ))}

      {/* Partículas de brilho */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            boxShadow: `0 0 8px ${particle.color}80`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative left-0 top-0 h-full w-72 ${
        tpmMode 
          ? 'bg-gradient-to-b from-pink-200/90 via-rose-100/90 to-pink-200/90 backdrop-blur-xl border-r border-pink-300/50' 
          : 'bg-gradient-to-b from-violet-200/90 via-purple-100/90 to-indigo-200/90 backdrop-blur-xl border-r border-violet-300/50'
      } z-50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl`}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b ${tpmMode ? 'border-pink-300/50' : 'border-violet-300/50'}`}>
          <button
            onClick={createNewConversation}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${
              tpmMode
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white'
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white'
            } rounded-xl font-medium transition-all shadow-lg hover:shadow-xl`}
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
                    ? tpmMode 
                      ? 'bg-gradient-to-r from-pink-300/50 to-rose-300/50 shadow-md' 
                      : 'bg-gradient-to-r from-violet-300/50 to-purple-300/50 shadow-md'
                    : tpmMode
                      ? 'hover:bg-pink-200/50'
                      : 'hover:bg-violet-200/50'
                }`}
              >
                <Icons.Chat />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${tpmMode ? 'text-rose-900' : 'text-violet-900'}`}>{conv.title}</p>
                  <p className={`text-xs truncate ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}>{formatDate(conv.updatedAt)}</p>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                    tpmMode 
                      ? 'text-rose-400 hover:text-red-500 hover:bg-red-100/50' 
                      : 'text-violet-400 hover:text-red-500 hover:bg-red-100/50'
                  }`}
                >
                  <Icons.Trash />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${tpmMode ? 'border-pink-300/50' : 'border-violet-300/50'} space-y-2`}>
          <button
            onClick={toggleTpmMode}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              tpmMode 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-gradient-to-r from-pink-200 to-rose-200 hover:from-pink-300 hover:to-rose-300 text-rose-700 border border-rose-300'
            }`}
          >
            <Icons.Heart />
            {tpmMode ? 'Modo TPM Ativo' : 'Modo TPM'}
          </button>
          
          <button
            onClick={() => navigate('/presente')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
              tpmMode
                ? 'bg-pink-100 hover:bg-pink-200 text-rose-700 border border-pink-300'
                : 'bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-300'
            }`}
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
        <header className={`px-4 py-3 border-b backdrop-blur-xl flex items-center gap-4 transition-all duration-500 ${
          tpmMode 
            ? 'bg-gradient-to-r from-pink-200/80 via-rose-100/80 to-pink-200/80 border-pink-300/50' 
            : 'bg-gradient-to-r from-violet-200/80 via-purple-100/80 to-indigo-200/80 border-violet-300/50'
        }`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              tpmMode 
                ? 'hover:bg-pink-200 text-rose-700' 
                : 'hover:bg-violet-200 text-violet-700'
            }`}
          >
            {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
          
          <div className="flex items-center gap-3">
            <MatteoLogo size="sm" />
            <div>
              <h1 className={`font-semibold text-lg ${tpmMode ? 'text-rose-800' : 'text-violet-800'}`}>Matteo</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${tpmMode ? 'bg-pink-500' : 'bg-emerald-400'}`}></span>
                <span className={`text-xs ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}>
                  {tpmMode ? 'Modo Carinho Ativo' : 'Online'}
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
                
                <h2 className={`text-4xl font-bold mb-3 ${
                  tpmMode 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600'
                }`}>
                  Olá, Gehh! 💙
                </h2>
                <p className={`text-lg mb-8 ${
                  tpmMode 
                    ? 'text-rose-600' 
                    : 'text-violet-600'
                }`}>
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
                      className={`group flex items-center gap-3 p-4 rounded-2xl text-left transition-all backdrop-blur-sm border-2 ${
                        tpmMode
                          ? 'bg-gradient-to-br from-pink-50/80 to-rose-50/80 border-pink-200 hover:border-pink-400 hover:shadow-lg'
                          : `bg-gradient-to-br from-white/60 to-white/40 border-white/30 hover:border-white/50 hover:shadow-lg`
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${suggestion.color} text-white shadow-md`}>
                        {suggestion.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        tpmMode ? 'text-rose-800' : 'text-gray-700'
                      }`}>
                        {suggestion.text}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Capacidades */}
                <div className={`mt-8 flex flex-wrap justify-center gap-3 ${
                  tpmMode ? 'text-rose-500' : 'text-violet-500'
                }`}>
                  <span className={`flex items-center gap-1 text-xs bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                    tpmMode ? 'text-rose-600' : 'text-violet-600'
                  }`}>
                    <Icons.Globe /> Busca na Web
                  </span>
                  <span className={`flex items-center gap-1 text-xs bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                    tpmMode ? 'text-rose-600' : 'text-violet-600'
                  }`}>
                    <Icons.Weather /> Clima
                  </span>
                  <span className={`flex items-center gap-1 text-xs bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                    tpmMode ? 'text-rose-600' : 'text-violet-600'
                  }`}>
                    <Icons.Brain /> Memória
                  </span>
                  <span className={`flex items-center gap-1 text-xs bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                    tpmMode ? 'text-rose-600' : 'text-violet-600'
                  }`}>
                    <Icons.Calculator /> Cálculos
                  </span>
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
                    <div className={`inline-block p-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        : tpmMode 
                          ? 'bg-gradient-to-br from-pink-50 to-rose-50 text-gray-800 border-2 border-pink-200' 
                          : 'bg-gradient-to-br from-violet-50 to-purple-50 text-gray-800 border-2 border-violet-200'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs mt-1 ${tpmMode ? 'text-rose-500' : 'text-violet-500'}`}>
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
                  <div className={`p-4 rounded-2xl shadow-md ${
                    tpmMode 
                      ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200' 
                      : 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className={`w-2 h-2 rounded-full animate-bounce ${tpmMode ? 'bg-pink-400' : 'bg-violet-400'}`}></span>
                        <span className={`w-2 h-2 rounded-full animate-bounce ${tpmMode ? 'bg-pink-400' : 'bg-violet-400'}`} style={{animationDelay: '150ms'}}></span>
                        <span className={`w-2 h-2 rounded-full animate-bounce ${tpmMode ? 'bg-pink-400' : 'bg-violet-400'}`} style={{animationDelay: '300ms'}}></span>
                      </div>
                      {typingStatus && (
                        <span className={`text-sm ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}>{typingStatus}</span>
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
        <footer className={`px-4 py-4 border-t backdrop-blur-xl transition-all duration-500 ${
          tpmMode 
            ? 'bg-gradient-to-r from-pink-200/80 via-rose-100/80 to-pink-200/80 border-pink-300/50' 
            : 'bg-gradient-to-r from-violet-200/80 via-purple-100/80 to-indigo-200/80 border-violet-300/50'
        }`}>
          <div className="max-w-3xl mx-auto">
            <div className={`flex items-end gap-3 p-3 rounded-2xl border-2 transition-all backdrop-blur-sm ${
              tpmMode 
                ? 'bg-white/80 border-pink-300 focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-200/50' 
                : 'bg-white/80 border-violet-300 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-200/50'
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
                    ? tpmMode
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
                    : tpmMode ? 'bg-pink-100 text-pink-300' : 'bg-violet-100 text-violet-300'
                }`}
              >
                <Icons.Send />
              </button>
            </div>
            <p className={`text-center text-xs mt-3 ${
              tpmMode ? 'text-rose-500' : 'text-violet-500'
            }`}>
              Matteo pode cometer erros, igual a mim. Criado com 💙 pelo Pablo.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MatteoPage
