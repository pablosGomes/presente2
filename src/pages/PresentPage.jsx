import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Petal from '../components/Petal'
import Flower from '../components/Flower'

const PresentPage = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = "Oi Gehh 💙, feliz aniversário!\n\nQue esse novo ciclo venha cheio de amor, sorrisos e sonhos realizados.\n\nEsse site é um pedacinho do quanto você é especial pra mim."
  const typingIntervalRef = useRef(null)
  
  // Memoizar pétalas para evitar recriação a cada render
  const petals = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
      left: Math.random() * 100,
    })), []
  )

  // Partículas de brilho
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    })), []
  )

  // Flores decorativas sutis
  const flowers = useMemo(() => [
    { id: 1, delay: 0.3, size: 35, x: 8, y: 15 },
    { id: 2, delay: 0.6, size: 40, x: 88, y: 20 },
    { id: 3, delay: 0.9, size: 30, x: 5, y: 75 },
    { id: 4, delay: 1.2, size: 38, x: 92, y: 80 },
  ], [])

  // Efeito de digitação - otimizado para não afetar outras animações
  useEffect(() => {
    let index = 0
    let isMounted = true
    
    const startTyping = () => {
      if (!isMounted) return
      
      typingIntervalRef.current = setInterval(() => {
        if (!isMounted) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
          }
          return
        }
        
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1))
          index++
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
        }
      }, 50)
    }
    
    // Pequeno delay para não interferir com animações iniciais das pétalas
    const timeout = setTimeout(startTyping, 200)
    
    return () => {
      isMounted = false
      clearTimeout(timeout)
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
        typingIntervalRef.current = null
      }
    }
  }, [fullText])

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-azul-claro via-white to-azul-bebe fixed inset-0 overflow-hidden">
      {/* Pétalas caindo */}
      {petals.map((petal) => (
        <Petal key={petal.id} delay={petal.delay} left={petal.left} />
      ))}

      {/* Partículas de brilho */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: '#5BA3D0',
            boxShadow: '0 0 8px rgba(91, 163, 208, 0.8)',
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 0.8, 0.5],
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

      {/* Flores decorativas */}
      {flowers.map((flower) => (
        <Flower
          key={flower.id}
          delay={flower.delay}
          size={flower.size}
          x={flower.x}
          y={flower.y}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 h-full w-full overflow-y-auto overflow-x-hidden pb-24 sm:pb-20 md:pb-16">
        {/* Botão voltar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 sm:mb-6"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 sm:px-6 sm:py-3 bg-white/95 backdrop-blur-sm text-blue-800 rounded-full font-poppins font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 ring-2 ring-blue-200/70"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Voltar
          </motion.button>
        </motion.div>

        {/* Mensagem principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto bg-white/98 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 shadow-2xl mb-6 sm:mb-8 border-2 border-gray-300/80"
        >
          {/* Decorações no card */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl opacity-20">💙</div>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xl sm:text-2xl opacity-20">🌸</div>
          
          {/* Brilho sutil nas bordas */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-200/0 via-blue-300/20 to-blue-200/0 opacity-50 pointer-events-none" />
          
          <pre className="relative z-10 font-poppins text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 whitespace-pre-wrap text-center leading-relaxed font-bold">
            {typedText}
          </pre>
        </motion.div>

        {/* Botão recado secreto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <motion.button
            onClick={() => setShowModal(true)}
            className="relative px-5 py-2.5 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-poppins font-bold text-sm sm:text-base md:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group ring-2 ring-blue-400/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Efeito de brilho no hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Abrir recado secreto 💌</span>
          </motion.button>
        </motion.div>

        {/* Modal do recado secreto */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-2 border-gray-300/80"
              >
                {/* Flores decorativas */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-2xl sm:text-4xl opacity-20">🌸</div>
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-2xl sm:text-4xl opacity-20">💐</div>
                
                <div className="relative z-10">
                  <h3 className="font-pacifico text-xl sm:text-2xl md:text-3xl text-blue-700 text-center mb-4 sm:mb-6 font-bold">
                    Recado Secreto 💌
                  </h3>
                  <p className="font-poppins text-sm sm:text-base md:text-lg text-gray-900 text-center leading-relaxed mb-4 sm:mb-6 font-bold px-2">
                    Gehh, obrigada por ser essa pessoa incrível, estressada me xinga, mas é incrivel 💙.
                    <br /><br />
                    Você merece o mundo inteiro, e espero que você seja feliz.
                  </p>
                  <div className="text-center">
                    <motion.button
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-700 text-white rounded-full font-poppins font-bold text-sm sm:text-base hover:bg-blue-800 transition-colors shadow-lg ring-2 ring-blue-500/50"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Fechar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão para Mural de Desabafos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 sm:mt-8"
        >
          <motion.button
            onClick={() => navigate('/desabafos')}
            className="relative px-5 py-2.5 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-poppins font-bold text-sm sm:text-base md:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden group ring-2 ring-blue-400/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Efeito de brilho no hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">🙄 Mural de Desabafos 💖</span>
          </motion.button>
        </motion.div>

        {/* Botão para fotos favoritas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 sm:mt-8"
        >
          <motion.button
            onClick={() => navigate('/fotos')}
            className="relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-rosa-pastel to-pink-400 text-white rounded-full font-poppins font-semibold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Efeito de brilho no hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">💐 Ver Fotos Favoritas 💙</span>
          </motion.button>
        </motion.div>

        {/* Botão para o Matteo IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6 sm:mt-8"
        >
          <motion.button
            onClick={() => navigate('/matteo')}
            className="relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-full font-poppins font-semibold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Efeito de brilho animado */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* Borda brilhante */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-xl">🤖</span>
              <span>Falar com Matteo</span>
              <span className="text-xl">✨</span>
            </span>
          </motion.button>
          <p className="text-xs text-gray-500 mt-2 font-poppins">Sua IA pessoal - Pesquisa, clima, cálculos e mais!</p>
        </motion.div>

        {/* Botão para página final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6 sm:mt-8"
        >
          <motion.button
            onClick={() => navigate('/final')}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-blue-700 rounded-full font-poppins font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuar →
          </motion.button>
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
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
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

export default PresentPage

