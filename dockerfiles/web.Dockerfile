FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm turbo run build --filter=web

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./
RUN npm install -g pnpm
RUN pnpm install 
CMD ["pnpm", "start"]