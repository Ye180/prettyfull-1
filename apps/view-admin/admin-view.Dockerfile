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

# On écrase tout pour être sûr
RUN rm /usr/share/nginx/html/index.html
RUN echo "<h1>DOKPLOY TEST SUCCESS</h1>" > /usr/share/nginx/html/index.html

# Le reste de ta config
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]