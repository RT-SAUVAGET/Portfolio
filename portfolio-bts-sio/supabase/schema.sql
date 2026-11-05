-- =====================================================================
--  Portfolio BTS SIO — Schéma Supabase
--  À coller dans : Supabase > SQL Editor > New query > Run
-- =====================================================================

-- ---------- 1. Profils & rôles ----------------------------------------
create table if not exists public.profiles (
  id    uuid primary key references auth.users(id) on delete cascade,
  nom   text,
  role  text not null default 'examinateur'
        check (role in ('admin', 'examinateur'))
);

-- Fonction utilitaire : l'utilisateur connecté est-il admin ?
create or replace function public.is_admin()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Création automatique d'un profil "examinateur" à chaque nouveau compte
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nom) values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 2. Projets ------------------------------------------------
create table if not exists public.projets (
  id            bigint generated always as identity primary key,
  titre         text not null,
  resume        text,
  description   text,
  contexte      text,               -- ex : "Formation", "Stage 1re année"
  date_projet   date,
  technologies  text[] default '{}',
  competences   text[] default '{}', -- codes B1.1 ... B1.6
  image_url     text,
  ordre         int default 0,
  created_at    timestamptz default now()
);

-- ---------- 3. Documents liés aux projets -----------------------------
create table if not exists public.documents (
  id          bigint generated always as identity primary key,
  projet_id   bigint not null references public.projets(id) on delete cascade,
  nom         text not null,
  chemin      text not null,   -- chemin dans le bucket "documents"
  type        text,
  taille      bigint,
  created_at  timestamptz default now()
);

-- ---------- 4. Sécurité (Row Level Security) --------------------------
alter table public.profiles  enable row level security;
alter table public.projets   enable row level security;
alter table public.documents enable row level security;

-- Profils : chacun voit le sien, l'admin voit tout
drop policy if exists "profil lecture" on public.profiles;
create policy "profil lecture" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- Projets : visibles par tout le monde (vitrine publique), modifiables par l'admin
drop policy if exists "projets lecture publique" on public.projets;
create policy "projets lecture publique" on public.projets
  for select using (true);

drop policy if exists "projets ecriture admin" on public.projets;
create policy "projets ecriture admin" on public.projets
  for all using (public.is_admin()) with check (public.is_admin());

-- Documents : lisibles uniquement par les comptes connectés, modifiables par l'admin
drop policy if exists "documents lecture connectes" on public.documents;
create policy "documents lecture connectes" on public.documents
  for select to authenticated using (true);

drop policy if exists "documents ecriture admin" on public.documents;
create policy "documents ecriture admin" on public.documents
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- 5. Stockage des fichiers ----------------------------------
-- "documents" = privé (docs techniques) ; "images" = public (visuels des projets)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false), ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "docs lecture connectes" on storage.objects;
create policy "docs lecture connectes" on storage.objects
  for select to authenticated using (bucket_id = 'documents');

drop policy if exists "fichiers ajout admin" on storage.objects;
create policy "fichiers ajout admin" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('documents', 'images') and public.is_admin());

drop policy if exists "fichiers modif admin" on storage.objects;
create policy "fichiers modif admin" on storage.objects
  for update to authenticated
  using (bucket_id in ('documents', 'images') and public.is_admin());

drop policy if exists "fichiers suppression admin" on storage.objects;
create policy "fichiers suppression admin" on storage.objects
  for delete to authenticated
  using (bucket_id in ('documents', 'images') and public.is_admin());

-- ---------- 6. Te passer administrateur -------------------------------
-- Après avoir créé ton compte (Authentication > Users > Add user),
-- remplace l'email puis exécute UNIQUEMENT cette ligne :
--
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'ton.email@exemple.fr');
