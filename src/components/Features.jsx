import { motion } from 'framer-motion'

export default function Features() {
  const features = [
    { icon: '✓', title: 'Verificado', text: 'Solo empresas legales. Validación rigurosa.' },
    { icon: '💰', title: 'Gratis', text: 'Sin comisiones, sin cuotas ocultas.' },
    { icon: '⚡', title: 'Directo', text: 'Negocia sin intermediarios, márgenes mejores.' },
    { icon: '🌍', title: 'Internacional', text: 'Conecta con logística especializada en exportación.' }
  ]

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
      <p className="section-subtitle">Beneficios reales para tu negocio</p>

      <div className="cards-grid">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="card-icon">{feature.icon}</div>
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-text">{feature.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
