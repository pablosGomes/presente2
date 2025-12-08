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

// Ícones melhorados com gradientes, animações e efeitos visuais
const Icons = {
  Send: () => (
    <motion.svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
    >
      <defs>
        <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
      </defs>
      <path 
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
        stroke="url(#sendGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </motion.svg>
  ),
  Menu: () => (
    <motion.svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <defs>
        <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <line x1="3" y1="12" x2="21" y2="12" stroke="url(#menuGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke="url(#menuGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="url(#menuGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    </motion.svg>
  ),
  Close: () => (
    <motion.svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
    >
      <defs>
        <linearGradient id="closeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>
      </defs>
      <line x1="18" y1="6" x2="6" y2="18" stroke="url(#closeGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="url(#closeGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    </motion.svg>
  ),
  Plus: () => (
    <motion.svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.15, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
    >
      <defs>
        <linearGradient id="plusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <line x1="12" y1="5" x2="12" y2="19" stroke="url(#plusGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="url(#plusGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    </motion.svg>
  ),
  Search: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1 }}
    >
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <circle cx="11" cy="11" r="8" stroke="url(#searchGradient)" strokeWidth="2.5"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="url(#searchGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    </motion.svg>
  ),
  Weather: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <linearGradient id="weatherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="5" fill="url(#weatherGradient)" opacity="0.2"/>
      <circle cx="12" cy="12" r="5" stroke="url(#weatherGradient)" strokeWidth="2"/>
      <line x1="12" y1="1" x2="12" y2="3" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="21" x2="12" y2="23" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="1" y1="12" x2="3" y2="12" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="21" y1="12" x2="23" y2="12" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="url(#weatherGradient)" strokeWidth="2" strokeLinecap="round"/>
    </motion.svg>
  ),
  Calendar: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1 }}
    >
      <defs>
        <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="url(#calendarGradient)" strokeWidth="2.5"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="url(#calendarGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="url(#calendarGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="url(#calendarGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    </motion.svg>
  ),
  Calculator: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1, y: -2 }}
    >
      <defs>
        <linearGradient id="calcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <rect x="4" y="2" width="16" height="20" rx="2" stroke="url(#calcGradient)" strokeWidth="2.5"/>
      <line x1="8" y1="6" x2="16" y2="6" stroke="url(#calcGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="8" cy="10" r="1" fill="url(#calcGradient)"/>
      <circle cx="12" cy="10" r="1" fill="url(#calcGradient)"/>
      <circle cx="16" cy="10" r="1" fill="url(#calcGradient)"/>
      <circle cx="8" cy="14" r="1" fill="url(#calcGradient)"/>
      <circle cx="12" cy="14" r="1" fill="url(#calcGradient)"/>
      <circle cx="16" cy="14" r="1" fill="url(#calcGradient)"/>
      <circle cx="8" cy="18" r="1" fill="url(#calcGradient)"/>
      <circle cx="12" cy="18" r="1" fill="url(#calcGradient)"/>
      <circle cx="16" cy="18" r="1" fill="url(#calcGradient)"/>
    </motion.svg>
  ),
  Brain: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.15 }}
    >
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" fill="url(#brainGradient)" opacity="0.3"/>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" stroke="url(#brainGradient)" strokeWidth="2"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" fill="url(#brainGradient)" opacity="0.3"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" stroke="url(#brainGradient)" strokeWidth="2"/>
    </motion.svg>
  ),
  Heart: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      animate={{ 
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.2 }}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="50%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
      </defs>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="url(#heartGradient)" stroke="url(#heartGradient)" strokeWidth="2"/>
    </motion.svg>
  ),
  Clipboard: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1, y: -2 }}
    >
      <defs>
        <linearGradient id="clipboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="url(#clipboardGradient)"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="url(#clipboardGradient)" strokeWidth="2.5"/>
    </motion.svg>
  ),
  Home: () => (
    <motion.svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1, y: -2 }}
    >
      <defs>
        <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="url(#homeGradient)" opacity="0.2"/>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="url(#homeGradient)" strokeWidth="2.5"/>
      <polyline points="9 22 9 12 15 12 15 22" stroke="url(#homeGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    </motion.svg>
  ),
  Trash: () => (
    <motion.svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.2, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
    >
      <defs>
        <linearGradient id="trashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>
      </defs>
      <polyline points="3 6 5 6 21 6" stroke="url(#trashGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="url(#trashGradient)" strokeWidth="2.5"/>
    </motion.svg>
  ),
  Chat: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1 }}
    >
      <defs>
        <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="url(#chatGradient)" opacity="0.1"/>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="url(#chatGradient)" strokeWidth="2.5"/>
    </motion.svg>
  ),
  Sparkles: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      animate={{ 
        rotate: [0, 180, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.2 }}
    >
      <defs>
        <linearGradient id="sparklesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="url(#sparklesGradient)" stroke="url(#sparklesGradient)" strokeWidth="1.5"/>
      <path d="M5 3v4" stroke="url(#sparklesGradient)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 17v4" stroke="url(#sparklesGradient)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 5h4" stroke="url(#sparklesGradient)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 19h4" stroke="url(#sparklesGradient)" strokeWidth="2" strokeLinecap="round"/>
    </motion.svg>
  ),
  Globe: () => (
    <motion.svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      whileHover={{ scale: 1.15 }}
    >
      <defs>
        <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="url(#globeGradient)" strokeWidth="2.5"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="url(#globeGradient)" strokeWidth="2.5"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="url(#globeGradient)" strokeWidth="2.5"/>
    </motion.svg>
  ),
  Admin: () => (
    <motion.svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      className="relative"
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <defs>
        <linearGradient id="adminGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#adminGradient)" opacity="0.2"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#adminGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="2" r="1.5" fill="url(#adminGradient)"/>
    </motion.svg>
  )
}

