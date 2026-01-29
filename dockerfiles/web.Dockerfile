FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

# Copy the entire repository
# NOTE: This requires the Build Context to be set to the repository Root (/)
COPY . .

# Install dependencies
# Using plain install as requested to avoid frozen-lockfile issues for now
RUN pnpm install 

# Build the web application
RUN pnpm --filter web build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the standalone build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Expose the port
EXPOSE 3000

# Start server using the standalone script
CMD ["node", "apps/web/server.js"]