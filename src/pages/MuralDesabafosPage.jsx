import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

// ============ CONFIGURAÇÕES DE ANIMAÇÃO ============
const springConfig = { type: "spring", stiffness: 300, damping: 30 }
const smoothSpring = { type: "spring", stiffness: 200, damping: 25 }
const gentleSpring = { type: "spring", stiffness: 120, damping: 20 }

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: smoothSpring
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: springConfig
}

const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: smoothSpring
}

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: smoothSpring
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: gentleSpring
}

// Configuração de Moods
const MOODS = {
  happy: { emoji: '😊', label: 'Feliz', color: 'from-yellow-400 to-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  sad: { emoji: '😢', label: 'Triste', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  angry: { emoji: '😤', label: 'Irritada', color: 'from-red-400 to-rose-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  love: { emoji: '😍', label: 'Apaixonada', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  neutral: { emoji: '😐', label: 'Normal', color: 'from-gray-400 to-slate-500', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
}

// Componente de Conquista
const AchievementBadge = ({ achievement, small = false }) => (
  <motion.div
    initial={{ scale: 0, rotate: -10 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={springConfig}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-2 ${small ? 'px-2 py-1' : 'px-3 py-2'} rounded-full ${
      achievement.unlocked 
        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg' 
        : 'bg-gray-100 text-gray-400'
    }`}
  >
    <span className={small ? 'text-sm' : 'text-lg'}>{achievement.emoji}</span>
    {!small && <span className="text-xs font-medium">{achievement.name}</span>}
  </motion.div>
)

// Componente de Estatísticas
const StatsCard = ({ stats, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.85, y: 30, opacity: 0 }}
      transition={smoothSpring}
      className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-800">📊 Estatísticas</h2>
        <motion.button 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
          whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {[
          { value: stats.total_posts, label: 'Total de Desabafos', colors: 'from-pink-50 to-rose-100', textColor: 'text-rose-600', subColor: 'text-rose-500' },
          { value: stats.posts_this_month, label: 'Este Mês', colors: 'from-purple-50 to-violet-100', textColor: 'text-violet-600', subColor: 'text-violet-500' },
          { value: `${stats.current_streak}🔥`, label: 'Dias Seguidos', colors: 'from-amber-50 to-yellow-100', textColor: 'text-amber-600', subColor: 'text-amber-500' },
          { value: stats.total_replies, label: 'Respostas do Pablo', colors: 'from-emerald-50 to-green-100', textColor: 'text-emerald-600', subColor: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={staggerItem}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-gradient-to-br ${stat.colors} rounded-2xl p-4 text-center cursor-default`}
          >
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            <p className={`text-xs ${stat.subColor} mt-1`}>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="bg-gray-50 rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-gray-500 mb-2">Humor mais frequente:</p>
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {MOODS[stats.most_common_mood]?.emoji || '😐'}
          </motion.span>
          <span className="font-medium text-gray-700">{MOODS[stats.most_common_mood]?.label || 'Normal'}</span>
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
)

// Componente de Conquistas
const AchievementsModal = ({ achievements, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.85, y: 30, opacity: 0 }}
      transition={smoothSpring}
      className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-800">🏆 Conquistas</h2>
        <motion.button 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
          whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="space-y-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {achievements.map((ach, index) => (
          <motion.div
            key={ach.key}
            variants={staggerItem}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              ach.unlocked 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' 
                : 'bg-gray-50 opacity-50'
            }`}
          >
            <motion.span 
              className="text-2xl"
              animate={ach.unlocked ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {ach.emoji}
            </motion.span>
            <div className="flex-1">
              <p className={`font-medium ${ach.unlocked ? 'text-amber-700' : 'text-gray-400'}`}>{ach.name}</p>
              <p className="text-xs text-gray-500">{ach.description}</p>
            </div>
            {ach.unlocked && (
              <motion.span 
                className="text-green-500 text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: index * 0.05 }}
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </motion.div>
)

// Componente de Card do Feedback
const FeedbackCard = ({ feedback, onEdit, onDelete, onPin, onReply, onMarkRead, onPoke, isAdmin }) => {
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isPoking, setIsPoking] = useState(false)
  const [pokeSent, setPokeSent] = useState(false)
  
  const mood = MOODS[feedback.mood] || MOODS.neutral
  
  const formatDate = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }
  
  const handleReply = async () => {
    if (!replyText.trim()) return
    setIsReplying(true)
    await onReply(feedback.id, replyText)
    setReplyText('')
    setIsReplying(false)
  }
  
  const handlePoke = async () => {
    setIsPoking(true)
    const success = await onPoke(feedback.id)
    setIsPoking(false)
    if (success) {
      setPokeSent(true)
      setTimeout(() => setPokeSent(false), 3000)
    }
  }
  
  return (
    <motion.div
      layout
      layoutId={feedback.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -50 }}
      transition={smoothSpring}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className={`rounded-2xl overflow-hidden shadow-sm border ${
        feedback.is_letter 
          ? 'bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-pink-200 shadow-pink-100' 
          : `${mood.bg} ${mood.border}`
      } ${feedback.is_pinned ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {feedback.is_pinned && (
            <motion.span 
              className="text-amber-500"
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.5 }}
            >
              📌
            </motion.span>
          )}
          {feedback.is_letter && (
            <motion.span 
              className="text-pink-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              💌
            </motion.span>
          )}
          <span className="text-lg">{mood.emoji}</span>
          <span className={`text-xs font-medium ${mood.text}`}>{mood.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {feedback.is_read && (
            <motion.span 
              className="text-xs text-emerald-500 flex items-center gap-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springConfig}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
                <path d="M20 6L9 17" strokeOpacity="0.5"/>
              </svg>
              Visto
            </motion.span>
          )}
          <span className="text-xs text-gray-400">{formatDate(feedback.created_at)}</span>
        </div>
      </div>
      
      {/* Conteúdo */}
      <motion.div 
        className={`px-4 pb-3 ${feedback.is_letter ? 'font-serif italic' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className={`text-gray-800 leading-relaxed whitespace-pre-wrap ${feedback.is_letter ? 'text-lg' : ''}`}>
          {feedback.message}
        </p>
        {feedback.updated_at && (
          <p className="text-xs text-gray-400 mt-2 italic">(editado)</p>
        )}
      </motion.div>
      
      {/* Respostas */}
      {feedback.replies && feedback.replies.length > 0 && (
        <div className="px-4 pb-3">
          <motion.button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-blue-500 font-medium flex items-center gap-1"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            💬 {feedback.replies.length} resposta{feedback.replies.length > 1 ? 's' : ''} do Pablo
            <motion.svg 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              animate={{ rotate: showReplies ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M6 9l6 6 6-6"/>
            </motion.svg>
          </motion.button>
          
          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {feedback.replies.map((reply, index) => (
                  <motion.div 
                    key={reply.id} 
                    className="bg-white/80 rounded-xl p-3 border border-blue-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, ...smoothSpring }}
                  >
                    <p className="text-sm text-gray-700">{reply.message}</p>
                    <p className="text-xs text-blue-400 mt-1">Pablo • {formatDate(reply.created_at)}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Ações */}
      <div className="px-4 pb-4 flex items-center justify-between border-t border-black/5 pt-3">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onEdit(feedback)}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white/50 rounded-lg hover:bg-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✏️ Editar
          </motion.button>
          <motion.button
            onClick={() => onDelete(feedback.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-500 bg-white/50 rounded-lg hover:bg-red-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🗑️
          </motion.button>
          
          {/* Botão Cutucar - só aparece se não tem resposta */}
          {!isAdmin && (!feedback.replies || feedback.replies.length === 0) && (
            <motion.button
              onClick={handlePoke}
              disabled={isPoking || pokeSent}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                pokeSent 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isPoking ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              title="Cutucar Pablo para responder!"
            >
              {isPoking ? '...' : pokeSent ? '✓ Enviado!' : '👉 Cutucar'}
            </motion.button>
          )}
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onMarkRead(feedback.id, !feedback.is_read)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                feedback.is_read 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-white/50 text-gray-500 hover:bg-emerald-50'
              }`}
              title={feedback.is_read ? 'Marcar como não lido' : 'Marcar como lido'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {feedback.is_read ? '✓✓' : '✓'}
            </motion.button>
            <motion.button
              onClick={() => onPin(feedback.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                feedback.is_pinned 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-white/50 text-gray-500 hover:bg-amber-50'
              }`}
              title={feedback.is_pinned ? 'Desafixar' : 'Fixar no topo'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📌
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Campo de resposta (admin) */}
      {isAdmin && (
        <motion.div 
          className="px-4 pb-4 border-t border-black/5 pt-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Responder como Pablo..."
              className="flex-1 px-3 py-2 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
              style={{ fontSize: '16px' }}
            />
            <motion.button
              onClick={handleReply}
              disabled={!replyText.trim() || isReplying}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isReplying ? '...' : '💬'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Componente Principal
const MuralDesabafosPage = () => {
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedMood, setSelectedMood] = useState('neutral')
  const [isLetter, setIsLetter] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingFeedback, setEditingFeedback] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [newAchievements, setNewAchievements] = useState([])
  const [stats, setStats] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [showStats, setShowStats] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [activeTab, setActiveTab] = useState('new') // 'new' | 'history'

  // Verificar se é admin (Pablo)
  useEffect(() => {
    const adminStatus = localStorage.getItem('pablo_admin') === 'true'
    const urlParams = new URLSearchParams(window.location.search)
    const urlAdmin = urlParams.get('admin') === 'pablo'
    setIsAdmin(adminStatus || urlAdmin)
  }, [])

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/feedback`)
      if (!response.ok) throw new Error('Erro ao buscar mensagens')
      const data = await response.json()
      setFeedbacks(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar o mural.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/achievements`)
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
    fetchStats()
    fetchAchievements()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage,
          mood: selectedMood,
          is_letter: isLetter
        })
      })

      if (!response.ok) throw new Error('Erro ao enviar')
      
      const data = await response.json()
      
      setNewMessage('')
      setSelectedMood('neutral')
      setIsLetter(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      
      // Mostrar novas conquistas
      if (data.new_achievements && data.new_achievements.length > 0) {
        setNewAchievements(data.new_achievements)
        setTimeout(() => setNewAchievements([]), 5000)
      }
      
      fetchFeedbacks()
      fetchStats()
      fetchAchievements()
      setActiveTab('history')
    } catch (err) {
      console.error(err)
      alert('Erro ao enviar mensagem.')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!editingFeedback || !editingFeedback.message.trim()) return

    try {
      const response = await fetch(`${API_URL}/api/feedback/${editingFeedback.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: editingFeedback.message,
          mood: editingFeedback.mood,
          is_letter: editingFeedback.is_letter
        })
      })

      if (!response.ok) throw new Error('Erro ao atualizar')
      
      setEditingFeedback(null)
      fetchFeedbacks()
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar.')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erro ao deletar')
      setShowDeleteConfirm(null)
      fetchFeedbacks()
      fetchStats()
    } catch (err) {
      console.error(err)
      alert('Erro ao deletar.')
    }
  }

  const handlePin = async (id) => {
    try {
      await fetch(`${API_URL}/api/feedback/${id}/pin`, { method: 'PATCH' })
      fetchFeedbacks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReply = async (feedbackId, message) => {
    try {
      await fetch(`${API_URL}/api/feedback/${feedbackId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      fetchFeedbacks()
      fetchAchievements()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkRead = async (id, markAsRead = true) => {
    try {
      const endpoint = markAsRead 
        ? `${API_URL}/api/feedback/${id}/read`
        : `${API_URL}/api/feedback/${id}/unread`
      await fetch(endpoint, { method: 'PATCH' })
      fetchFeedbacks()
    } catch (err) {
      console.error(err)
    }
  }

  const handlePoke = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/${id}/poke`, { method: 'PATCH' })
      const data = await response.json()
      
      if (response.ok) {
        // Atualizar conquistas (pode ter desbloqueado "Cutucadora")
        fetchAchievements()
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-pink-100 px-4 py-3"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={smoothSpring}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => navigate('/presente')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600"
              whileHover={{ scale: 1.1, backgroundColor: '#fecdd3' }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </motion.button>
            {isAdmin && (
              <motion.button
                onClick={() => navigate('/admin/dashboard')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-700"
                whileHover={{ scale: 1.1, backgroundColor: '#fde68a' }}
                whileTap={{ scale: 0.9 }}
                title="Voltar ao Dashboard Admin"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </motion.button>
            )}
          </div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-bold text-lg text-gray-800">Mural da Gehh</h1>
            <p className="text-xs text-pink-500">💕 {isAdmin ? 'Modo Pablo' : 'Só você e o Pablo veem'}</p>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <motion.button 
              onClick={() => { fetchStats(); setShowStats(true) }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              📊
            </motion.button>
            <motion.button 
              onClick={() => { fetchAchievements(); setShowAchievements(true) }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              🏆
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-lg mx-auto flex relative">
          {/* Indicador animado */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-pink-500"
            initial={false}
            animate={{
              left: activeTab === 'new' ? '0%' : '50%',
              width: '50%'
            }}
            transition={smoothSpring}
          />
          <motion.button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'new' ? 'text-pink-600' : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            ✍️ Novo Desabafo
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'history' ? 'text-pink-600' : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            📜 Histórico ({feedbacks.length})
          </motion.button>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="px-4 py-6 pb-32 max-w-lg mx-auto">
        
        {/* Novas Conquistas */}
        <AnimatePresence>
          {newAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={springConfig}
              className="mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-4 text-white shadow-lg"
            >
              <motion.p 
                className="font-bold mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                🎉 Nova Conquista!
              </motion.p>
              {newAchievements.map((ach, i) => (
                <motion.p 
                  key={i} 
                  className="text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {ach.emoji} {ach.name} - {ach.description}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab: Novo Desabafo */}
        <AnimatePresence mode="wait">
        {activeTab === 'new' && (
          <motion.div
            key="new-tab"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={smoothSpring}
            className="space-y-6"
          >
            {/* Seletor de Humor */}
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-medium text-gray-600 mb-3">Como você está se sentindo?</p>
              <div className="flex justify-between">
                {Object.entries(MOODS).map(([key, mood], index) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                      selectedMood === key 
                        ? `bg-gradient-to-br ${mood.color} text-white shadow-lg` 
                        : 'hover:bg-gray-100'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: selectedMood === key ? 1.1 : 1
                    }}
                    transition={{ delay: index * 0.05, ...smoothSpring }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Toggle Carta */}
            <motion.div 
              className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-pink-100 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <motion.span 
                  className="text-2xl flex-shrink-0"
                  animate={{ rotate: isLetter ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  💌
                </motion.span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm">Modo Carta</p>
                  <p className="text-xs text-gray-500 truncate">Escreva como uma carta romântica</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsLetter(!isLetter)}
                className={`w-12 h-7 rounded-full relative flex-shrink-0 ${
                  isLetter ? 'bg-pink-500' : 'bg-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  animate={{ left: isLetter ? 24 : 4 }}
                  transition={springConfig}
                />
              </motion.button>
            </motion.div>

            {/* Campo de Texto */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                  isLetter ? 'border-pink-200 bg-gradient-to-br from-rose-50 to-pink-50' : 'border-gray-100'
                }`}
                animate={{ 
                  borderColor: isLetter ? '#fbcfe8' : '#f3f4f6',
                  backgroundColor: isLetter ? '#fff1f2' : '#ffffff'
                }}
                transition={{ duration: 0.3 }}
              >
                <textarea
                  rows="6"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isLetter ? "Querido Pablo,\n\nEscreva sua cartinha aqui..." : "Desabafa aqui, princesa... 💭"}
                  className={`w-full p-4 bg-transparent text-gray-700 placeholder-gray-400 resize-none focus:outline-none transition-all ${
                    isLetter ? 'font-serif italic text-lg' : ''
                  }`}
                  style={{ fontSize: '16px' }}
                  required
                />
              </motion.div>
              
              <div className="flex items-center justify-between">
                <motion.p 
                  className="text-xs text-gray-400"
                  animate={{ opacity: newMessage.length > 0 ? 1 : 0 }}
                >
                  {newMessage.length} caracteres
                </motion.p>
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`px-6 py-3 text-white rounded-full font-semibold text-sm shadow-lg disabled:opacity-50 bg-gradient-to-r ${
                    MOODS[selectedMood].color
                  }`}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLetter ? 'Enviar Carta 💌' : 'Enviar 💬'}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'history' && (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={smoothSpring}
            className="space-y-4"
          >
            {loading && (
              <motion.div 
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                <motion.p 
                  className="mt-4 text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Carregando...
                </motion.p>
              </motion.div>
            )}

            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-red-500 text-sm">{error}</p>
                <motion.button 
                  onClick={fetchFeedbacks} 
                  className="mt-2 text-red-600 font-medium text-sm underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tentar novamente
                </motion.button>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {feedbacks.map((feedback, index) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onEdit={setEditingFeedback}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                  onPin={handlePin}
                  onReply={handleReply}
                  onMarkRead={handleMarkRead}
                  onPoke={handlePoke}
                  isAdmin={isAdmin}
                />
              ))}
            </AnimatePresence>

            {feedbacks.length === 0 && !loading && !error && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-4xl">💭</span>
                </motion.div>
                <p className="text-gray-600 font-medium">Nenhum desabafo ainda</p>
                <p className="text-gray-400 text-sm mt-1">Comece a escrever!</p>
              </motion.div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Modais */}
      <AnimatePresence>
        {showStats && stats && <StatsCard stats={stats} onClose={() => setShowStats(false)} />}
        {showAchievements && <AchievementsModal achievements={achievements} onClose={() => setShowAchievements(false)} />}
        
        {/* Modal de Edição */}
        {editingFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setEditingFeedback(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">✏️ Editar Desabafo</h2>
                <button onClick={() => setEditingFeedback(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">✕</button>
              </div>
              
              <form onSubmit={handleEdit} className="space-y-4">
                {/* Mood Selector */}
                <div className="flex justify-between">
                  {Object.entries(MOODS).map(([key, mood]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEditingFeedback({...editingFeedback, mood: key})}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        editingFeedback.mood === key 
                          ? `bg-gradient-to-br ${mood.color} text-white scale-110` 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{mood.emoji}</span>
                    </button>
                  ))}
                </div>
                
                <textarea
                  rows="5"
                  value={editingFeedback.message}
                  onChange={(e) => setEditingFeedback({...editingFeedback, message: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
                  style={{ fontSize: '16px' }}
                  required
                />
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingFeedback(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium"
                  >
                    Salvar ✓
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Confirmação de Delete */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-xs text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Deletar desabafo?</h3>
              <p className="text-sm text-gray-500 mb-6">Essa ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium"
                >
                  Deletar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Notificação de Sucesso */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-medium text-sm"
          >
            ✅ Enviado com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Admin - Engrenagem no canto inferior esquerdo */}
      <motion.button
        onClick={() => {
          const adminStatus = localStorage.getItem('pablo_admin') === 'true'
          navigate(adminStatus ? '/admin/dashboard' : '/admin')
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-4 left-4 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all shadow-xl hover:shadow-2xl ring-2 ring-amber-400/50 z-50 ${isAdmin ? 'opacity-70' : ''}`}
        title={isAdmin ? "Dashboard Admin" : "Acesso Admin"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </motion.button>
    </div>
  )
}

export default MuralDesabafosPage
