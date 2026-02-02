# FROM nginx:alpine

# # Supprimer la config par défaut de nginx
# RUN rm /etc/nginx/conf.d/default.conf

# # Copier TOUT le contenu de view-admin (index.html + assets)
# COPY . /usr/share/nginx/html

# # Configuration nginx pour une SPA
# RUN echo 'server { \
#     listen 80; \
#     server_name _; \
#     root /usr/share/nginx/html; \
#     index index.html; \
#     location / { \
#         try_files $uri $uri/ /index.html; \
#     } \
# }' > /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]



FROM nginx:alpine

# On vide le dossier par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# On copie tes fichiers (index.html, assets, etc.)
COPY . /usr/share/nginx/html/

# On crée une page de test forcée au cas où la copie échoue
RUN echo "<h1>ADMIN PRETTYFULL OK</h1>" > /usr/share/nginx/html/test.html

# Config pour le routage SPA
RUN printf "server {\n  listen 80;\n  location / {\n    root /usr/share/nginx/html;\n    try_files \$uri \$uri/ /index.html;\n  }\n}" > /etc/nginx/conf.d/default.conf

EXPOSE 80