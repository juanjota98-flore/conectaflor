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
      {/* Rosa ecuatoriana - izquierda */}
      <svg className="hero-flower-left" viewBox="0 0 200 280" width="140" height="200">
        <path d="M 100 200 Q 95 240 100 280" stroke="#15803D" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <ellipse cx="70" cy="240" rx="8" ry="30" fill="#059669" opacity="0.8" transform="rotate(-45 70 240)"/>
        <ellipse cx="130" cy="260" rx="8" ry="30" fill="#047857" opacity="0.7" transform="rotate(45 130 260)"/>
        <ellipse cx="100" cy="40" rx="14" ry="38" fill="#DB2777"/>
        <ellipse cx="145" cy="70" rx="14" ry="38" fill="#DB2777" transform="rotate(72 100 100)"/>
        <ellipse cx="155" cy="130" rx="14" ry="38" fill="#DB2777" transform="rotate(144 100 100)"/>
        <ellipse cx="115" cy="170" rx="14" ry="38" fill="#DB2777" transform="rotate(216 100 100)"/>
        <ellipse cx="45" cy="130" rx="14" ry="38" fill="#DB2777" transform="rotate(288 100 100)"/>
        <ellipse cx="100" cy="60" rx="10" ry="28" fill="#EC4899"/>
        <ellipse cx="130" cy="90" rx="10" ry="28" fill="#EC4899" transform="rotate(72 100 100)"/>
        <ellipse cx="135" cy="145" rx="10" ry="28" fill="#EC4899" transform="rotate(144 100 100)"/>
        <ellipse cx="95" cy="160" rx="10" ry="28" fill="#EC4899" transform="rotate(216 100 100)"/>
        <ellipse cx="65" cy="110" rx="10" ry="28" fill="#EC4899" transform="rotate(288 100 100)"/>
        <circle cx="100" cy="100" r="20" fill="#ffd700"/>
        <circle cx="100" cy="100" r="13" fill="#ffed4e" opacity="0.8"/>
      </svg>

      {/* Camión - derecha */}
      <svg className="hero-truck-right" viewBox="0 0 280 200" width="160" height="120">
        <rect x="20" y="80" width="60" height="50" rx="8" fill="#2c3e50"/>
        <rect x="30" y="90" width="35" height="25" rx="4" fill="#87ceeb" opacity="0.7"/>
        <rect x="80" y="60" width="140" height="70" rx="8" fill="#e8847f"/>
        <rect x="85" y="65" width="130" height="60" rx="6" fill="#d64045"/>
        <line x1="100" y1="65" x2="100" y2="125" stroke="#ffd700" strokeWidth="2" opacity="0.6"/>
        <line x1="130" y1="65" x2="130" y2="125" stroke="#ffd700" strokeWidth="2" opacity="0.6"/>
        <line x1="160" y1="65" x2="160" y2="125" stroke="#ffd700" strokeWidth="2" opacity="0.6"/>
        <line x1="190" y1="65" x2="190" y2="125" stroke="#ffd700" strokeWidth="2" opacity="0.6"/>
        <circle cx="110" cy="155" r="18" fill="#333"/>
        <circle cx="110" cy="155" r="12" fill="#555"/>
        <circle cx="200" cy="155" r="18" fill="#333"/>
        <circle cx="200" cy="155" r="12" fill="#555"/>
        <circle cx="40" cy="155" r="15" fill="#333"/>
        <circle cx="40" cy="155" r="9" fill="#555"/>
        <rect x="10" y="145" width="15" height="25" fill="#444"/>
      </svg>

      <motion.div className="hero-content" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 variants={itemVariants}>Mercado digital para flores ecuatorianas</motion.h1>
        <motion.p variants={itemVariants}>Conecta florícolas con logística y transporte de forma directa. Acelera pedidos, mejora márgenes, llega al mundo.</motion.p>
        <motion.div className="hero-buttons" variants={itemVariants}>
          <motion.a href="/registro.html" className="btn btn-primary" whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>Registrar empresa</motion.a>
          <motion.button className="btn btn-secondary" whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>Ver directorio</motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
