-- ============================================================
--  ConectaFlor · Etapa A
--  - Rechazar / pedir cambios en cotizaciones
--  - Pedidos florícola<->florícola (pero NO logística<->logística)
--  Ejecutar en SQL Editor después de los esquemas anteriores.
-- ============================================================

-- 1) Permitir nuevos estados en las cotizaciones
alter table public.quotes drop constraint if exists quotes_status_check;
alter table public.quotes
  add constraint quotes_status_check
  check (status in ('sent','accepted','rejected','changes_requested'));

-- 2) Guardar la nota de "pedir cambios" en la solicitud
alter table public.requests
  add column if not exists change_note text;

-- 3) Regla de quién puede pedir a quién:
--    permitido florícola<->logística y florícola<->florícola,
--    PROHIBIDO logística<->logística.
drop policy if exists "req_insert" on public.requests;
create policy "req_insert"
  on public.requests for insert to authenticated
  with check (
    public.owns_listing(requester_id)
    and requester_id <> recipient_id
    and exists (select 1 from public.listings r where r.id = recipient_id and r.status = 'approved')
    and not (
      (select tipo from public.listings where id = requester_id) = 'logistica'
      and (select tipo from public.listings where id = recipient_id) = 'logistica'
    )
  );

-- ============================================================
--  Listo. Recuerda que las políticas de UPDATE ya permiten a las
--  dos partes cambiar estados (aceptar, rechazar, pedir cambios).
-- ============================================================
