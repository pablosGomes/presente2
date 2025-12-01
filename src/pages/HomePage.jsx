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
            className="font-pacifico text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 sm:mb-8 px-2"
            style={{ textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            🎉 Feliz Aniversário, Geovana! 💙
          </motion.h1>

          <motion.div
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate('/presente')}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-600 rounded-full font-poppins font-semibold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Abrir meu presente 🌷</span>
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage

