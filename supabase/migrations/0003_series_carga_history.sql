create table if not exists public.series_carga_historico (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  original_codigo_serie text,
  original_titulo_serie text,
  change_date timestamptz not null default now(),
  change_user text,
  original_id uuid,
  original_categoria text,
  original_posicion text
);

create or replace function public.series_carga_change_user()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt() -> 'user_metadata' ->> 'name',
    auth.jwt() ->> 'email',
    auth.uid()::text,
    current_user
  );
$$;

create or replace function public.log_series_carga_changes()
returns trigger
language plpgsql
as $$
begin
  insert into public.series_carga_historico (
    change_date,
    change_user,
    original_id,
    original_codigo_serie,
    original_titulo_serie,
    original_categoria,
    original_posicion
  ) values (
    now(),
    public.series_carga_change_user(),
    old.id,
    old.codigo_serie,
    old.titulo_serie,
    old.categoria,
    old.posicion
  );
  return new;
end;
$$;

drop trigger if exists series_carga_history_trigger on public.series_carga;
create trigger series_carga_history_trigger
after update on public.series_carga
for each row execute function public.log_series_carga_changes();
