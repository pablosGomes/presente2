import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  useEffect(() => {
    // Verificar se está autenticado
    const adminStatus = localStorage.getItem('pablo_admin')
    if (adminStatus !== 'true') {
      setShowPasswordPrompt(true)
      return
    }
    setIsAuthenticated(true)
  }, [])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    const SECRET_PASSWORD = 'gehh2024'
    
    if (password === SECRET_PASSWORD) {
      localStorage.setItem('pablo_admin', 'true')
      setIsAuthenticated(true)
      setShowPasswordPrompt(false)
      setError('')
    } else {
      setError('Senha incorreta')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pablo_admin')
    navigate('/admin')
  }

  // Mostrar prompt de senha se não estiver autenticado
  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-slate-600/70 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg">
              🔐
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Acesso Restrito</h2>
            <p className="text-slate-400 text-sm">Digite a senha para continuar</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/70 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-semibold"
                autoFocus
              />
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.p>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg ring-2 ring-amber-400/50 transition-all"
            >
              Entrar
            </motion.button>
          </form>
          
          <motion.button
            onClick={() => navigate('/presente')}
            className="w-full mt-4 py-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            ← Voltar
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0.3, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                🔐 Painel Admin
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-medium">
                Gerencie o mural e histórico de mensagens
              </p>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-xl ring-2 ring-red-500/50 transition-all"
            >
              Sair
            </motion.button>
          </div>
        </motion.div>

        {/* Cards de Acesso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Card Mural */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => navigate('/mural?admin=pablo')}
            className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-slate-600/70 shadow-2xl cursor-pointer transition-all hover:border-pink-500/80 hover:shadow-pink-500/30 hover:bg-slate-800/90"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-xl ring-2 ring-pink-400/50">
                💌
              </div>
              <span className="text-slate-400 text-lg sm:text-xl font-bold">→</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">
              Mural de Desabafos
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-4 font-medium">
              Visualize e gerencie todas as mensagens do mural da Gehh
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-pink-500/30 text-pink-200 rounded-lg text-xs font-bold border border-pink-400/50">
                Ver mensagens
              </span>
              <span className="px-3 py-1.5 bg-pink-500/30 text-pink-200 rounded-lg text-xs font-bold border border-pink-400/50">
                Responder
              </span>
              <span className="px-3 py-1.5 bg-pink-500/30 text-pink-200 rounded-lg text-xs font-bold border border-pink-400/50">
                Estatísticas
              </span>
            </div>
          </motion.div>

          {/* Card Histórico de Mensagens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => navigate('/matteo?admin=pablo')}
            className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-slate-600/70 shadow-2xl cursor-pointer transition-all hover:border-purple-500/80 hover:shadow-purple-500/30 hover:bg-slate-800/90"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-xl ring-2 ring-purple-400/50">
                🤖
              </div>
              <span className="text-slate-400 text-lg sm:text-xl font-bold">→</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">
              Histórico de Mensagens
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-4 font-medium">
              Acesse todas as conversas do Matteo e visualize o histórico completo
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-purple-500/30 text-purple-200 rounded-lg text-xs font-bold border border-purple-400/50">
                Ver conversas
              </span>
              <span className="px-3 py-1.5 bg-purple-500/30 text-purple-200 rounded-lg text-xs font-bold border border-purple-400/50">
                Buscar mensagens
              </span>
              <span className="px-3 py-1.5 bg-purple-500/30 text-purple-200 rounded-lg text-xs font-bold border border-purple-400/50">
                Deletar
              </span>
            </div>
          </motion.div>
        </div>

        {/* Informações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-slate-600/70 shadow-xl">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 drop-shadow-md">
              ℹ️ Informações
            </h3>
            <div className="space-y-3 text-slate-200 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-lg">•</span>
                <p className="font-medium">No <strong className="text-white font-bold">Mural</strong>, você pode ver todas as mensagens, responder, fixar e gerenciar o conteúdo</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-bold text-lg">•</span>
                <p className="font-medium">No <strong className="text-white font-bold">Histórico de Mensagens</strong>, você pode ver todas as conversas do Matteo, buscar por conteúdo e deletar conversas</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">•</span>
                <p className="font-medium">Use o botão <strong className="text-white font-bold">Sair</strong> para encerrar sua sessão de admin</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botão Voltar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => navigate('/presente')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-slate-400 hover:text-slate-200 text-sm sm:text-base transition-colors"
          >
            ← Voltar para o presente
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard

