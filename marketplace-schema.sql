-- ============================================================
--  ConectaFlor · Esquema del MARKETPLACE
--  (cuentas por empresa + solicitudes + cotizaciones)
--
--  Ejecutar DESPUÉS de supabase-schema.sql
--  SQL Editor -> New query -> pegar TODO -> Run
-- ============================================================

-- ⚠️ PASO PREVIO OBLIGATORIO en el dashboard:
--   Authentication -> Sign In / Providers -> Email
--   -> desactiva "Confirm email" (OFF)
--   Así, al registrarse, la empresa inicia sesión de inmediato.
--   (La aprobación del admin sigue controlando qué se publica.)

-- ------------------------------------------------------------
-- 1) Vincular cada empresa (listing) a una cuenta de usuario
-- ------------------------------------------------------------
alter table public.listings
  add column if not exists user_id uuid references auth.users(id);

create index if not exists idx_listings_user on public.listings(user_id);

-- Función de ayuda: ¿el usuario actual es dueño de esta empresa?
-- (security definer evita problemas de recursión en las políticas)
create or replace function public.owns_listing(lid uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$ select exists(select 1 from public.listings where id = lid and user_id = auth.uid()); $$;

-- Reemplazar la inserción anónima por una ligada a la cuenta
drop policy if exists "registro_publico_insert" on public.listings;
create policy "empresa_inserta_propia"
  on public.listings for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

-- El dueño puede ver su propia ficha aunque aún no esté aprobada
drop policy if exists "owner_select_own" on public.listings;
create policy "owner_select_own"
  on public.listings for select to authenticated
  using (user_id = auth.uid());

-- (Se mantienen sin cambios: directorio_publico_select,
--  admin_select_todo, admin_update, admin_delete)

-- ------------------------------------------------------------
-- 2) SOLICITUDES  (requests)
--    kind = 'envio'  -> una FLORÍCOLA pide transporte a una LOGÍSTICA
--    kind = 'pedido' -> una LOGÍSTICA pide flores a una FLORÍCOLA
--    Flujo: requester crea la solicitud -> recipient cotiza -> requester acepta
-- ------------------------------------------------------------
create table if not exists public.requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  requester_id    uuid not null references public.listings(id) on delete cascade,
  recipient_id    uuid not null references public.listings(id) on delete cascade,
  kind            text not null check (kind in ('envio','pedido')),
  titulo          text,
  detalle         text,
  flores          text,
  cantidad        text,
  origen          text,
  destino         text,
  fecha_requerida date,
  status          text not null default 'open'
                  check (status in ('open','quoted','accepted','rejected','cancelled'))
);
create index if not exists idx_req_recipient on public.requests(recipient_id);
create index if not exists idx_req_requester on public.requests(requester_id);

alter table public.requests enable row level security;

-- Ver: solo las dos partes involucradas
create policy "req_select_partes"
  on public.requests for select to authenticated
  using (public.owns_listing(requester_id) or public.owns_listing(recipient_id));

-- Crear: solo el solicitante (dueño del requester) y hacia una empresa aprobada
create policy "req_insert"
  on public.requests for insert to authenticated
  with check (
    public.owns_listing(requester_id)
    and requester_id <> recipient_id
    and exists (select 1 from public.listings r where r.id = recipient_id and r.status = 'approved')
  );

-- Actualizar (cambios de estado): cualquiera de las dos partes
create policy "req_update_partes"
  on public.requests for update to authenticated
  using      (public.owns_listing(requester_id) or public.owns_listing(recipient_id))
  with check (public.owns_listing(requester_id) or public.owns_listing(recipient_id));

-- ------------------------------------------------------------
-- 3) COTIZACIONES  (quotes)
--    Las envía el DESTINATARIO de la solicitud. El SOLICITANTE acepta.
-- ------------------------------------------------------------
create table if not exists public.quotes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  request_id  uuid not null references public.requests(id) on delete cascade,
  sender_id   uuid not null references public.listings(id) on delete cascade,
  precio      numeric,
  moneda      text default 'USD',
  detalle     text,
  validez     date,
  status      text not null default 'sent' check (status in ('sent','accepted','rejected'))
);
create index if not exists idx_quote_request on public.quotes(request_id);

alter table public.quotes enable row level security;

-- Ver: las dos partes de la solicitud asociada
create policy "quote_select_partes"
  on public.quotes for select to authenticated
  using (exists (
    select 1 from public.requests r
    where r.id = quotes.request_id
      and (public.owns_listing(r.requester_id) or public.owns_listing(r.recipient_id))
  ));

-- Crear: solo el destinatario de la solicitud puede cotizar
create policy "quote_insert_destinatario"
  on public.quotes for insert to authenticated
  with check (
    public.owns_listing(sender_id)
    and exists (
      select 1 from public.requests r
      where r.id = request_id and r.recipient_id = sender_id
    )
  );

-- Actualizar (aceptar/rechazar): cualquiera de las dos partes
create policy "quote_update_partes"
  on public.quotes for update to authenticated
  using (exists (
    select 1 from public.requests r
    where r.id = quotes.request_id
      and (public.owns_listing(r.requester_id) or public.owns_listing(r.recipient_id))
  ))
  with check (exists (
    select 1 from public.requests r
    where r.id = quotes.request_id
      and (public.owns_listing(r.requester_id) or public.owns_listing(r.recipient_id))
  ));

-- ============================================================
--  Listo. Resumen del modelo:
--   listings  = empresas (ahora con dueño user_id)
--   requests  = solicitudes/pedidos entre empresas
--   quotes    = cotizaciones que responden a una solicitud
--  Todo protegido para que cada empresa solo vea lo suyo.
-- ============================================================
