FROM nginx:stable-alpine

# On vide tout pour éviter les conflits de fichiers par défaut
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/*

# On copie le contenu du dossier (index.html, assets, etc.)
COPY . /usr/share/nginx/html/

# On force les permissions de lecture pour Nginx
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Configuration propre pour ton admin Medusa
RUN printf "server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
    error_log /var/log/nginx/error.log debug;\n\
    access_log /var/log/nginx/access.log;\n\
}\n" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]