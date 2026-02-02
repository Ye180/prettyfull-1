# --- ÉTAPE 1 : BUILD ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# --- ÉTAPE 2 : SERVEUR NGINX ---
FROM nginx:alpine
# On copie les fichiers statiques générés vers le dossier Nginx
COPY --from=builder /app/apps/prettyfull-medusa/.medusa/admin /usr/share/nginx/html

RUN echo 'server { \
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]