-- Secure customer portal + staff separation for L.A Motors
-- IMPORTANT: run this once in the Supabase SQL editor before enabling customer accounts.

create table if not exists public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Preserve all auth users that already exist at migration time as staff.
-- Run this migration BEFORE inviting customers to create accounts.
insert into public.staff_users(user_id)
select id from auth.users
on conflict(user_id) do nothing;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(select 1 from public.staff_users s where s.user_id=auth.uid());
$$;

grant execute on function public.is_staff() to authenticated;

create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  registration text not null,
  make text,
  model text,
  year integer,
  mot_due date,
  service_due date,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,registration)
);

alter table public.staff_users enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.customer_vehicles enable row level security;

-- Staff can only identify their own staff membership.
drop policy if exists "staff can read own membership" on public.staff_users;
create policy "staff can read own membership" on public.staff_users
for select to authenticated
using(user_id=auth.uid());

-- Customers can only access their own profile.
drop policy if exists "customers read own profile" on public.customer_profiles;
create policy "customers read own profile" on public.customer_profiles
for select to authenticated using(user_id=auth.uid());
drop policy if exists "customers create own profile" on public.customer_profiles;
create policy "customers create own profile" on public.customer_profiles
for insert to authenticated with check(user_id=auth.uid() and not public.is_staff());
drop policy if exists "customers update own profile" on public.customer_profiles;
create policy "customers update own profile" on public.customer_profiles
for update to authenticated using(user_id=auth.uid() and not public.is_staff()) with check(user_id=auth.uid() and not public.is_staff());

-- Customers can only access their own vehicles.
drop policy if exists "customers read own vehicles" on public.customer_vehicles;
create policy "customers read own vehicles" on public.customer_vehicles
for select to authenticated using(user_id=auth.uid());
drop policy if exists "customers create own vehicles" on public.customer_vehicles;
create policy "customers create own vehicles" on public.customer_vehicles
for insert to authenticated with check(user_id=auth.uid() and not public.is_staff());
drop policy if exists "customers update own vehicles" on public.customer_vehicles;
create policy "customers update own vehicles" on public.customer_vehicles
for update to authenticated using(user_id=auth.uid() and not public.is_staff()) with check(user_id=auth.uid() and not public.is_staff());
drop policy if exists "customers delete own vehicles" on public.customer_vehicles;
create policy "customers delete own vehicles" on public.customer_vehicles
for delete to authenticated using(user_id=auth.uid() and not public.is_staff());

-- Replace broad authenticated policies with staff-only access on business tables.
drop policy if exists "authenticated staff can read bookings" on public.bookings;
create policy "staff can read bookings" on public.bookings for select to authenticated using(public.is_staff());
drop policy if exists "authenticated staff can update bookings" on public.bookings;
create policy "staff can update bookings" on public.bookings for update to authenticated using(public.is_staff()) with check(public.is_staff());

drop policy if exists "authenticated staff manage customers" on public.customers;
create policy "staff manage customers" on public.customers for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "authenticated staff manage customer vehicles" on public.vehicles;
create policy "staff manage customer vehicles" on public.vehicles for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "authenticated staff manage stock" on public.stock_vehicles;
create policy "staff manage stock" on public.stock_vehicles for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "authenticated staff manage job cards" on public.job_cards;
create policy "staff manage job cards" on public.job_cards for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "authenticated staff manage quotes" on public.quotes;
create policy "staff manage quotes" on public.quotes for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "authenticated staff manage invoices" on public.invoices;
create policy "staff manage invoices" on public.invoices for all to authenticated using(public.is_staff()) with check(public.is_staff());

-- Keep the existing public booking insert and public stock browse policies in place.

create or replace function public.set_customer_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists customer_profiles_updated_at on public.customer_profiles;
create trigger customer_profiles_updated_at before update on public.customer_profiles for each row execute function public.set_customer_updated_at();
drop trigger if exists customer_vehicles_updated_at on public.customer_vehicles;
create trigger customer_vehicles_updated_at before update on public.customer_vehicles for each row execute function public.set_customer_updated_at();
