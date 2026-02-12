# =============================================================================
# Dockerfile Multi-Stage pour Medusa v2 avec Admin UI
# Optimisé pour Turborepo + Dokploy
# =============================================================================

# --- ÉTAPE 1 : BASE ---
FROM node:22-alpine AS base

# Installation des outils globaux
RUN npm install -g pnpm turbo

# Compatibilité Alpine
RUN apk add --no-cache libc6-compat

# Configuration pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app


# --- ÉTAPE 2 : PRUNER (Turbo) ---
FROM base AS builder

WORKDIR /app

# Copie de tout le monorepo
COPY . .

# Isolation du sous-projet medusa avec Turbo
RUN turbo prune prettyfull-medusa --docker


# --- ÉTAPE 3 : INSTALLER + BUILD ---
FROM base AS installer

WORKDIR /app

# Arguments de build (passés par Dokploy)
ARG MEDUSA_BACKEND_URL
ARG DATABASE_URL
ARG REDIS_URL

# Variables temporaires pour le build
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL
ENV DATABASE_URL=$DATABASE_URL
ENV REDIS_URL=$REDIS_URL
ENV NODE_ENV=production
ENV COOKIE_SECRET=temp_build_secret
ENV JWT_SECRET=temp_build_secret

# 1. Copie des fichiers de dépendances uniquement (pour cache Docker)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# 2. Installation des dépendances
RUN pnpm install --frozen-lockfile --prod=false

# 3. Copie du code source complet
COPY --from=builder /app/out/full/ .

# 4. Build du backend avec Turbo
RUN pnpm turbo run build --filter=prettyfull-medusa

# 5. Build de l'Admin UI (CRITIQUE)
WORKDIR /app/apps/prettyfull-medusa

# Build avec mémoire augmentée + logs verbeux
RUN echo "🔨 Starting Medusa build (backend + admin)..." && \
    NODE_OPTIONS="--max-old-space-size=4096" pnpm build && \
    echo "✅ Build completed. Checking output..." && \
    echo "" && \
    echo "📁 Backend files:" && \
    ls -la .medusa/server/ && \
    echo "" && \
    echo "📁 Admin files (should be in server/public/admin/):" && \
    ls -la .medusa/server/public/ && \
    ls -la .medusa/server/public/admin/ && \
    echo "" && \
    if [ -f .medusa/server/public/admin/index.html ]; then \
      echo "✅ SUCCESS: Admin UI built successfully!"; \
    else \
      echo "❌ ERROR: Admin index.html not found!"; \
      exit 1; \
    fi


# --- ÉTAPE 4 : RUNNER (Production) ---
FROM base AS runner

WORKDIR /app

# Création utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

# Copie des fichiers nécessaires depuis l'étape installer
# 🔥 IMPORTANT: On copie TOUT le contexte car Medusa a besoin des node_modules racine
COPY --from=installer --chown=medusa:nodejs /app/node_modules /app/node_modules
COPY --from=installer --chown=medusa:nodejs /app/package.json /app/package.json
COPY --from=installer --chown=medusa:nodejs /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=installer --chown=medusa:nodejs /app/apps/prettyfull-medusa /app/apps/prettyfull-medusa

# Vérification finale que l'admin est présent dans l'image runner
RUN echo "🔍 Verifying admin in runner stage..." && \
    ls -la /app/apps/prettyfull-medusa/.medusa/server/public/admin/ || \
    echo "⚠️ Admin folder missing in runner stage!"

# Changement de workdir vers l'app Medusa
WORKDIR /app/apps/prettyfull-medusa

# Basculer vers l'utilisateur non-root
USER medusa

# Exposition du port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Commande de démarrage
# 1. Migrations DB
# 2. Démarrage du serveur
CMD ["sh", "-c", "pnpm migrate && pnpm start"]  