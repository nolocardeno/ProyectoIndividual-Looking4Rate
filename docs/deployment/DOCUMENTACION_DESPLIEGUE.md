# Despliegue con Docker - Looking4Rate

Guía completa para ejecutar Looking4Rate con Docker.

## URL de Producción

**🌐 Aplicación desplegada:** https://looking4rate-nu8km.ondigitalocean.app/

## Requisitos Previos

- Docker Desktop instalado (incluye Docker Compose)
- Mínimo 4GB de RAM disponible
- Puertos 80 y 8080 disponibles

## Inicio Rápido

### 1. Construir e iniciar todos los servicios

```bash
docker-compose up --build
```

### 2. Acceder a la aplicación

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080/api
- **Consola H2:** http://localhost:8080/h2-console
  - **JDBC URL:** `jdbc:h2:mem:looking4rate_db`
  - **Usuario:** `sa`
  - **Contraseña:** `sa`

### 3. Detener los servicios

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes
docker-compose down -v
```

## Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar en modo detached (segundo plano)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart frontend
docker-compose restart backend

# Reconstruir un servicio específico
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Inspección y Diagnóstico

```bash
# Ver estado de los servicios
docker-compose ps

# Ejecutar comando dentro de un contenedor
docker-compose exec backend sh
docker-compose exec frontend sh

# Ver uso de recursos
docker stats

# Inspeccionar red
docker network inspect looking4rate-network
```

### Limpieza

```bash
# Eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes generadas
docker-compose down --rmi all

# Limpiar todo el sistema Docker (¡cuidado!)
docker system prune -a --volumes
```

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER HOST                          │
│                                                         │
│  ┌──────────────────┐         ┌───────────────────┐    │
│  │   Frontend       │         │     Backend       │    │
│  │   (Nginx)        │────────▶│   (Spring Boot)   │    │
│  │   Puerto: 80     │         │   Puerto: 8080    │    │
│  └──────────────────┘         └───────────────────┘    │
│           │                            │                │
│           └────────────────────────────┘                │
│              looking4rate-network                       │
└─────────────────────────────────────────────────────────┘
```

### Componentes

#### Contenedor Frontend
- **Imagen Base:** `nginx:1.25-alpine`
- **Build:** Multi-stage con Node.js 20
- **Modo de Salida:** Estático (sin SSR para producción)
- **Proxy:** Nginx redirige peticiones `/api/` al backend
- **Health Check:** HTTP GET en puerto 80
- **Tamaño:** ~50MB

#### Contenedor Backend
- **Imagen Base:** `eclipse-temurin:21-jre-alpine`
- **Build:** Multi-stage con Maven 3.9
- **Base de Datos:** H2 en memoria
- **Health Check:** HTTP GET en `/api/juegos`
- **Tamaño:** ~250MB

## Detalles de Configuración

### Configuración de URL de la API

El frontend está configurado para usar **rutas relativas** (`/api`) aprovechando el proxy de Nginx:

**Archivo:** `frontend/src/app/core/constants.ts`
```typescript
export const API_URL = '/api';
export const BASE_URL = '';
```

Esto asegura que todas las llamadas a la API pasen por Nginx, que las redirige al contenedor backend.

### Configuración del Proxy Nginx

**Archivo:** `frontend/nginx.conf`
```nginx
location /api/ {
  proxy_pass http://backend:8080/api/;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

### Configuración de Build de Angular

El frontend usa el flag `--output-mode=static` para generar un build estático sin SSR:

**Archivo:** `frontend/Dockerfile`
```dockerfile
RUN npm run build -- --output-mode=static
```

Esto crea los archivos en `/app/dist/frontend/browser/`, donde `index.csr.html` se renombra a `index.html`.

## Tamaño de Imágenes

| Imagen | Tamaño Aproximado |
|--------|-------------------|
| Frontend (Nginx) | ~50MB |
| Backend (JRE 21) | ~250MB |
| **Total** | **~300MB** |

## Seguridad

### Implementado

- ✅ Health checks para ambos servicios
- ✅ Nginx con headers de seguridad
- ✅ Imágenes Alpine (superficie de ataque reducida)
- ✅ .dockerignore para excluir archivos sensibles
- ✅ Aislamiento de red con Docker Compose

### Recomendaciones para Producción

```bash
# Escanear imágenes en busca de vulnerabilidades
docker scan looking4rate-backend
docker scan looking4rate-frontend

# Usar secrets para datos sensibles
docker-compose --env-file .env.prod up -d
```

## Solución de Problemas

### Puerto 80 ya en uso

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8000:80"  # Acceder en http://localhost:8000
```

### Backend no responde

