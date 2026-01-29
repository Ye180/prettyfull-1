FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Install pnpm and turbo globally (turbo is still useful for running scripts, even if not pruning)
RUN npm install -g pnpm turbo

# Copy the entire repository
COPY . .

# Install dependencies (frozen-lockfile for consistency)
RUN pnpm install --frozen-lockfile

# Build the web application
RUN pnpm --filter web build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the standalone build artifacts
# The standalone output contains the necessary node_modules and server.js
# We copy it to the root of the runner container
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Expose the port (good practice, though Dokploy might override)
EXPOSE 3000

# Start server using the standalone script
CMD ["node", "apps/web/server.js"]
