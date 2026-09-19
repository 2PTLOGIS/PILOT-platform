-- Chưa cần chạy file này ở Bước 1.
-- File chuẩn bị sẵn cho giai đoạn kết nối dữ liệu thật giữa nhiều thiết bị.

create table if not exists public.trips (
  id text primary key,
  container_id text not null,
  driver_name text not null,
  truck_id text not null,
  terminal_name text not null,
  slot_start timestamptz,
  slot_end timestamptz,
  eta timestamptz,
  status text not null default 'DRAFT',
  risk_level text not null default 'ON_TIME',
  updated_at timestamptz not null default now()
);

create table if not exists public.gps_events (
  id bigint generated always as identity primary key,
  trip_id text not null references public.trips(id),
  latitude double precision not null,
  longitude double precision not null,
  speed_kmh double precision,
  event_time timestamptz not null,
  received_time timestamptz not null default now()
);

create table if not exists public.recommendations (
  id bigint generated always as identity primary key,
  trip_id text not null references public.trips(id),
  reason text not null,
  old_slot text,
  proposed_slot text,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  trip_id text,
  actor_role text not null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
