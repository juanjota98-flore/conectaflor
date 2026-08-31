# ConectaFlor — Documento vivo del proyecto

> **Qué es esto:** el manual maestro de ConectaFlor. No es un archivo que "se termina":
> se actualiza cada vez que tomas una decisión, agregas una función o cambia algo.
> Vive en la raíz del repositorio, junto a `index.html`.
>
> **Cómo usarlo:** cuando algo cambie, edita la sección correspondiente y anótalo en el
> **Registro de cambios** (al final). Si trabajas con Claude Code, puedes pedirle:
> *"actualiza PROYECTO.md con este cambio"*.
>
> Última actualización: **[COMPLETAR: fecha]** · Responsable: **Juan José**

---

## 1. Visión y problema

**El problema.** En Ecuador, entre la finca de flores y el comprador final hay un eslabón
crítico y desordenado: la logística de exportación (cadena de frío, carga aérea, aduanas) y
el transporte terrestre. Florícolas, empresas de logística y transportistas se coordinan hoy
por WhatsApp, contactos sueltos y llamadas.

**La solución.** ConectaFlor es un marketplace B2B que reúne a los tres actores en un solo
lugar: se registran, se verifican, y solicitan/cotizan servicios entre sí de forma ordenada
y con trazabilidad.

**Para quién:**
- **Florícolas** — publican excedentes, piden flores a otras fincas, contratan logística y transporte.
- **Logística de exportación** — recibe solicitudes de envío y cotiza.
- **Transporte terrestre** — recibe solicitudes de transporte y cotiza; gestiona su disponibilidad.

**Propuesta de valor.** Verificado, directo y con historial de las negociaciones.
Reemplaza el "coordinar por WhatsApp" con un flujo de solicitud → cotización → cierre.

**Norte a largo plazo.** [COMPLETAR: tu visión — p. ej. ser el estándar de coordinación
logística del sector floricultor en Ecuador y luego la región andina.]

---

## 2. Estado actual (qué está construido)

- [x] Registro de empresas (3 tipos) con perfil y aprobación por admin.
- [x] Autenticación por empresa (Supabase Auth) + recuperación de contraseña.
- [x] Directorio público con filtros por tipo y buscador.
- [x] Solicitudes y cotizaciones (aceptar / rechazar / pedir cambios).
- [x] Pedidos florícola ↔ florícola.
- [x] Tablón de excedentes público + ofertas con doble confirmación.
- [x] Tipo Transporte: perfil con camiones/capacidad/refrigerado y disponibilidad.
- [x] Contratar transporte al cerrar un pedido, con **costo acumulado** (flores + transporte).
- [x] **Privacidad de precios** entre las partes (ver sección 6).
- [x] Emails de bienvenida (Make.com + Brevo).
- [ ] Email de aprobación (pendiente de afinar en Make).
- [ ] Pago en la plataforma (ver Roadmap).

---

## 3. Arquitectura y stack

| Capa | Herramienta | Notas |
|---|---|---|
| Frontend | HTML/CSS/JS puro (vanilla) | Sin build. Supabase por CDN. |
| Backend / BD | Supabase (Postgres + Auth + RLS) | La seguridad real vive en RLS. |
| Hosting | Netlify | Sitio estático. |
| Emails auth | Supabase | Bienvenida/recuperación. |
| Emails transaccionales | Make.com + Brevo | Webhooks desde Supabase. |

**Diagrama mental:** Navegador → (Supabase JS) → Postgres con RLS. Netlify solo sirve los
archivos estáticos. Make/Brevo se disparan por webhooks de Supabase.

---

## 4. Estructura del repositorio

```
conectaflor/
├─ index.html            # Público: hero, cifras, excedentes, directorio
├─ registro.html         # Alta combinada (cuenta + empresa)
├─ panel.html            # Panel de la empresa (el archivo más grande)
├─ admin.html            # Panel de administración (aprobar empresas)
├─ assets/
│  ├─ config.js          # URL + anon key de Supabase  ⚠️ tus credenciales reales
│  ├─ styles.css         # Diseño
│  └─ app.js             # Helpers: getDB(), esc(), waLink(), siteLink()
├─ *.sql                 # Esquemas de BD (NO se suben a Netlify)
├─ CLAUDE.md             # Contexto para Claude Code
├─ PROYECTO.md           # Este documento
└─ README.md             # Guía rápida de despliegue
```

---

## 5. Base de datos

