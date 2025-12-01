import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Flower from '../components/Flower'

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
      setError('Não foi possível carregar o mural. O servidor da API está rodando?')
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
      fetchFeedbacks() // Recarrega a lista
    } catch (err) {
      console.error(err)
      alert('Erro ao enviar mensagem. Verifique se o servidor da API está rodando.')
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
      fetchFeedbacks() // Recarrega a lista
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar mensagem. Verifique se o servidor da API está rodando.')
    }
  }

  const formatDate = (isoString) => {
    if (!isoString) return 'Data Desconhecida'
    const date = new Date(isoString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="h-screen w-screen fixed inset-0 overflow-hidden bg-gradient-to-br from-azul-claro via-white to-azul-bebe">
      {/* Flores decorativas */}
      <Flower delay={0.2} size={50} x={10} y={5} />
      <Flower delay={0.5} size={40} x={85} y={10} />
      <Flower delay={0.8} size={45} x={5} y={90} />
      <Flower delay={1} size={50} x={90} y={85} />

      {/* Conteúdo principal */}
      <div className="h-full w-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-20 md:pb-16">
          
          {/* Botão voltar */}
          <motion.button
            onClick={() => navigate('/presente')}
            className="mb-6 sm:mb-8 text-blue-700 hover:text-blue-800 font-poppins font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ x: -5 }}
          >
            <span>←</span> Voltar
          </motion.button>

          {/* Título */}
          <motion.div
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-pacifico text-3xl sm:text-4xl md:text-5xl text-blue-700 mb-2 leading-tight">
              💖 Mural de Desabafos da Gehh 😠
            </h1>
            <p className="font-poppins text-gray-600 text-lg sm:text-xl">
              Pode falar o que quiser, o Pablo vai ler tudo!
            </p>
          </motion.div>

          {/* Formulário de Nova Mensagem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl mb-10 border border-pink-200"
          >
            <form onSubmit={handleSubmit}>
              <textarea
                rows="4"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva aqui o que você está sentindo ou pensando sobre o Pablo..."
                className="w-full p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-800 resize-none"
                required
              />
              <div className="text-right mt-4">
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-full font-poppins font-semibold text-base shadow-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enviar Desabafo 💌
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Mural de Mensagens */}
          <h2 className="font-pacifico text-2xl sm:text-3xl text-blue-700 mb-6 text-center">
            Mensagens Anteriores
          </h2>

          {loading && <p className="text-center text-gray-500">Carregando mensagens...</p>}
          {error && <p className="text-center text-red-500 font-bold">{error}</p>}

          <div className="space-y-6">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-md border-l-4 border-blue-400 relative"
              >
                {editingId === feedback.id ? (
                  <form onSubmit={handleEditSubmit}>
                    <textarea
                      rows="4"
                      value={editingMessage}
                      onChange={(e) => setEditingMessage(e.target.value)}
                      className="w-full p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-gray-800 resize-none"
                      required
                    />
                    <div className="flex justify-end gap-3 mt-3">
                      <motion.button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-gray-600 rounded-full font-poppins hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-full font-poppins font-semibold hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Salvar Edição
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="font-poppins text-gray-800 text-base sm:text-lg whitespace-pre-wrap mb-3">
                      {feedback.message}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
                      <p>
                        <span className="font-semibold">Postado em:</span> {formatDate(feedback.created_at)}
                        {feedback.updated_at && (
                          <span className="ml-2 italic">(Editado: {formatDate(feedback.updated_at)})</span>
                        )}
                      </p>
                      <motion.button
                        onClick={() => handleEditStart(feedback)}
                        className="text-blue-500 hover:text-blue-700 transition-colors font-semibold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Editar ✏️
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
            
            {feedbacks.length === 0 && !loading && !error && (
              <p className="text-center text-gray-500 italic">Nenhuma mensagem ainda. Seja a primeira a desabafar! 😉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MuralDesabafosPage
