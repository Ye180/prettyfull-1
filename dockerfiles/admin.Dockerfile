# Utilisation de la même base que votre web
FROM node:22-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installation de pnpm et turbo
RUN npm install -g pnpm turbo
COPY . .
# On isole uniquement le backend Medusa
RUN turbo prune prettyfull-medusa --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installation des dépendances
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --no-frozen-lockfile

# Build du projet
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=prettyfull-medusa

FROM base AS runner
WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa
USER medusa

# Copie des fichiers nécessaires depuis l'installer
COPY --from=installer --chown=medusa:nodejs /app .

WORKDIR /app/apps/prettyfull-medusa

# Port par défaut de Medusa
EXPOSE 9000

# Commande pour lancer les migrations puis le serveur
CMD ["sh", "-c", "pnpm exec medusa user -e admin@me.com -p mypassword && pnpm start"]