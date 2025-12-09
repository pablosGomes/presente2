import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Flower from '../components/Flower'
import Petal from '../components/Petal'

// 🤖 Logo do Matteo (versão premium)
const MatteoLogo = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="matteoAura" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="matteoCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#9F67FF" />
          </linearGradient>
          <linearGradient id="matteoHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Aura */}
        <circle cx="70" cy="70" r="56" fill="url(#matteoAura)" opacity="0.12" />
        <circle cx="70" cy="70" r="48" fill="url(#matteoAura)" opacity="0.18" />

        {/* Face shape */}
        <rect x="32" y="32" width="76" height="76" rx="26" fill="url(#matteoCore)" />
        <rect x="32" y="32" width="76" height="76" rx="26" fill="url(#matteoHighlight)" opacity="0.35" />
        <rect x="32" y="32" width="76" height="76" rx="26" stroke="#E9D5FF" strokeWidth="2.5" />

        {/* Eyes */}
        <circle cx="52" cy="66" r="10" fill="#fff" />
        <circle cx="88" cy="66" r="10" fill="#fff" />
        <circle cx="54" cy="66" r="4" fill="#0F172A" />
        <circle cx="86" cy="66" r="4" fill="#0F172A" />

        {/* Smile */}
        <path d="M50 82C53 91 60 96 70 96C80 96 87 91 90 82" stroke="#F8FAFC" strokeWidth="4.5" strokeLinecap="round" />

        {/* Cheeks */}
        <circle cx="45" cy="78" r="4" fill="#F9A8D4" opacity="0.8" />
        <circle cx="95" cy="78" r="4" fill="#F9A8D4" opacity="0.8" />

        {/* Antenna */}
        <path d="M70 32V20" stroke="url(#matteoAura)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="70" cy="16" r="8" fill="#22C55E" stroke="#ffffff" strokeWidth="2.5" />

        {/* Sparkle */}
        <circle cx="92" cy="44" r="6" fill="#fff" opacity="0.7" />
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
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
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
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
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
  const [adminSender, setAdminSender] = useState('pablo') // 'gehh', 'matteo' ou 'pablo'
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
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const mainRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [editingConversationId, setEditingConversationId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const searchTimeoutRef = useRef(null)
  const searchInputRef = useRef(null)
  const [expandedMessages, setExpandedMessages] = useState(new Set())
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [apiError, setApiError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const MAX_MESSAGE_LENGTH = 4000
  const MAX_RETRIES = 3

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')
  
  // Monitorar status de conexão
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setApiError(false)
      if (retryCount > 0) {
        showToast('Conexão restaurada! 💙', 'success')
        setRetryCount(0)
      }
    }
    const handleOffline = () => {
      setIsOnline(false)
      showToast('Sem conexão com a internet', 'error')
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [retryCount])

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

  // Ref para evitar múltiplos carregamentos simultâneos de conversas
  const isLoadingConversationsRef = useRef(false)
  const lastLoadConversationsTimeRef = useRef(0)
  
  // Carregar conversas do banco de dados
  const loadConversations = useCallback(async () => {
    const now = Date.now()
    // Evitar múltiplos carregamentos simultâneos ou muito próximos
    if (isLoadingConversationsRef.current || (now - lastLoadConversationsTimeRef.current < 500)) {
      console.log('Carregamento de conversas já em andamento ou muito recente, ignorando...')
      return
    }
    
    isLoadingConversationsRef.current = true
    lastLoadConversationsTimeRef.current = now
    setIsLoadingConversations(true)
    
    try {
      const response = await fetch(`${API_URL}/api/conversations`)
      if (response.ok) {
        const data = await response.json()
        
        // Remover duplicatas baseadas em ID
        const uniqueConversations = []
        const seenIds = new Set()
        for (const conv of data) {
          if (!seenIds.has(conv.id)) {
            seenIds.add(conv.id)
            uniqueConversations.push(conv)
          }
        }
        
        setConversations(uniqueConversations)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      // Fallback para localStorage se API falhar
      const saved = localStorage.getItem('matteo_conversations')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Remover duplicatas também do localStorage
          const uniqueConversations = []
          const seenIds = new Set()
          for (const conv of parsed) {
            if (!seenIds.has(conv.id)) {
              seenIds.add(conv.id)
              uniqueConversations.push(conv)
            }
          }
          setConversations(uniqueConversations)
        } catch (e) {
          console.error('Erro ao parsear conversas do localStorage:', e)
        }
      }
    } finally {
      setIsLoadingConversations(false)
      // Liberar flag após um pequeno delay
      setTimeout(() => {
        isLoadingConversationsRef.current = false
      }, 500)
    }
  }, [API_URL])

  useEffect(() => {
    loadConversations()
    
    // Verificar se é admin
    const adminStatus = localStorage.getItem('pablo_admin') === 'true'
    const urlParams = new URLSearchParams(window.location.search)
    const urlAdmin = urlParams.get('admin') === 'pablo'
    setIsAdmin(adminStatus || urlAdmin)
    
    // Não criar conversa automaticamente - deixar o usuário criar quando quiser
    // ou criar quando enviar a primeira mensagem
  }, [])

  // Recarregar conversas quando o sidebar abrir para garantir que está atualizado
  useEffect(() => {
    if (sidebarOpen) {
      loadConversations()
    } else {
      // Fechar busca quando sidebar fechar
      setShowSearch(false)
      setSearchQuery('')
    }
  }, [sidebarOpen, loadConversations])
  

  // Atualizar conversa atual quando mensagens mudam (com debounce)
  // Usar ref para evitar loops infinitos quando mensagens são recarregadas do banco
  const isReloadingRef = useRef(false)
  
  useEffect(() => {
    // Não atualizar se estiver recarregando do banco
    if (isReloadingRef.current) {
      isReloadingRef.current = false
      return
    }
    
    if (currentConversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]?.text?.substring(0, 50) + '...'
      
      // Debounce para não fazer muitas requisições
      const timeoutId = setTimeout(() => {
        // Atualizar no banco
        fetch(`${API_URL}/api/conversations/${currentConversationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ last_message: lastMessage })
        }).then(() => {
          // Recarregar lista após atualizar para garantir sincronização
          // Aguardar um pouco para não interferir com outros recarregamentos
          setTimeout(() => loadConversations(), 500)
        }).catch(console.error)
      }, 1000)
      
      // Não atualizar estado local para evitar duplicação - deixar loadConversations fazer isso
      
      return () => clearTimeout(timeoutId)
    }
  }, [messages, currentConversationId, API_URL, loadConversations])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => scrollToBottom(), [messages])

  // Detectar e compensar o teclado virtual (melhorado para mobile)
  useEffect(() => {
    let initialHeight = window.visualViewport?.height || window.innerHeight
    let isKeyboardOpen = false
    
    const handleFocusInput = () => {
      // Ao focar no input, aguarda teclado abrir e ajusta scroll
      setTimeout(() => {
        if (inputRef.current && mainRef.current) {
          const rect = inputRef.current.getBoundingClientRect()
          const viewHeight = window.visualViewport?.height || window.innerHeight
          
          // Se o input está abaixo da metade da tela, rola para cima
          if (rect.bottom > viewHeight - 100) {
            mainRef.current.scrollTo({
              top: mainRef.current.scrollHeight,
              behavior: 'smooth'
            })
          }
        }
      }, 350) // Aumentado para dar tempo do teclado abrir
    }

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const diff = initialHeight - currentHeight
      
      // Só considera como teclado se a diferença for significativa (>150px para mobile)
      const threshold = window.innerWidth < 768 ? 150 : 100
      
      if (diff > threshold && !isKeyboardOpen) {
        isKeyboardOpen = true
        setKeyboardHeight(diff)
        // Rola automaticamente para última mensagem
        setTimeout(() => {
          if (mainRef.current) {
            mainRef.current.scrollTo({
              top: mainRef.current.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 150)
      } else if (diff <= threshold && isKeyboardOpen) {
        isKeyboardOpen = false
        setKeyboardHeight(0)
        // Atualizar altura inicial quando teclado fecha
        initialHeight = window.visualViewport?.height || window.innerHeight
      }
    }

    const handleBlurInput = () => {
      // Pequeno delay para permitir que o teclado feche antes de resetar
      setTimeout(() => {
        if (!document.activeElement || document.activeElement !== inputRef.current) {
          setKeyboardHeight(0)
          isKeyboardOpen = false
        }
      }, 200)
    }

    const textarea = inputRef.current
    if (textarea) {
      textarea.addEventListener('focus', handleFocusInput)
      textarea.addEventListener('blur', handleBlurInput)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
    }
    
    // Fallback para iOS Safari e Android
    window.addEventListener('resize', handleViewportChange)

    return () => {
      if (textarea) {
        textarea.removeEventListener('focus', handleFocusInput)
        textarea.removeEventListener('blur', handleBlurInput)
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
      }
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [])

  const createNewConversation = () => {
    // Confirmar se há mensagens não salvas na conversa atual
    if (messages.length > 0 && currentConversationId) {
      const hasUnsavedMessages = messages.some(msg => {
        // Verificar se a mensagem foi salva (tem timestamp válido e não é muito recente)
        const msgTime = new Date(msg.timestamp).getTime()
        const now = Date.now()
        return (now - msgTime) < 5000 // Mensagens muito recentes podem não estar salvas
      })
      
      if (hasUnsavedMessages && !window.confirm('Tem certeza que quer criar uma nova conversa? A conversa atual será salva automaticamente.')) {
        return
      }
    }
    
    // Preparar estado local apenas (sem criar no banco ainda)
    const newId = `conv_${Date.now()}`
    const newSessionId = `session_${Date.now()}`
    
    setCurrentConversationId(newId)
    setSessionId(newSessionId)
    setMessages([])
    setInput('')
    setSidebarOpen(false)
    setApiError(false)
    setRetryCount(0)
    
    // Focar no input após criar nova conversa
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // Ref para evitar múltiplos recarregamentos simultâneos
  const isReloadingMessagesRef = useRef(false)
  const lastReloadTimeRef = useRef(0)
  
  // Função auxiliar para recarregar mensagens da conversa atual do banco
  const reloadCurrentConversationMessages = useCallback(async (conversationId = null) => {
    const convId = conversationId || currentConversationId
    if (!convId) return Promise.resolve()
    
    const now = Date.now()
    // Evitar múltiplos recarregamentos simultâneos ou muito próximos
    if (isReloadingMessagesRef.current || (now - lastReloadTimeRef.current < 500)) {
      console.log('Recarregamento já em andamento ou muito recente, ignorando...')
      return Promise.resolve()
    }
    
    try {
      isReloadingMessagesRef.current = true
      lastReloadTimeRef.current = now
      // Marcar que estamos recarregando para evitar loop no useEffect
      isReloadingRef.current = true
      
      const response = await fetch(`${API_URL}/api/conversations/${convId}`)
      if (response.ok) {
        const fullConv = await response.json()
        // Validar e mapear mensagens corretamente
        const validatedMessages = (fullConv.messages || []).map((msg, index) => ({
          id: msg.id || `msg_${index}_${msg.timestamp || Date.now()}`,
          text: msg.text || msg.content || '',
          sender: msg.sender || (msg.role === 'admin' ? 'pablo' : (msg.role === 'matteo_admin' ? 'matteo' : (msg.role === 'user' ? 'user' : 'bot'))),
          timestamp: msg.timestamp || new Date().toISOString()
        }))
        
        // Remover duplicatas baseado em texto + sender + timestamp (aproximado)
        const uniqueMessages = []
        const seen = new Set()
        for (const msg of validatedMessages) {
          const key = `${msg.text}_${msg.sender}_${msg.timestamp?.substring(0, 16)}` // Usar timestamp até segundos
          if (!seen.has(key)) {
            seen.add(key)
            uniqueMessages.push(msg)
          }
        }
        
        setMessages(uniqueMessages)
        return Promise.resolve()
      }
      return Promise.reject(new Error('Failed to load conversation'))
    } catch (error) {
      console.error('Erro ao recarregar mensagens:', error)
      return Promise.reject(error)
    } finally {
      // Liberar flag após um pequeno delay para evitar recarregamentos muito rápidos
      setTimeout(() => {
        isReloadingMessagesRef.current = false
      }, 1000)
    }
  }, [currentConversationId, API_URL])

  const loadConversation = async (conv) => {
    try {
      // Buscar conversa completa com mensagens do banco
      const response = await fetch(`${API_URL}/api/conversations/${conv.id}`)
      if (response.ok) {
        const fullConv = await response.json()
        setCurrentConversationId(fullConv.id)
        setSessionId(fullConv.sessionId)
        // Validar e mapear mensagens corretamente
        const validatedMessages = (fullConv.messages || []).map((msg, index) => ({
          id: msg.id || index + 1,
          text: msg.text || msg.content || '',
          sender: msg.sender || (msg.role === 'admin' ? 'pablo' : (msg.role === 'matteo_admin' ? 'matteo' : (msg.role === 'user' ? 'user' : 'bot'))),
          timestamp: msg.timestamp || new Date().toISOString()
        }))
        setMessages(validatedMessages)
        // Recarregar lista para garantir que está atualizada (com delay para evitar múltiplas chamadas)
        setTimeout(() => loadConversations(), 300)
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
    setShowSearch(false)
    setSearchQuery('')
  }

  const confirmDelete = (convId, e) => {
    e?.stopPropagation()
    setDeleteConfirmId(convId)
  }

  const deleteConversation = async () => {
    const convId = deleteConfirmId
    if (!convId) return
    
    const convTitle = conversations.find(c => c.id === convId)?.title || 'esta conversa'
    
    try {
      const response = await fetch(`${API_URL}/api/conversations/${convId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== convId))
        if (currentConversationId === convId) {
          setCurrentConversationId(null)
          setSessionId(`session_${Date.now()}`)
          setMessages([])
        }
        showToast(`"${convTitle}" deletada com sucesso!`)
        // Recarregar lista do servidor para garantir sincronização
        setTimeout(() => loadConversations(), 300)
      } else {
        showToast('Erro ao deletar conversa', 'error')
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      showToast('Erro ao deletar conversa', 'error')
    }
    
    setDeleteConfirmId(null)
  }

  const sendMessageToAPI = async (message, retryAttempt = 0) => {
    try {
      setTypingStatus('Pensando...')
      setApiError(false)
      
      // Verificar conexão
      if (!isOnline) {
        throw new Error('Sem conexão com a internet')
      }
      
      // Timeout de 30 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          session_id: sessionId, 
          conversation_id: currentConversationId,
          tpm_mode: tpmMode,
          is_admin: isAdmin,
          sender: isAdmin ? adminSender : 'gehh'
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erro ${response.status}`)
      }
      
      const data = await response.json()
      
      // Atualizar conversation_id se foi criado pelo backend
      if (data.conversation_id && data.conversation_id !== currentConversationId) {
        setCurrentConversationId(data.conversation_id)
        if (data.session_id) {
          setSessionId(data.session_id)
        }
      }
      
      // Se for múltiplas mensagens (Pablo + resposta do Matteo)
      if (data.is_multiple && data.messages) {
        return { 
          is_multiple: true, 
          messages: data.messages,
          session_id: data.session_id,
          conversation_id: data.conversation_id,
          group_mode: data.group_mode
        }
      }
      
      // Se for mensagem do admin (Pablo ou Matteo), retornar dados completos
      if (data.status === 'admin_message' && data.sender) {
        return { response: data.response, sender: data.sender, isAdminMessage: true }
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
      
      setRetryCount(0)
      return { response: data.response, sender: data.sender || 'bot', isAdminMessage: false }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setApiError(true)
      
      // Retry automático se não excedeu o limite
      if (retryAttempt < MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('Failed to fetch'))) {
        setRetryCount(retryAttempt + 1)
        setTypingStatus(`Tentando novamente... (${retryAttempt + 1}/${MAX_RETRIES})`)
        await new Promise(r => setTimeout(r, 2000 * (retryAttempt + 1)))
        return sendMessageToAPI(message, retryAttempt + 1)
      }
      
      // Mensagens de erro específicas
      let errorMessage = "Ops! Algo deu errado. Tenta de novo? 💙"
      if (error.name === 'AbortError') {
        errorMessage = "A requisição demorou muito. Tenta de novo? ⏱️"
      } else if (!isOnline) {
        errorMessage = "Sem conexão com a internet. Verifica sua rede! 📡"
      } else if (error.message.includes('429')) {
        errorMessage = "Muitas requisições! Aguarda um pouquinho e tenta de novo. 😅"
      } else if (error.message.includes('500')) {
        errorMessage = "Erro no servidor. O Pablo já foi avisado! 🔧"
      }
      
      return { response: errorMessage, sender: 'bot', isAdminMessage: false, error: true }
    } finally {
      setTypingStatus('')
    }
  }

  const handleSend = async () => {
    // Validações
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    
    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      showToast(`Mensagem muito longa! Máximo de ${MAX_MESSAGE_LENGTH} caracteres.`, 'error')
      return
    }
    
    if (isSending) {
      showToast('Aguarde, enviando mensagem...', 'error')
      return
    }
    
    if (!isOnline) {
      showToast('Sem conexão com a internet', 'error')
      return
    }
    
    setIsSending(true)
    const currentInput = trimmedInput
    setInput('')
    
    // Criar conversa no banco apenas quando enviar a primeira mensagem
    let conversationCreated = false
    if (!currentConversationId) {
      const newId = `conv_${Date.now()}`
      const newSessionId = `session_${Date.now()}`
      const title = currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : '')
      
      // Criar conversa no banco ANTES de enviar a mensagem
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
          // Não adicionar manualmente - recarregar do banco para evitar duplicação
          // setConversations(prev => [newConv, ...prev]) // Removido para evitar duplicação
          setCurrentConversationId(newId)
          setSessionId(newSessionId)
          conversationCreated = true
          // Recarregar do banco após um pequeno delay
          setTimeout(() => loadConversations(), 300)
        } else {
          console.error('Erro ao criar conversa no banco')
          // Se falhar, ainda tenta enviar a mensagem (o backend pode criar)
          setCurrentConversationId(newId)
          setSessionId(newSessionId)
        }
      } catch (error) {
        console.error('Erro ao criar conversa:', error)
        // Se falhar, ainda tenta enviar a mensagem (o backend pode criar)
        setCurrentConversationId(newId)
        setSessionId(newSessionId)
      }
    }
    
    setIsTyping(true)

    // Enviar mensagem - o backend vai salvar no banco
    try {
      const responseData = await sendMessageToAPI(currentInput)
      
      setIsTyping(false)
      
      // Validar que responseData existe e tem dados
      if (!responseData) {
        console.error('Resposta da API vazia')
        setIsTyping(false)
        return
      }
      
      // Atualizar conversation_id se foi retornado pelo backend
      const finalConversationId = responseData.conversation_id || currentConversationId
      if (responseData.conversation_id && responseData.conversation_id !== currentConversationId) {
        setCurrentConversationId(responseData.conversation_id)
      }
      
      // Sempre recarregar mensagens do banco após envio para evitar duplicação
      // O backend já salvou todas as mensagens (usuário + bot), então recarregamos para garantir sincronização
      if (finalConversationId) {
        // Aguardar um pouco para garantir que o backend salvou as mensagens
        // Usar retry apenas uma vez (não múltiplas tentativas para evitar duplicação)
        setTimeout(() => {
          // Usar o conversation_id final para garantir que estamos recarregando a conversa correta
          reloadCurrentConversationMessages(finalConversationId).catch((error) => {
            console.error('Erro ao recarregar mensagens:', error)
            // Tentar novamente apenas uma vez após delay maior
            setTimeout(() => {
              reloadCurrentConversationMessages(finalConversationId).catch(console.error)
            }, 1000)
          })
        }, 800) // Delay maior para garantir que o backend salvou
      } else {
        // Fallback: se não tiver conversation_id, adicionar manualmente (caso raro)
        if (responseData.is_multiple && responseData.messages && Array.isArray(responseData.messages)) {
          responseData.messages.forEach((msg, index) => {
            if (msg && msg.response && msg.sender) {
              const message = {
                id: Date.now() + index + 1,
                text: msg.response,
                sender: msg.sender,
                timestamp: new Date().toISOString()
              }
              setMessages(prev => [...prev, message])
            }
          })
        } else if (responseData.isAdminMessage && responseData.response && responseData.sender) {
          const adminMessage = {
            id: Date.now() + 1,
            text: responseData.response,
            sender: responseData.sender,
            timestamp: new Date().toISOString()
          }
          setMessages(prev => [...prev, adminMessage])
        } else if (responseData.response) {
          const botMessage = {
            id: Date.now() + 1,
            text: responseData.response,
            sender: responseData.sender || 'bot',
            timestamp: new Date().toISOString()
          }
          setMessages(prev => [...prev, botMessage])
        } else {
          console.error('Formato de resposta inválido:', responseData)
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setIsTyping(false)
      showToast('Erro ao enviar mensagem. Tenta de novo?', 'error')
    } finally {
      setIsSending(false)
    }

    // Atualizar título da conversa se for a primeira mensagem
    const isFirstMessage = messages.length === 0
    if (isFirstMessage && currentConversationId) {
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
    
    // Recarregar lista do servidor após enviar mensagem para garantir sincronização
    // Aguardar mais tempo para não interferir com o recarregamento de mensagens
    setTimeout(() => loadConversations(), 1500)
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
        text: "🆘 MODO TPM ATIVADO! 🆘\n\nPrincesa, tô aqui pra você agora! Vou te dar todo carinho do mundo. Quer desabafar? Tô ouvindo... 💙🫂",
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

  const getDateGroup = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    if (date.toDateString() === today.toDateString()) return 'Hoje'
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem'
    if (date > weekAgo) return 'Esta semana'
    if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) return 'Este mês'
    return 'Anteriores'
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const renameConversation = async (convId, newTitle) => {
    const trimmedTitle = newTitle.trim()
    if (!trimmedTitle) {
      showToast('O título não pode estar vazio', 'error')
      return
    }
    
    try {
      const response = await fetch(`${API_URL}/api/conversations/${convId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle })
      })
      
      if (response.ok) {
        // Não atualizar estado local - recarregar do banco para evitar duplicação
        setTimeout(() => loadConversations(), 300)
        showToast('Conversa renomeada com sucesso!')
      } else {
        showToast('Erro ao renomear conversa', 'error')
      }
    } catch (error) {
      console.error('Erro ao renomear conversa:', error)
      showToast('Erro ao renomear conversa', 'error')
    }
    setEditingConversationId(null)
    setEditingTitle('')
  }

  const startEditing = (conv) => {
    setEditingConversationId(conv.id)
    setEditingTitle(conv.title)
  }

  const cancelEditing = () => {
    setEditingConversationId(null)
    setEditingTitle('')
  }

  // Filtrar conversas por busca (com debounce)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const filteredConversations = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return conversations
    
    const query = debouncedSearchQuery.toLowerCase()
    return conversations.filter(conv => 
      conv.title?.toLowerCase().includes(query) ||
      conv.lastMessage?.toLowerCase().includes(query)
    )
  }, [conversations, debouncedSearchQuery])

  // Agrupar conversas por data
  const groupedConversations = useMemo(() => {
    const groups = {}
    filteredConversations.forEach(conv => {
      const group = getDateGroup(conv.updatedAt)
      if (!groups[group]) groups[group] = []
      groups[group].push(conv)
    })
    return groups
  }, [filteredConversations])

  // Sugestões iniciais
  const suggestions = [
    { icon: <Icons.Globe />, text: "Pesquisa sobre Taylor Swift", color: "from-blue-500 to-cyan-500" },
    { icon: <Icons.Weather />, text: "Como tá o clima em São Paulo?", color: "from-amber-500 to-orange-500" },
    { icon: <Icons.Brain />, text: "O que você lembra sobre mim?", color: "from-purple-500 to-pink-500" },
    { icon: <Icons.Calculator />, text: "Quanto é 15% de 350?", color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div 
      className={`h-screen w-screen flex overflow-hidden transition-all duration-700 ${
        tpmMode 
          ? 'bg-gradient-to-br from-pink-100 via-rose-50 via-pink-50 to-rose-100' 
          : 'bg-gradient-to-br from-azul-claro via-violet-100 via-purple-50 to-azul-bebe'
      }`}
      style={{
        height: '100dvh', // Dynamic viewport height para mobile
        minHeight: '-webkit-fill-available', // Fallback para iOS Safari
      }}
    >
      
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
        drag="x"
        dragConstraints={{ left: -288, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, info) => {
          // Fechar sidebar se arrastar para esquerda mais de 50px
          if (info.offset.x < -50) {
            setSidebarOpen(false)
          }
        }}
        className={`lg:translate-x-0 fixed lg:relative left-0 top-0 h-full w-72 sm:w-80 z-50 flex flex-col touch-none ${
          tpmMode 
            ? 'bg-gradient-to-b from-pink-200/98 via-rose-100/98 to-pink-200/98 backdrop-blur-xl border-r-2 border-pink-400/80 shadow-2xl' 
            : 'bg-gradient-to-b from-violet-200/98 via-purple-100/98 to-indigo-200/98 backdrop-blur-xl border-r-2 border-violet-400/80 shadow-2xl'
        }`}
        style={{
          height: '100dvh',
          minHeight: '-webkit-fill-available',
        }}
      >
        {/* Sidebar Header */}
        <div className={`p-3 sm:p-4 border-b-2 ${tpmMode ? 'border-pink-400/70' : 'border-violet-400/70'}`}>
          <div className="flex items-center gap-2 mb-2">
            <motion.button
              onClick={createNewConversation}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base ${
                tpmMode
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white ring-2 ring-pink-400/70 shadow-lg'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white ring-2 ring-violet-400/70 shadow-lg'
              } rounded-xl font-bold transition-all hover:shadow-xl`}
            >
              <Icons.Plus />
              <span className="hidden sm:inline">Nova conversa</span>
              <span className="sm:hidden">Nova</span>
            </motion.button>
            
            {/* Botão de busca */}
            <motion.button
              onClick={() => {
                setShowSearch(!showSearch)
                if (!showSearch) {
                  setTimeout(() => searchInputRef.current?.focus(), 100)
                } else {
                  setSearchQuery('')
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl active:scale-90 touch-manipulation ${
                showSearch
                  ? tpmMode
                    ? 'bg-pink-500 text-white'
                    : 'bg-violet-500 text-white'
                  : tpmMode
                    ? 'bg-pink-100/80 text-rose-600 hover:bg-pink-200/80'
                    : 'bg-violet-100/80 text-violet-600 hover:bg-violet-200/80'
              } transition-all`}
              title={showSearch ? 'Fechar busca' : 'Buscar conversas'}
              aria-label={showSearch ? 'Fechar busca' : 'Buscar conversas'}
            >
              {showSearch ? <Icons.Close /> : <Icons.Search />}
            </motion.button>
          </div>
          
          {/* Campo de busca - aparece apenas quando showSearch é true */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`relative mt-2 ${tpmMode ? 'bg-pink-100/80' : 'bg-violet-100/80'} rounded-lg border-2 ${tpmMode ? 'border-pink-300/70' : 'border-violet-300/70'}`}>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Icons.Search />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar conversas..."
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-transparent outline-none ${tpmMode ? 'text-rose-900 placeholder-rose-500' : 'text-violet-900 placeholder-violet-500'}`}
                  />
                  {searchQuery && (
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      whileHover={window.innerWidth >= 768 ? { scale: 1.1 } : {}}
                      whileTap={{ scale: 0.92 }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation ${tpmMode ? 'text-rose-600 hover:text-rose-800' : 'text-violet-600 hover:text-violet-800'}`}
                    >
                      <Icons.Close />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3" style={{ WebkitOverflowScrolling: 'touch' }}>
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-8 h-8 border-4 ${tpmMode ? 'border-pink-500 border-t-transparent' : 'border-violet-500 border-t-transparent'} rounded-full`}
              />
            </div>
          ) : Object.keys(groupedConversations).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="opacity-50 mb-3">
                <Icons.Chat />
              </div>
              <p className={`text-sm font-semibold ${tpmMode ? 'text-rose-700' : 'text-violet-700'}`}>
                {debouncedSearchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </p>
              <p className={`text-xs mt-1 ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}>
                {debouncedSearchQuery ? 'Tente outra busca' : 'Crie uma nova conversa para começar!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedConversations).map(([groupName, groupConvs]) => (
                <div key={groupName}>
                  <h3 className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 px-2 ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}>
                    {groupName}
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {groupConvs.map(conv => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        whileHover={window.innerWidth >= 768 ? { scale: 1.02, x: 4 } : {}}
                        whileTap={{ scale: 0.95 }}
                        className={`group flex items-start gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-lg sm:rounded-xl cursor-pointer transition-all border-2 touch-manipulation active:scale-95 ${
                          currentConversationId === conv.id 
                            ? tpmMode 
                              ? 'bg-gradient-to-r from-pink-400/90 to-rose-400/90 shadow-lg border-pink-500/90' 
                              : 'bg-gradient-to-r from-violet-400/90 to-purple-400/90 shadow-lg border-violet-500/90'
                            : tpmMode
                              ? 'hover:bg-pink-300/80 border-pink-300/70 hover:border-pink-400/90 bg-pink-100/60 active:bg-pink-300/90'
                              : 'hover:bg-violet-300/80 border-violet-300/70 hover:border-violet-400/90 bg-violet-100/60 active:bg-violet-300/90'
                        }`}
                      >
                        <div className="flex-shrink-0 pt-0.5">
                          <Icons.Chat />
                        </div>
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => {
                            if (editingConversationId === conv.id) return
                            loadConversation(conv)
                          }}
                        >
                          {editingConversationId === conv.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    renameConversation(conv.id, editingTitle)
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault()
                                    cancelEditing()
                                  }
                                }}
                                autoFocus
                                className={`flex-1 text-xs sm:text-sm font-bold bg-white border-2 ${tpmMode ? 'border-pink-400 text-rose-950' : 'border-violet-400 text-violet-950'} rounded px-2 py-1.5 outline-none`}
                              />
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  renameConversation(conv.id, editingTitle)
                                }}
                                whileTap={{ scale: 0.9 }}
                                className={`min-w-[44px] min-h-[44px] p-2 rounded-lg ${tpmMode ? 'bg-green-500 text-white' : 'bg-green-500 text-white'}`}
                                title="Salvar"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </motion.button>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  cancelEditing()
                                }}
                                whileTap={{ scale: 0.9 }}
                                className={`min-w-[44px] min-h-[44px] p-2 rounded-lg ${tpmMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}
                                title="Cancelar"
                              >
                                <Icons.Close />
                              </motion.button>
                            </div>
                          ) : (
                            <>
                              <p className={`text-xs sm:text-sm font-bold truncate ${tpmMode ? 'text-rose-950' : 'text-violet-950'}`}>
                                {conv.title}
                              </p>
                              {conv.lastMessage && (
                                <p className={`text-[10px] sm:text-xs font-medium truncate mt-0.5 ${tpmMode ? 'text-rose-700' : 'text-violet-700'}`}>
                                  {conv.lastMessage.length > 40 ? conv.lastMessage.substring(0, 40) + '...' : conv.lastMessage}
                                </p>
                              )}
                              <p className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 ${tpmMode ? 'text-rose-600' : 'text-violet-600'}`}>
                                {formatDate(conv.updatedAt)}
                              </p>
                            </>
                          )}
                        </div>
                        {editingConversationId !== conv.id && (
                          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditing(conv)
                              }}
                              whileTap={{ scale: 0.9 }}
                              className={`min-w-[44px] min-h-[44px] p-2 rounded-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all ${
                                tpmMode 
                                  ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-200/70' 
                                  : 'text-violet-600 hover:text-violet-800 hover:bg-violet-200/70'
                              }`}
                              title="Renomear"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </motion.button>
                            <motion.button
                              onClick={(e) => confirmDelete(conv.id, e)}
                              whileTap={{ scale: 0.9 }}
                              className={`min-w-[44px] min-h-[44px] p-2 rounded-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all ${
                                tpmMode 
                                  ? 'text-rose-600 hover:text-red-600 hover:bg-red-200/70' 
                                  : 'text-violet-600 hover:text-red-600 hover:bg-red-200/70'
                              }`}
                              title="Deletar"
                            >
                              <Icons.Trash />
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden touch-none"
          onClick={() => setSidebarOpen(false)}
          onTouchStart={(e) => {
            // Fechar sidebar ao tocar no overlay
            e.preventDefault()
            setSidebarOpen(false)
          }}
        />
      )}

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col h-full min-h-0" 
        style={{
          height: keyboardHeight > 0 
            ? `calc(100dvh - ${keyboardHeight}px)` 
            : '100dvh',
          minHeight: '-webkit-fill-available',
        }}
      >
        
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 backdrop-blur-xl flex items-center gap-2 sm:gap-4 relative z-50 sticky top-0 ${
            tpmMode 
              ? 'bg-gradient-to-r from-pink-200/98 via-rose-100/98 to-pink-200/98 border-pink-500/80 shadow-lg' 
              : 'bg-gradient-to-r from-violet-200/98 via-purple-100/98 to-indigo-200/98 border-violet-500/80 shadow-lg'
          }`}
        >
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-all relative z-[60] flex-shrink-0 shadow-xl ring-2 ring-offset-1 active:scale-95 ${
              tpmMode 
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white ring-pink-200/70 ring-offset-rose-100' 
                : 'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white ring-indigo-200/70 ring-offset-indigo-50'
            }`}
            title={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
          </motion.button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <MatteoLogo size="sm" />
            <div>
              <h1 className={`font-bold text-base sm:text-lg ${tpmMode ? 'text-rose-900' : 'text-violet-900'}`}>Matteo</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'animate-pulse' : ''} ${
                  isOnline 
                    ? (tpmMode ? 'bg-pink-600' : 'bg-emerald-500')
                    : 'bg-red-500'
                }`}></span>
                <span className={`text-[10px] sm:text-xs font-semibold ${tpmMode ? 'text-rose-700' : 'text-violet-700'}`}>
                  <span className="hidden sm:inline">{tpmMode ? 'Modo Carinho Ativo' : (isOnline ? 'Online' : 'Offline')}</span>
                  <span className="sm:hidden">{tpmMode ? 'TPM' : (isOnline ? 'On' : 'Off')}</span>
                </span>
                {apiError && (
                  <span className="text-[10px] text-red-600 font-semibold ml-1" title="Erro na conexão">
                    ⚠️
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              <motion.button
                onClick={() => navigate('/admin/dashboard')}
                whileHover={window.innerWidth >= 768 ? { scale: 1.1 } : {}}
                whileTap={{ scale: 0.92 }}
                className={`p-2.5 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation ${
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
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className={`p-2.5 rounded-xl transition-all shadow-lg ring-2 ring-offset-1 ${
                tpmMode 
                  ? 'bg-gradient-to-r from-pink-100 to-rose-200 hover:from-pink-200 hover:to-rose-300 text-rose-800 ring-pink-200/70 ring-offset-rose-50' 
                  : 'bg-gradient-to-r from-violet-100 to-indigo-200 hover:from-violet-200 hover:to-indigo-300 text-violet-800 ring-indigo-200/70 ring-offset-indigo-50'
              }`}
            >
              <Icons.Home />
            </motion.button>
          </div>
        </motion.header>

        {/* Messages Area */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ 
            scrollPaddingBottom: '160px',
            paddingBottom: keyboardHeight > 0 ? '20px' : '0',
            WebkitOverflowScrolling: 'touch', // Smooth scroll iOS
            scrollBehavior: 'smooth',
          }}
          onTouchStart={(e) => {
            // Fechar sidebar se tocar na área de mensagens quando sidebar estiver aberto
            if (sidebarOpen && window.innerWidth < 1024) {
              setSidebarOpen(false)
            }
          }}
        >
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
                      className={`group flex items-center gap-3 p-4 rounded-2xl text-left transition-all backdrop-blur-sm border shadow-lg hover:shadow-2xl hover:-translate-y-0.5 ${
                        tpmMode
                          ? 'bg-white/95 border-pink-200 hover:border-pink-400 shadow-pink-200/60'
                          : 'bg-white/96 border-indigo-100 hover:border-indigo-300 shadow-indigo-200/60'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${suggestion.color} text-white shadow-lg ring-2 ring-white/40`}>
                        {suggestion.icon}
                      </div>
                      <span className={`text-sm font-semibold ${
                        tpmMode ? 'text-rose-900' : 'text-slate-900'
                      }`}>
                        {suggestion.text}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Capacidades */}
                <div className={`mt-8 flex flex-wrap justify-center gap-3 ${
                  tpmMode ? 'text-rose-700' : 'text-indigo-700'
                }`}>
                  <span className={`flex items-center gap-1 text-xs bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-sm border shadow ${
                    tpmMode ? 'border-pink-200 shadow-pink-100/60' : 'border-indigo-100 shadow-indigo-100/60'
                  }`}>
                    <Icons.Globe /> Busca na Web
                  </span>
                  <span className={`flex items-center gap-1 text-xs bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-sm border shadow ${
                    tpmMode ? 'border-pink-200 shadow-pink-100/60' : 'border-indigo-100 shadow-indigo-100/60'
                  }`}>
                    <Icons.Weather /> Clima
                  </span>
                  <span className={`flex items-center gap-1 text-xs bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-sm border shadow ${
                    tpmMode ? 'border-pink-200 shadow-pink-100/60' : 'border-indigo-100 shadow-indigo-100/60'
                  }`}>
                    <Icons.Brain /> Memória
                  </span>
                  <span className={`flex items-center gap-1 text-xs bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-sm border shadow ${
                    tpmMode ? 'border-pink-200 shadow-pink-100/60' : 'border-indigo-100 shadow-indigo-100/60'
                  }`}>
                    <Icons.Calculator /> Cálculos
                  </span>
                </div>
              </motion.div>
            </div>
          ) : (
            // Lista de mensagens
            <div className="max-w-3xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6" style={{ paddingBottom: '140px' }}>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: window.innerWidth < 768 ? 0.2 : 0.4, // Animações mais rápidas no mobile
                    delay: window.innerWidth < 768 ? 0 : index * 0.05, // Sem delay no mobile
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={`flex gap-2 sm:gap-3 md:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <motion.div 
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-400' 
                        : msg.sender === 'pablo'
                          ? 'bg-gradient-to-br from-orange-600 to-red-600 ring-2 ring-orange-400'
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
                    whileHover={window.innerWidth >= 768 ? { scale: 1.1 } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    {msg.sender === 'user' ? (
                      <span className="text-white text-xs sm:text-sm font-bold">G</span>
                    ) : msg.sender === 'pablo' ? (
                      <span className="text-white text-xs sm:text-sm font-bold">P</span>
                    ) : (msg.sender === 'matteo' || msg.sender === 'bot') ? (
                      <MatteoLogo size="sm" className="w-5 h-5 sm:w-6 sm:h-6" />
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
                    whileHover={window.innerWidth >= 768 ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className={`inline-block p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap shadow-lg break-words ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-600/40 ring-2 ring-blue-400'
                          : msg.sender === 'pablo'
                            ? 'bg-gradient-to-br from-orange-200 to-red-200 text-gray-900 border-2 border-orange-400 shadow-orange-300/60'
                            : tpmMode 
                              ? 'bg-gradient-to-br from-pink-200 to-rose-200 text-gray-900 border-2 border-pink-400 shadow-pink-300/60' 
                              : 'bg-gradient-to-br from-violet-200 to-purple-200 text-gray-900 border-2 border-violet-400 shadow-violet-300/60'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{ 
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {(() => {
                        const MAX_LENGTH = 500
                        const isExpanded = expandedMessages.has(msg.id)
                        const shouldTruncate = msg.text.length > MAX_LENGTH
                        const displayText = shouldTruncate && !isExpanded 
                          ? msg.text.substring(0, MAX_LENGTH) + '...' 
                          : msg.text
                        
                        return (
                          <>
                            <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              {displayText}
                            </span>
                            {shouldTruncate && (
                              <button
                                onClick={() => {
                                  setExpandedMessages(prev => {
                                    const newSet = new Set(prev)
                                    if (isExpanded) {
                                      newSet.delete(msg.id)
                                    } else {
                                      newSet.add(msg.id)
                                    }
                                    return newSet
                                  })
                                }}
                                className={`ml-2 text-xs font-semibold underline hover:opacity-80 transition-opacity ${
                                  msg.sender === 'user' 
                                    ? 'text-blue-200' 
                                    : msg.sender === 'pablo'
                                      ? 'text-orange-600'
                                      : tpmMode ? 'text-rose-600' : 'text-violet-600'
                                }`}
                              >
                                {isExpanded ? 'Ver menos' : 'Ver mais'}
                              </button>
                            )}
                          </>
                        )
                      })()}
                    </motion.div>
                    <motion.p 
                      className={`text-[10px] sm:text-xs mt-1.5 font-bold ${
                        msg.sender === 'user' 
                          ? 'text-blue-300' 
                          : msg.sender === 'pablo'
                            ? 'text-orange-700'
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
        {/* No mobile: esconde quando sidebar está aberto. No desktop: sempre visível */}
        <motion.footer 
          animate={{ 
            opacity: sidebarOpen ? 0 : 1,
            x: sidebarOpen ? 288 : 0,
            pointerEvents: sidebarOpen ? 'none' : 'auto'
          }}
          transition={{ duration: 0.2 }}
          className={`px-3 sm:px-4 ${keyboardHeight > 0 ? 'py-2' : 'py-3'} border-t backdrop-blur-xl fixed bottom-0 left-0 right-0 z-40 lg:opacity-100 lg:translate-x-0 lg:pointer-events-auto lg:left-80 ${
            tpmMode 
              ? 'bg-gradient-to-r from-pink-200/95 via-rose-100/95 to-pink-200/95 border-pink-300/50' 
              : 'bg-gradient-to-r from-violet-200/95 via-purple-100/95 to-indigo-200/95 border-violet-300/50'
          }`} 
          style={{
            bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0',
            paddingBottom: keyboardHeight > 0 
              ? 'max(8px, env(safe-area-inset-bottom, 8px))' 
              : 'max(12px, env(safe-area-inset-bottom, 12px))'
          }}
        >
          <div className="max-w-3xl w-full mx-auto">
            {/* Seletor de sender para admin */}
            {isAdmin && (
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-xs font-semibold text-gray-600">Enviar como:</span>
                <div className="flex gap-1 bg-white/80 rounded-lg p-1 border border-gray-200">
                  {['gehh', 'pablo', 'matteo'].map((sender) => (
                    <button
                      key={sender}
                      onClick={() => setAdminSender(sender)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        adminSender === sender
                          ? sender === 'pablo'
                            ? 'bg-orange-500 text-white shadow-md'
                            : sender === 'matteo'
                            ? 'bg-violet-500 text-white shadow-md'
                            : 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {sender === 'gehh' ? 'Gehh' : sender === 'pablo' ? 'Pablo' : 'Matteo'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className={`flex items-end gap-2 sm:gap-3 ${keyboardHeight > 0 ? 'p-2.5' : 'p-3 sm:p-4'} rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm shadow-lg ${
              tpmMode 
            ? 'bg-white/95 border-pink-300/80 focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-200/50 focus-within:shadow-pink-200/30' 
            : 'bg-white/95 border-violet-300/80 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-200/50 focus-within:shadow-violet-200/30'
            }`}>
              <div className="flex-1 flex flex-col min-w-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= MAX_MESSAGE_LENGTH) {
                      setInput(value)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (!isSending && input.trim() && isOnline) {
                        handleSend()
                      }
                    }
                  }}
                  placeholder={!isOnline ? "Sem conexão..." : "Pergunte qualquer coisa..."}
                  rows={1}
                  disabled={isSending || !isOnline}
                  className={`w-full px-3 sm:px-4 ${keyboardHeight > 0 ? 'py-2.5' : 'py-3'} bg-transparent outline-none text-base sm:text-[16px] resize-none max-h-36 overflow-y-auto leading-relaxed ${
                    tpmMode ? 'text-gray-800 placeholder-gray-400' : 'text-slate-800 placeholder-slate-400'
                  } ${isSending || !isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-text'} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
                  style={{ 
                    minHeight: '48px',
                    fontSize: '16px', // Previne zoom no iOS
                    lineHeight: '1.5',
                  }}
                />
                {input.length > MAX_MESSAGE_LENGTH * 0.8 && (
                  <div className={`text-xs px-3 mt-1.5 font-medium ${
                    input.length >= MAX_MESSAGE_LENGTH 
                      ? 'text-red-600 font-bold' 
                      : input.length > MAX_MESSAGE_LENGTH * 0.9 
                        ? 'text-orange-600 font-semibold' 
                        : 'text-gray-500'
                  }`}>
                    {input.length} / {MAX_MESSAGE_LENGTH} caracteres
                  </div>
                )}
              </div>
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isSending || !isOnline}
                whileHover={input.trim() && !isSending && isOnline ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !isSending && isOnline ? { scale: 0.95 } : {}}
                className={`${keyboardHeight > 0 ? 'p-2.5' : 'p-3 sm:p-3.5'} rounded-xl transition-all duration-200 flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center touch-manipulation ${
                  input.trim() && !isSending && isOnline
                    ? tpmMode
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/40 ring-2 ring-pink-300/50 hover:shadow-xl hover:shadow-pink-500/50'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 ring-2 ring-violet-300/50 hover:shadow-xl hover:shadow-violet-500/40'
                    : tpmMode ? 'bg-pink-100/80 text-pink-300 cursor-not-allowed' : 'bg-violet-100/80 text-violet-300 cursor-not-allowed'
                }`}
                title={!isOnline ? 'Sem conexão' : isSending ? 'Enviando...' : !input.trim() ? 'Digite uma mensagem' : 'Enviar'}
                aria-label={!isOnline ? 'Sem conexão' : isSending ? 'Enviando...' : !input.trim() ? 'Digite uma mensagem' : 'Enviar'}
              >
                {isSending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`w-5 h-5 border-2 ${tpmMode ? 'border-white border-t-transparent' : 'border-white border-t-transparent'} rounded-full`}
                  />
                ) : (
                  <Icons.Send />
                )}
              </motion.button>
            </div>
            {keyboardHeight === 0 && (
              <p className={`text-center text-xs mt-2 ${
                tpmMode ? 'text-rose-500' : 'text-violet-500'
              }`}>
                Matteo pode cometer erros, igual a mim. Criado com 💙 pelo Pablo.
              </p>
            )}
          </div>
        </motion.footer>
      </div>

      {/* Modal de Confirmação de Deletar */}
      {deleteConfirmId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
              tpmMode 
                ? 'bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-400' 
                : 'bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-violet-400'
            }`}
          >
            <h3 className={`text-lg font-bold mb-2 ${tpmMode ? 'text-rose-900' : 'text-violet-900'}`}>
              Deletar conversa?
            </h3>
            <p className={`text-sm mb-6 ${tpmMode ? 'text-rose-700' : 'text-violet-700'}`}>
              Tem certeza que deseja deletar "{conversations.find(c => c.id === deleteConfirmId)?.title || 'esta conversa'}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <motion.button
                onClick={() => setDeleteConfirmId(null)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold ${
                  tpmMode 
                    ? 'bg-pink-200 text-rose-800 hover:bg-pink-300' 
                    : 'bg-violet-200 text-violet-800 hover:bg-violet-300'
                }`}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={deleteConversation}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600"
              >
                Deletar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-3 rounded-xl shadow-2xl max-w-sm ${
              toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            <p className="text-sm font-semibold text-center">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default MatteoPage
