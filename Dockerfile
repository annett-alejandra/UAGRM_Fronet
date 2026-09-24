# Stage 1: Build (Base Node)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Producción con Nginx
FROM nginx:alpine
# Copiar el build compilado
COPY --from=build /app/dist /usr/share/nginx/html
# Configuración personalizada para SPA (Redireccionar 404 a index.html)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
