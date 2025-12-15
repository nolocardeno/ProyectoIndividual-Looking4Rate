<p align="center">
  <img src="frontend/public/assets/img/logoL4R-grande.png" alt="Looking4Rate Logo" >
</p>

**Looking4Rate** es una plataforma moderna de catálogo y valoración de videojuegos construida con Angular 19 y Spring Boot 3, donde los usuarios pueden descubrir juegos, valorarlos e interactuar con otros jugadores.

---

## Tabla de Contenidos

- [Comenzar](#comenzar)
  - [Despliegue con Docker (Recomendado)](#despliegue-con-docker-recomendado)
  - [Modo Desarrollo](#modo-desarrollo)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Documentación Adicional](#documentación-adicional)
- [Licencia](#licencia)

---

## Comenzar

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
   - **Consola H2:** http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:looking4rate_db`
     - Usuario: `sa`
     - Contraseña: `sa`

3. **Detener los servicios:**
```bash
docker-compose down
```

> **Documentación completa de Docker:** [`docs/deployment/DOCKER.md`](docs/deployment/DOCKER.md)

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
- **Valoraciones de Usuarios:** Valora juegos y consulta las valoraciones de la comunidad
- **Perfiles de Usuario:** Perfiles personalizados con preferencias de juego
- **Diseño Responsive:** Interfaz completamente responsive con soporte para modo claro/oscuro
- **Interacciones en Tiempo Real:** Experiencia de usuario fluida con Angular signals
- **API RESTful:** API backend bien documentada con Spring Boot
- **Autenticación Segura:** Sistema de autenticación basado en JWT

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
- **Base de Datos:** H2 (en memoria)
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
│                (Base de Datos H2 en Memoria)                │
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
│   │   │   ├── java/com/looking4rate/
│   │   │   │   ├── controller/       # Controladores REST
│   │   │   │   ├── dto/              # DTOs
│   │   │   │   ├── entity/           # Entidades JPA
│   │   │   │   ├── repository/       # Repositorios JPA
│   │   │   │   ├── service/          # Lógica de Negocio
│   │   │   │   └── config/           # Configuración Spring
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql          # Datos iniciales
│   │   └── test/                     # Tests
│   ├── pom.xml
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/                         # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           # Componentes reutilizables
│   │   │   ├── pages/                # Páginas
│   │   │   ├── services/             # Servicios de API
│   │   │   ├── guards/               # Guards de rutas
│   │   │   ├── models/               # Interfaces TypeScript
│   │   │   ├── validators/           # Validadores
│   │   │   └── core/                 # Utilidades core
│   │   ├── styles/                   # SCSS (ITCSS)
│   │   └── index.html
│   ├── public/assets/                # Assets estáticos
│   ├── angular.json
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── docs/                             # Documentación
│   ├── deployment/
│   │   └── DOCKER.md                 # Guía de Docker
│   ├── client/                       # Docs del proyecto
│   └── design/                       # Docs de diseño
│
├── docker-compose.yml
└── README.md
```

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
- `POST /api/interacciones` - Crear interacción (valoración/favorito)
- `PUT /api/interacciones/{id}` - Actualizar interacción
- `DELETE /api/interacciones/{id}` - Eliminar interacción

### Catálogos
- `GET /api/catalogos` - Obtener todos los catálogos
- `GET /api/catalogos/{tipo}` - Obtener catálogo por tipo

### Autenticación
- `POST /api/auth/login` - Login de usuario (devuelve JWT)
- `POST /api/auth/register` - Registro de usuario

---

## Documentación Adicional

- **[Guía de Despliegue con Docker](docs/deployment/DOCUMENTACION_DESPLIEGUE.md)** - Documentación completa de Docker con comandos, troubleshooting y configuración avanzada
- **[Documentación del Cliente](docs/client/DOCUMENTACION_CLIENTE.md)** - Documentación detallada de todas las fases del frontend (Cliente)
- **[Documentación del Servidor](docs/server/DOCUMENTACION_SERVIDOR.md)** - Documentación del backend, entidades, DTOs y repositorios
- **[Documentación de Diseño](docs/design/DOCUMENTACION_DISEÑO.md)** - Guía de estilos, componentes y arquitectura SCSS

---

## Licencia

Este proyecto está desarrollado como proyecto académico individual.
Autor: Manolo Cárdeno Sánchez.

---

*Última Actualización: 15 de diciembre de 2025*
