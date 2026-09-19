-- Customer-visible workshop progress for My Garage
-- Run once after customer-booking-tracking.sql.

alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check
  check (status in (
    'pending',
    'confirmed',
    'in_progress',
    'waiting_parts',
    'ready',
    'completed',
    'cancelled'
  ));
