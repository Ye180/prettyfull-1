FROM nginx:alpine

# Nettoyage config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques
COPY . /usr/share/nginx/html

# Configuration Nginx pour SPA
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
