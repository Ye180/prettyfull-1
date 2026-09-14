# PrettyFull - Turborepo Monorepo

Monorepo e-commerce : storefront Next.js, back-office, API Hono, et packages partagés.

## Architecture

### Apps

| App       | Stack                     | Port dev | Rôle                               |
| --------- | ------------------------- | -------- | ---------------------------------- |
| `web`     | Next.js 16 (App Router)   | 3000     | Storefront client                  |
| `admin`   | Next.js 16                | 3001     | Back-office (catalogue, commandes) |
| `backend` | Hono + Drizzle + Postgres | 7777     | API REST                           |
| `docs`    | Storybook 9               | 6006     | Documentation des composants `ui`  |

### Packages

| Package                         | Contenu                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- |
| `@prettyfull/contracts`         | Schémas Zod + types partagés par l'API, le back-office et le storefront |
| `@prettyfull/ui`                | Composants React partagés (Tailwind v4, Radix, prefix CSS `ui:`)        |
| `@prettyfull/store`             | État global Zustand (panier)                                            |
| `@prettyfull/utils`             | Helpers (`cn`, `formatCurrency_FR`, `getMediaUrl`, constantes)          |
| `@prettyfull/tailwind-config`   | Styles et config Tailwind partagés                                      |
| `@prettyfull/typescript-config` | tsconfigs : `base.json`, `nextjs.json`, `node.json`                     |
| `@prettyfull/eslint-config`     | Presets ESLint : `base`, `next-js`, `node`, `react-internal`            |

## Démarrage

```bash
pnpm install

# Infra locale (Postgres + Redis)
docker compose up -d

# Variables d'env
cp apps/backend/.env.example apps/backend/.env
cp apps/admin/.env.example apps/admin/.env.local

# Schéma de base + jeu de démonstration
pnpm --filter backend db:migrate
pnpm --filter backend db:seed

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
pnpm --filter backend db:migrate    # crée les extensions puis applique les migrations
pnpm --filter backend db:seed       # jeu de données de démonstration (dev uniquement)
pnpm --filter backend db:reset      # vide le schéma public (dev uniquement)
pnpm --filter backend db:push       # pousse le schéma sans migration (dev)
pnpm --filter backend db:studio     # UI Drizzle Studio
```

### Comptes de démonstration

Créés par `db:seed`, mot de passe commun `Prettyfull2026!` :

| Compte                      | Rôle                   |
| --------------------------- | ---------------------- |
| `admin@prettyfull.shop`     | Super administrateur   |
| `catalogue@prettyfull.shop` | Gestionnaire catalogue |
| `commandes@prettyfull.shop` | Gestionnaire commandes |
| `support@prettyfull.shop`   | Support client         |
| `cliente@prettyfull.shop`   | Cliente (storefront)   |

## API

Deux surfaces distinctes, servies par `apps/backend` :

| Préfixe           | Accès                                         | Consommateur            |
| ----------------- | --------------------------------------------- | ----------------------- |
| `/api/store/*`    | Public, session cliente facultative           | `apps/web`              |
| `/api/admin/*`    | JWT compte back-office + permission par route | `apps/admin`            |
| `/api/webhooks/*` | Signature du prestataire                      | Agrégateurs de paiement |

Les jetons d'accès (15 min) transitent en `Authorization: Bearer` ; les jetons de
rafraîchissement en cookie `httpOnly` + `SameSite=Strict`, à rotation à chaque usage.

**Documentation interactive :** `http://localhost:7777/docs` · document brut :
`/openapi.json`.

## Documentation

| Document                                                 | Contenu                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`docs/modele-de-donnees.md`](docs/modele-de-donnees.md) | Les 37 tables, les invariants, la règle de cohérence produit et la mécanique du stock |
| [`docs/guide-panel-admin.md`](docs/guide-panel-admin.md) | Guide d'utilisation du back-office, module par module                                 |
| `/docs` (API démarrée)                                   | Référence OpenAPI interactive                                                         |

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
Docker et déploiement SSH - un job par app, en matrice.

Chaque app déployable doit fournir son propre `apps/<app>/Dockerfile`.

**Secrets requis :** `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `SERVER_HOST`,
`SERVER_USERNAME`, `SSH_PRIVATE_KEY`.
