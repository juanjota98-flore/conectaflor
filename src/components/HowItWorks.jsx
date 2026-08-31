import { motion } from 'framer-motion'

export default function HowItWorks() {
  const steps = [
    { icon: '🌱', title: 'Cultivo de Flores', text: 'Publica tu producción, especifica variedades y cantidad' },
    { icon: '🚛', title: 'Transporte', text: 'Recogida refrigerada y transporte seguro' },
    { icon: '✈️', title: 'Logística Export', text: 'Trámites aduanales y envío internacional' }
  ]

  return (
    <section className="section" id="flow">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        ¿Cómo funciona?
      </motion.h2>
      <p className="section-subtitle">El flujo completo de negocio</p>

      <div className="flow-container">
        {steps.map((step, i) => (
          <motion.div key={i}>
            {i > 0 && (
              <motion.div
                className="flow-arrow"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                →
              </motion.div>
            )}
            <motion.div
              className="flow-box"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flow-icon">{step.icon}</div>
              <h3 className="flow-title">{step.title}</h3>
              <p className="flow-text">{step.text}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
