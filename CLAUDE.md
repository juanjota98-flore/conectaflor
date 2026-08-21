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
- **Emails:** Supabase envía los de autenticación/recuperación; Make.com + Brevo envían
  los transaccionales (bienvenida, aprobación).

## Archivos
- `index.html` — página pública: hero, cifras del sector, tablón de excedentes público,
  directorio de empresas con filtros. Oculta accesos de registro si hay sesión.
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

## Roadmap / pendientes
- **Pago con pasarela** (PayPhone o Kushki): requiere RUC + cuenta de comercio + credenciales
  y un backend seguro (Supabase Edge Function) para confirmar el pago vía webhook. No se puede
  hacer de forma segura desde el sitio estático.
- **Migración recomendada:** frontend a React (Vite + React) sobre el MISMO backend Supabase,
  para poder escalar y mantener mejor (panel.html ya es difícil de mantener a mano).
- Correo de aprobación en Make (pendiente de afinar el filtro `record.status = approved`).
- Moderación opcional de excedentes por el admin.
