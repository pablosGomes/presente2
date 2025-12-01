import { motion } from 'framer-motion'

const Flower = ({ delay = 0, size = 40, x = 0, y = 0 }) => {
  return (
    <motion.div
      className="absolute hidden sm:block"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 0.95, 
        rotate: 360,
        y: [0, -20, 0]
      }}
      transition={{
        delay,
        duration: 2,
        rotate: { duration: 2 },
        y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(75, 163, 200, 0.5))' }}>
        {/* Pétalas - cores mais fortes */}
        <circle cx="50" cy="30" r="15" fill="#5BA3D0" opacity="1" />
        <circle cx="30" cy="50" r="15" fill="#4A9BC8" opacity="1" />
        <circle cx="70" cy="50" r="15" fill="#6BA8D4" opacity="1" />
        <circle cx="50" cy="70" r="15" fill="#5BA3D0" opacity="1" />
        {/* Centro */}
        <circle cx="50" cy="50" r="10" fill="#FFB6C1" />
      </svg>
    </motion.div>
  )
}

export default Flower

