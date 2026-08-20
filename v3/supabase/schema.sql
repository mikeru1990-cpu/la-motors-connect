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
  notes text default '',
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

create table if not exists public.job_cards (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  customer_name text not null,
  phone text,
  registration text not null,
  vehicle text default '',
  job_type text not null,
  description text default '',
  technician_notes text default '',
  status text not null default 'booked' check (status in ('booked','in_progress','waiting_parts','ready','completed','cancelled')),
  scheduled_date date,
  estimated_total numeric(10,2),
  final_total numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  image_urls text[] not null default '{}',
  status text not null default 'available' check (status in ('draft','available','reserved','sold')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers add column if not exists notes text default '';
alter table public.stock_vehicles add column if not exists image_urls text[] not null default '{}';

alter table public.bookings enable row level security;
alter table public.customers enable row level security;
alter table public.vehicles enable row level security;
alter table public.job_cards enable row level security;
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

create policy "authenticated staff manage job cards"
on public.job_cards for all
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

insert into storage.buckets (id,name,public)
values ('stock-photos','stock-photos',true)
on conflict (id) do update set public=true;

drop policy if exists "public read stock photos" on storage.objects;
create policy "public read stock photos"
on storage.objects for select
to anon, authenticated
using (bucket_id='stock-photos');

drop policy if exists "staff upload stock photos" on storage.objects;
create policy "staff upload stock photos"
on storage.objects for insert
to authenticated
with check (bucket_id='stock-photos');

drop policy if exists "staff update stock photos" on storage.objects;
create policy "staff update stock photos"
on storage.objects for update
to authenticated
using (bucket_id='stock-photos')
with check (bucket_id='stock-photos');

drop policy if exists "staff delete stock photos" on storage.objects;
create policy "staff delete stock photos"
on storage.objects for delete
to authenticated
using (bucket_id='stock-photos');

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

drop trigger if exists job_cards_updated_at on public.job_cards;
create trigger job_cards_updated_at before update on public.job_cards
for each row execute function public.set_updated_at();

drop trigger if exists stock_vehicles_updated_at on public.stock_vehicles;
create trigger stock_vehicles_updated_at before update on public.stock_vehicles
for each row execute function public.set_updated_at();