**Tablas principales:**
- `listings` — empresas. `tipo` ∈ (floricola, logistica, transporte). `status` ∈ (pending, approved, rejected).
- `requests` — solicitudes. `kind` ∈ (envio, pedido, transporte). Enlace de transporte: `parent_request_id`, `transporte_empresa`, `pickup_date`.
- `quotes` — cotizaciones. `status` ∈ (sent, accepted, rejected, changes_requested).
- `surplus` — excedentes (tallos numéricos). `status` ∈ (active, closed).
- `surplus_offers` — ofertas con doble confirmación. `status` ∈ (sent, accepted, confirmed, rejected, cancelled).
- Función `owns_listing(lid)` (SECURITY DEFINER), usada por las políticas RLS.

**Orden para correr los SQL** (solo si reconstruyes la BD desde cero; si el sitio ya
funciona, ya están aplicados):

1. `supabase-schema.sql`
2. `marketplace-schema.sql`
3. `marketplace-edit-schema.sql`
4. `etapaA-schema.sql`
5. `etapaB-schema.sql`
6. `etapaB-fix-schema.sql`
7. `transporte-schema.sql`
8. `transporte-link-schema.sql`

Todos usan `if not exists`, así que son seguros de re-ejecutar.

**Datos de acceso:**
- Proyecto Supabase: **[COMPLETAR: URL]**
- Admin: `juanjota98@gmail.com`
- Sitio Netlify: **[COMPLETAR: URL]**

---

## 6. Reglas de negocio clave

- **Quién pide a quién:** florícola↔logística = *envío*; florícola↔florícola = *pedido*;
  cualquiera → transporte. Prohibido logística↔logística.
- **Cierre + transporte:** al aceptar una cotización de un pedido de flores, el comprador
  puede contratar transporte (queda ligado por `parent_request_id`) y ver el costo total
  (flores + transporte).
- **Privacidad de precios (por diseño):**
  - La **transportista** solo ve la carga/cantidad, nunca el precio de las flores.
  - La **florícola vendedora** ve el transportista + fecha de recogida, pero **no** el precio del transporte.
  - El **comprador** (que es parte de ambas negociaciones) ve el costo acumulado.

---

## 7. Puesta en marcha (setup)

**Requisitos:** cuenta de GitHub, Git instalado, app de escritorio de Claude con plan de pago.

1. Descomprime el proyecto en una carpeta (usa el paquete oficial; no mezcles versiones viejas).
2. Coloca tu `config.js` **real** en `assets/` (con tu URL y anon key de Supabase).
   Sin esto, el sitio se ve vacío.
3. Instala Git (git-scm.com) con opciones por defecto.
4. Crea un repositorio en GitHub (puede ser privado).
5. En la app de Claude → pestaña **Code** → nueva sesión → selecciona la carpeta (modo Local).
6. Pide a Claude Code: *"inicializa git, crea un .gitignore, primer commit, y súbelo a este repo de GitHub: [URL]"*.
7. Pide: *"lee CLAUDE.md y resume la arquitectura y lo pendiente"*.

> **.gitignore:** asegúrate de NO subir secretos. La *anon key* es pública (segura),
> pero la *service_role* de Supabase **jamás** debe ir al repo.

---

## 8. Flujo de despliegue

1. Si hay SQL nuevo → correrlo en Supabase → SQL Editor (en orden).
2. Subir HTML/assets a Netlify (Deploys). `index.html` debe quedar en la raíz.
3. `Ctrl+F5` para refrescar caché.
4. Verificar en el navegador con la consola abierta (F12) que no haya errores.

*(Meta a futuro: despliegue automático conectando GitHub → Netlify, para no subir a mano.)*

---

## 9. Convenciones de código

- Escapar SIEMPRE datos de usuario con `esc()` antes de meterlos al HTML.
- Usar `getDB()` para el cliente de Supabase.
- Textos de interfaz en español.
- Cambios pequeños y revisables; un commit por funcionalidad.

---

## 10. Seguridad

- La seguridad **real** son las políticas RLS de Postgres. Los chequeos en JS (ocultar
  botones, expulsar no-admins) son cosméticos: no protegen datos por sí solos.
- Nunca exponer ni commitear la `service_role` key.
- Validar cada flujo nuevo de punta a punta (crear como empresa A, responder como empresa B).
- Antes de un cambio grande: commit de respaldo (o rama nueva).

---

## 11. Roadmap

**Estados:** ✅ hecho · 🟡 en curso · ⬜ pendiente

- 🟡 **Migración a React (Vite + React) sobre el mismo Supabase.** Es la clave para escalar;
  `panel.html` ya es difícil de mantener a mano. No se pierde la base de datos.
- ⬜ **Pago en la plataforma (PayPhone o Kushki).** Requiere: RUC, cuenta de comercio
  aprobada, credenciales, y un backend seguro (Supabase Edge Function) para confirmar el
  pago vía webhook. No es posible de forma segura desde el sitio estático actual.
