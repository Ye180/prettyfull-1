# --- ÉTAPE 1 : BUILD ---
FROM node:22-alpine AS builder
RUN npm install -g pnpm turbo
WORKDIR /app
COPY . .
# On installe et on build pour générer le dossier .medusa/admin
RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo run build --filter=prettyfull-medusa

# --- ÉTAPE 2 : RUNNER (Le serveur statique) ---
FROM nginx:alpine AS runner
# On copie les fichiers statiques générés vers le dossier Nginx
COPY --from=builder /app/apps/prettyfull-medusa/.medusa/admin /usr/share/nginx/html

# Configuration Nginx basique pour gérer les routes Single Page App
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]