FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install && pnpm build --filter=backend

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN pnpm install 
CMD ["node", "dist/apps/backend/main.js"]