- ⬜ Email de aprobación en Make (afinar filtro `record.status = approved`).
- ⬜ Despliegue automático GitHub → Netlify.
- ⬜ Moderación de excedentes por el admin (opcional).
- ⬜ Persistir "tengo transporte propio" en la BD (para estadísticas).
- ⬜ [COMPLETAR: tus siguientes ideas.]

---

## 12. Registro de decisiones (por qué se hizo así)

> Anota aquí las decisiones importantes con su fecha y motivo. Esto evita re-discutir lo ya
> resuelto y le da contexto a cualquiera (incluida la IA) que retome el proyecto.

- **[fecha]** Frontend en HTML/JS puro para arrancar rápido y sin costo. *Decisión de migrar
  a React cuando la complejidad lo justifique (ya se justifica).*
- **[fecha]** Doble confirmación en excedentes (dueño acepta → comprador confirma) para que
  ningún trato se cierre sin acuerdo de ambas partes.
- **[fecha]** Privacidad de precios por separación de tablas (no por reglas extra): cada
  parte solo accede a las filas de las que es parte.
- **[fecha]** Pasarela de pago elegida: PayPhone/Kushki, tras confirmar que Stripe no es la
  vía local en Ecuador y que se necesita RUC + backend.
- **[COMPLETAR: futuras decisiones.]**

---

## 13. Preguntas abiertas / por decidir

- **Monetización:** ¿a quién se cobra y cómo? (Lo habitual: cobrar a logística/transporte
  por aparecer o por cotizar; las florícolas gratis para llenar la oferta.) → [COMPLETAR]
- **Primeras empresas:** ¿cómo consigues las primeras florícolas/logística/transporte reales
  para que el marketplace no esté vacío? → [COMPLETAR]
- **Legal/tributario:** si el dinero pasa por la plataforma, te vuelves intermediario de
  pagos (más carga con el SRI). ¿Pago directo entre partes o a través de la plataforma? → [COMPLETAR]
- **Métricas que importan:** empresas registradas, solicitudes creadas, % que cierran,
  tratos con transporte. → [COMPLETAR: cuáles vas a seguir]

---

## 14. Negocio (borrador)

**Modelo de ingresos (hipótesis):** [COMPLETAR]. Opciones típicas de marketplace:
suscripción a proveedores, comisión por trato cerrado, o destacar perfiles.

**Estrategia de arranque:** un marketplace de dos (tres) lados sufre el problema del
"huevo y la gallina": sin florícolas no llegan transportistas y viceversa. Táctica común:
sembrar manualmente un lado primero (p. ej. cargar transportistas/logística reales) y salir
a buscar florícolas con esa oferta ya visible. → [COMPLETAR con tu plan]

**Ventaja para tu perfil:** un repo limpio (idealmente React + Supabase) en GitHub es una
carta de presentación fuerte para roles de producto/fintech. Documentar decisiones aquí
también demuestra criterio, no solo código.

---

## 15. Glosario (para no-desarrolladores)

- **Repositorio (repo):** la carpeta del proyecto con historial completo de cambios.
- **Commit:** una "foto guardada" del proyecto en un momento, con mensaje. Punto de retorno.
- **Push:** subir tus commits a GitHub (respaldo en la nube).
- **Branch (rama):** línea paralela para probar sin tocar la versión que funciona.
- **RLS (Row Level Security):** reglas en Postgres que deciden qué filas puede ver/editar
  cada usuario. Es la seguridad de verdad de la app.
- **Edge Function:** un pequeño backend en Supabase que corre en el servidor; necesario para
  cosas que no pueden ser seguras en el navegador (como confirmar un pago).
- **anon key vs service_role:** la anon es pública y segura para el navegador; la service_role
  es secreta y todopoderosa — nunca va al repo ni al frontend.

---

## 16. Registro de cambios (changelog)

> Añade una línea cada vez que despliegues algo. Lo más nuevo arriba.

- **[fecha]** Creado este documento vivo. Proyecto pasado a Git + Claude Code.
- **[fecha]** [COMPLETAR: siguiente cambio…]

---

## 17. Cómo mantener este documento

- Cuando agregues una función → márcala en **Estado actual** y **Roadmap**, y anota en el **Changelog**.
- Cuando tomes una decisión → anótala en **Registro de decisiones** con fecha y motivo.
- Cuando resuelvas una pregunta abierta → muévela de la sección 13 a **Decisiones**.
- Revisa este archivo al inicio de cada etapa grande (p. ej. antes de la migración a React).
