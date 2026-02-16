# ============================================
# Builder Stage - Build Medusa Application
# ============================================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    postgresql-client

# Install pnpm
RUN npm install -g pnpm@10.21.0

WORKDIR /app

# Copy package files for better layer caching
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile || pnpm install

# Copy application source
COPY . .

# Build arguments for flexibility
ARG MEDUSA_BACKEND_URL=""
ARG NODE_ENV=production

# Build-time environment variables (placeholders only - no real secrets)
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL="postgres://placeholder:placeholder@localhost:5432/placeholder"
ENV REDIS_URL="redis://localhost:6379"
ENV JWT_SECRET="build-time-placeholder"
ENV COOKIE_SECRET="build-time-placeholder"
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}

# Build the application with increased memory
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

# Verify admin build with fallback paths
RUN test -f .medusa/server/public/admin/index.html || \
    test -f .medusa/admin/index.html || \
    (echo "Admin build not found!" && exit 1)

# ============================================
# Runner Stage - Production Runtime
# ============================================
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl \
    postgresql-client \
    ca-certificates

# Install pnpm
RUN npm install -g pnpm@10.21.0

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

# Set production environment
ENV NODE_ENV=production
ENV CI=true

# Copy built application from builder
COPY --from=builder --chown=medusa:nodejs /app/.medusa/server ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Ensure proper ownership
RUN chown -R medusa:nodejs /app

# Switch to non-root user
USER medusa

# Expose Medusa port
EXPOSE 9000

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

# Start command: run migrations then start server
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
