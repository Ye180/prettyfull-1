# 📦 PrettyFull Medusa - Guide du Projet

## 🎯 Vue d'ensemble

Ce projet est une application **Medusa v2** (backend e-commerce) avec une interface admin personnalisée. Le projet fait partie d'un monorepo Turborepo et est déployé sur **Dokploy** avec Docker.

---

## 🔐 Identifiants Admin

- **URL Admin:** `https://admin.prettyfull.shop/app`
- **Email:** `yedev18@gmail.com`
- **Mot de passe:** `supersecret`

> ⚠️ **Note importante:** L'admin UI est actuellement **désactivé** en production car le build de l'interface admin ne fonctionne pas correctement dans Docker. Le backend API fonctionne normalement.

---

## 🏗️ Architecture du Projet

### Structure Medusa

Medusa v2 est composé de deux parties principales:

1. **Backend API (Port 9000)**
   - API REST pour le commerce électronique
   - Gestion des produits, catégories, commandes, clients, etc.
   - Modules personnalisés (product-media, category images)
2. **Admin UI (Interface /app)**
   - Interface d'administration construite avec React
   - Utilise Vite pour le build
   - Widgets personnalisés pour la gestion des médias

### Modules Personnalisés

Le projet contient plusieurs modules personnalisés:

- **`src/modules/product-media/`** - Gestion des images de produits
- **`src/api/admin/categories/[category_id]/images/`** - API pour les images de catégories
- **`src/admin/`** - Widgets et composants admin personnalisés
  - `components/category-media/` - Composants pour gérer les images de catégories
  - `widgets/category-media-widget.tsx` - Widget affiché dans les pages de détails de catégories
  - `routes/category-media/page.tsx` - Page de route personnalisée

---

## 🚀 Commandes Importantes

### Développement Local

```bash
# Installer les dépendances (depuis la racine du monorepo)
pnpm install

# Démarrer le serveur de développement
cd apps/prettyfull-medusa
pnpm dev

# Le serveur démarre sur http://localhost:9000
# L'admin est accessible sur http://localhost:9000/app
```

### Build

```bash
# Build du backend et de l'admin
pnpm build

# Vérifier que le build de l'admin a réussi
ls -la .medusa/admin/
# Doit contenir index.html et les assets
```

### Base de données

```bash
# Exécuter les migrations
npx medusa db:migrate

# Seed la base de données (données de test)
pnpm seed
```

### Tests

```bash
# Lancer les tests
pnpm test
```

---

## 🐳 Docker & Déploiement

### Dockerfile: `dockerfiles/admin.Dockerfile`

Le projet utilise un Dockerfile multi-stage optimisé pour Turborepo:

#### **Étape 1: BASE**

```dockerfile
FROM node:22-alpine AS base
RUN npm install -g pnpm turbo
RUN apk add --no-cache libc6-compat
```

- Image Alpine légère avec Node.js 22
- Installation de pnpm et turbo globalement

#### **Étape 2: BUILDER (Pruner)**

```dockerfile
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune prettyfull-medusa --docker
```

- Utilise Turborepo pour isoler uniquement les fichiers nécessaires à `prettyfull-medusa`
- Crée un sous-ensemble du monorepo dans `/app/out/`

#### **Étape 3: INSTALLER**

```dockerfile
FROM base AS installer
WORKDIR /app

# Installation des dépendances
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copie du code source
COPY --from=builder /app/out/full/ .

# Build du backend
RUN pnpm turbo run build --filter=prettyfull-medusa

# Build de l'admin UI (PROBLÈME ICI)
WORKDIR /app/apps/prettyfull-medusa
RUN NODE_OPTIONS="--max-old-space-size=4096" npx medusa build
```

- Installation des dépendances avec pnpm
- Build du backend avec Turbo
- **Build de l'admin UI** → Crée le dossier `.medusa/admin/` avec `index.html`

#### **Étape 4: RUNNER**

