# --- ÉTAPE 1 : BASE ---
FROM node:22-alpine AS base
RUN npm install -g pnpm turbo
# On ajoute libc6-compat dès la base pour éviter les soucis de compatibilité alpine/node
RUN apk add --no-cache libc6-compat

# --- ÉTAPE 2 : PRUNER (Turbo) ---
FROM base AS builder
WORKDIR /app
COPY . .
# On isole uniquement ce qui est nécessaire pour medusa
RUN turbo prune prettyfull-medusa --docker

# --- ÉTAPE 3 : INSTALLER ---
FROM base AS installer
WORKDIR /app

# Installation des dépendances
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copie du code source complet
COPY --from=builder /app/out/full/ .

# Arguments nécessaires pour le build
ARG DATABASE_URL
ARG REDIS_URL
ENV COOKIE_SECRET=supersecret_build_temp
ENV JWT_SECRET=supersecret_build_temp

# Build du Backend (Turbo)
RUN pnpm turbo run build --filter=prettyfull-medusa

# 🔥 FIX 1: Build de l'Admin UI avec plus de mémoire
WORKDIR /app/apps/prettyfull-medusa
# On force la mémoire à 4GB pour le build car l'admin ui est lourd
RUN NODE_OPTIONS="--max-old-space-size=4096" npx medusa build

# --- ÉTAPE 4 : RUNNER ---
FROM base AS runner
WORKDIR /app

# Création user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 medusa

# Copie des fichiers de l'application
COPY --from=installer --chown=medusa:nodejs /app .

# 🔥 FIX 2 (CRITIQUE): On recopie explicitement le dossier caché .medusa pour être sûr qu'il est là
# Sans cette ligne, le COPY précédent rate souvent ce dossier caché.
COPY --from=installer --chown=medusa:nodejs /app/apps/prettyfull-medusa/.medusa /app/apps/prettyfull-medusa/.medusa

WORKDIR /app/apps/prettyfull-medusa
USER medusa
EXPOSE 9000

# Commande de démarrage
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]