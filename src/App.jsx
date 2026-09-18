import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import './App.css'

function App() {
  useEffect(() => {
    // Si el usuario está logueado, redirigir a panel.html
    const checkSession = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const config = window.SUPABASE_CONFIG
        if (!config) return
        const db = createClient(config.url, config.anonKey)
        const { data } = await db.auth.getSession()
        if (data.session) {
          window.location.href = '/panel.html'
        }
      } catch (err) {
        console.error(err)
      }
    }
    checkSession()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </motion.div>
  )
}

export default App
