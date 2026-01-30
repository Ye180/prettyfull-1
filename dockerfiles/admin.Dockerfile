# --- ÉTAPE 1 : BASE ---
FROM node:22-alpine AS base
# Installation globale des outils nécessaires pour le monorepo
RUN npm install -g pnpm turbo

# --- ÉTAPE 2 : BUILDER (Préparation) ---
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
# On isole uniquement le backend Medusa
RUN turbo prune prettyfull-medusa --docker

# --- ÉTAPE 3 : INSTALLER (Dépendances et Build) ---
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copie des fichiers JSON et du lock pour le cache Docker
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Installation des dépendances
RUN pnpm install --no-frozen-lockfile

# Copie du code complet
COPY --from=builder /app/out/full/ .

# BUILD DU PROJET
# On définit des variables factices pour que 'medusa build' ne crash pas
# On augmente la RAM allouée au build pour éviter l'exit code 1
RUN NODE_OPTIONS="--max-old-space-size=4096" \
    DATABASE_URL="postgresql://medusa:PTSaWIgwwhyLFFk4wc8M@84.247.187.15:5432/medusa-db" \
    REDIS_URL="redis://default:7bbOrR57ubKPcHyPywtz@84.247.187.15:6379" \
    pnpm turbo run build --filter=prettyfull-medusa

# --- ÉTAPE 4 : RUNNER (Production) ---
FROM base AS runner
WORKDIR /app

# Sécurité : utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa
USER medusa

# On récupère le build final de l'étape précédente
COPY --from=installer --chown=medusa:nodejs /app .

# On se place dans le dossier de l'app Medusa
WORKDIR /app/apps/prettyfull-medusa

EXPOSE 9000

# Commande de démarrage avec migration automatique
# Les vraies variables d'environnement de Dokploy seront injectées ici
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]