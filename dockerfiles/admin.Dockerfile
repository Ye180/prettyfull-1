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

# --- ÉTAPE 3 : INSTALLER & BUILDER ---
FROM base AS installer
WORKDIR /app

# 1. Installation des dépendances
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# Installation complète (prod + dev) pour pouvoir builder
RUN pnpm install --frozen-lockfile

# 2. Copie du code source
COPY --from=builder /app/out/full/ .

# 3. Build du code Backend (TypeScript -> JavaScript)
# On passe les ARGs ici pour que le build ne casse pas si Medusa vérifie la config
ARG DATABASE_URL
ARG REDIS_URL
# Optionnel : définir une clé temporaire pour le build pour éviter les erreurs de validation
ENV COOKIE_SECRET=supersecret_build_temp
ENV JWT_SECRET=supersecret_build_temp

# Build du projet via Turbo
RUN pnpm turbo run build --filter=prettyfull-medusa

# 4. Build de l'Admin UI (CRUCIAL pour la production)
WORKDIR /app/apps/prettyfull-medusa
# Cette commande génère le dossier .medusa/server/public/admin
RUN npx medusa build

# --- ÉTAPE 4 : RUNNER ---
FROM base AS runner
WORKDIR /app

# Création de l'utilisateur sécurisé
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 medusa

# Copie de tout le dossier de l'application depuis l'étape installer
# On change le propriétaire directement lors de la copie pour éviter les problèmes de permissions
COPY --from=installer --chown=medusa:nodejs /app .

# On se place dans le dossier de l'application
WORKDIR /app/apps/prettyfull-medusa

USER medusa
EXPOSE 9000

# Commande de démarrage
# Note: En prod, on utilise 'medusa start', pas 'pnpm dev'
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]