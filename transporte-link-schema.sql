-- ============================================================
--  ConectaFlor · Transporte enlazado al trato + privacidad de precios
--  Ejecutar en SQL Editor después de transporte-schema.sql
-- ============================================================

-- Enlaza una solicitud de transporte con el trato de flores que la origina
alter table public.requests
  add column if not exists parent_request_id uuid references public.requests(id) on delete set null;

-- Resumen SIN precio que ve la florícola vendedora (transportista + fecha de recogida)
alter table public.requests
  add column if not exists transporte_empresa text;

alter table public.requests
  add column if not exists pickup_date date;

-- ============================================================
--  Privacidad (por diseño, sin reglas extra):
--   · La transportista solo es parte de la solicitud de transporte,
--     así que ve la CARGA/cantidad, nunca el precio de las flores
--     (vive en otra solicitud a la que no tiene acceso).
--   · La florícola vendedora no es parte de la solicitud de transporte,
--     así que no ve sus precios; solo verá el resumen
--     (transporte_empresa + pickup_date) en su propio trato.
--   · El comprador, que es parte de ambas, ve el costo acumulado.
-- ============================================================
