-- ============================================================
--  ConectaFlor · Etapa B · Tablón de excedentes
--  - surplus:        publicaciones de sobrantes de flores
--  - surplus_offers: ofertas que hacen otras empresas
--  Ejecutar en SQL Editor después de los esquemas anteriores.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Tabla de EXCEDENTES
-- ------------------------------------------------------------
create table if not exists public.surplus (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  listing_id       uuid not null references public.listings(id) on delete cascade,
  flores           text not null,
  cantidad         text,
  precio           numeric,
  moneda           text default 'USD',
  disponible_hasta date,
  ubicacion        text,
  detalle          text,
  status           text not null default 'active'
                   check (status in ('active','closed'))
);
create index if not exists idx_surplus_listing on public.surplus(listing_id);
create index if not exists idx_surplus_status  on public.surplus(status);

alter table public.surplus enable row level security;

drop policy if exists "surplus_public_select" on public.surplus;
create policy "surplus_public_select"
  on public.surplus for select to anon, authenticated
  using (status = 'active');

drop policy if exists "surplus_owner_select" on public.surplus;
create policy "surplus_owner_select"
  on public.surplus for select to authenticated
  using (public.owns_listing(listing_id));

drop policy if exists "surplus_insert" on public.surplus;
create policy "surplus_insert"
  on public.surplus for insert to authenticated
  with check (
    public.owns_listing(listing_id)
    and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'approved')
  );

drop policy if exists "surplus_update" on public.surplus;
create policy "surplus_update"
  on public.surplus for update to authenticated
  using      (public.owns_listing(listing_id))
  with check (public.owns_listing(listing_id));

drop policy if exists "surplus_delete" on public.surplus;
create policy "surplus_delete"
  on public.surplus for delete to authenticated
  using (public.owns_listing(listing_id));

-- ------------------------------------------------------------
-- 2) Tabla de OFERTAS sobre excedentes
-- ------------------------------------------------------------
create table if not exists public.surplus_offers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  surplus_id  uuid not null references public.surplus(id) on delete cascade,
  buyer_id    uuid not null references public.listings(id) on delete cascade,
  precio      numeric,
  moneda      text default 'USD',
  cantidad    text,
  mensaje     text,
  status      text not null default 'sent' check (status in ('sent','accepted','rejected'))
);
create index if not exists idx_soffer_surplus on public.surplus_offers(surplus_id);

alter table public.surplus_offers enable row level security;

drop policy if exists "soffer_select" on public.surplus_offers;
create policy "soffer_select"
  on public.surplus_offers for select to authenticated
  using (
    public.owns_listing(buyer_id)
    or exists (
      select 1 from public.surplus s
      where s.id = surplus_offers.surplus_id and public.owns_listing(s.listing_id)
    )
  );

drop policy if exists "soffer_insert" on public.surplus_offers;
create policy "soffer_insert"
  on public.surplus_offers for insert to authenticated
  with check (
    public.owns_listing(buyer_id)
    and exists (select 1 from public.listings l where l.id = buyer_id and l.status = 'approved')
    and exists (
      select 1 from public.surplus s
      where s.id = surplus_id and s.status = 'active' and s.listing_id <> buyer_id
    )
  );

drop policy if exists "soffer_update" on public.surplus_offers;
create policy "soffer_update"
  on public.surplus_offers for update to authenticated
  using (
    public.owns_listing(buyer_id)
    or exists (select 1 from public.surplus s where s.id = surplus_offers.surplus_id and public.owns_listing(s.listing_id))
  )
  with check (
    public.owns_listing(buyer_id)
    or exists (select 1 from public.surplus s where s.id = surplus_offers.surplus_id and public.owns_listing(s.listing_id))
  );

-- ============================================================
--  El directorio público muestra los excedentes 'active'.
--  Para ofertar hay que iniciar sesión como empresa aprobada.
-- ============================================================
