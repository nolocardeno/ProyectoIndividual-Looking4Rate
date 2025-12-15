# ============================================
# STAGE 1: BUILD
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias primero (cache de capas)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación para producción (solo browser, sin SSR)
RUN npm run build -- --output-mode=static

# ============================================
# STAGE 2: RUNTIME con NGINX
# ============================================
FROM nginx:1.25-alpine

# Instalar curl para health check
RUN apk add --no-cache curl

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Renombrar index.csr.html a index.html para que Nginx lo sirva correctamente
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Nginx se ejecuta en foreground por defecto
CMD ["nginx", "-g", "daemon off;"]
