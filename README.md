# Wellbeing App — Frontend Angular 18

![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Nginx-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Google OAuth2](https://img.shields.io/badge/Google-OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Chatbot IA](https://img.shields.io/badge/Chatbot-IA%20Flottant-10B981?style=for-the-badge&logo=openai&logoColor=white)

Interface moderne de bien-être au travail avec chatbot IA flottant, login Google OAuth2 via Keycloak, et architecture microservices Angular 18 standalone components.

---

## Fonctionnalités

### Espace Utilisateur (USER / COACH)

| Fonctionnalité | Description |
|---|---|
| 🔐 Login / Register | Authentification classique email + mot de passe |
| 🌐 Google OAuth2 | Connexion via Google (Keycloak IdP) |
| 🏠 Dashboard | Vue d'ensemble personnalisée |
| 😊 Humeur | Suivi quotidien du niveau de bien-être (1–10) |
| 🧘 Méditation | Séances guidées avec timer, historique et statistiques |
| 📅 Événements | Découverte, inscription, notation des événements bien-être |
| 📚 Ressources | Accès aux vidéos, articles, podcasts et formations |
| 📢 Réclamations | Soumission et suivi des réclamations avec timeline de statuts |
| 💬 Chat | Messagerie directe entre utilisateurs |
| 🤖 Chatbot IA | Widget flottant — Assistant Bien-être disponible sur toutes les pages |
| 🔔 Notifications | Centre de notifications en temps réel (polling 10s) |
| 👤 Profil | Gestion du compte personnel |

### Espace Administrateur (ADMIN)

| Fonctionnalité | Description |
|---|---|
| 📊 Dashboard Admin | Vue globale des KPIs et statistiques |
| 👥 Gestion Utilisateurs | Liste, modification et suppression des comptes |
| 😊 Gestion Humeurs | Tableau de bord analytique avec moyennes, alertes, filtres |
| 🧘 Gestion Méditations | Création et édition des séances (titre, catégorie, durée, image) |
| 📅 Gestion Événements | CRUD complet + gestion des statuts (UPCOMING / ONGOING / COMPLETED / CANCELLED) |
| 📚 Gestion Ressources | Publication et édition des ressources bien-être |
| 📢 Gestion Réclamations | Traitement des réclamations avec mise à jour de statut et commentaire |
| 💬 Supervision Chat | Accès aux conversations |

---

## Architecture du projet

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts          — Vérifie isLoggedIn(), redirige vers /login
│   │   └── admin.guard.ts
│   ├── interceptors/
│   │   ├── jwt.interceptor.ts     — Injecte Bearer token sur chaque requête
│   │   └── session.interceptor.ts — Intercepte les 401 → alerte session expirée
│   └── services/
│       ├── auth.service.ts        — Login, register, Google OAuth2, JWT localStorage
│       ├── chat.service.ts        — Messagerie & conversations
│       ├── complaint.service.ts   — Réclamations & historique statuts
│       ├── event.service.ts       — Événements, inscriptions, notations
│       ├── meditation.service.ts  — Séances, historique, statistiques
│       ├── mood.service.ts        — Suivi humeur quotidien
│       ├── notification.service.ts— Notifications temps réel
│       ├── resource.service.ts    — Ressources bien-être
│       ├── session.service.ts     — Gestion expiration session (signal + countdown)
│       └── user.service.ts        — Profil & gestion utilisateurs
│
├── layouts/
│   ├── frontoffice/               — Layout USER : Navbar + Chatbot IA flottant
│   └── backoffice/                — Layout ADMIN : Sidebar rétractable
│
├── modules/
│   ├── auth/
│   │   ├── login/                 — Formulaire login + bouton Google
│   │   ├── register/              — Inscription (email, nom, prénom, tel, role)
│   │   └── callback/              — Échange du code OAuth2 + sync utilisateur
│   ├── dashboard/                 — Dashboard utilisateur
│   ├── profile/                   — Page profil & modification
│   ├── mood/
│   │   ├── mood-form/             — Saisie humeur
│   │   ├── mood-list/             — Historique personnel
│   │   └── mood-admin/            — Vue admin avec stats et tableau
│   ├── meditation/
│   │   ├── meditation-list/       — Séances + historique + stats
│   │   ├── meditation-form/       — Création/édition (admin)
│   │   └── meditation-timer/      — Timer interactif plein écran
│   ├── event/
│   │   ├── event-list/            — Grille d'événements + filtres + inscription
│   │   └── event-form/            — Création/édition (admin)
│   ├── resource/
│   │   ├── resource-list/         — Grille de ressources + filtres par type
│   │   └── resource-form/         — Création/édition (admin)
│   ├── complaint/
│   │   └── complaint-list/        — Soumission + suivi timeline (USER & ADMIN)
│   ├── chat/
│   │   ├── chat-list/             — Conversations & messages
│   │   └── chat-form/
│   ├── notification/
│   │   └── notification-list/     — Centre de notifications (Toutes / Non lues)
│   └── admin/
│       ├── admin-dashboard/       — KPIs admin
│       └── user-management/       — Gestion des comptes
│
└── shared/
    ├── navbar/                    — Barre de navigation + notifications dropdown
    ├── sidebar/                   — Sidebar admin collapsible
    ├── chatbot/                   — Widget IA flottant (Assistant Bien-être 🤖)
    └── session-expired/           — Modal d'alerte session expirée + countdown
```

---

## Technologies

| Technologie | Version | Usage |
|---|---|---|
| Angular | 18.2 | Framework principal (Standalone Components) |
| TypeScript | ~5.5 | Typage statique |
| Bootstrap | 5.3.8 | Grilles et composants UI |
| SCSS | — | Styles personnalisés par composant |
| RxJS | ~7.8 | Gestion des flux asynchrones |
| Keycloak-JS | 24.0.5 | Client OAuth2 / OIDC |
| keycloak-angular | 15.3 | Intégration Angular |
| JWT | — | Stockage et injection du token (localStorage) |
| Node | 20-alpine | Build Docker |
| Nginx | alpine | Serveur de production |

---

## Installation & Démarrage

### Prérequis

- Node.js 20+
- Angular CLI 18
- Keycloak 24 en local sur le port `8180`
- API Gateway en local sur le port `8080`

### Développement

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd wellbeing-frontend

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Lancer le serveur de développement
ng serve
# → http://localhost:4200
```

### Build de production

```bash
ng build --configuration=production
# → dist/wellbeing-frontend/browser/
```

---

## Routes

### Publiques

| Route | Composant | Description |
|---|---|---|
| `/` | — | Redirige vers `/login` |
| `/login` | `LoginComponent` | Connexion email/password ou Google |
| `/register` | `RegisterComponent` | Inscription d'un nouveau compte |
| `/auth/callback` | `CallbackComponent` | Callback OAuth2 Google via Keycloak |
| `/**` | — | Redirige vers `/login` |

### Frontoffice — Utilisateur (`/home/*`)

> Protégées par `authGuard`

| Route | Composant | Description |
|---|---|---|
| `/home` | `DashboardComponent` | Dashboard principal |
| `/home/profile` | `ProfileComponent` | Profil utilisateur |
| `/home/moods` | `MoodListComponent` | Suivi humeur |
| `/home/meditations` | `MeditationListComponent` | Séances + historique |
| `/home/meditations/timer` | `MeditationTimerComponent` | Timer de méditation |
| `/home/meditations/new` | `MeditationFormComponent` | Nouvelle séance |
| `/home/meditations/edit/:id` | `MeditationFormComponent` | Édition séance |
| `/home/events` | `EventListComponent` | Événements bien-être |
| `/home/resources` | `ResourceListComponent` | Ressources bien-être |
| `/home/chat` | `ChatListComponent` | Messagerie |
| `/home/complaints` | `ComplaintListComponent` | Réclamations |

### Backoffice — Admin (`/admin/*`)

> Protégées par `authGuard`

| Route | Composant | Description |
|---|---|---|
| `/admin` | `AdminDashboardComponent` | Dashboard admin |
| `/admin/users` | `UserManagementComponent` | Gestion utilisateurs |
| `/admin/moods` | `MoodAdminComponent` | Analyse des humeurs |
| `/admin/meditations` | `MeditationListComponent` | Gestion séances |
| `/admin/meditations/new` | `MeditationFormComponent` | Créer une séance |
| `/admin/meditations/edit/:id` | `MeditationFormComponent` | Modifier une séance |
| `/admin/events` | `EventListComponent` | Gestion événements |
| `/admin/events/new` | `EventFormComponent` | Créer un événement |
| `/admin/events/edit/:id` | `EventFormComponent` | Modifier un événement |
| `/admin/resources` | `ResourceListComponent` | Gestion ressources |
| `/admin/resources/new` | `ResourceFormComponent` | Créer une ressource |
| `/admin/resources/edit/:id` | `ResourceFormComponent` | Modifier une ressource |
| `/admin/complaints` | `ComplaintListComponent` | Gestion réclamations |
| `/admin/chat` | `ChatListComponent` | Supervision chat |

---

## Sécurité

### Flux Login Classique

```
Utilisateur saisit email + mot de passe
        ↓
POST /api/users/login
        ↓
Réponse : { accessToken, refreshToken, user }
        ↓
Stockage dans localStorage :
  - token         → accessToken
  - refresh_token → refreshToken
  - user          → UserInfo (JSON)
        ↓
Redirection vers /home ou /admin selon le rôle
```

### Flux Google OAuth2 (Keycloak)

```
Clic "Se connecter avec Google"
        ↓
loginWithGoogle() → redirect Keycloak (kc_idp_hint=google)
  realm: wellbeing-realm | client: wellbeing-client
        ↓
Google authentifie → Keycloak redirige vers /auth/callback?code=...
        ↓
CallbackComponent → exchangeCode(code)
        ↓
POST Keycloak /token → { access_token, id_token, refresh_token }
        ↓
decodeToken(access_token) → extraire email, firstName, lastName
        ↓
syncUser() → POST /api/users/sync → UserInfo en base
        ↓
saveToken() + saveUser() → localStorage
        ↓
Redirection vers /home
```

### Intercepteurs HTTP

**`jwtInterceptor`** — injecte le header `Authorization: Bearer <token>` sur toutes les requêtes HTTP protégées, sauf :
- `POST /users/register`
- `POST /users/login`
- Toute URL contenant `/realms/` (endpoints Keycloak)

**`sessionInterceptor`** — capture les réponses HTTP `401` et déclenche `sessionService.showExpiredAlert()` pour afficher le modal de session expirée avec countdown automatique.

### Guard

**`authGuard`** — vérifie `authService.isLoggedIn()` (présence du token JWT en localStorage). Si absent, redirige vers `/login`.

### Rôles

| Rôle | Accès |
|---|---|
| `USER` | Frontoffice `/home/*` uniquement |
| `COACH` | Frontoffice `/home/*` + création de méditations |
| `ADMIN` | Frontoffice + Backoffice `/admin/*` + toutes les actions CRUD |

---

## Docker

### Build multi-stage

```dockerfile
# Stage 1 — Build Angular (node:20-alpine)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Stage 2 — Serve avec Nginx (nginx:alpine)
FROM nginx:alpine
COPY --from=build /app/dist/wellbeing-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Configuration Nginx (`nginx.conf`)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing — toutes les routes Angular renvoient index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API vers l'API Gateway microservices
    location /api/ {
        proxy_pass http://api-gateway:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Lancer avec Docker

```bash
# Build de l'image
docker build -t wellbeing-frontend .

# Lancer le conteneur
docker run -p 80:80 wellbeing-frontend

# Avec docker-compose (recommandé avec l'API Gateway)
docker-compose up --build
```

---

## Design System

### Couleurs principales

| Rôle | Couleur |
|---|---|
| Primaire | `#4CAF50` (vert bien-être) |
| Secondaire | `#2196F3` (bleu) |
| Danger | `#f44336` (rouge) |
| Warning | `#FF9800` (orange) |
| Texte discret | `#888888` |
| Fond carte | `#ffffff` |

### Typographie

- Police système : `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Titres de page : `1.6rem`, `font-weight: 700`
- Textes secondaires : `0.8rem`, `color: #888`

### Composants récurrents

| Classe CSS | Usage |
|---|---|
| `.event-card` / `.resource-card` | Cartes des modules |
| `.alert-bar.alert-success/error` | Barre d'alerte |
| `.modal-overlay` / `.modal-box` | Modals (détail, notation, participants) |
| `.tab-btn` / `.tab-badge` | Onglets avec compteur |
| `.spinner` | Indicateur de chargement |
| `.btn-create` / `.btn-save` | Boutons d'action principaux |
| `.status-pill` / `.status-badge` | Badges de statut colorés |

### Chatbot IA flottant

Le composant `ChatbotComponent` est un widget persistant injecté dans le layout Frontoffice :

- Visible sur toutes les pages `/home/*` — masqué sur `/login` et `/register`
- Nom affiché : `🤖 Assistant Bien-être` (identifiant backend : `ai-assistant`)
- Utilise le microservice `chat-service` comme backend conversationnel
- Délai de réponse simulé de 2 secondes
- Auto-scroll vers le dernier message

---

## Variables d'environnement

| Variable | Valeur développement | Description |
|---|---|---|
| `apiUrl` | `http://localhost:8080/api` | URL de l'API Gateway |
| Keycloak URL | `http://localhost:8180` | Serveur Keycloak |
| Realm | `wellbeing-realm` | Realm Keycloak |
| Client ID | `wellbeing-client` | Client OAuth2 |
| Redirect URI | `http://localhost:4200/auth/callback` | Callback Google |

> En production, modifier `src/environments/environment.prod.ts` avec les URLs de déploiement.

---

## Auteur

**Ali Najjaa**
Étudiant 4ème année Génie Logiciel — ESPRIT

> Projet réalisé dans le cadre du module Microservices & Architecture Distribuée.
