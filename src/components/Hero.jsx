import { motion } from 'framer-motion'

const FlowerSVG = ({ color = '#e8847f', id = Math.random() }) => {
  const petals = [0, 60, 120, 180, 240, 300].map((angle) => (
    <ellipse
      key={angle}
      cx="60"
      cy="35"
      rx="10"
      ry="28"
      fill={color}
      opacity="0.9"
      transform={`rotate(${angle} 60 60)`}
    />
  ))

  const filterId = `shadow-${id}`

  return (
    <svg viewBox="0 0 120 150" width="100" height="120" className="flower-svg">
      <defs>
        <filter id={filterId}>
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {petals}
        <circle cx="60" cy="60" r="16" fill="#ffd700" />
        <circle cx="60" cy="60" r="10" fill="#ffed4e" opacity="0.6" />
        <path d="M 60 76 Q 58 100 55 130" stroke="#2d6a4f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="45" cy="95" rx="8" ry="20" fill="#2d6a4f" opacity="0.8" transform="rotate(-35 45 95)" />
        <ellipse cx="75" cy="110" rx="8" ry="20" fill="#2d6a4f" opacity="0.7" transform="rotate(35 75 110)" />
      </g>
    </svg>
  )
}

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants}>
          Del campo ecuatoriano al mundo
        </motion.h1>

        <motion.p variants={itemVariants}>
          Conecta directo florícolas, logística y transporte. Sin intermediarios, márgenes mejores.
        </motion.p>

        <motion.div
          className="hero-buttons"
          variants={itemVariants}
        >
          <motion.a
            href="/registro.html"
            className="btn btn-primary"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Registrar empresa
          </motion.a>
          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver directorio
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-flower-left"
        initial={{ opacity: 0, scale: 0.6, rotate: -20, x: -50 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      >
        <FlowerSVG color="#e8847f" />
      </motion.div>

      <motion.div
        className="hero-flower-right"
        initial={{ opacity: 0, scale: 0.6, rotate: 20, x: 50 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
      >
        <FlowerSVG color="#d4a574" />
      </motion.div>
    </div>
  )
}
