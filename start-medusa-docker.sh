#!/bin/bash

# Create Docker network if it doesn't exist
docker network create prettyfull-network 2>/dev/null || true

# Start PostgreSQL
echo "Starting PostgreSQL..."
docker run -d \
  --name prettyfull-postgres \
  --network prettyfull-network \
  -e POSTGRES_USER=medusa \
  -e POSTGRES_PASSWORD=medusa \
  -e POSTGRES_DB=medusa \
  -p 5432:5432 \
  postgres:15-alpine 2>/dev/null || docker start prettyfull-postgres

# Start Redis
echo "Starting Redis..."
docker run -d \
  --name prettyfull-redis \
  --network prettyfull-network \
  -p 6379:6379 \
  redis:7-alpine 2>/dev/null || docker start prettyfull-redis

# Wait for databases to be ready
echo "Waiting for databases to be ready..."
sleep 5

# Start Medusa
echo "Starting Medusa server..."
docker run -d \
  --name prettyfull-medusa \
  --network prettyfull-network \
  -e DATABASE_URL=postgres://medusa:medusa@prettyfull-postgres:5432/medusa \
  -e REDIS_URL=redis://prettyfull-redis:6379 \
  -e JWT_SECRET=supersecret-change-in-production \
  -e COOKIE_SECRET=supersecret-change-in-production \
  -e NODE_ENV=production \
  -e PORT=9000 \
  -e MEDUSA_BACKEND_URL=http://localhost:9000 \
  -e STORE_CORS=http://localhost:3000,http://dev.prettyfull.shop,https://dev.prettyfull.shop \
  -e ADMIN_CORS=http://localhost:9000,http://dev.prettyfull.shop,https://dev.prettyfull.shop \
  -e AUTH_CORS=http://localhost:9000,http://localhost:3000,http://dev.prettyfull.shop,https://dev.prettyfull.shop \
  -p 9000:9000 \
  prettyfull-medusa-admin 2>/dev/null || docker start prettyfull-medusa

echo ""
echo "✅ Medusa server is starting!"
echo "📊 Check logs with: docker logs -f prettyfull-medusa"
echo "🌐 Admin dashboard will be available at: http://localhost:9000/app"
echo "🔧 API available at: http://localhost:9000"
echo ""
echo "To stop all services: docker stop prettyfull-medusa prettyfull-postgres prettyfull-redis"
