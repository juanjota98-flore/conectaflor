-- ============================================================
--  ConectaFlor · Triggers para notificaciones por email
--  Llaman Edge Function: notify-empresa
--  Ejecutar DESPUÉS de todos los demás schemas
-- ============================================================

-- Primero, verificamos que pg_net esté disponible
create extension if not exists pg_net with schema extensions;

-- ============================================================
--  TRIGGER 1: INSERT en listings (Bienvenida)
-- ============================================================
create or replace function public.trigger_new_listing_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
begin
  -- URL de la Edge Function (reemplazar si es necesario)
  edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
  anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

  -- Enviar webhook a la Edge Function
  perform net.http_post(
    url := edge_function_url,
    body := jsonb_build_object(
      'type', 'INSERT',
      'record', jsonb_build_object(
        'id', new.id,
        'email', new.email,
        'nombre_empresa', new.nombre_empresa,
        'status', new.status,
        'tipo', new.tipo
      )
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    )
  );

  return new;
end;
$$;

-- Crear trigger para INSERT
drop trigger if exists notify_new_listing on public.listings;
create trigger notify_new_listing
  after insert on public.listings
  for each row
  execute function public.trigger_new_listing_notification();

-- ============================================================
--  TRIGGER 2: UPDATE en listings (Aprobación/Rechazo)
-- ============================================================
create or replace function public.trigger_listing_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
begin
  -- Solo proceder si el status cambió
  if new.status <> old.status then
    edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

    -- Enviar webhook
    perform net.http_post(
      url := edge_function_url,
      body := jsonb_build_object(
        'type', 'UPDATE',
        'record', jsonb_build_object(
          'id', new.id,
          'email', new.email,
          'nombre_empresa', new.nombre_empresa,
          'status', new.status,
          'tipo', new.tipo
        ),
        'old_record', jsonb_build_object(
          'status', old.status
        )
      ),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      )
    );
  end if;

  return new;
end;
$$;

-- Crear trigger para UPDATE
drop trigger if exists notify_listing_update on public.listings;
create trigger notify_listing_update
  after update on public.listings
  for each row
  execute function public.trigger_listing_status_change();

-- ============================================================
--  Listo. Los triggers están activos.
--  Ahora:
--  1. Cada INSERT en listings → bienvenida automática
--  2. Cada UPDATE de status → aprobación/rechazo automático
--
--  Verifica los logs en Supabase → Edge Functions → notify-empresa
-- ============================================================
