import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Flower from '../components/Flower'

const FotosPage = () => {
  const navigate = useNavigate()
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [imageLoaded, setImageLoaded] = useState({})

  // Dados das fotos
  const fotos = [
    {
      id: 1,
      url: '/fotos/3e59a8ce-4c71-41ab-b815-2a98b2f48464.jpeg', // Foto das unhas azuis e brancas com player de música
      legenda: 'Você ficou tão linda nessa foto!',
      mensagem: 'Quando tu me mandou essa foto, eu fiquei sem oq falar, essa foto é perfeita e foda que sei lá o que falar.'
    },
    {
      id: 2,
      url: '/fotos/4b6ef5aa-2089-474a-9d1b-a3779009228c.jpeg', // Selfie no espelho com cabelo cacheado
      legenda: 'Unha do Matuê vsfd',
      mensagem: 'Pode parecer idiota, mas eu fiquei tão feliz quando vc fez essa unha.'
    },
    {
      id: 3,
      url: '/fotos/5476f5d1-af8a-49a9-91a3-b954add9c03c.jpeg', // Retrato próximo com sorriso suave
      legenda: 'nem precisa falar',
      mensagem: 'Você ta tão (emoji mordendo o lábio)'
    },
    {
      id: 4,
      url: '/fotos/83f57b3f-1db8-4ebd-b3a1-1932099e1799.jpeg', // Selfie no espelho com top preto e jeans
      legenda: 'elite né',
      mensagem: 'nem tem muito oq falar, tu sabe que eu amo vc de cabelo cacheado.'
    },
  ]

  // Partículas de brilho
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }))

  return (
    <div className="h-screen w-screen fixed inset-0 overflow-hidden bg-gradient-to-br from-azul-claro via-azul-bebe to-[#E3F2FD]">
      {/* Partículas de brilho */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-azul-claro opacity-40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
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
      <Flower delay={0.2} size={50} x={10} y={5} />
      <Flower delay={0.5} size={40} x={85} y={10} />
      <Flower delay={0.8} size={45} x={5} y={90} />
      <Flower delay={1} size={50} x={90} y={85} />

      {/* Conteúdo principal */}
      <div className="h-full w-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-20 md:pb-16">
          {/* Botão voltar */}
          <motion.button
            onClick={() => navigate('/presente')}
            className="mb-6 sm:mb-8 text-blue-700 hover:text-blue-800 font-poppins font-bold text-sm sm:text-base flex items-center gap-2 transition-colors px-3 py-2 bg-white/80 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ x: -5 }}
          >
            <span>←</span> Voltar
          </motion.button>

          {/* Título */}
          <motion.div
            className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-pacifico text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#2563EB] mb-2 sm:mb-3 md:mb-4 leading-tight font-bold" style={{ textShadow: '3px 3px 8px rgba(255, 255, 255, 0.9), 1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
              💐 Minhas Fotos Favoritas da Gehh 💙
            </h1>
          </motion.div>

          {/* Grid de fotos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {fotos.map((foto, index) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group w-full border-2 border-gray-200/80"
                onClick={() => setSelectedPhoto(foto)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Imagem */}
                <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-azul-claro to-azul-bebe">
                  {/* Placeholder */}
                  {(!imageLoaded[foto.id] || imageErrors[foto.id]) && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                      <div className="text-center p-4">
                        <div className="text-4xl sm:text-5xl mb-2">📷</div>
                        <p className="font-poppins text-xs sm:text-sm text-blue-700/70 px-2">
                          Adicione a imagem em:<br />
                          <span className="font-mono text-xs">public/fotos/{foto.url.split('/').pop()}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Imagem real */}
                  <motion.img
                    src={foto.url}
                    alt={foto.legenda}
                    className="w-full h-full object-cover"
                    style={{ 
                      opacity: imageLoaded[foto.id] && !imageErrors[foto.id] ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onLoad={() => {
                      setImageLoaded(prev => ({ ...prev, [foto.id]: true }))
                      setImageErrors(prev => ({ ...prev, [foto.id]: false }))
                    }}
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [foto.id]: true }))
                      setImageLoaded(prev => ({ ...prev, [foto.id]: false }))
                    }}
                  />
                  
                  {/* Overlay brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  {/* Brilho nas bordas */}
                  <div className="absolute inset-0 ring-2 ring-blue-300/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Legenda */}
                <div className="p-3 sm:p-4 md:p-5">
                  <p className="font-poppins text-xs sm:text-sm md:text-base text-gray-800 text-center leading-relaxed font-semibold">
                    {foto.legenda}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para ampliar foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border-2 border-gray-300/80"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagem ampliada */}
              <div className="relative aspect-video sm:aspect-[4/3] overflow-hidden bg-gradient-to-br from-azul-claro to-azul-bebe">
                {/* Placeholder */}
                {(!imageLoaded[selectedPhoto.id] || imageErrors[selectedPhoto.id]) && (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                    <div className="text-center p-4">
                      <div className="text-5xl sm:text-6xl mb-3">📷</div>
                      <p className="font-poppins text-sm sm:text-base text-blue-700/70 px-4">
                        Adicione a imagem em:<br />
                        <span className="font-mono text-xs sm:text-sm">public/fotos/{selectedPhoto.url.split('/').pop()}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Imagem real */}
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.legenda}
                  className="w-full h-full object-cover"
                  style={{ 
                    opacity: imageLoaded[selectedPhoto.id] && !imageErrors[selectedPhoto.id] ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                  onLoad={() => {
                    setImageLoaded(prev => ({ ...prev, [selectedPhoto.id]: true }))
                    setImageErrors(prev => ({ ...prev, [selectedPhoto.id]: false }))
                  }}
                  onError={() => {
                    setImageErrors(prev => ({ ...prev, [selectedPhoto.id]: true }))
                    setImageLoaded(prev => ({ ...prev, [selectedPhoto.id]: false }))
                  }}
                />
                
                {/* Flores decorativas no modal */}
                <Flower delay={0} size={60} x={10} y={10} />
                <Flower delay={0.3} size={50} x={85} y={15} />
              </div>

              {/* Conteúdo do modal */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-azul-claro/30 to-azul-bebe/30">
                <p className="font-poppins text-sm sm:text-base md:text-lg text-gray-900 text-center mb-6 leading-relaxed font-bold px-2">
                  {selectedPhoto.mensagem}
                </p>

                {/* Botão fechar */}
                <div className="text-center">
                  <motion.button
                    onClick={() => setSelectedPhoto(null)}
                    className="px-5 py-2.5 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-full font-poppins font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 ring-2 ring-pink-400/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                  >
                    Fechar 🌷
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Admin - Engrenagem no canto inferior esquerdo */}
      <motion.button
        onClick={() => {
          const isAdmin = localStorage.getItem('pablo_admin') === 'true'
          navigate(isAdmin ? '/admin/dashboard' : '/admin')
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
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

export default FotosPage
