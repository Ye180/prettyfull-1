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
ARG MEDUSA_BACKEND_URL
ARG STORE_CORS
ARG ADMIN_CORS

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL:-http://localhost:9000}
ENV STORE_CORS=${STORE_CORS:-http://localhost:8000}
ENV ADMIN_CORS=${ADMIN_CORS:-http://localhost:9000}

# Build le backend seulement (pas l'admin pour l'instant)
WORKDIR /app/apps/prettyfull-medusa
RUN NODE_ENV=production NODE_OPTIONS="--max-old-space-size=4096" pnpm turbo build

# --- ÉTAPE 4 : RUNNER ---
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 medusa

COPY --from=installer --chown=medusa:nodejs /app .

WORKDIR /app/apps/prettyfull-medusa

# Build l'admin dans le runner stage avec les bonnes permissions
USER root
RUN NODE_ENV=production NODE_OPTIONS="--max-old-space-size=4096" npx medusa build && \
    echo "Verifying admin build..." && \
    ls -la .medusa/admin/ && \
    test -f .medusa/admin/index.html && echo "✓ Admin build successful" || (echo "✗ Admin build failed" && exit 1)

# Changer les permissions pour l'utilisateur medusa
RUN chown -R medusa:nodejs .medusa

USER medusa
EXPOSE 9000

# ICI, les variables d'environnement réelles de ton onglet "Environment" Dokploy seront utilisées.
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]