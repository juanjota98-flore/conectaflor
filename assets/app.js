/* Helpers compartidos por todas las páginas */

function getDB() {
  if (!window.supabase) {
    throw new Error("No se cargó la librería de Supabase.");
  }
  const { createClient } = window.supabase;
  return createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
}

// Escapa texto para evitar inyección de HTML
function esc(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Limpia un número para usarlo en enlace de WhatsApp (solo dígitos)
function waLink(num) {
  const digits = String(num || "").replace(/\D/g, "");
  return digits ? "https://wa.me/" + digits : null;
}

// Normaliza una URL de sitio web
function siteLink(url) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : "https://" + url;
}
