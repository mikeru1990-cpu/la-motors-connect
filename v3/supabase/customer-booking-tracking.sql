-- Customer booking tracking for My Garage
-- Run once in Supabase SQL Editor after customer-portal-migration.sql.

alter table public.bookings
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists bookings_user_id_idx on public.bookings(user_id);

-- Public/guest requests stay anonymous. Signed-in customers may only attach their own user id.
drop policy if exists "public can create booking requests" on public.bookings;
create policy "public can create booking requests"
on public.bookings
for insert to anon,authenticated
with check(user_id is null or user_id=auth.uid());

-- Customers can read only booking requests linked to their own account.
drop policy if exists "customers read own bookings" on public.bookings;
create policy "customers read own bookings"
on public.bookings
for select to authenticated
using(user_id=auth.uid() and not public.is_staff());

-- Existing staff policies remain in place and continue to give staff access to all bookings.
