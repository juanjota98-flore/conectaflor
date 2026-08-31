export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>ConectaFlor</h4>
          <p>Marketplace B2B para florícolas, logística y transporte en Ecuador.</p>
        </div>
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="#features">Características</a></li>
            <li><a href="#flow">Cómo funciona</a></li>
            <li><a href="/panel.html">Panel</a></li>
            <li><a href="/registro.html">Registrar</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>info@conectaflor.ec</p>
          <p>Ecuador 🇪🇨</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 ConectaFlor. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
