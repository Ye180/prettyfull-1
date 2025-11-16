FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Copy the backend apps package.json
COPY apps/backend/package.json ./apps/backend/

# Install pnpm
RUN npm install -g pnpm turbo

COPY . .

RUN turbo prune backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
 
# First install the dependencies (as they change less often)
RUN npm install -g pnpm
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=backend
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Install pnpm in runner stage
RUN npm install -g pnpm

# Copy workspace files
COPY --from=installer --chown=nestjs:nodejs /app/package.json ./
COPY --from=installer --chown=nestjs:nodejs /app/pnpm-lock.yaml ./
COPY --from=installer --chown=nestjs:nodejs /app/pnpm-workspace.yaml ./

# Copy the built backend application and its package.json
COPY --from=installer --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/backend/package.json ./apps/backend/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

USER nestjs
 
CMD ["node", "apps/backend/dist/main.js"]