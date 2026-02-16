FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g pnpm@10.21.0

WORKDIR /app
COPY package.json ./
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm install
COPY . .

ENV NODE_ENV=production
ENV DATABASE_URL="postgres://placeholder:placeholder@localhost:5432/placeholder"
ENV REDIS_URL="redis://localhost:6379"
ENV JWT_SECRET="build-time-placeholder"
ENV COOKIE_SECRET="build-time-placeholder"
ARG MEDUSA_BACKEND_URL=""
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

RUN NODE_OPTIONS= pnpm build
RUN test -f .medusa/server/public/admin/index.html


FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat curl
RUN npm install -g pnpm@10.21.0

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 medusa

ENV NODE_ENV=production
COPY --from=builder --chown=medusa:nodejs /app/.medusa/server ./
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm install --prod
RUN chown -R medusa:nodejs /app

USER medusa
EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]