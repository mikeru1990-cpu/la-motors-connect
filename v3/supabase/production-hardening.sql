-- L.A Motors production hardening
-- Safe to run more than once in Supabase SQL Editor.
-- Run AFTER customer-portal-migration.sql so public.is_staff() exists.

alter table public.bookings enable row level security;

grant insert on table public.bookings to anon, authenticated;

drop policy if exists "public can create booking requests" on public.bookings;
create policy "public can create booking requests"
on public.bookings
for insert to anon, authenticated
with check (
  status = 'pending'
  and length(trim(customer_name)) between 2 and 120
  and length(trim(phone)) between 7 and 40
  and length(trim(registration)) between 2 and 24
  and preferred_date >= current_date
);

-- Keep public showroom images readable, but only real staff can alter them.
drop policy if exists "public read stock photos" on storage.objects;
create policy "public read stock photos"
on storage.objects
for select to anon, authenticated
using (bucket_id = 'stock-photos');

drop policy if exists "staff upload stock photos" on storage.objects;
create policy "staff upload stock photos"
on storage.objects
for insert to authenticated
with check (bucket_id = 'stock-photos' and public.is_staff());

drop policy if exists "staff update stock photos" on storage.objects;
create policy "staff update stock photos"
on storage.objects
for update to authenticated
using (bucket_id = 'stock-photos' and public.is_staff())
with check (bucket_id = 'stock-photos' and public.is_staff());

drop policy if exists "staff delete stock photos" on storage.objects;
create policy "staff delete stock photos"
on storage.objects
for delete to authenticated
using (bucket_id = 'stock-photos' and public.is_staff());

-- Explicit least-privilege grants for the public surface.
revoke update, delete on table public.bookings from anon;
revoke insert, update, delete on table public.stock_vehicles from anon;

grant select on table public.stock_vehicles to anon, authenticated;
