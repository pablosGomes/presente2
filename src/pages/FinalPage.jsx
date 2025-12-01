import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Petal from '../components/Petal'

const FinalPage = () => {
  const navigate = useNavigate()
  const petals = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    left: Math.random() * 100,
  }))

  // Flores enchendo toda a tela - distribuição por toda a área
  const flowers = Array.from({ length: 60 }, (_, i) => {
    // Usar valores determinísticos baseados no índice para consistência
    const seed = i * 7.3 // Número primo para melhor distribuição
    const cols = 8 // 8 colunas
    const rows = Math.ceil(60 / cols) // Linhas necessárias
    const col = i % cols
    const row = Math.floor(i / cols)
    
      return {
        id: i,
        delay: i * 0.05,
        size: 30 + (seed % 35), // Tamanhos variados (30-65px) - melhor para responsividade
        // Distribuir por toda a tela em grid com variação
        x: (col / cols) * 100 + ((seed % 15) - 7), // Posição X com variação
        y: (row / rows) * 100 + ((seed % 20) - 10), // Posição Y com variação
        colorVariation: i % 6, // 6 variações de cor (3 azuis + 3 rosas)
        isPink: (seed % 100) < 45, // Distribuição mais aleatória: ~45% rosa, ~55% azul
        rotationSpeed: 12 + (i % 10) * 1.3, // Velocidade de rotação variada (12-25 segundos) - mais rápida
      }
  })

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-azul-claro via-azul-bebe to-white fixed inset-0 overflow-hidden">
      {/* Pétalas caindo */}
      {petals.map((petal) => (
        <Petal key={petal.id} delay={petal.delay} left={petal.left} />
      ))}

      {/* Flores desabrochando por toda a tela */}
      {flowers.map((flower) => {
        // Variação de cores azuis e rosas - cores mais fortes e vibrantes
        const blueColors = [
          { petal1: '#6BA8D4', petal2: '#5BA3D0', petal3: '#7BB3D9', petal4: '#4A9BC8', center: '#FFB6C1' },
          { petal1: '#5BA3D0', petal2: '#6BA8D4', petal3: '#4A9BC8', petal4: '#7BB3D9', center: '#FFC0CB' },
          { petal1: '#7BB3D9', petal2: '#4A9BC8', petal3: '#6BA8D4', petal4: '#5BA3D0', center: '#FFB6C1' },
        ]
        const pinkColors = [
          { petal1: '#FF91A4', petal2: '#FF9DB0', petal3: '#FFA8BB', petal4: '#FF85A0', center: '#FFD1DC' },
          { petal1: '#FF9DB0', petal2: '#FFA8BB', petal3: '#FF91A4', petal4: '#FF85A0', center: '#FFD1DC' },
          { petal1: '#FFA8BB', petal2: '#FF91A4', petal3: '#FF9DB0', petal4: '#FF85A0', center: '#FFD1DC' },
        ]
        
        // Escolher entre azul ou rosa baseado na propriedade isPink
        const colorPalette = flower.isPink ? pinkColors : blueColors
        const colorSet = colorPalette[flower.colorVariation % 3]
        const shadowColor = flower.isPink ? 'rgba(255, 145, 164, 0.4)' : 'rgba(75, 163, 200, 0.4)'
        
        return (
          <motion.div
            key={flower.id}
            className="absolute scale-75 sm:scale-100"
            style={{
              left: `${Math.max(5, Math.min(95, flower.x))}%`, // Limitar entre 5% e 95%
              top: `${Math.max(5, Math.min(95, flower.y))}%`, // Limitar entre 5% e 95%
              width: `${flower.size}px`,
              height: `${flower.size}px`,
              filter: `drop-shadow(0 4px 8px ${shadowColor})`,
            }}
            initial={{ 
              scale: 0, 
              opacity: 0, 
            }}
            animate={{ 
              scale: [0, 1.1, 1], // Efeito de "pop" ao desabrochar
              opacity: [0, 1, 1],
              rotate: 360, // Rotação contínua e infinita
              y: [0, -15, -5, 0], // Movimento flutuante suave
            }}
            transition={{
              delay: flower.delay,
              scale: {
                times: [0, 0.6, 1],
                duration: 2.5,
              },
              opacity: {
                times: [0, 0.5, 1],
                duration: 2.5,
              },
              rotate: {
                duration: flower.rotationSpeed, // Rotação muito lenta (20-38 segundos)
                repeat: Infinity,
                ease: "linear"
              },
              y: {
                repeat: Infinity,
                duration: 4 + (flower.id % 3) * 0.5, // Variação determinística no tempo de flutuação
                ease: "easeInOut"
              }
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id={`gradient-${flower.id}`} cx="50%" cy="50%">
                  <stop offset="0%" stopColor={colorSet.petal1} stopOpacity="1" />
                  <stop offset="100%" stopColor={colorSet.petal2} stopOpacity="0.7" />
                </radialGradient>
              </defs>
              {/* Pétalas externas - mais detalhadas e fortes */}
              <circle cx="50" cy="25" r="18" fill={colorSet.petal1} opacity="1" />
              <circle cx="25" cy="50" r="18" fill={colorSet.petal2} opacity="1" />
              <circle cx="75" cy="50" r="18" fill={colorSet.petal3} opacity="1" />
              <circle cx="50" cy="75" r="18" fill={colorSet.petal4} opacity="1" />
              {/* Pétalas intermediárias */}
              <circle cx="50" cy="30" r="12" fill={colorSet.petal2} opacity="0.95" />
              <circle cx="30" cy="50" r="12" fill={colorSet.petal3} opacity="0.95" />
              <circle cx="70" cy="50" r="12" fill={colorSet.petal4} opacity="0.95" />
              <circle cx="50" cy="70" r="12" fill={colorSet.petal1} opacity="0.95" />
              {/* Centro com gradiente */}
              <circle cx="50" cy="50" r="12" fill={colorSet.center} opacity="1" />
              <circle cx="50" cy="50" r="8" fill="#FFFFFF" opacity="0.7" />
            </svg>
          </motion.div>
        )
      })}

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 py-8 sm:py-12 pb-24 sm:pb-20 md:pb-16">
        {/* Botão voltar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 md:left-8 z-20"
        >
          <motion.button
            onClick={() => navigate('/presente')}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-white/95 backdrop-blur-sm text-blue-700 rounded-full font-poppins font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Voltar
          </motion.button>
        </motion.div>

        {/* Player do Spotify */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 w-full max-w-full 3xl:max-w-[800px] mx-auto px-4 sm:px-6 md:px-8"
        >
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px', width: '100%' }}
            src="https://open.spotify.com/embed/track/0nJW01T7XtvILxQgC5J7Wh?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Player"
            className="w-full"
          ></iframe>
        </motion.div>
      </div>
    </div>
  )
}

export default FinalPage

