# ==============================================================================
# Dockerfile Multi-Stage: UAGRM Sistema Título Supletorio (Frontend)
# ==============================================================================

# Stage 1: Build de la Aplicación React + Vite
FROM node:20-alpine AS build
WORKDIR /app

# Argumentos de compilación para Vite (inyectados en el bundle)
ARG VITE_API_BASE_URL=http://localhost:8000/api
ARG VITE_GRAPHQL_URL=http://localhost:8000/graphql/
ARG VITE_MINIO_PUBLIC_URL=http://localhost:10001
ARG VITE_APP_ENV=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_MINIO_PUBLIC_URL=$VITE_MINIO_PUBLIC_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Instalación de dependencias optimizada con caché
COPY package*.json ./
RUN npm ci --silent || npm install

# Copia de código fuente y compilación
COPY . .
RUN npm run build

# Stage 2: Servidor Web de Producción con Nginx
FROM nginx:alpine AS production

# Copia del bundle generado en el Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración Nginx para SPA (Single Page Application) con Gzip y Cache
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Habilitar compresión Gzip \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_proxied any; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml; \
    \
    # Cache estático agresivo para assets compilados con hash \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Enrutamiento React Router (SPA) \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Manejo de errores \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