```bash
# Ver logs detallados
docker-compose logs -f backend

# Verificar estado de health check
docker inspect looking4rate-backend | grep -A 10 Health

# Acceder al contenedor
docker-compose exec backend sh
curl http://localhost:8080/api/juegos
```

### Frontend no puede alcanzar el backend

1. Verificar logs de Nginx: `docker-compose logs frontend`
2. Verificar conectividad de red: `docker-compose exec frontend ping backend`
3. Probar backend desde contenedor frontend: `docker-compose exec frontend curl http://backend:8080/api/juegos`

### El build es lento

```bash
# Limpiar caché de build de Docker
docker builder prune

# Construir sin caché
docker-compose build --no-cache

# Verificar espacio en disco
docker system df
```

### Frontend muestra página por defecto de Nginx

Esto significa que los archivos de Angular no se copiaron correctamente. Verificar:
```bash
docker-compose exec frontend ls -la /usr/share/nginx/html
```

Deberías ver archivos como `index.html`, `main-*.js`, `styles-*.css`, etc.

## Monitoreo

### Métricas en tiempo real

```bash
# CPU, RAM, Network I/O
docker stats looking4rate-frontend looking4rate-backend

# Logs continuos
docker-compose logs -f --tail=100
```

### Métricas del Backend

Spring Boot Actuator expone métricas en:
- Health: http://localhost:8080/actuator/health
- Metrics: http://localhost:8080/actuator/metrics
- Info: http://localhost:8080/actuator/info

## Despliegue en Producción

### DigitalOcean App Platform

La aplicación está desplegada en **DigitalOcean App Platform**:

| Componente | URL |
|------------|-----|
| Frontend | https://looking4rate-nu8km.ondigitalocean.app/ |
| API Backend | https://looking4rate-nu8km.ondigitalocean.app/api/ |

#### Verificación del Despliegue

##### Rutas del Frontend (SPA)

Todas las rutas SPA funcionan correctamente con acceso directo:

| Ruta | Estado | Descripción |
|------|--------|-------------|
| `/` | ✅ | Home - Página principal |
| `/buscar` | ✅ | Búsqueda de juegos |
| `/juego/:id` | ✅ | Detalle de juego |
| `/usuario/:id` | ✅ | Perfil de usuario |
| `/ajustes` | ✅ | Ajustes de cuenta (requiere login) |
| `/404` | ✅ | Página no encontrada |
| `/*` (wildcard) | ✅ | Redirige a 404 |

##### Endpoints de la API

| Endpoint | Estado | Autenticación |
|----------|--------|---------------|
| `GET /api/juegos` | ✅ | Pública |
| `GET /api/juegos/:id` | ✅ | Pública |
| `GET /api/usuarios/:id` | ✅ | Requiere JWT |
| `GET /api/catalogos/*` | ✅ | Requiere JWT |
| `POST /api/auth/login` | ✅ | Pública |
| `POST /api/auth/registro` | ✅ | Pública |

#### Configuración de Redirects para SPA

El archivo `nginx.conf` está configurado para manejar correctamente las rutas de la SPA:

```nginx
location / {
  try_files $uri $uri/ /index.html;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

Esta configuración asegura que:
1. Primero se busca el archivo exacto (`$uri`)
2. Si no existe, se busca un directorio (`$uri/`)
3. Si tampoco existe, se sirve `index.html` para que Angular Router maneje la ruta
4. No se cachea el HTML para asegurar actualizaciones inmediatas

### Docker Hub

```bash
# Etiquetar imágenes
docker tag looking4rate-frontend:latest tuusuario/looking4rate-frontend:1.0.0
docker tag looking4rate-backend:latest tuusuario/looking4rate-backend:1.0.0

# Push a Docker Hub
docker push tuusuario/looking4rate-frontend:1.0.0
docker push tuusuario/looking4rate-backend:1.0.0
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Backend
SPRING_PROFILES_ACTIVE=default
JAVA_OPTS=-Xms512m -Xmx1024m

# Puertos
FRONTEND_PORT=80
BACKEND_PORT=8080
```

Usar en `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-default}
      - JAVA_OPTS=${JAVA_OPTS:--Xms256m -Xmx512m}
    ports:
      - "${BACKEND_PORT:-8080}:8080"
```

## Reconstruir Después de Cambios

Cuando hagas cambios en el código:

```bash
# Cambios en frontend
docker-compose stop frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Cambios en backend
docker-compose stop backend
docker-compose build --no-cache backend
docker-compose up -d backend

# Ambos
docker-compose down
docker-compose up --build -d
```

## Recursos

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Guía de Spring Boot con Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Despliegue de Angular con Docker](https://angular.dev/tools/cli/deployment#docker)
- [Imagen Oficial de Nginx en Docker](https://hub.docker.com/_/nginx)

---

**Última Actualización:** 14 de enero de 2026
