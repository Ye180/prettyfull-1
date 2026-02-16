# Configuration Dokploy pour Medusa Backend

## ⚠️ PROBLÈME ACTUEL

Le build échoue car Dokploy construit depuis la **racine du monorepo** au lieu du dossier `apps/prettyfull-medusa`.

### Erreur observée:
```
Local package.json exists, but node_modules missing, did you mean to install?
```

Turbo essaie de construire TOUS les packages du workspace, mais seul le package.json racine a ses dépendances installées.

## ✅ SOLUTION: Configuration Dokploy

### 1. Build Context Path

Dans Dokploy, configurez:

**Build Settings:**
- **Build Context**: `apps/prettyfull-medusa` ⚠️ IMPORTANT
- **Dockerfile Path**: `Dockerfile` (relatif au build context)

OU si Dokploy ne permet pas de changer le build context:

**Alternative - Build depuis la racine:**
- **Build Context**: `.` (racine)
- **Dockerfile Path**: `apps/prettyfull-medusa/Dockerfile`

Mais dans ce cas, vous devez modifier le Dockerfile pour copier depuis la racine.

### 2. Variables d'environnement (Runtime)

Configurez ces variables dans Dokploy (JAMAIS dans le Dockerfile):

```bash
# Database
DATABASE_URL=postgresql://medusa:PTSaWIgwwhyLFFk4wc8M@prettyfull-medusadb-dvbjzq:5432/medusa-db?sslmode=require

# Redis
REDIS_URL=redis://default:7bbOrR57ubKPcHyPywtz@prettyfull-medusaredis-6xx16s:6379

# Secrets (CRITIQUES - Ne jamais commiter)
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret

# Backend URL
MEDUSA_BACKEND_URL=https://api.prettyfull.shop

# CORS
STORE_CORS=http://localhost:8000,https://docs.medusajs.com,dev.prettyfull.shop
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,admin.prettyfull.shop,http://localhost:3000
AUTH_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,admin.prettyfull.shop,http://localhost:3000,https://admin.prettyfull.shop

# Worker Mode
MEDUSA_WORKER_MODE=server

# Admin
DISABLE_ADMIN=true

# Environment
NODE_ENV=production
PORT=9000
HOST=0.0.0.0
```

### 3. Réseau Docker

Assurez-vous que:
- Le service Medusa et PostgreSQL sont sur le **même réseau Docker**
- Le hostname `prettyfull-medusadb-dvbjzq` est résolvable depuis le conteneur Medusa
- Le hostname `prettyfull-medusaredis-6xx16s` est résolvable depuis le conteneur Medusa

### 4. Build Arguments (Optionnel)

Si vous voulez passer le backend URL au build:

```bash
MEDUSA_BACKEND_URL=https://api.prettyfull.shop
```

## 🔧 Option Alternative: Dockerfile pour Build depuis la Racine

Si Dokploy force le build depuis la racine du repo, créez ce Dockerfile à la racine:

```dockerfile
# /Dockerfile (à la racine du monorepo)
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g pnpm@10.21.0

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy only the medusa app
COPY apps/prettyfull-medusa ./apps/prettyfull-medusa

# Install dependencies for workspace
RUN pnpm install --filter prettyfull-medusa...

# Build with placeholders
ENV NODE_ENV=production
ENV DATABASE_URL="postgres://placeholder:placeholder@localhost:5432/placeholder"
ENV REDIS_URL="redis://localhost:6379"
ENV JWT_SECRET="build-time-placeholder"
ENV COOKIE_SECRET="build-time-placeholder"
ARG MEDUSA_BACKEND_URL=""
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

WORKDIR /app/apps/prettyfull-medusa
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build
RUN test -f .medusa/server/public/admin/index.html

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat curl
RUN npm install -g pnpm@10.21.0

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 medusa

ENV NODE_ENV=production
COPY --from=builder --chown=medusa:nodejs /app/apps/prettyfull-medusa/.medusa/server ./
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm install --prod
RUN chown -R medusa:nodejs /app

USER medusa
EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
```

## 🚀 Déploiement

1. **Committez les changements:**
```bash
git add apps/prettyfull-medusa/Dockerfile
git commit -m "fix: remove hardcoded secrets from Dockerfile"
git push origin main
```

2. **Dans Dokploy:**
   - Allez dans les paramètres de build
   - Changez le **Build Context** à `apps/prettyfull-medusa`
   - OU utilisez le Dockerfile alternatif à la racine
   - Vérifiez que toutes les variables d'environnement sont configurées
   - Redéployez

3. **Vérifiez les logs:**
   - Le build doit installer uniquement les dépendances de Medusa
   - Pas d'erreur "node_modules missing"
   - L'admin doit être construit avec succès

## 🔍 Debug

Si le build échoue encore:

```bash
# Vérifier que le build context est correct
docker build -t test-medusa apps/prettyfull-medusa

# Ou depuis la racine avec le Dockerfile alternatif
docker build -f Dockerfile.root -t test-medusa .
```

## ⚠️ Sécurité

**JAMAIS:**
- ❌ Hardcoder des secrets dans le Dockerfile
- ❌ Commiter des fichiers .env avec des secrets réels
- ❌ Exposer les secrets dans les logs

**TOUJOURS:**
- ✅ Utiliser les variables d'environnement de Dokploy
- ✅ Générer des secrets forts (32+ caractères aléatoires)
- ✅ Utiliser des placeholders au build-time
- ✅ Passer les vrais secrets au runtime uniquement
