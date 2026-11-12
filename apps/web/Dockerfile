# syntax=docker/dockerfile:1
#
# web (apps/web, Next.js) - à construire depuis la RACINE du dépôt :
#   Dokploy : Build Type « Dockerfile », Docker Context Path « . »,
#             Dockerfile Path « apps/web/Dockerfile »
#
# Variables NEXT_PUBLIC_* : lues à la COMPILATION, donc à déclarer dans
# Dokploy comme « Build-time Arguments » (onglet Environment), pas comme
# variables d'exécution - sinon elles seraient vides dans le navigateur.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && npm install -g pnpm@10.21.0
WORKDIR /app

# --- Construction ------------------------------------------------------------
FROM base AS builder
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --filter "web..."

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STOREFRONT_URL
ARG NEXT_PUBLIC_MEDIA_URL
# SEO (optionnels, voir docs/seo.md) : vérification Search Console, exclusion de l'index, compte X.
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_NOINDEX
ARG NEXT_PUBLIC_TWITTER_HANDLE
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_STOREFRONT_URL=$NEXT_PUBLIC_STOREFRONT_URL \
    NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_NOINDEX=$NEXT_PUBLIC_NOINDEX \
    NEXT_PUBLIC_TWITTER_HANDLE=$NEXT_PUBLIC_TWITTER_HANDLE \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1

# Paquets partagés d'abord (contracts en tsc, ui en CSS), puis l'application.
RUN pnpm --filter "web^..." build && pnpm --filter web build

# --- Exécution ---------------------------------------------------------------
FROM node:22-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT}/" > /dev/null || exit 1

CMD ["node", "apps/web/server.js"]
