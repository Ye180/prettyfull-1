# Docker Verification Guide

## Dockerfile Configuration Summary

### Decisions Implemented
- ✅ Admin enabled in production (`DISABLE_MEDUSA_ADMIN=false`)
- ✅ Single-process container (no separate worker mode)
- ✅ Runtime env vars only (no build-time secrets)
- ✅ Admin path fallback: checks both `.medusa/server/public/admin` and `.medusa/admin`
- ✅ Placeholder env vars during build to avoid leaking secrets
- ✅ Multi-stage build for optimized image size
- ✅ Non-root user (medusa:nodejs) for security
- ✅ Health check endpoint configured

## Local Build

```bash
# From monorepo root
cd /home/ye/Project/XperienceDev/prettyfull

# Build the Docker image
docker build -t prettyfull-medusa apps/prettyfull-medusa
```

## Prerequisites for Running

You need PostgreSQL and Redis running. Quick setup:

```bash
# Start PostgreSQL
docker run -d \
  --name medusa-postgres \
  -e POSTGRES_USER=medusa \
  -e POSTGRES_PASSWORD=medusa \
  -e POSTGRES_DB=medusa \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d \
  --name medusa-redis \
  -p 6379:6379 \
  redis:7-alpine
```

## Create .env File

Copy the example and customize:

```bash
cp apps/prettyfull-medusa/.env.example apps/prettyfull-medusa/.env
```

Edit `.env` with your actual values:
- Generate secure secrets for `JWT_SECRET` and `COOKIE_SECRET`
- Update database URLs if needed
- Set CORS origins for your frontend

## Local Run

```bash
# Run with env file
docker run --rm -p 9000:9000 \
  --env-file apps/prettyfull-medusa/.env \
  prettyfull-medusa
```

Or with inline env vars:

```bash
docker run --rm -p 9000:9000 \
  -e DATABASE_URL=postgres://medusa:medusa@host.docker.internal:5432/medusa \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  -e JWT_SECRET=your-jwt-secret \
  -e COOKIE_SECRET=your-cookie-secret \
  -e MEDUSA_BACKEND_URL=http://localhost:9000 \
  -e STORE_CORS=http://localhost:3000 \
  -e ADMIN_CORS=http://localhost:9000 \
  -e AUTH_CORS=http://localhost:9000,http://localhost:3000 \
  prettyfull-medusa
```

**Note:** Use `host.docker.internal` instead of `localhost` in DATABASE_URL and REDIS_URL when connecting to services on your host machine from Docker.

## Manual Verification

### 1. Check Admin Dashboard
Open in browser:
```
http://localhost:9000/app
```

Expected: Medusa Admin login page loads

### 2. Check API Health
```bash
curl http://localhost:9000/health
```

Expected: `{"status":"ok"}` or similar health response

### 3. Check Store API
```bash
curl http://localhost:9000/store/products
```

Expected: JSON response with products (empty array if no products yet)

### 4. Check Admin API
```bash
curl http://localhost:9000/admin/auth
```

Expected: JSON response about authentication

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs prettyfull-medusa

# Run interactively to see errors
docker run --rm -it -p 9000:9000 \
  --env-file apps/prettyfull-medusa/.env \
  prettyfull-medusa
```

### Database connection issues
- Verify PostgreSQL is running: `docker ps | grep postgres`
- Check DATABASE_URL format: `postgres://user:password@host:port/database`
- Use `host.docker.internal` for host machine services

### Admin not loading
- Check build logs for admin compilation errors
- Verify `MEDUSA_BACKEND_URL` is set correctly
- Check browser console for errors
- Verify admin files exist: `docker run --rm prettyfull-medusa ls -la public/admin/`

### Migration errors
- Ensure database is accessible
- Check if database exists: `psql -h localhost -U medusa -d medusa -c "\dt"`
- Run migrations manually: `docker exec -it prettyfull-medusa npx medusa db:migrate`

## Production Deployment

For production, ensure:

1. **Secrets**: Generate strong random secrets
   ```bash
   # Generate secrets
   openssl rand -base64 32
   ```

2. **Database**: Use managed PostgreSQL (not Docker)

3. **Redis**: Use managed Redis (not Docker)

4. **Environment Variables**: Set via your hosting platform, not .env file

5. **CORS**: Update CORS origins to match your production domains

6. **Health Checks**: Configure your load balancer to use `/health` endpoint

7. **Logging**: Monitor container logs for errors

## Docker Compose (Optional)

For easier local development with all services:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: medusa
      POSTGRES_DB: medusa
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  medusa:
    image: prettyfull-medusa
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgres://medusa:medusa@postgres:5432/medusa
      REDIS_URL: redis://redis:6379
      JWT_SECRET: supersecret
      COOKIE_SECRET: supersecret
      MEDUSA_BACKEND_URL: http://localhost:9000
      STORE_CORS: http://localhost:3000
      ADMIN_CORS: http://localhost:9000
      AUTH_CORS: http://localhost:9000,http://localhost:3000
    ports:
      - "9000:9000"

volumes:
  postgres_data:
```

Run with: `docker compose up`
