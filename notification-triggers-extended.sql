-- ============================================================
--  ConectaFlor · Triggers adicionales para notificaciones
--  (Solicitudes, Cotizaciones, Sobrantes)
--  Ejecutar DESPUÉS de webhook-triggers.sql
-- ============================================================

-- ============================================================
--  TRIGGERS PARA REQUESTS (Solicitudes)
-- ============================================================

create or replace function public.trigger_request_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
  requester_listing record;
  recipient_listing record;
begin
  -- Obtener datos de las empresas
  select nombre_empresa, email into requester_listing from public.listings where id = new.requester_id;
  select nombre_empresa, email into recipient_listing from public.listings where id = new.recipient_id;

  edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
  anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

  perform net.http_post(
    url := edge_function_url,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'requests',
      'record', jsonb_build_object(
        'id', new.id,
        'titulo', new.titulo,
        'requester_empresa', requester_listing.nombre_empresa,
        'recipient_empresa', recipient_listing.nombre_empresa,
        'requester_email', requester_listing.email,
        'recipient_email', recipient_listing.email,
        'status', new.status
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

drop trigger if exists notify_request_created on public.requests;
create trigger notify_request_created
  after insert on public.requests
  for each row
  execute function public.trigger_request_created();

-- ============================================================
--  TRIGGER: UPDATE de requests (Aceptada/Rechazada)
-- ============================================================

create or replace function public.trigger_request_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
  requester_listing record;
  recipient_listing record;
begin
  if new.status <> old.status then
    select nombre_empresa, email into requester_listing from public.listings where id = new.requester_id;
    select nombre_empresa, email into recipient_listing from public.listings where id = new.recipient_id;

    edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

    perform net.http_post(
      url := edge_function_url,
      body := jsonb_build_object(
        'type', 'UPDATE',
        'table', 'requests',
        'record', jsonb_build_object(
          'id', new.id,
          'titulo', new.titulo,
          'requester_empresa', requester_listing.nombre_empresa,
          'recipient_empresa', recipient_listing.nombre_empresa,
          'requester_email', requester_listing.email,
          'status', new.status
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

drop trigger if exists notify_request_update on public.requests;
create trigger notify_request_update
  after update on public.requests
  for each row
  execute function public.trigger_request_status_change();

-- ============================================================
--  TRIGGERS PARA QUOTES (Cotizaciones)
-- ============================================================

create or replace function public.trigger_quote_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
  requester_listing record;
  sender_listing record;
  request_record record;
begin
  select requester_id, recipient_id into request_record from public.requests where id = new.request_id;
  select nombre_empresa, email into requester_listing from public.listings where id = request_record.requester_id;
  select nombre_empresa into sender_listing from public.listings where id = new.sender_id;

  edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
  anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

  perform net.http_post(
    url := edge_function_url,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'quotes',
      'record', jsonb_build_object(
        'id', new.id,
        'sender_empresa', sender_listing.nombre_empresa,
        'requester_empresa', requester_listing.nombre_empresa,
        'requester_email', requester_listing.email,
        'precio', new.precio,
        'moneda', new.moneda,
        'status', new.status
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

drop trigger if exists notify_quote_created on public.quotes;
create trigger notify_quote_created
  after insert on public.quotes
  for each row
  execute function public.trigger_quote_created();

-- ============================================================
--  TRIGGER: UPDATE de quotes (Aceptada/Rechazada)
-- ============================================================

create or replace function public.trigger_quote_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
  requester_listing record;
  sender_listing record;
  request_record record;
begin
  if new.status <> old.status then
    select requester_id from public.requests where id = new.request_id into request_record;
    select nombre_empresa, email into requester_listing from public.listings where id = request_record.requester_id;
    select nombre_empresa into sender_listing from public.listings where id = new.sender_id;

    edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

    perform net.http_post(
      url := edge_function_url,
      body := jsonb_build_object(
        'type', 'UPDATE',
        'table', 'quotes',
        'record', jsonb_build_object(
          'id', new.id,
          'sender_empresa', sender_listing.nombre_empresa,
          'requester_empresa', requester_listing.nombre_empresa,
          'requester_email', requester_listing.email,
          'precio', new.precio,
          'moneda', new.moneda,
          'status', new.status
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

drop trigger if exists notify_quote_update on public.quotes;
create trigger notify_quote_update
  after update on public.quotes
  for each row
  execute function public.trigger_quote_status_change();

-- ============================================================
--  TRIGGER PARA SURPLUS (Sobrantes)
-- ============================================================

create or replace function public.trigger_surplus_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_function_url text;
  anon_key text;
  florista_listing record;
begin
  select nombre_empresa into florista_listing from public.listings where id = new.florista_id;

  edge_function_url := 'https://jbsgahlfsixbltvpdmqt.supabase.co/functions/v1/notify-empresa';
  anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

  perform net.http_post(
    url := edge_function_url,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'surplus',
      'record', jsonb_build_object(
        'id', new.id,
        'flores', new.flores,
        'cantidad', new.cantidad,
        'precio', new.precio,
        'florista_empresa', florista_listing.nombre_empresa,
        'status', new.status
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

drop trigger if exists notify_surplus_created on public.surplus;
create trigger notify_surplus_created
  after insert on public.surplus
  for each row
  execute function public.trigger_surplus_created();

-- ============================================================
--  Listo. Triggers adicionales activados para:
--  - Solicitudes (INSERT y UPDATE)
--  - Cotizaciones (INSERT y UPDATE)
--  - Sobrantes (INSERT)
-- ============================================================
