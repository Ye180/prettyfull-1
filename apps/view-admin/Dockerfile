FROM nginx:stable-alpine

# 1. On nettoie tout pour éviter les conflits
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/*

# 2. On copie TOUT le contenu du dossier view-admin (assets, index.html, etc.)
COPY . /usr/share/nginx/html/

# 3. On crée la configuration Nginx optimisée pour Medusa (SPA)
RUN printf "server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
    # Gestion du cache pour les assets statiques\n\
    location /assets/ {\n\
        expires 1y;\n\
        add_header Cache-Control \"public\";\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# FROM nginx:alpine

# # On vide le dossier par défaut de Nginx
# RUN rm -rf /usr/share/nginx/html/*

# # On copie tes fichiers (index.html, assets, etc.)
# COPY . /usr/share/nginx/html/

# # On crée une page de test forcée au cas où la copie échoue
# RUN echo "<h1>ADMIN PRETTYFULL OK</h1>" > /usr/share/nginx/html/test.html

# # Config pour le routage SPA
# RUN printf "server {\n  listen 80;\n  location / {\n    root /usr/share/nginx/html;\n    try_files \$uri \$uri/ /index.html;\n  }\n}" > /etc/nginx/conf.d/default.conf

# EXPOSE 80