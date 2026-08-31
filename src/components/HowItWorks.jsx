import { motion } from 'framer-motion'

export default function HowItWorks() {
  const steps = [
    { icon: '🌱', title: 'Cultivo de Flores', text: 'Publica tu producción, especifica variedades y cantidad' },
    { icon: '🚛', title: 'Transporte', text: 'Recogida refrigerada y transporte seguro' },
    { icon: '✈️', title: 'Logística Export', text: 'Trámites aduanales y envío internacional' }
  ]

  const boxVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: i * 0.3,
        ease: 'easeOut',
      },
    }),
  }

  const arrowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: (i + 1) * 0.3 - 0.15,
        ease: 'easeOut',
      },
    }),
  }

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
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        El flujo completo de negocio
      </motion.p>

      <div className="flow-container">
        {steps.map((step, i) => (
          <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {i > 0 && (
              <motion.div
                className="flow-arrow"
                custom={i}
                variants={arrowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                →
              </motion.div>
            )}
            <motion.div
              className="flow-box"
              custom={i}
              variants={boxVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                scale: 1.08,
                y: -15,
                boxShadow: '0 20px 40px rgba(45, 106, 79, 0.2)',
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flow-icon"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              >
                {step.icon}
              </motion.div>
              <h3 className="flow-title">{step.title}</h3>
              <p className="flow-text">{step.text}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
