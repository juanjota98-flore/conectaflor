import { motion } from 'framer-motion'

export default function Features() {
  const features = [
    { icon: '🔐', title: 'Empresas Verificadas', text: 'Solo negocios legales validados. Garantiza confianza en cada transacción.' },
    { icon: '🌹', title: 'Producto Sobrante', text: 'Vende tus flores excedentes en el tablón. Recupera margen de lo que sobra.' },
    { icon: '⚡', title: 'Procesos Rápidos', text: 'Solicita, cotiza y cierra acuerdos en minutos, no días.' },
    { icon: '🌐', title: 'Alcance Global', text: 'Conecta con logística especializada en exportación internacional.' }
  ]

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

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="section" id="features">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        ¿Por qué ConectaFlor?
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Beneficios reales para tu negocio
      </motion.p>

      <motion.div
        className="cards-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="card"
            variants={cardVariants}
            whileHover={{
              scale: 1.08,
              y: -10,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="card-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-text">{feature.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
