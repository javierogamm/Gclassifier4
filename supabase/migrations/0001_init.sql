create extension if not exists "pgcrypto";

create table if not exists public.series_carga (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  nombre text not null,
  descripcion text,
  created_at timestamptz not null default now()
);

create table if not exists public.series_vinculacion (
  id uuid primary key default gen_random_uuid(),
  serie_id uuid references public.series_carga (id) on delete cascade,
  entidad text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subseries_carga (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  nombre text not null,
  descripcion text,
  serie_codigo text,
  created_at timestamptz not null default now()
);

create table if not exists public.subseries_vinculacion (
  id uuid primary key default gen_random_uuid(),
  subserie_id uuid references public.subseries_carga (id) on delete cascade,
  entidad text not null,
  created_at timestamptz not null default now()
);

create index if not exists series_carga_codigo_idx on public.series_carga (codigo);
create index if not exists subseries_carga_codigo_idx on public.subseries_carga (codigo);

create or replace function public.ping()
returns text
language sql
as $$
  select 'pong';
$$;

grant execute on function public.ping() to anon, authenticated;

alter table public.series_carga enable row level security;
alter table public.series_vinculacion enable row level security;
alter table public.subseries_carga enable row level security;
alter table public.subseries_vinculacion enable row level security;

create policy "anon_read_series_carga" on public.series_carga
  for select to anon using (true);

create policy "anon_read_series_vinculacion" on public.series_vinculacion
  for select to anon using (true);

create policy "anon_read_subseries_carga" on public.subseries_carga
  for select to anon using (true);

create policy "anon_read_subseries_vinculacion" on public.subseries_vinculacion
  for select to anon using (true);
