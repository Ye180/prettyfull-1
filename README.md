# PrettyFull - Turborepo Monorepo

Application web complète avec architecture micro-frontend utilisant Turborepo pour la gestion des packages partagés.

## 🏗️ Architecture

### Apps

- **`web`**: Application frontend Next.js principale
- **`backend`**: API backend NestJS (serveur sur port 7777)
- **`admin`**: Interface d'administration (port 3001)

### Packages Partagés

- **`@repo/ui`**: Composants React réutilisables avec prefix CSS `ui:` (ex: `ui:bg-red-600`)
- **`@repo/eslint-config`**: Configurations ESLint partagées (base, next, react)
- **`@repo/store`**: État global et logique métier partagée (Zustand)
- **`@repo/typescript-config`**: Configurations TypeScript partagées (base, nestjs, nextjs)

## 🚀 Démarrage Rapide

### Installation

```bash
pnpm install
```

### Développement

```bash
# Démarrer tous les services
pnpm dev

# Applications spécifiques
pnpm dev --filter=web       # Frontend uniquement
pnpm dev --filter=backend   # Backend uniquement
pnpm dev --filter=admin     # Admin uniquement
```

**Accès local :**

- Web: `http://localhost:3000`
- Backend API: `http://localhost:7777`
- Admin: `http://localhost:3001`

### Build & Production

```bash
# Build tout le projet
pnpm build

# Build spécifique
pnpm build --filter=web
pnpm build --filter=backend
pnpm build --filter=admin
```

## 📦 Utilisation des Packages

### UI Components

```tsx
import { Button } from "@prettyfull/ui";

<Button variant="destructive" size="lg">
  Mon bouton
</Button>;
```

_Note: Les styles utilisent le prefix `ui:` pour éviter les conflits CSS_

**Variantes disponibles :**

- `variant`: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- `size`: `default`, `sm`, `lg`

### Store (État Global)

```tsx
import { useCartStore } from "@prettyfull/store";

const { items, addItem } = useCartStore();
```

### Configurations

- **ESLint**: Automatiquement héritée dans chaque app
- **TypeScript**: Configurations partagées via `@prettyfull/typescript-config`
  - `base.json`: Configuration de base
  - `nestjs.json`: Pour le backend
  - `nextjs.json`: Pour les apps Next.js

## 🐳 Déploiement

Le projet utilise Docker et GitHub Actions pour le déploiement automatique :

- **Déclencheur**: Push sur la branche `develop`
- **Détection intelligente**: Seules les apps modifiées sont redéployées (à revoir)
- **Jobs séparés**: Un job indépendant par application
- **Ports de production**: Web (3000), Backend (3002), Admin (3001)

### Dockerfiles

```
dockerfiles/
├── web.Dockerfile      # Next.js app
├── backend.Dockerfile  # NestJS API
└── admin.Dockerfile    # Admin interface
```

## 🛠️ Commandes Utiles

```bash
# Développement ciblé
pnpm dev --filter=web --filter=backend  # Web + Backend uniquement

# Build avec cache
pnpm build --cache-dir=.turbo

# Nettoyage
pnpm clean

# Tests
pnpm test --filter=backend
pnpm test --filter=web

# Linting
pnpm lint --filter=web
```

## 📁 Structure du Projet

```
prettyfull/
├── apps/
│   ├── web/          # App Next.js principale (e-commerce)
│   ├── backend/      # API NestJS avec MongoDB
│   └── admin/        # Interface d'administration
├── packages/
│   ├── ui/           # Composants + styles (prefix ui:)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── styles.css
│   ├── store/        # État global (Zustand)
│   │   └── use-cart-store.ts
│   ├── eslint-config/
│   │   ├── base.js
│   │   ├── next.js
│   │   └── react-internal.js
│   └── typescript-config/
│       ├── base.json
│       ├── nestjs.json
│       └── nextjs.json
├── dockerfiles/      # Configurations Docker
└── .github/workflows/ # CI/CD GitHub Actions
```

## 🔧 Configuration Technique

- **Turborepo**: Cache intelligent et builds parallèles
- **Docker**: Containerisation pour production
- **GitHub Actions**: CI/CD automatique avec détection de changements
- **MongoDB**: Base de données (backend)
- **Tailwind CSS**: Système de design cohérent
- **Class Variance Authority**: Gestion des variantes de composants

## 📋 Modules Backend

```
backend/src/modules/
├── auth/         # Authentification JWT
├── users/        # Gestion des utilisateurs
├── products/     # Catalogue produits
└── orders/       # Gestion des commandes
```

**Architecture CQRS** avec séparation commands/queries/schemas/services.

## 🎯 Features Web App

- **Authentification**: Système de login/register
- **E-commerce**: Panier, commandes, paiements
- **Interface moderne**: Tailwind CSS + composants UI
- **État global**: Gestion du panier avec Zustand

---

**Tip**: Utilisez `pnpm dev --filter=<app>` pour développer efficacement sur une seule partie du projet.