```dockerfile
FROM base AS runner
WORKDIR /app

# Création de l'utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

# Copie des fichiers buildés
COPY --from=installer --chown=medusa:nodejs /app .

# 🔥 COPIE EXPLICITE du dossier .medusa (CRITIQUE)
COPY --from=installer --chown=medusa:nodejs /app/apps/prettyfull-medusa/.medusa /app/apps/prettyfull-medusa/.medusa

WORKDIR /app/apps/prettyfull-medusa
USER medusa
EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
```

- Copie tous les fichiers dans l'image finale
- **Copie explicite du dossier `.medusa`** car les dossiers cachés sont parfois ignorés
- Démarre le serveur après les migrations

### Problème Actuel avec Docker

**Symptôme:** L'erreur `Could not find index.html in the admin build directory` apparaît au démarrage.

**Cause possible:**

1. Le build de l'admin échoue silencieusement pendant `npx medusa build`
2. Le dossier `.medusa/admin/` n'est pas correctement copié dans l'étape runner
3. Docker utilise une image en cache qui ne contient pas le build de l'admin

**Solution temporaire:** L'admin est désactivé dans `medusa-config.ts`:

```typescript
admin: {
  disable: true, // Désactivé temporairement
  backendUrl: process.env.MEDUSA_BACKEND_URL,
  path: "/app",
}
```

---

## 🔧 Configuration

### Variables d'environnement (Dokploy)

Variables requises dans l'onglet **Environment** de Dokploy:

```bash
# Base de données PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis (cache et sessions)
REDIS_URL=redis://host:6379

# URLs et CORS
MEDUSA_BACKEND_URL=https://admin.prettyfull.shop
STORE_CORS=https://prettyfull.shop
ADMIN_CORS=https://admin.prettyfull.shop
AUTH_CORS=https://admin.prettyfull.shop,https://prettyfull.shop

# Secrets (générer des valeurs sécurisées en production)
JWT_SECRET=votre-secret-jwt-long-et-securise
COOKIE_SECRET=votre-secret-cookie-long-et-securise

# Stripe (paiements)
STRIPE_API_KEY=sk_test_...
```

### Fichier `medusa-config.ts`

Configuration principale de Medusa:

```typescript
export default defineConfig({
	projectConfig: {
		databaseUrl: process.env.DATABASE_URL,
		redisUrl: process.env.REDIS_URL,
		http: {
			storeCors: process.env.STORE_CORS!,
			adminCors: process.env.ADMIN_CORS!,
			authCors: process.env.AUTH_CORS!,
			jwtSecret: process.env.JWT_SECRET || "supersecret",
			cookieSecret: process.env.COOKIE_SECRET || "supersecret",
		},
	},
	admin: {
		disable: true, // Actuellement désactivé
		backendUrl: process.env.MEDUSA_BACKEND_URL,
		path: "/app",
	},
	modules: [
		{
			resolve: "./src/modules/product-media",
		},
		{
			resolve: "@medusajs/medusa/payment",
			options: {
				providers: [
					{
						resolve: "@medusajs/payment-stripe",
						id: "stripe",
						options: {
							apiKey: process.env.STRIPE_API_KEY,
						},
					},
				],
			},
		},
	],
});
```

---

## 📝 Fonctionnalités Personnalisées

### 1. Gestion des Images de Catégories

Le projet permet d'associer plusieurs images à chaque catégorie de produits.

**API Endpoints:**

- `GET /admin/categories/:id/images` - Liste les images d'une catégorie
- `POST /admin/categories/:id/images` - Upload une nouvelle image
- `POST /admin/categories/:id/images/batch` - Upload multiple
- `DELETE /admin/categories/:id/images/batch` - Suppression multiple

**Widget Admin:**

- Affiché dans la page de détails d'une catégorie
- Permet d'uploader, modifier et supprimer des images
- Définir une image comme thumbnail

**Entité:** `ProductCategoryImage` (table `product_category_image`)

```typescript
{
	id: string;
	category_id: string;
	url: string;
	type: "thumbnail" | "gallery";
	position: number;
	created_at: Date;
	updated_at: Date;
}
```

