create table if not exists public.downloads (
  created_at timestamptz default now(),
  modelo text,
  "user" text,
  "type" text
);

alter table public.downloads enable row level security;

create policy "anon_insert_downloads" on public.downloads
  for insert to anon with check (true);
