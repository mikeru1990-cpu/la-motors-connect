-- Customer finance access for My Garage
-- Run after customer-booking-tracking.sql.

create or replace function public.customer_owns_job(target_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select
    not public.is_staff()
    and exists (
      select 1
      from public.job_cards j
      join public.bookings b on b.id=j.booking_id
      where j.id=target_job_id
        and b.user_id=auth.uid()
    );
$$;

revoke all on function public.customer_owns_job(uuid) from public;
grant execute on function public.customer_owns_job(uuid) to authenticated;

alter table public.quotes enable row level security;
alter table public.invoices enable row level security;

drop policy if exists "customers read own quotes" on public.quotes;
create policy "customers read own quotes"
on public.quotes
for select to authenticated
using (
  status in ('sent','accepted','declined','expired')
  and public.customer_owns_job(job_id)
);

drop policy if exists "customers read own invoices" on public.invoices;
create policy "customers read own invoices"
on public.invoices
for select to authenticated
using (
  status in ('unpaid','paid')
  and public.customer_owns_job(job_id)
);

grant select on table public.quotes to authenticated;
grant select on table public.invoices to authenticated;

create or replace function public.accept_my_quote(quote_id uuid)
returns bigint
language plpgsql
security definer
set search_path=public
as $$
declare
  q public.quotes%rowtype;
  inv_no bigint;
begin
  if public.is_staff() then
    raise exception 'Customer account required';
  end if;

  select *
  into q
  from public.quotes
  where id=quote_id
    and status in ('sent','accepted')
    and public.customer_owns_job(job_id)
  for update;

  if not found then
    raise exception 'Quote not available';
  end if;

  select invoice_number
  into inv_no
  from public.invoices
  where job_id=q.job_id
    and status <> 'void'
  order by created_at desc
  limit 1;

  if inv_no is null then
    insert into public.invoices(
      job_id,customer_id,vehicle_id,customer_name,phone,registration,vehicle,
      description,amount,status,due_date
    )
    values(
      q.job_id,q.customer_id,q.vehicle_id,q.customer_name,q.phone,q.registration,q.vehicle,
      q.description,q.amount,'unpaid',current_date+7
    )
    returning invoice_number into inv_no;
  end if;

  if q.status <> 'accepted' then
    update public.quotes set status='accepted' where id=q.id;
  end if;

  return inv_no;
end;
$$;

revoke all on function public.accept_my_quote(uuid) from public;
grant execute on function public.accept_my_quote(uuid) to authenticated;
