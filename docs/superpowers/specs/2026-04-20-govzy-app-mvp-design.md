# Govzy App MVP — Design Spec
Date: 2026-04-20

## 1. Vision

Govzy est un assistant administratif belge. L'utilisateur envoie ses documents (fiches de paie, contrats, factures…), l'IA les analyse, les résume, répond à ses questions, et détecte les aides de l'État auxquelles il pourrait avoir droit.

MVP : Auth + Dashboard + Upload Documents + Assistant IA (Gemini) + Détection d'aides

---

## 2. Stack

| Couche | Outil |
|---|---|
| Frontend + API routes | Next.js 14 App Router |
| Auth | Supabase Auth (Email + Google OAuth) |
| Base de données | Supabase PostgreSQL |
| Stockage fichiers | Supabase Storage |
| IA | Google Gemini API (gratuit) |
| Déploiement | Vercel |

---

## 3. Pages & Routing

| Route | Description |
|---|---|
| `/` | Landing page (existante) |
| `/auth/login` | Connexion email ou Google |
| `/auth/register` | Inscription email |
| `/auth/callback` | Callback OAuth Supabase |
| `/dashboard` | Dashboard principal |
| `/documents` | Liste de tous les documents |
| `/documents/[id]` | Détail d'un document + chat IA |

Toutes les routes `/dashboard`, `/documents` sont protégées (middleware Supabase Auth).

---

## 4. Layout Dashboard (Hybride A+C)

- **Sidebar large (100px)** avec logo Govzy, liens labellisés : Accueil, Documents, Aides, Alertes, et avatar utilisateur en bas
- **Zone principale** :
  - Header : "Bonjour [prénom] 👋" + bouton "+ Scanner un doc"
  - Rangée de stats : Documents · Aides détectées · Alertes
  - Bas de page divisé en deux :
    - **Gauche** : empty state "Scanner votre premier document" (disparaît quand docs présents)
    - **Droite** : Assistant IA toujours visible, prêt à répondre

---

## 5. Authentification

- Supabase Auth avec deux méthodes : email/mot de passe et Google OAuth
- À l'inscription, un profil est créé dans la table `profiles` via trigger Supabase
- Redirection post-login vers `/dashboard`
- Middleware Next.js protège toutes les routes privées

---

## 6. Upload de Documents

- Desktop : `<input type="file">` acceptant PDF, JPG, PNG
- Mobile : `<input type="file" capture="environment">` pour la caméra
- Flow upload :
  1. Fichier → Supabase Storage (bucket `documents`, chemin `{user_id}/{uuid}.{ext}`)
  2. Appel `POST /api/ai/analyze` avec le storage_path
  3. Gemini identifie le type de document et génère un résumé
  4. Résultat sauvegardé dans table `documents`
- Taille max fichier : 10 Mo

---

## 7. Intelligence Artificielle (Gemini)

### 7.1 Analyse d'un document (`POST /api/ai/analyze`)
- Reçoit : `document_id`, fichier ou storage_path
- Gemini identifie le type (fiche de paie, contrat, facture, composition de ménage…)
- Génère un résumé structuré en français
- Sauvegarde `type_detecte` et `resume` dans `documents`

### 7.2 Chat sur un document (`POST /api/ai/chat`)
- Reçoit : `message`, `document_id` (optionnel), `conversation_id`
- Contexte envoyé à Gemini : résumé du/des document(s) + historique des messages
- Réponse sauvegardée dans `messages`

### 7.3 Détection d'aides (`POST /api/ai/suggestions`)
- **Déclenchement automatique** : dès que l'utilisateur a ≥ 3 documents analysés
- **Déclenchement manuel** : bouton "Analyser mes aides" toujours accessible
- Gemini reçoit les résumés de tous les documents de l'utilisateur
- **Si contexte insuffisant** : Gemini répond avec la liste des documents manquants nécessaires (ex. fiche de paie, composition de ménage, avertissement extrait de rôle) adaptée à ce qu'il a déjà
- **Si aides détectées** : liste d'aides belges potentielles avec description courte et liens
- Résultats sauvegardés dans table `suggestions`

---

## 8. Schéma Base de Données

### `profiles`
```sql
id uuid references auth.users primary key
prenom text
email text
created_at timestamptz default now()
```

### `documents`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references profiles(id) on delete cascade
nom text
type_detecte text
resume text
storage_path text
created_at timestamptz default now()
```

### `messages`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references profiles(id) on delete cascade
document_id uuid references documents(id) on delete set null
role text check (role in ('user', 'assistant'))
content text
created_at timestamptz default now()
```

### `suggestions`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references profiles(id) on delete cascade
contenu jsonb
statut text check (statut in ('detectee', 'en_attente_docs', 'confirmee'))
created_at timestamptz default now()
```

RLS activé sur toutes les tables : chaque utilisateur ne voit que ses propres données.

---

## 9. API Routes

| Route | Méthode | Description |
|---|---|---|
| `/api/ai/analyze` | POST | Analyse un document avec Gemini |
| `/api/ai/chat` | POST | Message de chat (avec ou sans doc) |
| `/api/ai/suggestions` | POST | Analyse globale pour détecter les aides |

---

## 10. Variables d'Environnement

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

---

## 11. Ce qui n'est PAS dans le MVP

- Notifications push / alertes en temps réel
- Partage de documents entre utilisateurs
- Mode hors-ligne
- Paiement / abonnement
- Détection automatique des aides sans action utilisateur (au-delà du seuil de 3 docs)
