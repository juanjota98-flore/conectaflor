import { motion } from 'framer-motion'

export default function Features() {
  const features = [
    { icon: '✓', title: 'Verificado', text: 'Solo empresas legales. Validación rigurosa.' },
    { icon: '💰', title: 'Gratis', text: 'Sin comisiones, sin cuotas ocultas.' },
    { icon: '⚡', title: 'Directo', text: 'Negocia sin intermediarios, márgenes mejores.' },
    { icon: '🌍', title: 'Internacional', text: 'Conecta con logística especializada en exportación.' }
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
