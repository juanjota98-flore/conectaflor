-- ============================================================
--  ConectaFlor · Permisos para que cada empresa edite/borre lo suyo
--  Ejecutar en SQL Editor (después de los esquemas anteriores).
-- ============================================================

-- La empresa puede ACTUALIZAR su propia ficha.
-- Importante: no puede auto-aprobarse. Si edita estando aprobada,
-- su ficha vuelve a 'pending' para nueva revisión del admin.
drop policy if exists "owner_update_own" on public.listings;
create policy "owner_update_own"
  on public.listings for update to authenticated
  using      (user_id = auth.uid())
  with check (user_id = auth.uid() and status in ('pending','rejected'));

-- La empresa puede BORRAR su propia ficha.
drop policy if exists "owner_delete_own" on public.listings;
create policy "owner_delete_own"
  on public.listings for delete to authenticated
  using (user_id = auth.uid());

-- ============================================================
--  Nota sobre "eliminar cuenta":
--  Borrar la FICHA (listings) sí lo puede hacer la empresa desde
--  el navegador, y por el "on delete cascade" se borran también
--  sus solicitudes y cotizaciones automáticamente.
--
--  Borrar el USUARIO de auth (el login) NO se puede hacer de forma
--  segura desde el navegador con la anon key. El panel borrará la
--  ficha y cerrará la sesión; el usuario de login queda inactivo
--  (sin ficha). Si quieres borrarlo del todo, se hace desde
--  Authentication -> Users en el dashboard, o con una Edge Function.
-- ============================================================
