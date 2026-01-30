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

# --- ÉTAPE 3 : INSTALLER ---
FROM base AS installer
WORKDIR /app

# On déclare les arguments pour le build
ARG DATABASE_URL
ARG REDIS_URL
# On les définit comme variables d'environnement pour le processus de build
ENV DATABASE_URL=postgresql://medusa:PTSaWIgwwhyLFFk4wc8M@prettyfull-medusadb-dvbjzq:5432/medusa-db
ENV REDIS_URL=redis://default:7bbOrR57ubKPcHyPywtz@prettyfull-medusaredis-6xx16s:6379

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --no-frozen-lockfile

COPY --from=builder /app/out/full/ .

# Ajout de l'option --no-cache pour être sûr de voir l'erreur réelle si ça échoue encore
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