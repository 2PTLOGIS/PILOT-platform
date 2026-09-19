-- PILOT Platform - Realtime Demo schema
-- Chay toan bo tep nay mot lan trong Supabase SQL Editor.
-- Script co the chay lai an toan, khong xoa du lieu dang co.

create table if not exists public.demo_sessions (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_by text not null default 'system',
  updated_at timestamptz not null default now(),
  constraint demo_sessions_main_only check (id = 'main')
);

comment on table public.demo_sessions is
  'Trang thai mo phong dung chung cho Driver, Dispatcher va Port Control Tower.';

-- Bat RLS de Data API khong the bo qua quy tac truy cap.
alter table public.demo_sessions enable row level security;

-- Ban demo khong chua du lieu that. Trinh duyet chi duoc doc va ghi session main.
-- Ban san pham se thay policy nay bang Supabase Auth va phan quyen theo vai tro.
drop policy if exists "pilot_demo_read_main" on public.demo_sessions;
create policy "pilot_demo_read_main"
on public.demo_sessions
for select
to anon, authenticated
using (id = 'main');

drop policy if exists "pilot_demo_insert_main" on public.demo_sessions;
create policy "pilot_demo_insert_main"
on public.demo_sessions
for insert
to anon, authenticated
with check (id = 'main');

drop policy if exists "pilot_demo_update_main" on public.demo_sessions;
create policy "pilot_demo_update_main"
on public.demo_sessions
for update
to anon, authenticated
using (id = 'main')
with check (id = 'main');

-- Automatically expose new tables dang tat, nen chi cap quyen dung bang demo nay.
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.demo_sessions to anon, authenticated;

-- Dua bang vao publication Realtime mot lan duy nhat.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'demo_sessions'
  ) then
    alter publication supabase_realtime add table public.demo_sessions;
  end if;
end
$$;

-- Ket qua cuoi cung phai co table_name = demo_sessions va rls_enabled = true.
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'demo_sessions';
