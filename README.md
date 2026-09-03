# PrettyFull — Turborepo Monorepo

Monorepo e-commerce : storefront Next.js, back-office, API Hono, et packages partagés.

## Architecture

### Apps

| App | Stack | Port dev | Rôle |
| --- | --- | --- | --- |
| `web` | Next.js 16 (App Router) | 3000 | Storefront client |
| `admin` | Next.js 16 | 3001 | Back-office (catalogue, commandes) |
| `backend` | Hono + Drizzle + Postgres | 7777 | API REST |
| `docs` | Storybook 9 | 6006 | Documentation des composants `ui` |

### Packages

| Package | Contenu |
| --- | --- |
| `@prettyfull/ui` | Composants React partagés (Tailwind v4, Radix, prefix CSS `ui:`) |
| `@prettyfull/store` | État global Zustand (panier) |
| `@prettyfull/utils` | Helpers (`cn`, `formatCurrency_FR`, `getMediaUrl`, constantes) |
| `@prettyfull/tailwind-config` | Styles et config Tailwind partagés |
| `@prettyfull/typescript-config` | tsconfigs : `base.json`, `nextjs.json`, `node.json` |
| `@prettyfull/eslint-config` | Presets ESLint : `base`, `next-js`, `node`, `react-internal` |

## Démarrage

```bash
pnpm install

# Infra locale (Postgres + Redis)
docker compose up -d

# Variables d'env
cp apps/backend/.env.example apps/backend/.env
cp apps/admin/.env.example apps/admin/.env.local

# Schéma de base
pnpm --filter backend db:push

# Tout démarrer
pnpm dev

# Une app en particulier
pnpm dev --filter=web
pnpm dev --filter=admin
pnpm dev --filter=backend
```

**Accès local :** web `:3000` · admin `:3001` · API `:7777` · Storybook `:6006`

## Commandes

```bash
pnpm build                    # build de tout le graphe
pnpm build --filter=web       # build ciblé (+ ses dépendances)
pnpm lint
pnpm check-types
pnpm format                   # prettier sur **/*.{ts,tsx,md}
pnpm clean

# Base de données (Drizzle, depuis apps/backend)
pnpm --filter backend db:generate   # génère une migration depuis le schéma
pnpm --filter backend db:migrate    # applique les migrations
pnpm --filter backend db:push       # pousse le schéma sans migration (dev)
pnpm --filter backend db:studio     # UI Drizzle Studio
```

## Utilisation des packages

```tsx
import { Button } from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
```

> Les styles de `@prettyfull/ui` utilisent le prefix `ui:` pour éviter les collisions
> (`ui:bg-red-600`). Passer par les variantes existantes plutôt que de redéfinir du style.
>
> Toujours importer via l'alias de workspace (`@prettyfull/store`), jamais en relatif
> à travers les dossiers (`../../packages/store/src/...`).

## Déploiement

GitHub Actions (`.github/workflows/deploy.yml`) sur push vers `dev-v2` :
détection des apps modifiées via `dorny/paths-filter`, puis build/push de l'image
Docker et déploiement SSH — un job par app, en matrice.

Chaque app déployable doit fournir son propre `apps/<app>/Dockerfile`.

**Secrets requis :** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `SERVER_HOST`,
`SERVER_USERNAME`, `SSH_PRIVATE_KEY`.
