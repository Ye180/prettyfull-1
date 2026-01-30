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

# Build du projet
RUN pnpm turbo run build --filter=prettyfull-medusa

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa
USER medusa

COPY --from=installer --chown=medusa:nodejs /app .

WORKDIR /app/apps/prettyfull-medusa
EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && pnpm start"]