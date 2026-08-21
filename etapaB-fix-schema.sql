-- ============================================================
--  ConectaFlor · Etapa B (ajustes)
--  - Cantidad numérica (tallos) en excedentes y ofertas
--  - Doble confirmación: dueño acepta -> comprador confirma
--  - Excedente pasa a 'closed' cuando el trato se cierra
--  Ejecutar en SQL Editor después de etapaB-schema.sql
-- ============================================================

-- 1) Cantidad numérica (tallos). Mantengo las columnas de texto por compatibilidad,
--    pero agrego columnas numéricas que serán las que se validan.
alter table public.surplus
  add column if not exists tallos integer;

alter table public.surplus_offers
  add column if not exists tallos integer;

-- 2) Nuevos estados de la oferta:
--    sent       -> enviada por el comprador
--    accepted   -> el dueño la aceptó (falta confirmación del comprador)
--    confirmed  -> el comprador confirmó: TRATO CERRADO
--    rejected   -> rechazada
--    cancelled  -> anulada
alter table public.surplus_offers drop constraint if exists surplus_offers_status_check;
alter table public.surplus_offers
  add constraint surplus_offers_status_check
  check (status in ('sent','accepted','confirmed','rejected','cancelled'));

-- ============================================================
--  Nota: cuando una oferta llega a 'confirmed', el panel marcará
--  el excedente como 'closed' (sale del directorio público) y
--  ambas empresas verán el trato cerrado con los datos de contacto.
-- ============================================================
