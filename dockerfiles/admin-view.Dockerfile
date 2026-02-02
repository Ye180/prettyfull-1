FROM nginx:stable-alpine

# On nettoie TOUT (config et fichiers par défaut)
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/*

# On copie tout le contenu du dossier actuel
COPY . /usr/share/nginx/html

# On crée une config ultra-minimaliste
RUN echo "server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/admin.conf

# PETIT TRUC : On vérifie dans les logs au lancement
RUN ls -la /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]