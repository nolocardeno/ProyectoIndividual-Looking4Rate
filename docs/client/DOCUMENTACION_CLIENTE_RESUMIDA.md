# Frontend - Looking4Rate

Documentación resumida del proyecto Angular.

## Comandos Rápidos

```bash
# Desarrollo
ng serve   # http://localhost:4200

# Compilación
ng build
```

---

## FASE 1: Arquitectura de Eventos del Cliente

### Manipulación del DOM
- **ViewChild y ElementRef** para acceso directo a elementos DOM
- Modificación de atributos ARIA, estilos y clases dinámicamente
- Creación/eliminación de elementos (meta tags, modals)

### Sistema de Eventos
- Event binding: `(click)`, `(input)`, `(focus)`, `(blur)`
- Eventos nativos: keyboard, mouse, touch
- Eventos custom con `@Output()` y `EventEmitter`
- Propagación: `stopPropagation()`, `preventDefault()`

### Componentes Interactivos
- **ThemeToggle:** Cambio de tema con animación y persistencia en localStorage
- **Accordion:** Paneles expandibles con modo exclusivo
- **Tabs:** Navegación por pestañas con soporte para templates
- **Modal:** Login/Register con backdrop y teclado ESC

### Mejoras de Accesibilidad
- Roles ARIA: `button`, `menu`, `tab`, `tabpanel`, `alert`
- Propiedades: `aria-expanded`, `aria-selected`, `aria-hidden`
- Navegación por teclado: flechas, Enter, ESC, Tab

---

## FASE 2: Servicios y Comunicación

### Servicios Principales

**EventBusService**
- Comunicación entre componentes no relacionados
- Patrón Publish/Subscribe con RxJS Subject

**StateService**
- Gestión de estado global (usuario, filtros)
- BehaviorSubject para estado reactivo

**NotificationService**
- Toasts con tipos: success, error, warning, info
- Auto-dismiss configurable y cola de mensajes

**LoadingService**
- Spinner global con overlay
- Barra de progreso para operaciones largas
- Control granular por operación

**NavigationService**
- Navegación programática con historial
- Detección de navegación back/forward

**AuthService**
- Login, registro, logout
- Gestión de sesión con localStorage
- Guards para rutas protegidas

### Comunicación entre Componentes
- `@Input()` / `@Output()` para padre-hijo
- EventBusService para hermanos
- StateService para estado compartido
- Observables para flujos de datos

---

## FASE 3: Formularios Reactivos

### Formularios Implementados

**LoginForm**
- Validadores síncronos (required, email, minLength)
- Manejo de errores con mensajes personalizados

**RegisterForm**
- Validadores síncronos + asíncronos (username único)
- Validador custom: passwords coinciden
- Barra de fortaleza de contraseña

**EditProfileForm**
- FormArray para teléfonos dinámicos
- ViewChild para manipulación DOM (avatar preview)
- Validación asíncrona de username

### Validadores Personalizados

**Síncronos:**
- `passwordsMatch`: Compara password y confirmPassword
- `strongPassword`: Mínimo 8 caracteres, mayúscula, número
- `validPhoneNumber`: Formato de teléfono español

**Asíncronos:**
- `usernameAvailable`: Verifica disponibilidad en backend
- `emailNotRegistered`: Comprueba email no existe

### FormArray
```typescript
// Añadir teléfono
addTelefono(): void {
  this.telefonos.push(this.fb.control('', [Validators.pattern(/^\d{9}$/)]));
}

// Eliminar teléfono
removeTelefono(index: number): void {
  this.telefonos.removeAt(index);
}
```

---

## FASE 4: Enrutamiento y Guards

### Configuración de Rutas

```typescript
// Rutas públicas
{ path: '', component: Home }
{ path: 'search', component: Search }
{ path: 'games/:id', component: GameDetail }

// Rutas protegidas (requieren login)
{ path: 'profile', component: Profile, canActivate: [authGuard] }
{ path: 'settings', component: Settings, canActivate: [authGuard] }

// Lazy loading
{ path: 'style-guide', loadComponent: () => import('./pages/style-guide/style-guide') }
```

### Guards Implementados

**authGuard (Functional)**
- Verifica usuario autenticado
- Redirige a home si no hay sesión
- Guarda URL intentada para redirección post-login

**canDeactivateGuard**
- Previene navegación con cambios sin guardar
- Confirmación con dialog nativo
- Implementado en EditProfileForm

### Navegación Programática

```typescript
// Router
router.navigate(['/games', gameId]);
router.navigateByUrl('/profile');

// RouterLink
<a [routerLink]="['/games', game.id]">Ver juego</a>

// NavigationService (con historial)
navigationService.navigateTo('/search', { queryParams: { q: 'zelda' } });
```

### Parámetros de Ruta

**Route params:** `games/:id`
```typescript
route.paramMap.subscribe(params => {
  const id = params.get('id');
});
```

