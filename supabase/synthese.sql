-- =====================================================================
--  Tableau de synthèse E5 — tables et règles de sécurité
--  Supabase > SQL Editor > New query > coller ce fichier > Run
--  (nécessite que schema.sql ait déjà été exécuté)
-- =====================================================================

-- En-tête du tableau (une seule ligne)
create table if not exists public.synthese_infos (
  id            int primary key default 1 check (id = 1),
  nom           text,
  num_candidat  text,
  centre        text,
  option        text default 'SISR' check (option in ('SISR', 'SLAM')),
  url           text,
  session       text default '2027'
);
insert into public.synthese_infos (id) values (1) on conflict (id) do nothing;

-- Lignes du tableau (une par réalisation)
create table if not exists public.synthese_lignes (
  id           bigint generated always as identity primary key,
  section      text not null check (section in ('formation', 'annee1', 'annee2')),
  ordre        int default 0,
  intitule     text,
  documents    text,          -- liste des documents et productions associés
  date_debut   date,
  date_fin     date,
  competences  text[] default '{}',   -- codes B1.1 ... B1.6
  projet_id    bigint references public.projets(id) on delete set null,
  created_at   timestamptz default now()
);

alter table public.synthese_infos  enable row level security;
alter table public.synthese_lignes enable row level security;

-- En-tête (contient le n° candidat) : visible uniquement par les comptes connectés
drop policy if exists "synthese infos lecture" on public.synthese_infos;
create policy "synthese infos lecture" on public.synthese_infos
  for select to authenticated using (true);

drop policy if exists "synthese infos admin" on public.synthese_infos;
create policy "synthese infos admin" on public.synthese_infos
  for all using (public.is_admin()) with check (public.is_admin());

-- Lignes : visibles par tout le monde, modifiables par l'admin
drop policy if exists "synthese lignes lecture" on public.synthese_lignes;
create policy "synthese lignes lecture" on public.synthese_lignes
  for select using (true);

drop policy if exists "synthese lignes admin" on public.synthese_lignes;
create policy "synthese lignes admin" on public.synthese_lignes
  for all using (public.is_admin()) with check (public.is_admin());
