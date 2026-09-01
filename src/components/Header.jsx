import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = 'https://jbsgahlfsixbltvpdmqt.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MDMwMDAsImV4cCI6MjAxODEyMzAwMH0.0OcK8e9KbNM9KBxaVfnvj2HtYZPgLnCOKBp1bRdL9nQ'
      const db = createClient(supabaseUrl, supabaseKey)

      const { data } = await db.auth.getSession()
      if (data.session) {
        const { data: userData } = await db.auth.getUser()
        const { data: company } = await db.from("listings").select("nombre").eq("user_id", userData.user.id).limit(1)
        if (company && company.length > 0) {
          setIsLoggedIn(true)
          setCompanyName(company[0].nombre)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = 'https://jbsgahlfsixbltvpdmqt.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MDMwMDAsImV4cCI6MjAxODEyMzAwMH0.0OcK8e9KbNM9KBxaVfnvj2HtYZPgLnCOKBp1bRdL9nQ'
      const db = createClient(supabaseUrl, supabaseKey)
      await db.auth.signOut()
      location.href = '/'
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">🌹 ConectaFlor</div>
      <nav className="nav">
        <a href="/">Inicio</a>
        <a href="/directorio.html">Directorio</a>
        <a href="#features">Características</a>
        <a href="#flow">Cómo funciona</a>
        {isLoggedIn ? (
          <>
            <a href="/panel.html" className="btn-nav">Mi cuenta ({companyName})</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout() }} style={{ color: '#EC4899', fontWeight: 600, cursor: 'pointer' }}>Salir</a>
          </>
        ) : (
          <>
            <a href="/directorio.html">Ver empresas</a>
            <a href="/registro.html" className="btn-nav">Registrar</a>
          </>
        )}
      </nav>
    </motion.header>
  )
}
