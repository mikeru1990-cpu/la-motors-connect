create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  registration text not null,
  vehicle text default '',
  preferred_date date not null,
  customer_name text not null,
  phone text not null,
  notes text default '',
  status text not null default 'pending' check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  registration text not null,
  make text,
  model text,
  year integer,
  mot_due date,
  service_due date,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  make text not null,
  model text not null,
  derivative text,
  year integer,
  price integer,
  mileage integer,
  fuel text,
  gearbox text,
  colour text,
  mot text,
  service_history text,
  description text,
  status text not null default 'available' check (status in ('draft','available','reserved','sold')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.stock_vehicles enable row level security;

create policy "public can create booking requests"
on public.bookings for insert
to anon, authenticated
with check (true);

create policy "authenticated staff can read bookings"
on public.bookings for select
to authenticated
using (true);

create policy "authenticated staff can update bookings"
on public.bookings for update
to authenticated
using (true)
with check (true);

create policy "authenticated staff manage customers"
on public.customers for all
to authenticated
using (true)
with check (true);

create policy "authenticated staff manage customer vehicles"
on public.vehicles for all
to authenticated
using (true)
with check (true);

create policy "public can browse available stock"
on public.stock_vehicles for select
to anon, authenticated
using (status in ('available','reserved'));

create policy "authenticated staff manage stock"
on public.stock_vehicles for all
to authenticated
using (true)
with check (true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists stock_vehicles_updated_at on public.stock_vehicles;
create trigger stock_vehicles_updated_at before update on public.stock_vehicles
for each row execute function public.set_updated_at();
