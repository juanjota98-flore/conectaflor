import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Del campo ecuatoriano al mundo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Conecta directo florícolas, logística y transporte. Sin intermediarios, márgenes mejores.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a href="/registro.html" className="btn btn-primary">Registrar empresa</a>
          <button className="btn btn-secondary">Ver directorio</button>
        </motion.div>
      </div>
    </div>
  )
}
