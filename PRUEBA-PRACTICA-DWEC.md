# Prueba Práctica - DWEC (Cliente)

## Jerarquía de componentes

La página de ranking sigue la misma estructura que el resto del proyecto: una página que usa componentes.

```
Ruta /ranking
│
└── Ranking
     ├── SpinnerInline    → mientras carga
     ├── Alert            → si hay error
     └── RankingItem      → por cada juego del ranking
          ├── GameCover   → imagen del juego (con enlace)
          └── StarRating  → estrellas de puntuación
```

### Página: `Ranking`

**Ubicación:** `src/app/pages/ranking/`

Es el componente padre. Al entrar en la ruta `/ranking`:
1. Llama al `RankingService` para pedir los 10 juegos mejor valorados.
2. Mientras carga muestra un `SpinnerInline`.
3. Si falla muestra un `Alert` con el error.
4. Si va bien renderiza un `RankingItem` por cada juego usando `@for`.

Usa **signals** para el estado (`ranking`, `loading`, `error`) y `ChangeDetectionStrategy.OnPush` para rendimiento. También comprueba con `isPlatformBrowser` que estamos en el navegador (por el SSR).

### Componente: `RankingItem`

**Ubicación:** `src/app/components/shared/ranking-item/`

Recibe un `@Input` con el objeto `JuegoRankingDTO` y pinta:
- La posición en el ranking (#1, #2...)
- La portada del juego (componente `GameCover`)
- El nombre con enlace a su detalle (`RouterLink`)
- La puntuación media con estrellas (`StarRating`) y el valor numérico formateado con `DecimalPipe`

Está en `components/shared/` porque es reutilizable, no está acoplado a la página.

---

## Servicio y modelo

### `RankingService`

**Ubicación:** `src/app/services/ranking.service.ts`

Extiende de `HttpBaseService` (el servicio base con las llamadas HTTP) y hace un `GET /api/ranking?limite=10`.

### `JuegoRankingDTO`

**Ubicación:** `src/app/models/ranking.model.ts`

```typescript
export interface JuegoRankingDTO {
  posicion: number;
  id: number;
  nombre: string;
  imagenPortada: string;
  puntuacionMedia: number;
  totalReviews: number;
}
```

---

## Ruta

En `app.routes.ts` la ruta se define con **lazy loading**:

```typescript
{ path: 'ranking', loadComponent: () => import('./pages/ranking/ranking'), title: 'Top Juegos - Looking4Rate' }
```

---

## Instrucciones de ejecución

### Requisitos

- Node.js
- npm

### Arrancar el frontend

```bash
cd frontend
npm install
npm start
```

Se abre en `http://localhost:4200`. La página de ranking está en `http://localhost:4200/ranking`.

### Arrancar con backend (necesario para que funcione)

El ranking necesita que el backend esté corriendo para obtener los datos. Hay dos formas:

**Opción 1: Manual**
```bash
# Terminal 1 - Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm start
```

### Arrancar con Docker Compose

En la raíz del proyecto hay un `docker-compose.yml` que levanta todo junto: Base de datos, backend y frontend.

```bash
docker-compose up --build
```

Esto arranca 3 contenedores:
- **postgres** → base de datos en el puerto `5432`
- **backend** → API en el puerto `8080`
- **frontend** → web en el puerto `80`

Una vez levantado, la app está en `http://localhost` y el ranking en `http://localhost/ranking`.