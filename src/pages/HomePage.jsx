import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Flower from '../components/Flower'

const HomePage = () => {
  const navigate = useNavigate()

  const flowers = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    size: 30 + Math.random() * 30,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-azul-claro via-azul-bebe to-white fixed inset-0 overflow-hidden">
      {/* Flores flutuantes */}
      {flowers.map((flower) => (
        <Flower
          key={flower.id}
          delay={flower.delay}
          size={flower.size}
          x={flower.x}
          y={flower.y}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 py-8 sm:py-12 pb-20 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center w-full max-w-4xl"
        >
          <motion.h1
            className="font-pacifico text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-6 sm:mb-8 px-2 sm:px-4"
            style={{ textShadow: '4px 4px 12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            🎉 Feliz Aniversário, Geovana! 💙
          </motion.h1>

          <motion.div
            className="mt-6 sm:mt-8 md:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate('/presente')}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-700 rounded-full font-poppins font-bold text-sm sm:text-base md:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group ring-4 ring-white/50"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Abrir meu presente 🌷</span>
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Botão Admin - Engrenagem no canto inferior esquerdo */}
      <motion.button
        onClick={() => {
          const isAdmin = localStorage.getItem('pablo_admin') === 'true'
          navigate(isAdmin ? '/admin/dashboard' : '/admin')
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 left-4 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all shadow-xl hover:shadow-2xl ring-2 ring-amber-400/50 z-50"
        title="Acesso Admin"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </motion.button>
    </div>
  )
}

export default HomePage

