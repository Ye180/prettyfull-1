# FROM node:22-alpine AS base

# FROM base AS builder
# RUN apk update
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # Copy root package.json and lockfile
# COPY package.json pnpm-lock.yaml ./

# # Copy the admin apps package.json
# COPY apps/admin/package.json ./apps/admin/

# # Install pnpm
# RUN npm install -g pnpm turbo

# COPY . .

# RUN turbo prune prettyfull-admin --docker

# # Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer
# RUN apk update
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
 
# # First install the dependencies (as they change less often)
# RUN npm install -g pnpm
# COPY --from=builder /app/out/json/ .
# RUN pnpm install --frozen-lockfile
 
# # Build the project
# COPY --from=builder /app/out/full/ .
# RUN pnpm turbo run build
 
# FROM base AS runner
# WORKDIR /app
 
# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
# COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public
 
# CMD node apps/admin/server.js