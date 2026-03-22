# 🌿 Wellbeing App — Frontend Angular 18

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18-red?style=for-the-badge&logo=angular"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap"/>
  <img src="https://img.shields.io/badge/Docker-Nginx-blue?style=for-the-badge&logo=docker"/>
</p>

> Interface utilisateur moderne pour l'application de bien-être mental **Wellbeing App**.  
> Projet académique — Module **Applications Web Distribuées (MT-41)** — ESPRIT

---

## 📋 Table des matières

- [Description](#-description)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#️-architecture)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancer le projet](#-lancer-le-projet)
- [Structure des fichiers](#-structure-des-fichiers)
- [Modules](#-modules)
- [Docker](#-docker)
- [Auteur](#-auteur)

---

## 📖 Description

Interface Angular 18 **standalone** pour la plateforme de bien-être mental Wellbeing App.  
Elle communique avec les microservices backend via l'API Gateway et gère l'authentification JWT via Keycloak.

---

## ✨ Fonctionnalités

### 👤 Utilisateur (USER)
```
✅ Authentification (Login / Register)
✅ Dashboard personnalisé avec statistiques
✅ Suivi d'humeur (slider 1-10, emojis, historique)
✅ Séances de méditation
✅ Inscription aux événements de bien-être
✅ Consultation des ressources (articles, vidéos, podcasts)
✅ Soumission et suivi des réclamations (timeline)
✅ Chat Messenger avec tous les utilisateurs
✅ Notifications en temps réel 🔔
✅ Profil utilisateur avec statistiques
✅ Session expirée avec countdown
```

### ⚙️ Administrateur (ADMIN)
```
✅ Dashboard admin avec statistiques dynamiques
✅ Gestion des utilisateurs
✅ Gestion des humeurs (vue globale)
✅ Création et gestion des événements
✅ Gestion des ressources
✅ Traitement des réclamations (changement statut)
✅ Messagerie avec les utilisateurs
✅ Vue de toutes les conversations
```

---

## 🏗️ Architecture

```
src/app/
├── core/
│   ├── guards/          → authGuard
│   ├── interceptors/    → jwt + session
│   └── services/        → tous les services Angular
├── layouts/
│   ├── frontoffice/     → Layout USER (Navbar)
│   └── backoffice/      → Layout ADMIN (Sidebar)
├── modules/
│   ├── auth/            → login, register
│   ├── dashboard/       → dashboard user
│   ├── admin/           → dashboard admin, users
│   ├── mood/            → list, admin
│   ├── event/           → list, form
│   ├── complaint/       → list, form
│   ├── resource/        → list, form
│   ├── chat/            → messenger
│   ├── profile/         → profil utilisateur
│   └── meditation/      → méditations
└── shared/
    ├── navbar/          → barre de navigation
    ├── sidebar/         → menu admin
    └── session-expired/ → overlay session expirée
```

---

## 🛠️ Technologies

| Catégorie | Technologies |
|-----------|-------------|
| **Framework** | Angular 18 (Standalone Components) |
| **Language** | TypeScript 5 |
| **UI** | Bootstrap 5, SCSS |
| **Auth** | JWT, Keycloak OAuth2 |
| **HTTP** | HttpClient, Interceptors |
| **Routing** | Angular Router, Guards |
| **State** | Services + Signals |
| **Build** | Angular CLI, Webpack |
| **Server** | Nginx (Docker) |

---

## 📋 Prérequis

```
✅ Node.js 20+
✅ Angular CLI 18
✅ npm ou yarn
✅ Backend microservices démarrés
```

---

## ⚙️ Installation

### 1 — Cloner le projet

```bash
git clone https://github.com/alinajjaa/MicroService-Frontend.git
cd MicroService-Frontend
```

### 2 — Installer les dépendances

```bash
npm install --legacy-peer-deps
```

### 3 — Configurer l'environnement

`src/environments/environment.ts` (développement) :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

`src/environments/environment.prod.ts` (production/Docker) :
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

---

## 🚀 Lancer le projet

### Développement local

```bash
ng serve
# → http://localhost:4200
```

### Build production

```bash
ng build --configuration=production
```

### Avec Docker

```bash
# Depuis le dossier wellbeing-app (backend)
docker-compose up --build frontend

# Rebuild sans cache
docker-compose build --no-cache frontend
docker-compose up
```

---

## 📁 Structure des fichiers

```
wellbeing-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts        → Root component
│   │   ├── app.config.ts           → Providers + Interceptors
│   │   ├── app.routes.ts           → Routes principales
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts
│   │   │   │   └── session.interceptor.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── user.service.ts
│   │   │       ├── mood.service.ts
│   │   │       ├── event.service.ts
│   │   │       ├── complaint.service.ts
│   │   │       ├── resource.service.ts
│   │   │       ├── chat.service.ts
│   │   │       ├── notification.service.ts
│   │   │       └── session.service.ts
│   │   ├── layouts/
│   │   │   ├── frontoffice/
│   │   │   └── backoffice/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── mood/
│   │   │   ├── event/
│   │   │   ├── complaint/
│   │   │   ├── resource/
│   │   │   ├── chat/
│   │   │   ├── profile/
│   │   │   └── meditation/
│   │   └── shared/
│   │       ├── navbar/
│   │       ├── sidebar/
│   │       └── session-expired/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.scss
├── Dockerfile
├── nginx.conf
└── package.json
```

---

## 🗺️ Modules

### Routes

```
/login                    → Page de connexion
/register                 → Page d'inscription

/home                     → Dashboard utilisateur
/home/moods               → Mes humeurs
/home/moods/new           → Nouvelle humeur
/home/meditations         → Mes méditations
/home/events              → Événements
/home/resources           → Ressources
/home/complaints          → Mes réclamations
/home/complaints/new      → Nouvelle réclamation
/home/chat                → Messagerie
/home/profile             → Mon profil

/admin                    → Dashboard admin
/admin/users              → Gestion utilisateurs
/admin/moods              → Gestion humeurs
/admin/events             → Gestion événements
/admin/events/new         → Créer événement
/admin/resources          → Gestion ressources
/admin/resources/new      → Créer ressource
/admin/complaints         → Gestion réclamations
/admin/chat               → Messagerie admin
```

### Services Angular

```typescript
// auth.service.ts
login(email, password)  → JWT token
register(...)           → Créer compte
logout()                → Supprimer token
getUser()               → Utilisateur courant

// notification.service.ts
getMyNotifications(userId)   → Liste notifications
getUnreadCount(userId)       → Nombre non lus
markAsRead(id)               → Marquer lu
markAllAsRead(userId)        → Tout lire

// session.service.ts
showExpiredAlert()   → Afficher overlay expiration
redirectToLogin()    → Rediriger vers login
```

---

## 🔐 Sécurité

```typescript
// jwt.interceptor.ts → Ajoute Bearer token à chaque requête
// session.interceptor.ts → Catch 401 → session expirée

// auth.guard.ts
canActivate(): boolean {
  return !!localStorage.getItem('token');
}
```

---

## 🐳 Docker

### Dockerfile (Multi-stage)

```dockerfile
# Stage 1 — Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Stage 2 — Nginx
FROM nginx:alpine
COPY --from=build /app/dist/wellbeing-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### nginx.conf

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Proxy vers API Gateway
  location /api/ {
    proxy_pass http://api-gateway:8080/api/;
  }
}
```

---

## 🎨 Design System

```
Couleur primaire  : #1a472a (vert foncé)
Couleur secondaire: #2d6a4f (vert moyen)
Accent           : #52b788 (vert clair)
Background       : #f0f4f1

Composants :
→ Cards avec hover animation
→ Modals avec backdrop blur
→ Loading spinners
→ Toast notifications
→ Badges statuts colorés
→ Progress bars dynamiques
```

---

## 📊 Screenshots

```
→ Page Login / Register       (design 2 panneaux)
→ Dashboard USER               (cards modules + stats)
→ Dashboard ADMIN              (stats dynamiques + services status)
→ Module Humeurs               (slider + emojis)
→ Module Événements            (grille + inscription)
→ Module Chat                  (UI Messenger)
→ Module Réclamations          (timeline statuts)
→ Cloche Notifications 🔔      (dropdown + badge)
→ Session Expirée              (overlay + countdown)
→ Profil Utilisateur           (hero card + tabs)
```

---

## 👤 Auteur

**Ali Najjaa**  
Étudiant en 4ème année — ESPRIT  
Module : Applications Web Distribuées (MT-41)

[![GitHub](https://img.shields.io/badge/GitHub-alinajjaa-black?style=flat&logo=github)](https://github.com/alinajjaa)  
[![Backend](https://img.shields.io/badge/Backend-Microservice--Project-green?style=flat)](https://github.com/alinajjaa/Microservice-Project)

---

## 📄 Licence

Ce projet est développé dans le cadre académique de l'école ESPRIT.