### 2. Module Product Media

Module personnalisé pour gérer les médias des produits (similaire aux catégories).

---

## 🐛 Problèmes Connus

### 1. Admin UI ne build pas dans Docker

**Statut:** Non résolu

**Description:** La commande `npx medusa build` s'exécute pendant le build Docker mais ne crée pas le fichier `index.html` ou le dossier `.medusa/admin/` n'est pas copié correctement.

**Workaround actuel:** Admin désactivé (`disable: true`)

**Pistes de résolution:**

- Vérifier les logs de build Docker pour voir si `npx medusa build` échoue
- Forcer un rebuild sans cache dans Dokploy
- Vérifier que les dépendances de build sont présentes (`vite`, `@medusajs/admin-sdk`, etc.)
- Tester le build localement: `NODE_OPTIONS="--max-old-space-size=4096" npx medusa build`

### 2. React Query Context dans les Widgets

**Statut:** Résolu

**Description:** Les widgets admin personnalisés nécessitent un `QueryClientProvider` pour utiliser React Query.

**Solution:** Wrapper le widget avec `QueryClientProvider`:

```typescript
const queryClient = new QueryClient();

const Widget = (props) => (
  <QueryClientProvider client={queryClient}>
    <WidgetContent {...props} />
  </QueryClientProvider>
);
```

---

## 📚 Ressources Utiles

### Documentation Medusa v2

- [Architecture](https://docs.medusajs.com/learn/introduction/architecture)
- [Build & Deployment](https://docs.medusajs.com/learn/build)
- [Production Deployment](https://docs.medusajs.com/learn/deployment)
- [Worker Mode](https://docs.medusajs.com/learn/production/worker-mode)

### Commandes Medusa CLI

```bash
# Démarrer en mode développement
medusa develop

# Build backend + admin
medusa build

# Démarrer en production
medusa start

# Migrations
medusa db:migrate
medusa db:create <migration-name>

# Exécuter un script
medusa exec ./src/scripts/seed.ts
```

---

## 🔍 Debugging

### Vérifier que le backend fonctionne

```bash
curl http://localhost:9000/health
# Devrait retourner: {"status":"ok"}
```

### Vérifier que l'admin est buildé

```bash
ls -la apps/prettyfull-medusa/.medusa/admin/
# Doit contenir index.html et le dossier assets/
```

### Logs Docker (Dokploy)

- **Logs d'exécution:** Onglet "Logs" → Logs du conteneur en cours
- **Logs de build:** Pendant le déploiement, logs de construction de l'image Docker

### Tester l'API

```bash
# Liste des produits
curl http://localhost:9000/store/products

# Liste des catégories
curl http://localhost:9000/store/product-categories

# Images d'une catégorie (nécessite authentification admin)
curl -H "Authorization: Bearer <token>" \
  http://localhost:9000/admin/categories/<id>/images
```

---

## 🎯 Prochaines Étapes

1. **Résoudre le problème de build de l'admin dans Docker**
   - Analyser les logs de build Docker
   - Tester différentes approches de copie du dossier `.medusa`
   - Considérer un build de l'admin en dehors de Docker

2. **Optimisations**
   - Configurer Redis pour la production (actuellement in-memory)
   - Configurer un Event Bus externe (actuellement local)
   - Ajouter des tests automatisés

3. **Fonctionnalités**
   - Compléter la gestion des médias de catégories
   - Ajouter la compression d'images
   - Implémenter le CDN pour les assets

---

## 💡 Conseils

- **Toujours tester localement** avant de déployer
- **Vérifier les logs Docker** pendant le build pour détecter les erreurs
- **Utiliser `pnpm` dans le monorepo**, pas `npm` ou `yarn`
- **Les migrations sont automatiques** au démarrage du serveur
- **L'admin nécessite un build séparé** avec `medusa build`

---

## 📞 Contact

Pour toute question sur le projet, contacter le propriétaire du repo.

**Bon courage! 🚀**
