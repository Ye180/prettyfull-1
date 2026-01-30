FROM node:22-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune prettyfull-medusa --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# --- AJOUT ICI : Il faut réinstaller pnpm dans cette étape ---
RUN npm install -g pnpm turbo 

# Copie du code source complet d'abord
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Installation des dépendances
RUN pnpm install --no-frozen-lockfile

# Build du projet avec variables d'environnement temporaires
RUN DATABASE_URL="postgresql://medusa:PTSaWIgwwhyLFFk4wc8M@prettyfull-medusadb-dvbjzq:5432/medusa-db" \
    REDIS_URL="redis://default:7bbOrR57ubKPcHyPywtz@prettyfull-medusaredis-6xx16s:6379" \
    STORE_CORS="http://localhost:3000" \
    ADMIN_CORS="http://localhost:9000" \
    AUTH_CORS="http://localhost:9000" \
    JWT_SECRET="build-time-secret" \
    COOKIE_SECRET="build-time-secret" \
    pnpm turbo run build --filter=prettyfull-medusa

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa
USER medusa

COPY --from=installer --chown=medusa:nodejs /app .

WORKDIR /app/apps/prettyfull-medusa
EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && pnpm start"]