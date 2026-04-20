-- supabase/migrations/001_initial_schema.sql

-- Profiles (liés à auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  prenom text,
  email text not null,
  created_at timestamptz default now() not null
);

-- Trigger : crée automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, prenom)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Documents
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  nom text not null,
  type_detecte text,
  resume text,
  storage_path text not null,
  created_at timestamptz default now() not null
);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- Suggestions
create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  contenu jsonb not null,
  statut text check (statut in ('detectee', 'en_attente_docs', 'confirmee')) not null,
  created_at timestamptz default now() not null
);

-- RLS : chaque utilisateur voit uniquement ses données
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.suggestions enable row level security;

create policy "users see own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "users see own documents" on public.documents
  for all using (auth.uid() = user_id);

create policy "users see own messages" on public.messages
  for all using (auth.uid() = user_id);

create policy "users see own suggestions" on public.suggestions
  for all using (auth.uid() = user_id);

-- Storage bucket pour les documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

create policy "users upload own documents" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users read own documents" on storage.objects
  for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users delete own documents" on storage.objects
  for delete using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
