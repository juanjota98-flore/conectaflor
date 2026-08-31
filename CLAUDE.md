# ConectaFlor — Contexto del proyecto

> Este archivo lo lee Claude Code al iniciar cada sesión. Mantenlo actualizado.

## Qué es
Marketplace B2B que conecta **florícolas**, empresas de **logística** de exportación y
empresas de **transporte** en Ecuador. Las empresas se registran, se aprueban, y luego
solicitan/cotizan servicios entre sí. Idioma de la interfaz: **español**.

## Stack actual
- **Frontend:** HTML/CSS/JS puro (vanilla, sin framework, sin paso de build).
  Supabase se carga por CDN (`@supabase/supabase-js@2`).
- **Backend:** Supabase (Postgres + Auth + RLS). La seguridad REAL vive en las
  políticas RLS de Postgres; los chequeos en JS (ocultar botones, etc.) son solo cosméticos.
- **Hosting:** Netlify (sitio estático).
- **Emails:** Supabase envía los de autenticación/recuperación; Edge Function `notify-empresa`
  + Brevo envían los transaccionales (bienvenida, aprobación, rechazo).

## Archivos
- `index.html` — página pública REDISEÑADA: 
  - Hero con fondo gradiente y SVG animado (flores realistas con Lottie)
  - Sección "¿Por qué ConectaFlor?" con 3 cards (Verificado, Gratis, Directo)
  - Sección "¿Cómo funciona?" con 4 pasos animados (Florícola → Empaque → Transporte → Logística)
  - Estadísticas del sector en glassmorphism
  - Tipos de empresas con badges
  - Footer con links
  - Animaciones CSS suaves + Lottie CDN
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

## Diseño e Interfaces (ACTUALIZADO ✅)

**Redesign 2024-08:**
- ✅ Hero section con gradiente verde oscuro + SVG pattern de flores
- ✅ Flores Lottie animadas (realistas, tamaño medianas) en posiciones laterales
- ✅ Sección "¿Cómo funciona?" con 4 cards + animaciones Lottie (floricola, empaque, transporte, logística)
- ✅ Cards de características con efectos hover suave
- ✅ Estadísticas en sección glassmorphism con bordes translúcidos
- ✅ Animaciones CSS: slideIn, fadeInScale, scroll-smooth
- ✅ Tipografía: Hanken Grotesk (body) + Fraunces (headings)
- ✅ Colores: Crema (#d4a574), Verde oscuro (#2d6a4f), Rosa (#e8847f)
- ✅ Header sticky con nav y logo
- ✅ Responsive: mobile, tablet, desktop

**Técnica de animaciones:**
- Lottie CDN: carga JSON animations desde LottieFiles
- SVG pattern CSS: background pattern de flores en hero
- CSS animations: @keyframes para fade, slide, scale
- Estructura: divs con `id` para cada contenedor Lottie

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
- **Notificaciones adicionales:** solicitudes recibidas, sobrantes publicados, cotizaciones
  (requiere triggers en `requests`, `surplus`, `quotes`)
- **Pago con pasarela** (PayPhone o Kushki): requiere RUC + cuenta de comercio + credenciales
  y un backend seguro (Supabase Edge Function) para confirmar el pago vía webhook. No se puede
  hacer de forma segura desde el sitio estático.
- **Migración recomendada:** frontend a React (Vite + React) sobre el MISMO backend Supabase,
  para poder escalar y mantener mejor (panel.html ya es difícil de mantener a mano).
- Moderación opcional de excedentes por el admin.