**Query params:** `search?q=zelda&platform=switch`
```typescript
route.queryParamMap.subscribe(params => {
  const query = params.get('q');
});
```

### Resolvers

**DataResolver**
- Precarga datos antes de activar ruta
- Implementado en GameDetail
- Manejo de errores con redirección

---

## 📔 FASE 5: Comunicación HTTP

### HttpClient y Servicios

**HttpBaseService**
- Servicio base con operaciones CRUD genéricas
- Tipado con Generics: `get<T>()`, `post<T>()`
- Manejo centralizado de errores

**Servicios de Dominio:**
- **JuegosService:** CRUD de juegos
- **UsuariosService:** Gestión de usuarios
- **InteraccionesService:** Likes, comentarios, puntuaciones
- **CatalogoService:** Plataformas, géneros, desarrolladoras
- **AuthHttpService:** Login, registro, logout

### Operaciones HTTP

```typescript
// GET
getAll(): Observable<Juego[]>
getById(id: number): Observable<Juego>
getPaginated(page: number, size: number): Observable<PagedResponse<Juego>>

// POST
create(juego: JuegoCreate): Observable<Juego>

// PUT/PATCH
update(id: number, juego: JuegoUpdate): Observable<Juego>
partialUpdate(id: number, changes: Partial<Juego>): Observable<Juego>

// DELETE
delete(id: number): Observable<void>
```

### Interceptores HTTP

**authInterceptor**
- Añade token JWT a headers
- Refresca token expirado
- Maneja 401 Unauthorized

**errorInterceptor**
- Normaliza errores HTTP
- Muestra notificaciones según tipo de error
- Logging de errores

**loggingInterceptor**
- Log de requests/responses en desarrollo
- Tiempo de respuesta
- Headers y payloads

**loadingInterceptor**
- Muestra spinner automáticamente
- Gestión de múltiples requests concurrentes
- Excluye endpoints específicos

### Manejo de Errores

```typescript
// Error normalizado
interface NormalizedError {
  status: number;
  code: string;
  message: string;
  details?: string[];
}

// Retry con backoff exponencial
retryOnError(maxRetries: number = 3) {
  return retry({
    count: maxRetries,
    delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000)
  });
}
```

### Estados de UI

**Loading State:**
- Spinner global con LoadingService
- Spinners inline en componentes
- Skeleton screens

**Error State:**
- Alertas inline
- Notificaciones toast
- Empty state con retry

**Success Feedback:**
- Toast de confirmación
- Redirección automática
- Actualización optimista de UI

---

## 🎨 Arquitectura CSS

### Metodología
- **BEM:** Nomenclatura de clases
- **ITCSS:** Organización de archivos (Settings → Tools → Generic → Elements → Objects → Components)
- **Design Tokens:** Variables globales para consistencia

### Sistema de Temas
- Modo oscuro/claro
- CSS Custom Properties: `--bg-primary`, `--text-primary`, `--color-accent`
- Persistencia en localStorage

### Componentes UI (25 total)
- Botones (4 variantes, 3 tamaños)
- Formularios (Input, Textarea, Select)
- Cards (GameCover, GameCard, PlatformBadge)
- Navegación (SearchBox, Pagination, ThemeToggle)
- Feedback (Alert, Notification, Spinner, Tooltip)
- Interactivos (Tabs, Accordion)

### Style Guide
- Catálogo visual de componentes: `/style-guide`
- Organizado en 7 tabs
- Testing visual y documentación de referencia

---

## Tecnologías

- **Angular 19:** Standalone components, Signals
- **TypeScript:** Tipado estático
- **RxJS:** Programación reactiva
- **SCSS:** Preprocesador CSS
- **FontAwesome:** Iconografía
- **H2 Database:** Base de datos en memoria (backend)
- **Spring Boot:** Backend REST API

---

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/          # Header, Footer
│   │   │   └── shared/          # 25 componentes UI reutilizables
│   │   ├── pages/               # Home, Search, GameDetail, Profile, Settings, StyleGuide
│   │   ├── services/            # 12 servicios
│   │   ├── guards/              # authGuard, canDeactivateGuard
│   │   ├── resolvers/           # DataResolver
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── validators/          # Validadores personalizados
│   │   └── core/                # Interceptores, constantes
│   └── styles/
│       ├── 00-settings/         # Variables, tokens
│       ├── 01-tools/            # Mixins
│       ├── 02-generic/          # Reset CSS
│       └── main.scss            # Punto de entrada
├── public/
│   └── assets/
│       └── img/                 # Imágenes estáticas
└── docs/
    ├── README_CLIENTE.md        # Documentación completa
    ├── README_RESUMIDO.md       # Esta documentación
    └── design/
        └── DOCUMENTACION.md     # Sistema de diseño
```

---

## 🔗 Enlaces Útiles

- [Documentación Completa](./README_CLIENTE.md)
- [Documentación de Diseño](./design/DOCUMENTACION.md)
- [Angular Docs](https://angular.dev)
- [RxJS Docs](https://rxjs.dev)
