# Portfolio BTS SIO SISR

Site statique (HTML / CSS / JavaScript) qui utilise **Supabase** comme back-end : authentification, base de données PostgreSQL et stockage des fichiers.

| Visiteur | Accès |
|---|---|
| Public | Présentation, compétences, liste et détail des projets, tableau de synthèse |
| **Examinateur** (compte créé par toi) | + consultation et téléchargement des documents |
| **Admin** (toi) | + ajout, modification et suppression de projets, envoi et suppression de documents |

La sécurité est gérée **côté serveur** par les règles RLS (Row Level Security) de Supabase. Même si quelqu'un modifie le JavaScript dans son navigateur, il ne peut pas lire les documents sans être connecté, ni modifier quoi que ce soit sans être admin.

## Structure

```
index.html      Page d'accueil (à personnaliser : nom, formation, stages, veille…)
projet.html     Détail d'un projet + documents (si connecté)
login.html      Connexion
admin.html      Espace d'administration
css/style.css
js/config.js    ← URL et clé Supabase à renseigner
js/app.js       Fonctions communes (connexion, rôles, compétences B1.x)
js/index.js · js/projet.js · js/admin.js
supabase/schema.sql   Tables, règles de sécurité, buckets
```

## Installation (environ 15 minutes)

### 1. Créer le projet Supabase
1. Crée un compte sur https://supabase.com, puis clique sur **New project** (offre gratuite).
2. Ouvre **SQL Editor** > **New query**, colle tout le contenu de `supabase/schema.sql` puis clique sur **Run**.

### 2. Désactiver les inscriptions publiques
**Authentication** > **Sign In / Providers** > décoche **Allow new users to sign up**.
Ainsi, seuls les comptes que tu crées toi-même peuvent se connecter.

### 3. Créer les comptes
**Authentication** > **Users** > **Add user** > **Create new user** (coche *Auto Confirm User*) :
- ton compte admin ;
- un compte par examinateur (ex. `jury@portfolio.fr`), à qui tu transmets les identifiants.

Chaque nouveau compte reçoit automatiquement le rôle `examinateur`. Pour te passer admin, exécute dans le SQL Editor :
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'ton.email@exemple.fr');
```

### 3 bis. Importer les projets du portfolio V4
Dans le SQL Editor, colle le contenu de `supabase/import-projets.sql`, puis clique sur **Run** (une seule fois).
Dans le champ « Description » de l'administration, tu peux utiliser `## Titre`, `- liste`, `**gras**` et des schémas entre deux lignes ```` ``` ````.

### 4. Configurer le site
**Project Settings** > **API** : copie l'**URL du projet** et la clé **anon public** dans `js/config.js`.

### 5. Tester en local
Le site doit être servi par un serveur web (pas en ouvrant le fichier directement) :
```bash
python -m http.server 8000      # puis ouvre http://localhost:8000
```
Ou utilise l'extension **Live Server** de VS Code.

### 6. Mettre en ligne (gratuit)
- **GitHub Pages** : pousse le dossier sur un dépôt, puis Settings > Pages > branche `main`.
- ou **Netlify** / **Vercel** : glisse-dépose le dossier.

Ajoute ensuite l'URL du site dans Supabase > **Authentication** > **URL Configuration** > *Site URL*.

## À personnaliser
- `Prénom Nom`, e-mail, LinkedIn dans les 4 fichiers HTML ;
- sections *À propos*, *Compétences techniques* et *Veille* dans `index.html` ;
- ajoute ton `cv.pdf` à la racine ;
- les couleurs se changent dans `:root` au début de `css/style.css`.

## Bon à savoir
- **Mise en pause** : sur l'offre gratuite, un projet Supabase inactif pendant 7 jours est mis en pause. **Connecte-toi au site ou au tableau de bord Supabase quelques jours avant l'épreuve** ; un projet en pause se relance en un clic.
- Les documents sont servis par des **URL signées valables 10 minutes**, donc un lien copié ne reste pas utilisable indéfiniment.
- La taille maximale est de 50 Mo par fichier et le stockage total de 1 Go sur l'offre gratuite.
- La clé `anon` est publique par conception. Ne mets **jamais** la clé `service_role` dans le site.

## Pistes d'amélioration (à valoriser à l'oral)
- Expliquer l'architecture et les règles RLS : c'est un bon sujet pour parler de **sécurité et de gestion des droits**.
- Ajouter un journal des consultations des documents.
- Héberger le site sur ton propre serveur (Debian + Nginx + certificat Let's Encrypt), un vrai projet SISR en soi.
