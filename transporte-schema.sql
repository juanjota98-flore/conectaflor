-- ============================================================
--  ConectaFlor · Tipo TRANSPORTE
--  - Tercer tipo de empresa: 'transporte'
--  - Campos propios del transportista + disponibilidad
--  - Se le solicita y cotiza igual que a logística
--  Ejecutar en SQL Editor después de los esquemas anteriores.
-- ============================================================

-- 1) Permitir el tercer tipo
alter table public.listings drop constraint if exists listings_tipo_check;
alter table public.listings
  add constraint listings_tipo_check
  check (tipo in ('floricola','logistica','transporte'));

-- 2) Campos propios del transportista
alter table public.listings add column if not exists camiones_disponibles integer;
alter table public.listings add column if not exists capacidad_carga text;   -- ej: "hasta 10 ton / 12 pallets"
alter table public.listings add column if not exists tipo_vehiculo text;     -- ej: "Furgón, camión 3.5T"
alter table public.listings add column if not exists cobertura text;         -- ej: "Sierra y aeropuerto Quito"
alter table public.listings add column if not exists refrigerado boolean default false;
alter table public.listings add column if not exists disponible boolean default true;  -- disponible/no para asignación

-- 3) Permitir solicitudes de tipo 'transporte'
alter table public.requests drop constraint if exists requests_kind_check;
alter table public.requests
  add constraint requests_kind_check
  check (kind in ('envio','pedido','transporte'));

-- 4) Regla de quién puede pedir a quién (actualizada):
--    - florícola <-> logística            (envío)
--    - florícola <-> florícola            (pedido)
--    - cualquiera  -> transporte          (transporte)   floricola y logistica
--    PROHIBIDO: logística <-> logística, y pedir transporte a no-transportistas
--    También: una transportista no pide transporte (se enfoca en dar el servicio).
drop policy if exists "req_insert" on public.requests;
create policy "req_insert"
  on public.requests for insert to authenticated
  with check (
    public.owns_listing(requester_id)
    and requester_id <> recipient_id
    and exists (select 1 from public.listings r where r.id = recipient_id and r.status = 'approved')
    -- Si es solicitud de transporte, el destino DEBE ser transportista
    and (
      (kind = 'transporte'
        and (select tipo from public.listings where id = recipient_id) = 'transporte'
        and (select tipo from public.listings where id = requester_id) in ('floricola','logistica'))
      or
      -- Si NO es transporte, no se permite que el destino sea transportista,
      -- ni logística<->logística
      (kind <> 'transporte'
        and (select tipo from public.listings where id = recipient_id) <> 'transporte'
        and not (
          (select tipo from public.listings where id = requester_id) = 'logistica'
          and (select tipo from public.listings where id = recipient_id) = 'logistica'
        ))
    )
  );

-- ============================================================
--  Listo. Un transportista es una empresa más que recibe
--  solicitudes (kind='transporte') y las cotiza, con el mismo
--  flujo de aceptar / rechazar / pedir cambios que ya existe.
-- ============================================================
