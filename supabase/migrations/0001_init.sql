create extension if not exists "pgcrypto";

create table if not exists public.series_vinculacion (
  id uuid primary key default gen_random_uuid(),
  nombre_entidad text,
  sobrescribir text,
  cod text,
  actividad text,
  plazos text,
  created_at timestamptz default now()
);

create table if not exists public.series_carga (
  id uuid primary key default gen_random_uuid(),
  nombre_entidad text,
  sobrescribir text,
  posicion text,
  codigo_serie text,
  titulo_serie text,
  categoria text,
  unidad_gestora text,
  libro_oficial text,
  nivel_seguridad text,
  advertencia_seguridad text,
  sensibilidad_datos_personales text,
  nivel_confidencialidad text,
  tipo_acceso text,
  condiciones_reutilizacion text,
  codigo_causa_limitacion text,
  normativa text,
  valor_primario text,
  plazo text,
  valor_secundario text,
  dictamen text,
  documento_esencial text,
  accion_dictaminada text,
  ejecucion text,
  motivacion text,
  last_change timestamptz default now(),
  created_at timestamptz default now()
);

create or replace function public.ping()
returns text
language sql
as $$
  select 'pong';
$$;

grant execute on function public.ping() to anon, authenticated;

alter table public.series_carga enable row level security;
alter table public.series_vinculacion enable row level security;

create policy "anon_read_series_carga" on public.series_carga
  for select to anon using (true);

create policy "anon_read_series_vinculacion" on public.series_vinculacion
  for select to anon using (true);
