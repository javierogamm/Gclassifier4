alter table if exists public.users
  add column if not exists admin boolean not null default false;
