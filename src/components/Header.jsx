import { motion } from 'framer-motion'
import './Header.css'

export default function Header() {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">🌿 ConectaFlor</div>
      <nav className="nav">
        <a href="#features">Características</a>
        <a href="#flow">Cómo funciona</a>
        <a href="/panel.html">Panel</a>
        <a href="/registro.html" className="btn-nav">Registrar</a>
      </nav>
    </motion.header>
  )
}
