# --- ÉTAPE 1 : BASE ---
FROM node:22-alpine AS base
RUN npm install -g pnpm turbo

# --- ÉTAPE 2 : BUILDER ---
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN turbo prune prettyfull-medusa --docker

# --- ÉTAPE 3 : INSTALLER ---
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --no-frozen-lockfile

COPY --from=builder /app/out/full/ .

# On utilise des arguments de build (ARG) au lieu de valeurs en dur.
# Dokploy injectera ces valeurs si tu les configures, sinon elles restent vides.
ARG DATABASE_URL
ARG REDIS_URL

# On lance le build. Medusa v2 a besoin que DATABASE_URL soit définie (même vide)
# pour valider la config, mais il n'essaiera pas de s'y connecter si on gère bien le config.ts.
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm turbo run build --filter=prettyfull-medusa

# 🔥 BUILD ADMIN MEDUSA (LA LIGNE MANQUANTE)
WORKDIR /app/apps/prettyfull-medusa
RUN npx medusa build



# --- ÉTAPE 4 : RUNNER ---
FROM base AS runner
WORKDIR /app

# On définit l'environnement en production
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 medusa
USER medusa

# On copie tout (y compris le dossier .medusa généré à l'étape précédente)
COPY --from=installer --chown=medusa:nodejs /app .

WORKDIR /app/apps/prettyfull-medusa
EXPOSE 9000

# MODIFICATION ICI : On force le host et le port dans la commande
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start --host 0.0.0.0 --port 9000"]