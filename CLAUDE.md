# ConectaFlor — Contexto del proyecto

> Este archivo lo lee Claude Code al iniciar cada sesión. Mantenlo actualizado.

## Qué es
Marketplace B2B que conecta **florícolas**, empresas de **logística** de exportación y
empresas de **transporte** en Ecuador. Las empresas se registran, se aprueban, y luego
solicitan/cotizan servicios entre sí. Idioma de la interfaz: **español**.

## Stack actual
- **Frontend Landing:** React 18 + Vite + Framer Motion (animaciones suaves)
  - Tipografía: Plus Jakarta Sans (Google Fonts)
  - Paleta: Verde natural (#15803D) + Rosa floral (#EC4899)
  - Componentes: Hero, Features, HowItWorks, Footer
  - Build: `npm run build` → dist/ → Netlify
- **Frontend Panel/Admin:** HTML/CSS/JS puro (vanilla) — `panel.html`, `admin.html`, `registro.html`
  - Conectado a Supabase real con RLS
  - Requiere actualización con nuevo diseño floral
- **Backend:** Supabase (Postgres + Auth + RLS). La seguridad REAL vive en las
  políticas RLS de Postgres; los chequeos en JS (ocultar botones, etc.) son solo cosméticos.
- **Hosting:** Netlify (Vite build + static files)
  - Landing: https://bespoke-alpaca-050188.netlify.app/
- **Emails:** Supabase envía los de autenticación/recuperación; Edge Function `notify-empresa`
  + Brevo envían los transaccionales (bienvenida, aprobación, rechazo).

## Archivos

### Landing (React + Framer Motion)
- `index.html` — template Vite mínimo (carga src/main.jsx)
- `src/main.jsx` — entry point React (ReactDOM.createRoot)
- `src/App.jsx` — root component
- `src/App.css` — estilos globales (paleta floral, animaciones)
- `src/index.css` — reset + tipografía Plus Jakarta Sans
- `src/components/Header.jsx` + `Header.css` — nav sticky con logo + botones
- `src/components/Hero.jsx` — Hero con SVG flores realistas + camión + botones CTA
- `src/components/Features.jsx` — 4 cards: Verificadas, Producto Sobrante, Procesos Rápidos, Alcance Global
- `src/components/HowItWorks.jsx` — Flujo de 4 pasos: Publica → Cotiza → Sobrantes → Transporta
- `src/components/Footer.jsx` — Footer con links y contacto
- `vite.config.js` — config Vite + React plugin
- `package.json` — deps: react, framer-motion, vite
- `registro.html` — alta combinada (crea usuario en Auth + inserta la empresa como `pending`).
  Tres tipos: floricola / logistica / transporte, con campos condicionales.
- `panel.html` — panel de la empresa (pestañas: Explorar, Solicitudes recibidas,
  Mis solicitudes, Excedentes, Mi perfil). Login + recuperación de contraseña. Es el archivo
  más grande y complejo.
- `admin.html` — panel solo-admin para aprobar/rechazar/eliminar empresas.
- `assets/config.js` — URL y anon key de Supabase.
- `assets/styles.css` — diseño (fuentes Fraunces + Hanken Grotesk; paleta crema/verde/rosa).
- `assets/app.js` — helpers: `getDB()`, `esc()`, `waLink()`, `siteLink()`.
- `*.sql` — esquemas de base de datos. **NO se suben a Netlify**; se corren manualmente en
  Supabase → SQL Editor, en orden.
- `supabase/functions/notify-empresa/index.ts` — Edge Function que envía emails transaccionales
  (bienvenida, aprobación, rechazo). Se despliega con `supabase functions deploy`.
- `webhook-triggers.sql` — Triggers SQL con pg_net que disparan la Edge Function automáticamente
  al insertar/actualizar empresas. Corre una sola vez en Supabase SQL Editor.
- `notification-triggers-extended.sql` — Triggers adicionales para requests, quotes, surplus.

## Supabase
- Proyecto: `jbsgahlfsixbltvpdmqt` · URL en `assets/config.js`.
- Admin: `juanjota98@gmail.com` (constante `ADMIN_EMAIL` en el código).
- La **anon/publishable key** es pública por diseño (segura para el cliente).
  **NUNCA** commitear ni usar la `service_role` key.

## Modelo de datos (tablas principales)
- `listings` — empresas. `tipo` ∈ (floricola, logistica, transporte). `status` ∈
  (pending, approved, rejected). Transporte tiene: camiones_disponibles, capacidad_carga,
  tipo_vehiculo, cobertura, refrigerado, disponible.
- `requests` — solicitudes. `kind` ∈ (envio, pedido, transporte). `status` ∈
  (open, quoted, accepted, rejected, cancelled). Campos de enlace de transporte:
  `parent_request_id`, `transporte_empresa`, `pickup_date`.
- `quotes` — cotizaciones. `status` ∈ (sent, accepted, rejected, changes_requested).
- `surplus` — tablón de excedentes (tallos numéricos, precio, etc.). `status` ∈ (active, closed).
- `surplus_offers` — ofertas sobre excedentes con doble confirmación.
  `status` ∈ (sent, accepted, confirmed, rejected, cancelled).
- Función clave: `owns_listing(lid)` (SECURITY DEFINER) usada por las políticas RLS.

## Reglas de negocio importantes
- Florícola ↔ logística = envío; florícola ↔ florícola = pedido; cualquiera → transporte.
  Prohibido logística ↔ logística.
- Al cerrar un **pedido de flores**, el comprador puede **contratar transporte** (ligado por
  `parent_request_id`) y ver el **costo acumulado** (flores + transporte).
- **Privacidad de precios (por diseño):** la transportista solo ve la carga/cantidad, nunca
  el precio de las flores; la florícola vendedora ve el transportista + fecha de recogida,
  pero NO el precio del transporte.

## Flujo de despliegue (actual)
1. Correr el/los `.sql` nuevos en Supabase → SQL Editor (en orden).
2. Subir los HTML/assets a Netlify (Deploys). `index.html` debe quedar en la raíz.
3. `Ctrl+F5` para refrescar caché.

## Convenciones
- Escapar siempre datos de usuario con `esc()` antes de meterlos al HTML.
- Usar `getDB()` para el cliente de Supabase.
- Textos de interfaz en español.

## Cómo quiero trabajar con Claude Code
- Cambios pequeños y revisables (diffs), no reescrituras de archivos enteros.
- Un commit por funcionalidad, con mensaje claro.
- Validar/probar antes de dar por terminado.
- Avisarme si un cambio requiere correr SQL nuevo en Supabase.

## Diseño e Interfaces (Rediseño Floral ✅)

**Rediseño 2026-08: Paleta Floral Ecuatoriana**
- ✅ **Paleta:** Verde natural (#15803D) + Rosa floral (#EC4899)
- ✅ **Tipografía:** Plus Jakarta Sans (moderno, profesional)
- ✅ **Hero:** Gradiente verde/verde con rosa floral realista + camión refrigerado
- ✅ **Características (4 cards):** 
  - Empresas Verificadas (🔐)
  - Producto Sobrante (🌹) ← NEW
  - Procesos Rápidos (⚡)
  - Alcance Global (🌐)
- ✅ **Cómo funciona (4 pasos):**
  - 📋 Publica (florícola publica producción)
  - 💬 Cotiza (comprador negocia directo)
  - 🌹 Sobrantes (vende excedentes en tablón)
  - 🚛 Transporta (logística recoge y envía)
- ✅ **Animaciones:** Framer Motion (stagger, whileHover, whileInView)
- ✅ **SVG:** Flores con gradientes realistas + camión rojo/rosa
- ✅ **Responsive:** Mobile, tablet, desktop
- ✅ **En vivo:** https://bespoke-alpaca-050188.netlify.app/

## Notificaciones por Email (COMPLETADO ✅)

**Empresas (listings):**
- ✅ Bienvenida: cuando se registra una empresa (`INSERT`)
- ✅ Aprobación: cuando el admin cambia status a `approved` (`UPDATE`)
- ✅ Rechazo: cuando el admin cambia status a `rejected` (`UPDATE`)

**Solicitudes (requests):**
- ✅ Nueva solicitud recibida: cuando un empresa la solicita (`INSERT`)
- ✅ Solicitud aceptada: cuando recipient acepta (`UPDATE` → accepted)
- ✅ Solicitud rechazada: cuando recipient rechaza (`UPDATE` → rejected)

**Cotizaciones (quotes):**
- ✅ Cotización recibida: cuando sender envía cotización (`INSERT`)
- ✅ Cotización aceptada: cuando requester acepta (`UPDATE` → accepted)
- ✅ Cotización rechazada: cuando requester rechaza (`UPDATE` → rejected)

**Sobrantes (surplus):**
- ✅ Sobrantes disponibles: broadcast a todos los florícolas (`INSERT`)

**Tecnología:**
- Edge Function: `notify-empresa` (Supabase)
- API de emails: Brevo
- Triggers: SQL con pg_net (`webhook-triggers.sql` + `notification-triggers-extended.sql`)

## Roadmap / pendientes

### Corto plazo (próximas sesiones)
- ✅ **Landing completa:** Rediseñada con paleta floral, en vivo en Netlify
- ⏳ **Panel de empresa (panel.html):** Actualizar con diseño floral + conectar Supabase real
  - Pestañas: Explorar, Solicitudes recibidas, Mis solicitudes, Sobrantes, Mi perfil
  - Mostrar empresas registradas, solicitudes, cotizaciones
- ⏳ **Admin panel (admin.html):** Actualizar con diseño floral
- ⏳ **Registro (registro.html):** Actualizar con diseño floral, formulario de 3 tipos
- ⏳ **Tabla de Sobrantes:** Mostrar excedentes de flores en el panel

### Mediano plazo
- **Pago con pasarela** (PayPhone o Kushki): requiere RUC + cuenta + backend Edge Function
- **Chat/Mensajería:** Entre florícolas y logística para negociar
- **Sistema de ratings:** Calificación de empresas y transacciones
- **Notificaciones en tiempo real:** WebSocket para nuevas solicitudes/cotizaciones

### Largo plazo
- **Migración panel a React:** Frontend unificado en React (panel.html + admin.html) para mantenibilidad
- Moderación opcional de excedentes por el admin.
