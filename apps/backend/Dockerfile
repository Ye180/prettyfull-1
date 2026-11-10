# syntax=docker/dockerfile:1
#
# API Hono (apps/backend) - à construire depuis la RACINE du dépôt :
#   Dokploy : Build Type « Dockerfile », Docker Context Path « . »,
#             Dockerfile Path « apps/backend/Dockerfile »
#
# Les paquets partagés (@prettyfull/contracts) vivent dans le monorepo : le
# contexte doit donc être la racine, pas apps/backend.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && npm install -g pnpm@10.21.0
WORKDIR /app

# --- Construction ------------------------------------------------------------
FROM base AS builder
COPY . .
# Cache du magasin pnpm entre deux builds : réinstallation quasi instantanée.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --filter "backend..."
RUN pnpm --filter @prettyfull/contracts build && pnpm --filter backend build
# Les migrations SQL ne sont pas du TypeScript : tsc ne les copie pas, or
# migrate.js les cherche à côté de lui.
RUN cp -r apps/backend/src/db/migrations apps/backend/dist/db/migrations
# Dossier autonome : uniquement les dépendances de production du backend,
# avec @prettyfull/contracts embarqué.
RUN pnpm --filter backend deploy --prod --legacy /prod

# --- Exécution ---------------------------------------------------------------
FROM node:22-alpine AS runner
ENV NODE_ENV=production \
    PORT=7777
WORKDIR /app
COPY --from=builder --chown=node:node /prod ./
USER node
EXPOSE 7777

# `unhealthy` si l'API ne répond plus : Dokploy peut alors la redémarrer.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT}/health" > /dev/null || exit 1

# Migrations au démarrage (RUN_MIGRATIONS=false pour les désactiver). Si elles
# échouent, l'API ne démarre pas : mieux vaut une panne claire qu'une API
# branchée sur un schéma en retard.
CMD ["sh", "-c", "if [ \"$RUN_MIGRATIONS\" != \"false\" ]; then node dist/db/migrate.js || exit 1; fi; exec node dist/index.js"]
