import { motion } from 'framer-motion'
import { useMemo, memo } from 'react'

const Petal = memo(({ delay = 0, left = 0 }) => {
  // Memoizar valores para evitar recálculos a cada render
  const { screenHeight, color } = useMemo(() => {
    const height = typeof window !== 'undefined' ? window.innerHeight : 1000
    // Cores mais fortes e vibrantes
    const colors = ['#5BA3D0', '#4A9BC8', '#6BA8D4', '#3D8AB8', '#4D9FC6']
    const colorIndex = Math.floor((delay * 10 + left) % colors.length)
    return {
      screenHeight: height,
      color: colors[colorIndex]
    }
  }, [delay, left])
  
  return (
    <motion.div
      className="absolute w-4 h-4 sm:w-5 sm:h-5"
      style={{
        left: `${left}%`,
        filter: 'drop-shadow(0 3px 6px rgba(75, 163, 200, 0.6))',
        willChange: 'transform, opacity',
      }}
      initial={{ 
        y: -100, 
        opacity: 1,
        rotate: 0
      }}
      animate={{ 
        y: screenHeight + 100,
        opacity: [1, 0.95, 0.85, 0],
        rotate: 360
      }}
      transition={{
        delay,
        duration: 8,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
        type: "tween" // Usar tween para melhor performance
      }}
    >
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <ellipse cx="10" cy="10" rx="8" ry="12" fill={color} opacity="1" />
        <ellipse cx="10" cy="10" rx="6" ry="9" fill={color} opacity="0.7" />
      </svg>
    </motion.div>
  )
})

Petal.displayName = 'Petal'

export default Petal

