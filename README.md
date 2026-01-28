<p align="center">
  <img src="frontend/public/assets/img/logos/logoL4R-large.webp" alt="Looking4Rate Logo" >
</p>

**Looking4Rate** es una plataforma moderna de catálogo y valoración de videojuegos construida con Angular 19 y Spring Boot 3, donde los usuarios pueden descubrir juegos, valorarlos e interactuar con otros jugadores.

---

## Tabla de Contenidos

- [Comenzar](#comenzar)
  - [Acceso a la Aplicación](#acceso-a-la-aplicación)
  - [Despliegue con Docker (Recomendado)](#despliegue-con-docker-recomendado)
  - [Modo Desarrollo](#modo-desarrollo)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación API y Monitorización](#documentación-api-y-monitorización)
- [Endpoints de la API](#endpoints-de-la-api)
- [Accesibilidad y Multimedia](#accesibilidad-y-multimedia)
- [Documentación Adicional](#documentación-adicional)
- [Licencia](#licencia)

---

## Comenzar

### Acceso a la Aplicación

La aplicación está desplegada y accesible para poder visualizarla sin problemas en:

**[https://looking4rate-nu8km.ondigitalocean.app/](https://looking4rate-nu8km.ondigitalocean.app/)**

> **Nota:** La aplicación está desplegada en Digital Ocean App Platform sin dominio personalizado. Puedes acceder directamente mediante el enlace proporcionado. Este despliegue es temporal, en el futuro buscare alguna plataforma en la cual poder desplegar de forma permanente mi aplicación con un dominio personalizado.

### Despliegue con Docker (Recomendado)

La forma más rápida y sencilla de ejecutar la aplicación completa:

#### Requisitos
- Docker Desktop instalado (incluye Docker Compose)
- Mínimo 4GB de RAM
- Puertos 80 y 8080 disponibles

#### Pasos

1. **Construir e iniciar todos los servicios:**
```bash
docker-compose up --build
```

2. **Acceder a la aplicación:**
   - **Frontend:** http://localhost
   - **Backend API:** http://localhost:8080/api
   - **Swagger UI:** http://localhost:8080/swagger-ui.html
   - **Health Check:** http://localhost:8080/actuator/health

3. **Detener los servicios:**
```bash
docker-compose down
```

> **Documentación completa de despliegue:** [`docs/deployment/DOCUMENTACION_DESPLIEGUE.md`](docs/deployment/DOCUMENTACION_DESPLIEGUE.md)

---

### Modo Desarrollo

#### Requisitos Previos
- Node.js 20+ y npm
- Java 21 (JDK)
- Maven 3.9+

#### Backend

```bash
cd backend
mvn spring-boot:run
```

O con el JAR compilado:
```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**URL:** http://localhost:8080

#### Frontend

```bash
cd frontend
npm install
npm start
```

**URL:** http://localhost:4200

> **Nota:** En modo desarrollo, el frontend se conecta automáticamente a `http://localhost:8080/api`

---

## Características

- **Catálogo de Juegos:** Navega y busca en una completa base de datos de videojuegos
- **Valoraciones de Usuarios:** Sistema de puntuación de 1-5 estrellas (1-10 internamente)
- **Reseñas y Reviews:** Escribe y consulta opiniones detalladas sobre juegos
- **Estado de Jugado:** Marca juegos como jugados y lleva registro de tu biblioteca
- **Perfiles de Usuario:** Perfiles personalizados con estadísticas (juegos jugados, reviews escritas)
- **Diseño Responsive:** Interfaz completamente responsive con soporte para modo claro/oscuro
- **Gestión de Estado Reactiva:** Experiencia de usuario fluida con Angular Signals
- **API RESTful:** API backend bien documentada con Spring Boot y Swagger UI
- **Autenticación Segura:** Sistema de autenticación basado en JWT con persistencia de sesión

---

## Stack Tecnológico

### Frontend
- **Framework:** Angular 19 (Componentes Standalone)
- **Lenguaje:** TypeScript 5.7
- **Estilos:** SCSS con arquitectura ITCSS y metodología BEM
- **Gestión de Estado:** Angular Signals
- **Herramienta de Build:** Angular CLI con esbuild
- **Iconos:** Font Awesome 6.7

### Backend
- **Framework:** Spring Boot 3.5.8
- **Lenguaje:** Java 21
- **Base de Datos:** PostgreSQL 16 (producción) / H2 (desarrollo local)
- **Seguridad:** Spring Security con JWT
- **ORM:** JPA/Hibernate
- **Build:** Maven 3.9

### DevOps
- **Contenerización:** Docker & Docker Compose
- **Servidor Web:** Nginx (producción)
- **Proxy Inverso:** Nginx → Spring Boot

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE CLIENTE                        │
│                    (Angular 19 SPA)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Rutas     │  │ Componentes  │  │  Servicios   │      │
│  │   Guards    │  │   Modelos    │  │ Interceptores │      │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE API GATEWAY                        │
│                     (Proxy Nginx)                           │
│                   Puerto 80 → Puerto 8080                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE BACKEND                         │
│                  (API REST Spring Boot)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Controladores │  │   Servicios  │  │ Repositorios │     │
│  │     DTOs     │  │   Entidades  │  │      JPA     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE BASE DE DATOS                      │
│          PostgreSQL 16 (producción) / H2 (desarrollo)       │
│       Tablas: juego, usuario, interaccion, catalogo         │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
ProyectoIndividual-Looking4Rate/
├── backend/                          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/looking4rate/backend/
│   │   │   │   ├── controllers/      # Controladores REST
│   │   │   │   ├── dtos/             # DTOs
│   │   │   │   ├── entities/         # Entidades JPA
│   │   │   │   ├── repositories/     # Repositorios JPA
│   │   │   │   ├── services/         # Lógica de Negocio
│   │   │   │   ├── security/         # Configuración JWT
│   │   │   │   ├── exceptions/       # Excepciones personalizadas
│   │   │   │   └── config/           # Configuración Spring
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql          # Datos iniciales
│   │   └── test/                     # Tests unitarios
│   ├── pom.xml
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/                         # Frontend Angular 19
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           # Componentes reutilizables (30+)
│   │   │   │   ├── layout/           # Header, footer, navegación
│   │   │   │   └── shared/           # Componentes compartidos
│   │   │   ├── pages/                # Páginas (home, search, profile...)
│   │   │   ├── services/             # Servicios de API
│   │   │   ├── guards/               # Guards de rutas
│   │   │   ├── models/               # Interfaces TypeScript
│   │   │   ├── resolvers/            # Resolvers de datos
│   │   │   ├── validators/           # Validadores de formularios
│   │   │   ├── tests/                # Tests unitarios
│   │   │   └── core/                 # Utilidades, interceptores, constantes
│   │   ├── styles/                   # SCSS (ITCSS)
│   │   │   ├── 00-settings/          # Variables y configuración
│   │   │   ├── 01-tools/             # Mixins y funciones
│   │   │   ├── 02-generic/           # Reset y normalización
│   │   │   ├── 03-elements/          # Estilos base HTML
│   │   │   └── 04-layout/            # Layouts generales
│   │   └── index.html
│   ├── public/assets/                # Assets estáticos
│   ├── angular.json
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── docs/                             # Documentación completa
│   ├── accesibility/                 # Documentación de accesibilidad
│   │   └── README.md                 # Análisis WCAG 2.1 AA
│   ├── client/                       # Docs del frontend
│   ├── server/                       # Docs del backend
│   ├── deployment/                   # Guía de despliegue
│   └── design/                       # Guía de diseño
│
├── docker-compose.yml
└── README.md
```

---

## Documentación API y Monitorización

El backend incluye herramientas integradas para documentación interactiva y monitorización:

### Swagger UI (OpenAPI)

Documentación interactiva de la API con capacidad de probar endpoints directamente:

- **URL:** http://localhost:8080/swagger-ui.html (desarrollo)
- **OpenAPI JSON:** http://localhost:8080/api-docs

**Características:**
- Documentación completa de todos los endpoints
- Autenticación JWT integrada (botón "Authorize")
- Prueba de endpoints en tiempo real
- Esquemas de request/response

### Spring Boot Actuator

Endpoints para monitorizar el estado de la aplicación:

| Endpoint | Descripción |
|----------|-------------|
| `/actuator/health` | Estado de salud (base de datos, disco) |
| `/actuator/info` | Información de la aplicación |
| `/actuator/metrics` | Métricas del sistema |

---

## Endpoints de la API

**URL Base:** 
- Desarrollo: `http://localhost:8080/api`
- Docker: `http://localhost/api`

### Juegos
- `GET /api/juegos` - Obtener todos los juegos
- `GET /api/juegos/{id}` - Obtener juego por ID
- `POST /api/juegos` - Crear nuevo juego (requiere auth)
- `PUT /api/juegos/{id}` - Actualizar juego (requiere auth)
- `DELETE /api/juegos/{id}` - Eliminar juego (requiere auth)

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `POST /api/usuarios` - Registrar nuevo usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario (requiere auth)
- `DELETE /api/usuarios/{id}` - Eliminar usuario (requiere auth)

### Interacciones
- `GET /api/interacciones` - Obtener todas las interacciones
- `GET /api/interacciones/usuario/{usuarioId}` - Obtener interacciones de usuario
- `GET /api/interacciones/juego/{juegoId}` - Obtener interacciones de juego
- `POST /api/interacciones` - Crear interacción (puntuación, review, estado de jugado)
- `PUT /api/interacciones/{id}` - Actualizar interacción
- `DELETE /api/interacciones/{id}` - Eliminar interacción

### Catálogos
- `GET /api/catalogos` - Obtener todos los catálogos
- `GET /api/catalogos/{tipo}` - Obtener catálogo por tipo

### Autenticación
- `POST /api/auth/login` - Login de usuario (devuelve JWT)
- `POST /api/auth/register` - Registro de usuario

---

## Accesibilidad y Multimedia

### Descripción
Este proyecto añade mejoras de accesibilidad web siguiendo las pautas WCAG 2.1, incluyendo navegación por teclado, compatibilidad con lectores de pantalla, estructura semántica y un componente multimedia accesible.

### Componente multimedia añadido
**Tipo:** Galería de imágenes  
**Descripción:** Lightbox interactivo con navegación por teclado (flechas y Escape), botones de navegación visibles y textos alternativos contextuales.

### Resultados de auditoría de accesibilidad

| Herramienta | Puntuación inicial | Puntuación final | Mejora |
|-------------|-------|---------|--------|
| Lighthouse | 87/100 | 97/100 | +10 puntos |
| WAVE | 1 errores, 4 alertas | 0 errores, 1 alerta | -1 errores, -3 alertas |
| TAW | 10 problemas | X problemas | -X problemas |

**Nivel de conformidad alcanzado:** WCAG 2.1 AA

### Documentación completa
📄 **[Ver análisis completo de accesibilidad](./docs/accesibility/README.md)**

### Verificación realizada
- ✅ Auditoría con Lighthouse, WAVE y TAW
- ✅ Test con lector de pantalla (NVDA)
- ✅ Test de navegación por teclado
- ✅ Verificación cross-browser (Chrome, Firefox, Safari)

### Tecnologías utilizadas
- HTML5 semántico (landmarks, ARIA)
- SCSS con variables CSS para temas
- Angular 19 con señales y OnPush
- TypeScript con tipado estricto

### Autor
**Nombre:** Manolo Cárdeno Sánchez  
**Curso:** 2º DAW - Desarrollo de Aplicaciones Web  
**Módulo:** Diseño de Interfaces Web (DIW)

---

## Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [Guía de Despliegue](docs/deployment/DOCUMENTACION_DESPLIEGUE.md) | Docker, configuración y troubleshooting |
| [Documentación del Cliente](docs/client/DOCUMENTACION_CLIENTE.md) | Frontend Angular: componentes, servicios, routing |
| [Documentación del Servidor](docs/server/DOCUMENTACION_SERVIDOR.md) | Backend Spring Boot: entidades, DTOs, repositorios |
| [Documentación de Diseño](docs/design/DOCUMENTACION_DISEÑO.md) | Guía de estilos, ITCSS, metodología BEM |
| [Documentación de Accesibilidad](docs/accesibility/README.md) | Análisis WCAG 2.1 AA, auditorías, correcciones |

---

## Licencia

Este proyecto está desarrollado como proyecto académico individual.
Autor: Manolo Cárdeno Sánchez.

---

*Última Actualización: 28 de enero de 2026*
