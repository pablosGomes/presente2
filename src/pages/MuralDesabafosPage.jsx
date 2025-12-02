import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// URL da API - em produção usa URL relativa (mesmo servidor), em dev usa localhost
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

const MuralDesabafosPage = () => {
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingMessage, setEditingMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/feedback`)
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens')
      }
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

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      setNewMessage('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      fetchFeedbacks()
    } catch (err) {
      console.error(err)
      alert('Erro ao enviar mensagem.')
    }
  }

  const handleEditStart = (feedback) => {
    setEditingId(feedback.id)
    setEditingMessage(feedback.message)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingMessage.trim()) return

    try {
      const response = await fetch(`${API_URL}/api/feedback/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editingMessage })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar mensagem')
      }

      setEditingId(null)
      setEditingMessage('')
      fetchFeedbacks()
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar mensagem.')
    }
  }

  const formatDate = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora mesmo'
    if (diffMins < 60) return `Há ${diffMins} min`
    if (diffHours < 24) return `Há ${diffHours}h`
    if (diffDays < 7) return `Há ${diffDays} dias`
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      {/* Header fixo mobile-friendly */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 px-4 py-3 safe-area-top"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button
            onClick={() => navigate('/presente')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 active:bg-pink-200 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </motion.button>
          
          <div className="text-center">
            <h1 className="font-bold text-lg text-gray-800">Mural da Gehh</h1>
            <p className="text-xs text-pink-500">💕 Só você e o Pablo veem</p>
          </div>
          
          <div className="w-10 h-10 flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
        </div>
      </motion.header>

      {/* Conteúdo principal */}
      <main className="px-4 py-6 pb-32 max-w-lg mx-auto">
        
        {/* Card de novo desabafo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg shadow-pink-100/50 p-5 mb-6 border border-pink-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-lg">
              😤
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Novo Desabafo</p>
              <p className="text-xs text-gray-400">O que o Pablo aprontou agora?</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <textarea
              rows="3"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Desabafa aqui, princesa... 💭"
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-700 placeholder-gray-400 text-base resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
              style={{ fontSize: '16px' }} // Previne zoom no iOS
              required
            />
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">
                {newMessage.length > 0 ? `${newMessage.length} caracteres` : 'Pode escrever à vontade!'}
              </p>
              <motion.button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-pink-200 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
                whileTap={{ scale: 0.95 }}
              >
                Enviar 💌
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Notificação de sucesso */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-medium text-sm"
            >
              ✅ Desabafo enviado!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
          <span className="text-xs text-gray-400 font-medium">Desabafos Anteriores</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div 
              className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="mt-4 text-gray-400 text-sm">Carregando...</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center"
          >
            <p className="text-red-500 text-sm">{error}</p>
            <button 
              onClick={fetchFeedbacks}
              className="mt-2 text-red-600 font-medium text-sm underline"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}

        {/* Lista de feedbacks */}
        <div className="space-y-4">
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {editingId === feedback.id ? (
                /* Modo de edição */
                <form onSubmit={handleEditSubmit} className="p-4">
                  <textarea
                    rows="3"
                    value={editingMessage}
                    onChange={(e) => setEditingMessage(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl text-gray-700 text-base resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ fontSize: '16px' }}
                    autoFocus
                    required
                  />
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm active:bg-gray-200 transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium text-sm active:bg-pink-600 transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      Salvar ✓
                    </motion.button>
                  </div>
                </form>
              ) : (
                /* Modo visualização */
                <div className="p-4">
                  <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                    {feedback.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🕐</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(feedback.created_at)}
                        {feedback.updated_at && ' (editado)'}
                      </span>
                    </div>
                    
                    <motion.button
                      onClick={() => handleEditStart(feedback)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium active:bg-gray-100 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {feedbacks.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">💭</span>
            </div>
            <p className="text-gray-600 font-medium">Nenhum desabafo ainda</p>
            <p className="text-gray-400 text-sm mt-1">
              Seja a primeira a escrever! O Pablo vai ler 👀
            </p>
          </motion.div>
        )}

        {/* Dica no final */}
        {feedbacks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-400">
              💡 Dica: Você também pode falar com o Matteo e pedir pra ele postar aqui!
            </p>
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-lg shadow-pink-300/50 flex items-center justify-center text-white z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </motion.button>

      {/* Safe area bottom para iOS */}
      <div className="h-6 safe-area-bottom"></div>
    </div>
  )
}

export default MuralDesabafosPage
