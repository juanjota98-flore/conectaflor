-- ============================================================
--  ConectaFlor  ·  Esquema de base de datos para Supabase
-- ============================================================
--  Cómo usarlo:
--  1. Entra a tu proyecto en https://supabase.com
--  2. Menú lateral  ->  "SQL Editor"  ->  "New query"
--  3. Pega TODO este archivo y dale "Run".
--  4. ¡IMPORTANTE! Reemplaza  CORREO_DEL_ADMIN@ejemplo.com
--     por el correo real con el que vas a iniciar sesión como
--     administrador (búscalo y cámbialo en las 3 políticas de abajo).
-- ============================================================

-- Extensión para generar IDs únicos (normalmente ya viene activa)
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
--  Tabla principal: registros de florícolas y logística
-- ------------------------------------------------------------
create table if not exists public.listings (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- Tipo de empresa
  tipo            text not null check (tipo in ('floricola','logistica')),

  -- Datos generales
  nombre_empresa  text not null,
  ruc             text,
  provincia       text,
  ciudad          text,

  -- Contacto (visible solo cuando está aprobado)
  contacto_nombre text,
  email           text not null,
  telefono        text,
  whatsapp        text,
  sitio_web       text,
  descripcion     text,

  -- Campos específicos de FLORÍCOLAS
  tipos_flores    text,   -- ej: Rosas, Gypsophila, Claveles
  volumen_mensual text,   -- ej: 1.5M tallos/mes
  certificaciones text,   -- ej: Flor Ecuador, BASC, Rainforest

  -- Campos específicos de LOGÍSTICA
  servicios       text,   -- ej: Cadena de frío, agente aduanal, courier
  destinos        text,   -- ej: Miami, Ámsterdam, Moscú
  cadena_frio     boolean default false,

  -- Estado del registro
  status          text not null default 'pending'
                  check (status in ('pending','approved','rejected'))
);

-- ------------------------------------------------------------
--  Activamos Row Level Security (seguridad por filas)
-- ------------------------------------------------------------
alter table public.listings enable row level security;

-- 1) Cualquier visitante puede REGISTRARSE,
--    pero solo entra como 'pending' (no se puede auto-aprobar).
drop policy if exists "registro_publico_insert" on public.listings;
create policy "registro_publico_insert"
  on public.listings for insert
  to anon, authenticated
  with check (status = 'pending');

-- 2) Cualquier visitante puede VER solo lo que ya está APROBADO.
drop policy if exists "directorio_publico_select" on public.listings;
create policy "directorio_publico_select"
  on public.listings for select
  to anon, authenticated
  using (status = 'approved');

-- 3) El ADMINISTRADOR puede ver TODO (incluidos los pendientes).
drop policy if exists "admin_select_todo" on public.listings;
create policy "admin_select_todo"
  on public.listings for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'CORREO_DEL_ADMIN@ejemplo.com');

-- 4) El ADMINISTRADOR puede APROBAR / RECHAZAR (update).
drop policy if exists "admin_update" on public.listings;
create policy "admin_update"
  on public.listings for update
  to authenticated
  using      ((auth.jwt() ->> 'email') = 'CORREO_DEL_ADMIN@ejemplo.com')
  with check ((auth.jwt() ->> 'email') = 'CORREO_DEL_ADMIN@ejemplo.com');

-- 5) (Opcional) El ADMINISTRADOR puede BORRAR registros.
drop policy if exists "admin_delete" on public.listings;
create policy "admin_delete"
  on public.listings for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'CORREO_DEL_ADMIN@ejemplo.com');

-- ------------------------------------------------------------
--  Índices para que el directorio cargue rápido
-- ------------------------------------------------------------
create index if not exists idx_listings_status on public.listings (status);
create index if not exists idx_listings_tipo   on public.listings (tipo);

-- ============================================================
--  Listo. Ahora crea tu usuario admin:
--  Authentication -> Users -> "Add user" -> usa el MISMO correo
--  que pusiste arriba en las políticas, y una contraseña.
-- ============================================================
