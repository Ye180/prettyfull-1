# --- ÉTAPE 1 : BASE ---
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
# On installe pnpm globalement ici pour qu'il soit disponible partout
RUN npm install -g pnpm turbo

# --- ÉTAPE 2 : BUILDER (Préparation du monorepo) ---
FROM base AS builder
WORKDIR /app
COPY . .
# Turbo va isoler uniquement ce qui est nécessaire pour Medusa
RUN turbo prune prettyfull-medusa --docker

# --- ÉTAPE 3 : INSTALLER (Installation des dépendances) ---
FROM base AS installer
WORKDIR /app

# Copie des fichiers générés par le prune
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Installation des dépendances uniquement
RUN pnpm install --no-frozen-lockfile

# Copie du code source complet après l'installation
COPY --from=builder /app/out/full/ .

# Build effectif de l'application
RUN pnpm turbo run build --filter=prettyfull-medusa

# --- ÉTAPE 4 : RUNNER (Exécution) ---
FROM base AS runner
WORKDIR /app

# Sécurité : On crée un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa
USER medusa

# On récupère le build final
COPY --from=installer --chown=medusa:nodejs /app .

# On se place dans le bon dossier du monorepo pour lancer les commandes
WORKDIR /app/apps/prettyfull-medusa

EXPOSE 9000

# Commande cruciale : on lance les migrations avant de démarrer
CMD ["sh", "-c", "npx medusa db:migrate && pnpm start"]