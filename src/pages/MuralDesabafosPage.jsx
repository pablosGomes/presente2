import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

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
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
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
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">📊 Estatísticas</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">✕</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-rose-600">{stats.total_posts}</p>
          <p className="text-xs text-rose-500 mt-1">Total de Desabafos</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-violet-600">{stats.posts_this_month}</p>
          <p className="text-xs text-violet-500 mt-1">Este Mês</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{stats.current_streak}🔥</p>
          <p className="text-xs text-amber-500 mt-1">Dias Seguidos</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.total_replies}</p>
          <p className="text-xs text-emerald-500 mt-1">Respostas do Pablo</p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-sm text-gray-500 mb-2">Humor mais frequente:</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{MOODS[stats.most_common_mood]?.emoji || '😐'}</span>
          <span className="font-medium text-gray-700">{MOODS[stats.most_common_mood]?.label || 'Normal'}</span>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

// Componente de Conquistas
const AchievementsModal = ({ achievements, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">🏆 Conquistas</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">✕</button>
      </div>
      
      <div className="space-y-3">
        {achievements.map((ach) => (
          <div
            key={ach.key}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              ach.unlocked 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' 
                : 'bg-gray-50 opacity-50'
            }`}
          >
            <span className="text-2xl">{ach.emoji}</span>
            <div className="flex-1">
              <p className={`font-medium ${ach.unlocked ? 'text-amber-700' : 'text-gray-400'}`}>{ach.name}</p>
              <p className="text-xs text-gray-500">{ach.description}</p>
            </div>
            {ach.unlocked && <span className="text-green-500 text-lg">✓</span>}
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
)

// Componente de Card do Feedback
const FeedbackCard = ({ feedback, onEdit, onDelete, onPin, onReply, isAdmin }) => {
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  
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
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`rounded-2xl overflow-hidden shadow-sm border transition-all ${
        feedback.is_letter 
          ? 'bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-pink-200 shadow-pink-100' 
          : `${mood.bg} ${mood.border}`
      } ${feedback.is_pinned ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {feedback.is_pinned && <span className="text-amber-500">📌</span>}
          {feedback.is_letter && <span className="text-pink-500">💌</span>}
          <span className="text-lg">{mood.emoji}</span>
          <span className={`text-xs font-medium ${mood.text}`}>{mood.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {feedback.is_read && (
            <span className="text-xs text-emerald-500 flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
                <path d="M20 6L9 17" strokeOpacity="0.5"/>
              </svg>
              Visto
            </span>
          )}
          <span className="text-xs text-gray-400">{formatDate(feedback.created_at)}</span>
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className={`px-4 pb-3 ${feedback.is_letter ? 'font-serif italic' : ''}`}>
        <p className={`text-gray-800 leading-relaxed whitespace-pre-wrap ${feedback.is_letter ? 'text-lg' : ''}`}>
          {feedback.message}
        </p>
        {feedback.updated_at && (
          <p className="text-xs text-gray-400 mt-2 italic">(editado)</p>
        )}
      </div>
      
      {/* Respostas */}
      {feedback.replies && feedback.replies.length > 0 && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-blue-500 font-medium flex items-center gap-1"
          >
            💬 {feedback.replies.length} resposta{feedback.replies.length > 1 ? 's' : ''} do Pablo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform ${showReplies ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          
          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {feedback.replies.map((reply) => (
                  <div key={reply.id} className="bg-white/80 rounded-xl p-3 border border-blue-100">
                    <p className="text-sm text-gray-700">{reply.message}</p>
                    <p className="text-xs text-blue-400 mt-1">Pablo • {formatDate(reply.created_at)}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Ações */}
      <div className="px-4 pb-4 flex items-center justify-between border-t border-black/5 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(feedback)}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white/50 rounded-lg hover:bg-white transition-colors"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete(feedback.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-500 bg-white/50 rounded-lg hover:bg-red-50 transition-colors"
          >
            🗑️
          </button>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPin(feedback.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                feedback.is_pinned 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-white/50 text-gray-500 hover:bg-amber-50'
              }`}
            >
              📌
            </button>
          </div>
        )}
      </div>
      
      {/* Campo de resposta (admin) */}
      {isAdmin && (
        <div className="px-4 pb-4 border-t border-black/5 pt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Responder como Pablo..."
              className="flex-1 px-3 py-2 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ fontSize: '16px' }}
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || isReplying}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl disabled:opacity-50"
            >
              {isReplying ? '...' : '💬'}
            </button>
          </div>
        </div>
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
    const urlParams = new URLSearchParams(window.location.search)
    setIsAdmin(urlParams.get('admin') === 'pablo')
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

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/feedback/${id}/read`, { method: 'PATCH' })
      fetchFeedbacks()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-pink-100 px-4 py-3"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => navigate('/presente')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="text-center">
            <h1 className="font-bold text-lg text-gray-800">Mural da Gehh</h1>
            <p className="text-xs text-pink-500">💕 {isAdmin ? 'Modo Pablo' : 'Só você e o Pablo veem'}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { fetchStats(); setShowStats(true) }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600"
            >
              📊
            </button>
            <button 
              onClick={() => { fetchAchievements(); setShowAchievements(true) }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600"
            >
              🏆
            </button>
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-lg mx-auto flex">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'new' 
                ? 'text-pink-600 border-b-2 border-pink-500' 
                : 'text-gray-500'
            }`}
          >
            ✍️ Novo Desabafo
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'text-pink-600 border-b-2 border-pink-500' 
                : 'text-gray-500'
            }`}
          >
            📜 Histórico ({feedbacks.length})
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="px-4 py-6 pb-32 max-w-lg mx-auto">
        
        {/* Novas Conquistas */}
        <AnimatePresence>
          {newAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-4 text-white shadow-lg"
            >
              <p className="font-bold mb-2">🎉 Nova Conquista!</p>
              {newAchievements.map((ach, i) => (
                <p key={i} className="text-sm">{ach.emoji} {ach.name} - {ach.description}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab: Novo Desabafo */}
        {activeTab === 'new' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Seletor de Humor */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
              <p className="text-sm font-medium text-gray-600 mb-3">Como você está se sentindo?</p>
              <div className="flex justify-between">
                {Object.entries(MOODS).map(([key, mood]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      selectedMood === key 
                        ? `bg-gradient-to-br ${mood.color} text-white scale-110 shadow-lg` 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Carta */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-pink-100 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">💌</span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm">Modo Carta</p>
                  <p className="text-xs text-gray-500 truncate">Escreva como uma carta romântica</p>
                </div>
              </div>
              <button
                onClick={() => setIsLetter(!isLetter)}
                className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
                  isLetter ? 'bg-pink-500' : 'bg-gray-200'
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isLetter ? 'left-6' : 'left-1'
                }`}/>
              </button>
            </div>

            {/* Campo de Texto */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                isLetter ? 'border-pink-200 bg-gradient-to-br from-rose-50 to-pink-50' : 'border-gray-100'
              }`}>
                <textarea
                  rows="6"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isLetter ? "Querido Pablo,\n\nEscreva sua cartinha aqui..." : "Desabafa aqui, princesa... 💭"}
                  className={`w-full p-4 bg-transparent text-gray-700 placeholder-gray-400 resize-none focus:outline-none ${
                    isLetter ? 'font-serif italic text-lg' : ''
                  }`}
                  style={{ fontSize: '16px' }}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {newMessage.length > 0 ? `${newMessage.length} caracteres` : ''}
                </p>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`px-6 py-3 text-white rounded-full font-semibold text-sm shadow-lg disabled:opacity-50 transition-all bg-gradient-to-r ${
                    MOODS[selectedMood].color
                  }`}
                >
                  {isLetter ? 'Enviar Carta 💌' : 'Enviar 💬'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div 
                  className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-500 text-sm">{error}</p>
                <button onClick={fetchFeedbacks} className="mt-2 text-red-600 font-medium text-sm underline">
                  Tentar novamente
                </button>
              </div>
            )}

            <AnimatePresence>
              {feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onEdit={setEditingFeedback}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                  onPin={handlePin}
                  onReply={handleReply}
                  isAdmin={isAdmin}
                />
              ))}
            </AnimatePresence>

            {feedbacks.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">💭</span>
                </div>
                <p className="text-gray-600 font-medium">Nenhum desabafo ainda</p>
                <p className="text-gray-400 text-sm mt-1">Comece a escrever!</p>
              </div>
            )}
          </motion.div>
        )}
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

      {/* Botão Admin - Discreto mas visível */}
      {!isAdmin && (
        <motion.button
          onClick={() => navigate('/admin')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 right-4 w-10 h-10 bg-slate-800/20 hover:bg-slate-800/40 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all shadow-sm hover:shadow-md"
          title="Admin"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </motion.button>
      )}
    </div>
  )
}

export default MuralDesabafosPage
