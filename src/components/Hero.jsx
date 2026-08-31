import { motion } from 'framer-motion'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  return (
    <div className="hero">
      {/* Flores decorativas */}
      <svg className="hero-flower left" viewBox="0 0 100 120" width="120" height="150">
        <ellipse cx="50" cy="25" rx="9" ry="22" fill="#e8847f" />
        <ellipse cx="70" cy="35" rx="9" ry="22" fill="#e8847f" transform="rotate(60 50 50)" />
        <ellipse cx="75" cy="55" rx="9" ry="22" fill="#e8847f" transform="rotate(120 50 50)" />
        <ellipse cx="50" cy="75" rx="9" ry="22" fill="#e8847f" transform="rotate(180 50 50)" />
        <ellipse cx="25" cy="55" rx="9" ry="22" fill="#e8847f" transform="rotate(240 50 50)" />
        <ellipse cx="30" cy="35" rx="9" ry="22" fill="#e8847f" transform="rotate(300 50 50)" />
        <circle cx="50" cy="50" r="14" fill="#ffd700" />
        <circle cx="50" cy="50" r="8" fill="#ffed4e" opacity="0.8" />
        <path d="M 50 64 Q 48 90 50 115" stroke="#2d6a4f" strokeWidth="3" fill="none" />
        <ellipse cx="40" cy="90" rx="6" ry="16" fill="#2d6a4f" opacity="0.7" transform="rotate(-30 40 90)" />
      </svg>

      <svg className="hero-flower right" viewBox="0 0 100 120" width="120" height="150">
        <ellipse cx="50" cy="25" rx="9" ry="22" fill="#d4a574" />
        <ellipse cx="70" cy="35" rx="9" ry="22" fill="#d4a574" transform="rotate(60 50 50)" />
        <ellipse cx="75" cy="55" rx="9" ry="22" fill="#d4a574" transform="rotate(120 50 50)" />
        <ellipse cx="50" cy="75" rx="9" ry="22" fill="#d4a574" transform="rotate(180 50 50)" />
        <ellipse cx="25" cy="55" rx="9" ry="22" fill="#d4a574" transform="rotate(240 50 50)" />
        <ellipse cx="30" cy="35" rx="9" ry="22" fill="#d4a574" transform="rotate(300 50 50)" />
        <circle cx="50" cy="50" r="14" fill="#ffd700" />
        <circle cx="50" cy="50" r="8" fill="#ffed4e" opacity="0.8" />
        <path d="M 50 64 Q 52 90 50 115" stroke="#2d6a4f" strokeWidth="3" fill="none" />
        <ellipse cx="60" cy="90" rx="6" ry="16" fill="#2d6a4f" opacity="0.7" transform="rotate(30 60 90)" />
      </svg>

      <motion.div className="hero-content" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 variants={itemVariants}>Del campo ecuatoriano al mundo</motion.h1>
        <motion.p variants={itemVariants}>Conecta directo florícolas, logística y transporte. Sin intermediarios, márgenes mejores.</motion.p>
        <motion.div className="hero-buttons" variants={itemVariants}>
          <motion.a href="/registro.html" className="btn btn-primary" whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>Registrar empresa</motion.a>
          <motion.button className="btn btn-secondary" whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>Ver directorio</motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