const MatteoPage = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
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
    
    // Verificar se é admin
    const adminStatus = localStorage.getItem('pablo_admin') === 'true'
    const urlParams = new URLSearchParams(window.location.search)
    const urlAdmin = urlParams.get('admin') === 'pablo'
    setIsAdmin(adminStatus || urlAdmin)
    
    // Criar conversa automaticamente se não houver nenhuma ativa
    const createInitialConversation = async () => {
      if (!currentConversationId) {
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
          }
        } catch (error) {
          console.error('Erro ao criar conversa inicial:', error)
        }
      }
    }
    
    // Aguardar um pouco antes de criar para não conflitar com loadConversations
    setTimeout(createInitialConversation, 500)
  }, [])
  

  // Atualizar conversa atual quando mensagens mudam (com debounce)
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]?.text?.substring(0, 50) + '...'
      
      // Debounce para não fazer muitas requisições
      const timeoutId = setTimeout(() => {
        // Atualizar no banco
        fetch(`${API_URL}/api/conversations/${currentConversationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ last_message: lastMessage })
        }).catch(console.error)
      }, 1000)
      
      // Atualizar estado local imediatamente
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
      
      return () => clearTimeout(timeoutId)
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
      <motion.aside 
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -288,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`lg:translate-x-0 fixed lg:relative left-0 top-0 h-full w-72 sm:w-80 z-50 flex flex-col ${
          tpmMode 
            ? 'bg-gradient-to-b from-pink-200/98 via-rose-100/98 to-pink-200/98 backdrop-blur-xl border-r-2 border-pink-400/80 shadow-2xl' 
            : 'bg-gradient-to-b from-violet-200/98 via-purple-100/98 to-indigo-200/98 backdrop-blur-xl border-r-2 border-violet-400/80 shadow-2xl'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`p-3 sm:p-4 border-b-2 ${tpmMode ? 'border-pink-400/70' : 'border-violet-400/70'}`}>
          <motion.button
            onClick={createNewConversation}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base ${
              tpmMode
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white ring-2 ring-pink-400/70 shadow-lg'
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white ring-2 ring-violet-400/70 shadow-lg'
            } rounded-xl font-bold transition-all hover:shadow-xl`}
          >
            <Icons.Plus />
            Nova conversa
          </motion.button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3">
          <div className="space-y-1.5 sm:space-y-2">
            {conversations.map(conv => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: conv.id ? 0 : 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadConversation(conv)}
                className={`group flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all border-2 ${
                  currentConversationId === conv.id 
                    ? tpmMode 
                      ? 'bg-gradient-to-r from-pink-400/90 to-rose-400/90 shadow-lg border-pink-500/90' 
                      : 'bg-gradient-to-r from-violet-400/90 to-purple-400/90 shadow-lg border-violet-500/90'
                    : tpmMode
                      ? 'hover:bg-pink-300/80 border-pink-300/70 hover:border-pink-400/90 bg-pink-100/60'
                      : 'hover:bg-violet-300/80 border-violet-300/70 hover:border-violet-400/90 bg-violet-100/60'
                }`}
              >
                <div className="flex-shrink-0">
                  <Icons.Chat />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-bold truncate ${tpmMode ? 'text-rose-950' : 'text-violet-950'}`}>{conv.title}</p>
                  <p className={`text-[10px] sm:text-xs font-semibold truncate ${tpmMode ? 'text-rose-800' : 'text-violet-800'}`}>{formatDate(conv.updatedAt)}</p>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className={`p-1.5 sm:p-2 rounded-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ${
                    tpmMode 
                      ? 'text-rose-600 hover:text-red-600 hover:bg-red-200/70' 
                      : 'text-violet-600 hover:text-red-600 hover:bg-red-200/70'
                  }`}
                >
                  <Icons.Trash />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={`p-3 sm:p-4 border-t-2 ${tpmMode ? 'border-pink-400/70' : 'border-violet-400/70'} space-y-2`}>
          <motion.button
            onClick={toggleTpmMode}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all ${
              tpmMode 
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg ring-2 ring-pink-400/70' 
                : 'bg-gradient-to-r from-pink-200 to-rose-200 hover:from-pink-300 hover:to-rose-300 text-rose-800 border-2 border-rose-400/70'
            }`}
          >
            <Icons.Heart />
            <span className="hidden sm:inline">{tpmMode ? 'Modo TPM Ativo' : 'Modo TPM'}</span>
            <span className="sm:hidden">{tpmMode ? 'TPM Ativo' : 'TPM'}</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/presente')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all border-2 ${
              tpmMode
                ? 'bg-pink-100/90 hover:bg-pink-200/90 text-rose-800 border-pink-400/70'
                : 'bg-violet-100/90 hover:bg-violet-200/90 text-violet-800 border-violet-400/70'
            }`}
          >
            <Icons.Home />
            <span className="hidden sm:inline">Voltar ao início</span>
            <span className="sm:hidden">Início</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 backdrop-blur-xl flex items-center gap-2 sm:gap-4 relative z-50 ${
            tpmMode 
              ? 'bg-gradient-to-r from-pink-200/98 via-rose-100/98 to-pink-200/98 border-pink-500/80 shadow-lg' 
              : 'bg-gradient-to-r from-violet-200/98 via-purple-100/98 to-indigo-200/98 border-violet-500/80 shadow-lg'
          }`}
        >
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`lg:hidden p-2.5 sm:p-3 rounded-xl transition-all relative z-[60] flex-shrink-0 ${
              tpmMode 
                ? 'bg-pink-400/95 hover:bg-pink-500/95 text-rose-900 ring-2 ring-pink-500/80 shadow-xl' 
                : 'bg-violet-400/95 hover:bg-violet-500/95 text-violet-900 ring-2 ring-violet-500/80 shadow-xl'
            }`}
            title={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
          </motion.button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <MatteoLogo size="sm" />
            <div>
              <h1 className={`font-bold text-base sm:text-lg ${tpmMode ? 'text-rose-900' : 'text-violet-900'}`}>Matteo</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${tpmMode ? 'bg-pink-600' : 'bg-emerald-500'}`}></span>
                <span className={`text-[10px] sm:text-xs font-semibold ${tpmMode ? 'text-rose-700' : 'text-violet-700'}`}>
                  <span className="hidden sm:inline">{tpmMode ? 'Modo Carinho Ativo' : 'Online'}</span>
                  <span className="sm:hidden">{tpmMode ? 'TPM' : 'On'}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              <motion.button
                onClick={() => navigate('/admin/dashboard')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-all ${
                  tpmMode 
                    ? 'bg-blue-300/80 hover:bg-blue-400/90 text-blue-900 ring-2 ring-blue-400/70' 
                    : 'bg-blue-300/80 hover:bg-blue-400/90 text-blue-900 ring-2 ring-blue-400/70'
                }`}
                title="Dashboard Admin"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </motion.button>
            )}
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-all ${
                tpmMode 
                  ? 'bg-pink-300/80 hover:bg-pink-400/90 text-rose-900 ring-2 ring-pink-400/70' 
                  : 'bg-violet-300/80 hover:bg-violet-400/90 text-violet-900 ring-2 ring-violet-400/70'
              }`}
            >
              <Icons.Home />
            </motion.button>
          </div>
        </motion.header>

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
                <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1
              }}
            >
              <MatteoLogo size="xl" className="mx-auto mb-6" />
            </motion.div>
                
                <motion.h2 
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 ${
                    tpmMode 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-rose-700 drop-shadow-lg' 
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700 drop-shadow-lg'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Olá, Gehh! 💙
                </motion.h2>
                <motion.p 
                  className={`text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-bold ${
                    tpmMode 
                      ? 'text-rose-800' 
                      : 'text-violet-800'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Sou o Matteo, sua IA pessoal. Como posso te ajudar hoje?
                </motion.p>

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
            <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={`flex gap-2 sm:gap-3 md:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <motion.div 
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-400' 
                        : tpmMode 
                          ? 'bg-gradient-to-br from-pink-500 to-rose-600 ring-2 ring-pink-400' 
                          : 'bg-gradient-to-br from-violet-600 to-purple-700 ring-2 ring-violet-400'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {msg.sender === 'user' ? (
                      <span className="text-white text-xs sm:text-sm font-bold">G</span>
                    ) : (
                      <MatteoLogo size="sm" className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </motion.div>
                  
                  {/* Message */}
                  <motion.div 
                    className={`flex-1 max-w-[85%] sm:max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div 
                      className={`inline-block p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap shadow-lg ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-600/40 ring-2 ring-blue-400'
                          : tpmMode 
                            ? 'bg-gradient-to-br from-pink-200 to-rose-200 text-gray-900 border-2 border-pink-400 shadow-pink-300/60' 
                            : 'bg-gradient-to-br from-violet-200 to-purple-200 text-gray-900 border-2 border-violet-400 shadow-violet-300/60'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {msg.text}
                    </motion.div>
                    <motion.p 
                      className={`text-[10px] sm:text-xs mt-1.5 font-bold ${
                        msg.sender === 'user' 
                          ? 'text-blue-300' 
                          : tpmMode ? 'text-rose-700' : 'text-violet-700'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {formatTime(msg.timestamp)}
                    </motion.p>
                  </motion.div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4"
                >
                  <motion.div 
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-2 ${
                      tpmMode 
                        ? 'bg-gradient-to-br from-pink-400 to-rose-500 ring-pink-300' 
                        : 'bg-gradient-to-br from-violet-500 to-purple-600 ring-violet-300'
                    }`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <MatteoLogo size="sm" className="w-6 h-6" />
                  </motion.div>
                  <motion.div 
                    className={`p-4 rounded-2xl shadow-lg ${
                      tpmMode 
                        ? 'bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-300 shadow-pink-200/50' 
                        : 'bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-violet-300 shadow-violet-200/50'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <motion.span 
                          className={`w-2.5 h-2.5 rounded-full ${tpmMode ? 'bg-pink-500' : 'bg-violet-500'}`}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span 
                          className={`w-2.5 h-2.5 rounded-full ${tpmMode ? 'bg-pink-500' : 'bg-violet-500'}`}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span 
                          className={`w-2.5 h-2.5 rounded-full ${tpmMode ? 'bg-pink-500' : 'bg-violet-500'}`}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      {typingStatus && (
                        <motion.span 
                          className={`text-sm font-medium ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {typingStatus}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
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
              <motion.button
                onClick={handleSend}
                disabled={!input.trim()}
                whileHover={input.trim() ? { scale: 1.1 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  input.trim()
                    ? tpmMode
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/40 ring-2 ring-pink-300'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-xl shadow-violet-500/30 ring-2 ring-violet-300'
                    : tpmMode ? 'bg-pink-100 text-pink-300' : 'bg-violet-100 text-violet-300'
                }`}
              >
                <Icons.Send />
              </motion.button>
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
