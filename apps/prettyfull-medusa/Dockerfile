# Production Dockerfile for Medusa backend in monorepo
# Build from monorepo root: docker build -f apps/prettyfull-medusa/Dockerfile -t prettyfull-medusa .
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.21.0

# Copy root package files for monorepo workspace setup
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy the medusa app
COPY apps/prettyfull-medusa ./apps/prettyfull-medusa

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Set working directory to medusa app
WORKDIR /app/apps/prettyfull-medusa

# Build the Medusa application (outputs to .medusa/server)
RUN pnpm run build

# Install production dependencies in the build output directory
WORKDIR /app/apps/prettyfull-medusa/.medusa/server
ENV CI=true
RUN pnpm install --prod --frozen-lockfile

# Expose Medusa port
EXPOSE 9000

# Run migrations and start the production server
CMD ["sh", "-c", "pnpm run predeploy && pnpm run start"]
