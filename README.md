# ConectaFlor 🌹✈️

Directorio web que conecta **florícolas de Ecuador** con **empresas de logística de exportación**.
Las empresas se registran, un administrador las aprueba, y solo entonces se publican en el
directorio público donde pueden verse y contactarse entre sí.

**Costo total: $0** (planes gratuitos de Supabase + Cloudflare Pages / Netlify).

---

## ¿Qué hace cada archivo?

| Archivo | Función |
|---|---|
| `index.html` | Página principal + directorio público (solo muestra aprobados) |
| `registro.html` | Formulario para que florícolas y logística se registren |
| `admin.html` | Panel privado para aprobar / rechazar registros |
| `assets/config.js` | **Aquí pegas tus credenciales de Supabase** |
| `assets/styles.css` | Diseño |
| `assets/app.js` | Funciones compartidas |
| `supabase-schema.sql` | Crea la base de datos y las reglas de seguridad |

---

## PASO 1 — Crear el backend gratis (Supabase)

1. Entra a **https://supabase.com** y crea una cuenta (gratis).
2. **New project** → ponle nombre (ej. `conectaflor`), elige una contraseña de base de datos y la región más cercana (East US sirve para Ecuador). Espera ~2 min a que se cree.
3. En el menú lateral abre **SQL Editor → New query**.
4. Abre el archivo `supabase-schema.sql`, **copia todo**, pégalo y dale **Run**.
   - ⚠️ Antes de ejecutarlo, busca y reemplaza `CORREO_DEL_ADMIN@ejemplo.com` por **el correo real que usarás como administrador** (aparece 3 veces).
5. Crea tu usuario administrador: **Authentication → Users → Add user**.
   - Usa **el mismo correo** que pusiste en el SQL y una contraseña.
   - (Si te pide confirmar el email, en *Authentication → Providers → Email* puedes desactivar "Confirm email" para pruebas.)

## PASO 2 — Conectar el frontend con tu backend

1. En Supabase ve a **Project Settings → API** (o "Data API").
2. Copia dos valores:
   - **Project URL** (algo como `https://abcdxyz.supabase.co`)
   - **anon public** key (es pública, no es secreta).
3. Abre `assets/config.js` y pégalos:

```js
window.SUPABASE_CONFIG = {
  url:     "https://abcdxyz.supabase.co",
  anonKey: "eyJhbGciOi...."
};
```

## PASO 3 — Probar en tu computadora (opcional)

Como son archivos estáticos, puedes abrir `index.html` directamente en el navegador,
o servirlo localmente:

```bash
# Si tienes Python instalado, dentro de la carpeta conectaflor/
python3 -m http.server 8000
# Luego abre  http://localhost:8000
```

## PASO 4 — Publicarlo gratis en internet

Elige **una** de estas opciones (todas tienen plan gratuito de por vida):

### Opción A — Netlify Drop (la más rápida, sin cuenta técnica)
1. Entra a **https://app.netlify.com/drop**
2. **Arrastra la carpeta `conectaflor`** completa a la página.
3. Listo: te da una URL pública (ej. `https://conectaflor.netlify.app`).
   Puedes cambiar el nombre y conectar un dominio propio después.

### Opción B — Cloudflare Pages
1. Crea cuenta en **https://pages.cloudflare.com**
2. **Create application → Pages → Upload assets**, sube la carpeta.
3. Obtienes una URL `*.pages.dev`.

### Opción C — Vercel
1. **https://vercel.com** → **Add New → Project → Deploy** (puedes subir la carpeta o conectar GitHub).

> Recomendación: para empezar, **Netlify Drop** (Opción A) es la más simple.
> Para actualizaciones frecuentes, conecta el proyecto a un repositorio de GitHub.

---

## Cómo funciona el flujo de aprobación (seguridad)

La seguridad **no** depende del código del navegador, sino de las reglas (RLS) en la base de datos:

- Cualquiera puede **insertar** un registro, pero la base de datos lo fuerza a `status = 'pending'`.
- El público (sin sesión) **solo puede leer** los registros con `status = 'approved'`.
- **Aprobar, rechazar o ver pendientes** solo lo puede hacer el usuario cuyo correo coincide
  con el del administrador definido en las políticas SQL. Nadie más, aunque manipule el frontend.

Por eso la `anon key` puede ser pública sin riesgo: las reglas viven en el servidor.

---

## Ideas para la siguiente versión (cuando quieras crecer)

- Subida de fotos/logos y galería (Supabase Storage, también gratis).
- Mensajería interna en lugar de mostrar el contacto directo.
- Filtros avanzados (por destino, por tipo de flor, por certificación).
- Verificación de RUC contra el SRI.
- Notificación por correo al admin cuando llega un registro nuevo (Supabase Edge Functions o un webhook a Make.com / n8n).

---

Hecho para conectar el sector floricultor ecuatoriano con el mundo. 🇪🇨
