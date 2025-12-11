# Frontend - Looking4Rate

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.9.

## 🚀 Inicio Rápido

### Servidor de desarrollo

```bash
ng serve
```

Una vez que el servidor esté corriendo, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente.

### Compilación

```bash
ng build
```

Los artefactos de compilación se almacenarán en el directorio `dist/`.

---

<br><br>

# ═══════════════════════════════════════════════════════════════════════════════
# 📘 FASE 1: ARQUITECTURA DE EVENTOS DEL CLIENTE
# ═══════════════════════════════════════════════════════════════════════════════

> **Objetivo:** Manipulación del DOM, sistema de eventos y componentes interactivos.

---

## 📐 Arquitectura de Eventos del Cliente

### 🔧 Manipulación del DOM

#### ViewChild y ElementRef

Los componentes utilizan `ViewChild` y `ElementRef` para acceder y manipular elementos del DOM de forma programática:

```typescript
// Ejemplo en ThemeToggle
@ViewChild('toggleButton', { static: false }) toggleButton!: ElementRef<HTMLButtonElement>;

// Ejemplo en LoginForm
@ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;

// Ejemplo en Header
@ViewChild('mobileMenu') mobileMenu!: ElementRef<HTMLElement>;
@ViewChild('hamburgerBtn') hamburgerBtn!: ElementRef<HTMLButtonElement>;
```

#### Modificación de propiedades y estilos

```typescript
// Modificar atributos ARIA dinámicamente
private updateMenuAccessibility(): void {
  if (this.hamburgerBtn?.nativeElement) {
    const btn = this.hamburgerBtn.nativeElement;
    btn.setAttribute('aria-expanded', String(this.isMenuOpen));
  }
}

// Modificar estilos programáticamente
private animatePanelContent(itemId: string, isExpanding: boolean): void {
  const panel = this.accordionContainer.nativeElement.querySelector(`#accordion-panel-${itemId}`);
  panel.style.maxHeight = isExpanding ? `${content.scrollHeight}px` : '0';
}
```

#### Crear y eliminar elementos del DOM

```typescript
// Crear meta tag para theme-color en dispositivos móviles
private updateMetaThemeColor(theme: 'dark' | 'light'): void {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  
  if (!metaThemeColor) {
    // Crear el elemento si no existe
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = theme === 'dark' ? '#0D0E11' : '#2A2F2F';
    document.head.appendChild(meta);
  }
}
```

---

### 🎯 Sistema de Eventos

#### Event Binding en Componentes

Los componentes utilizan diferentes tipos de event binding según su función:

| Componente | Evento | Handler | Descripción |
|------------|--------|---------|-------------|
| ThemeToggle | `(click)` | `toggleTheme($event)` | Cambia entre tema claro/oscuro |
| ThemeToggle | `(keydown)` | `onKeyDown($event)` | Soporte teclado (Enter, Space) |
| Header | `(click)` | `toggleMenu($event)` | Abre/cierra menú hamburguesa |
| LoginForm | `(ngSubmit)` | `onSubmit($event)` | Envía formulario |
| LoginForm | `(click)` | `onOverlayClick($event)` | Cierra modal al click fuera |
| Accordion | `(click)` | `togglePanel(item, $event)` | Expande/colapsa sección |
| Tabs | `(keydown)` | `onKeyDown($event, tab)` | Navegación con flechas |
| Tooltip | `(mouseenter)` | `onMouseEnter()` | Muestra tooltip |
| Tooltip | `(mouseleave)` | `onMouseLeave()` | Oculta tooltip |

#### Eventos de Teclado

```typescript
// Manejo de eventos de teclado en componentes
@HostListener('document:keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && this.isOpen) {
    event.preventDefault();
    event.stopPropagation();
    this.closeModal();
  }
}
```

**Teclas soportadas:**
- `Escape`: Cierra modales y menús
- `Enter` / `Space`: Activa botones y toggles
- `Tab` / `Shift+Tab`: Navegación con foco atrapado en modales
- `ArrowUp` / `ArrowDown`: Navegación en acordeones
- `ArrowLeft` / `ArrowRight`: Navegación en tabs
- `Home` / `End`: Ir al primer/último elemento

#### Eventos de Mouse y Focus

```typescript
// Eventos de focus para validación de formularios
(inputBlur)="onUsernameBlur()"
(inputBlur)="onPasswordBlur()"

// Eventos de hover para tooltips
(mouseenter)="onMouseEnter()"
(mouseleave)="onMouseLeave()"
(focusin)="onFocus()"
(focusout)="onBlur()"
```

#### Prevención de comportamientos por defecto

```typescript
// Prevenir envío de formulario
onSubmit(event?: Event): void {
  if (event) {
    event.preventDefault();
  }
  // ... lógica de envío
}

// Prevenir scroll al usar Space en botones
onKeyDown(event: KeyboardEvent): void {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    this.toggleTheme();
  }
}
```

#### Propagación y detención de eventos

```typescript
// Detener propagación para evitar cierre inmediato del menú
toggleMenu(event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  this.isMenuOpen = !this.isMenuOpen;
}

// Click en modal no propaga al overlay
onModalClick(event: MouseEvent): void {
  event.stopPropagation();
}
```

---

### 📊 Diagrama de Flujo de Eventos Principales

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE EVENTOS - THEME TOGGLE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │  Usuario │────▶│ Click/Enter │────▶│ toggleTheme()│────▶│ Actualizar  │ │
│  │          │     │    Event    │     │              │     │  isDarkMode │ │
│  └──────────┘     └─────────────┘     └──────────────┘     └──────┬──────┘ │
│                                                                    │        │
│                   ┌───────────────────────────────────────────────┘        │
│                   │                                                         │
│                   ▼                                                         │
│  ┌────────────────────────┐     ┌──────────────────┐     ┌───────────────┐ │
│  │ applyTheme(dark/light) │────▶│ document.docEl   │────▶│ localStorage  │ │
│  │                        │     │ setAttribute()   │     │ setItem()     │ │
│  └────────────────────────┘     └──────────────────┘     └───────────────┘ │
│                                                                             │
│                   ┌─────────────────────────────────────────────────────┐   │
│                   │              DETECCIÓN INICIAL                      │   │
│                   ├─────────────────────────────────────────────────────┤   │
│                   │  1. Verificar localStorage                          │   │
│                   │  2. Si no existe → detectar prefers-color-scheme    │   │
│                   │  3. Aplicar tema y guardar preferencia              │   │
│                   │  4. Configurar listener para cambios del sistema    │   │
│                   └─────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE EVENTOS - MODAL                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐     ┌────────────┐     ┌────────────────┐                    │
│  │  Abrir   │────▶│ isOpen=true│────▶│ setInitialFocus│                    │
│  │  Modal   │     │            │     │ (primer input) │                    │
│  └──────────┘     └────────────┘     └────────────────┘                    │
│                                                                             │
│                         │                                                   │
│                         ▼                                                   │
│       ┌─────────────────────────────────────────┐                          │
│       │           EVENTOS DE CIERRE             │                          │
│       ├─────────────────────────────────────────┤                          │
│       │  • ESC key     → closeModal()           │                          │
│       │  • Click overlay → closeModal()         │                          │
│       │  • Click botón X → closeModal()         │                          │
│       │  • Submit exitoso → closeModal()        │                          │
│       └─────────────────────────────────────────┘                          │
│                         │                                                   │
│                         ▼                                                   │
│       ┌─────────────────────────────────────────┐                          │
│       │         RESTAURAR ESTADO                │                          │
│       ├─────────────────────────────────────────┤                          │
│       │  • resetForm()                          │                          │
│       │  • Restaurar foco a elemento anterior   │                          │
│       │  • isOpen = false                       │                          │
│       └─────────────────────────────────────────┘                          │
│                                                                             │
│                   ┌─────────────────────────────────────────────────────┐   │
│                   │              TRAP FOCUS (TAB)                       │   │
│                   ├─────────────────────────────────────────────────────┤   │
│                   │  Tab en último elemento → primer elemento           │   │
│                   │  Shift+Tab en primer elemento → último elemento     │   │
│                   └─────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                     FLUJO DE EVENTOS - MENÚ HAMBURGUESA                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         ABRIR MENÚ                                   │  │
│  │  Click hamburguesa ──▶ toggleMenu() ──▶ isMenuOpen=true              │  │
│  │                                     ──▶ updateMenuAccessibility()    │  │
│  │                                     ──▶ trapFocusInMenu()            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        CERRAR MENÚ                                   │  │
│  │  • ESC key (document:keydown)                                        │  │
│  │  • Click fuera del menú (document:click)                             │  │
│  │  • Click en overlay                                                  │  │
│  │  • Scroll de página (window:scroll)                                  │  │
│  │  • Selección de opción del menú                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       ANIMACIÓN CSS                                  │  │
│  │  transform: translateX(100%) ←──→ transform: translateX(0)           │  │
│  │  visibility: hidden ←──→ visibility: visible                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 🎨 Componentes Interactivos

#### Menú Hamburguesa
- **Archivo:** `components/layout/header/`
- **Funcionalidades:**
  - Abrir/cerrar con animación (translateX)
  - Cierre con ESC
  - Cierre al click fuera
  - Cierre al hacer scroll
  - Atributos ARIA dinámicos

#### Modales (Login/Register)
- **Archivos:** `components/shared/login-form/`, `components/shared/register-form/`
- **Funcionalidades:**
  - Abrir/cerrar con animación fade
  - Cierre con ESC
  - Cierre al click en overlay
  - Focus trap (Tab atrapado dentro del modal)
  - Auto-focus en primer campo
  - Restauración de foco al cerrar

#### Acordeón
- **Archivo:** `components/shared/accordion/`
- **Funcionalidades:**
  - Expandir/colapsar secciones con animación de altura
  - Modo exclusivo (solo un panel abierto)
  - Navegación con teclado (flechas, Home, End)
  - Soporte para paneles deshabilitados
  - Eventos de cambio de estado

#### Tabs
- **Archivo:** `components/shared/tabs/`
- **Funcionalidades:**
  - Cambiar entre pestañas con animación fade
  - Navegación con teclado (flechas)
  - Orientación horizontal/vertical
  - Pestañas deshabilitadas
  - Auto-activación al recibir foco

#### Tooltips
- **Archivo:** `components/shared/tooltip/`
- **Funcionalidades:**
  - Mostrar al hover y focus
  - Ocultar con ESC
  - Posicionamiento automático (top, bottom, left, right)
  - Delay configurable
  - Reposicionamiento si no hay espacio

#### Theme Switcher
- **Archivo:** `components/shared/theme-toggle/`
- **Funcionalidades:**
  - Detección de preferencia del sistema (prefers-color-scheme)
  - Toggle entre temas claro/oscuro
  - Persistencia en localStorage
  - Aplicación del tema al cargar
  - Listener para cambios en preferencia del sistema
  - Actualización de meta theme-color

---

### 🌐 Tabla de Compatibilidad de Navegadores

| Evento/API | Chrome | Firefox | Safari | Edge | IE11 |
|------------|--------|---------|--------|------|------|
| `click` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `keydown` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `keyup` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mouseenter` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mouseleave` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `focus` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `blur` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `focusin` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `focusout` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `scroll` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `input` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `change` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `submit` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `localStorage` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `matchMedia` | ✅ | ✅ | ✅ | ✅ | ⚠️ Parcial |
| `prefers-color-scheme` | ✅ 76+ | ✅ 67+ | ✅ 12.1+ | ✅ 79+ | ❌ |
| `Element.closest()` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `Event.stopPropagation()` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `Event.preventDefault()` | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS `@keyframes` | ✅ | ✅ | ✅ | ✅ | ✅ 10+ |
| CSS `transform` | ✅ | ✅ | ✅ | ✅ | ✅ 10+ |
| CSS `transition` | ✅ | ✅ | ✅ | ✅ | ✅ 10+ |
| `aria-*` attributes | ✅ | ✅ | ✅ | ✅ | ✅ |

**Notas:**
- ⚠️ **matchMedia en IE11**: Funciona pero no soporta `addListener` con callback functions modernas.
- ❌ **prefers-color-scheme en IE11**: No soportado, se usa el tema oscuro por defecto.
- ❌ **Element.closest() en IE11**: Requiere polyfill si se necesita soporte.

---

### 🛠️ APIs y Métodos del DOM Utilizados

```typescript
// Selección de elementos
document.documentElement                    // Elemento <html>
document.querySelector()                    // Selector CSS
element.querySelectorAll()                  // Múltiples elementos
element.closest()                           // Ancestro más cercano

// Manipulación de atributos
element.setAttribute()                      // Establecer atributo
element.getAttribute()                      // Obtener atributo
element.removeAttribute()                   // Eliminar atributo
element.classList.add/remove/toggle()       // Clases CSS

// Manipulación de estilos
element.style.property = value              // Estilos inline
getComputedStyle(element)                   // Estilos computados

// Eventos
element.addEventListener()                  // Agregar listener
element.removeEventListener()               // Quitar listener
event.preventDefault()                      // Prevenir default
event.stopPropagation()                     // Detener propagación

// Focus
element.focus()                             // Dar foco
document.activeElement                      // Elemento con foco actual

// Medidas
element.getBoundingClientRect()             // Posición y tamaño
element.scrollHeight                        // Altura del contenido
window.innerWidth / innerHeight             // Viewport

// Storage
localStorage.getItem()                      // Leer
localStorage.setItem()                      // Escribir

// Media Queries
window.matchMedia()                         // Consulta de medios
mediaQueryList.addEventListener('change')   // Cambios de media query

// Creación de elementos
document.createElement()                    // Crear elemento
element.appendChild()                       // Agregar hijo
```

---

### 📚 Estructura de Componentes Interactivos

```
src/app/components/
├── layout/
│   ├── header/                    # Menú hamburguesa + navegación
│   │   ├── header.ts              # Lógica con ViewChild, HostListener
│   │   ├── header.html            # Template con event binding
│   │   └── header.scss            # Estilos y animaciones
│   ├── main/
│   └── footer/
│
└── shared/
    ├── theme-toggle/              # Switch de tema
    │   ├── theme-toggle.ts        # Lógica con localStorage, matchMedia
    │   ├── theme-toggle.html      # Template con role="switch"
    │   └── theme-toggle.scss      # Estilos del toggle
    │
    ├── login-form/                # Modal de login
    │   ├── login-form.ts          # Lógica con focus trap, ESC handler
    │   ├── login-form.html        # Template con role="dialog"
    │   └── login-form.scss        # Estilos del modal
    │
    ├── register-form/             # Modal de registro
    │   └── ...                    # Similar a login-form
    │
    ├── accordion/                 # Acordeón expandible
    │   ├── accordion.ts           # Lógica con animación de altura
    │   ├── accordion.html         # Template con aria-expanded
    │   └── accordion.scss         # Estilos y transiciones
    │
    ├── tabs/                      # Pestañas navegables
    │   ├── tabs.ts                # Lógica con navegación por teclado
    │   ├── tabs.html              # Template con role="tablist"
    │   └── tabs.scss              # Estilos y animaciones
    │
    └── tooltip/                   # Tooltips informativos
        ├── tooltip.ts             # Lógica de posicionamiento
        ├── tooltip.html           # Template con role="tooltip"
        └── tooltip.scss           # Estilos y animaciones
```

---

<br><br>

# ═══════════════════════════════════════════════════════════════════════════════
# 📗 FASE 2: ARQUITECTURA DE SERVICIOS Y COMUNICACIÓN
# ═══════════════════════════════════════════════════════════════════════════════

> **Objetivo:** Servicios de comunicación entre componentes, gestión de estado global, sistema de notificaciones y gestión de estados de carga.

---

## 🔄 Arquitectura de Servicios

### 📡 EventBusService - Comunicación entre Componentes

Servicio centralizado para comunicación entre componentes hermanos y no relacionados directamente en el árbol de componentes, implementando el patrón **Publish/Subscribe** con RxJS Subject.

#### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EVENTBUS SERVICE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐        ┌──────────────┐        ┌─────────────┐            │
│   │ Componente A│───────▶│              │───────▶│ Componente B│            │
│   │  (Emisor)   │ emit() │   Subject    │  on()  │ (Suscriptor)│            │
│   └─────────────┘        │              │        └─────────────┘            │
│                          │              │                                    │
│   ┌─────────────┐        │   BusEvent   │        ┌─────────────┐            │
│   │ Componente C│───────▶│   {type,     │───────▶│ Componente D│            │
│   │  (Emisor)   │        │    payload,  │        │ (Suscriptor)│            │
│   └─────────────┘        │    timestamp}│        └─────────────┘            │
│                          └──────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Uso del Servicio

```typescript
// Importar el servicio
import { EventBusService } from './services';

// Emitir un evento
eventBus.emit('auth:login', { userId: '123', username: 'user' });

// Suscribirse a un evento específico
eventBus.on<UserData>('auth:login').subscribe(payload => {
  console.log('Usuario logueado:', payload);
});

// Suscribirse a múltiples eventos
eventBus.onMany(['auth:login', 'auth:logout']).subscribe(event => {
  console.log('Evento de auth:', event);
});

// Suscribirse a una categoría de eventos
eventBus.onCategory('auth').subscribe(event => {
  console.log('Cualquier evento de auth:', event);
});
```

#### Tipos de Eventos Predefinidos

| Categoría | Evento | Descripción |
|-----------|--------|-------------|
| `auth` | `auth:login` | Usuario inició sesión |
| `auth` | `auth:logout` | Usuario cerró sesión |
| `auth` | `auth:sessionExpired` | Sesión expirada |
| `theme` | `theme:changed` | Cambio de tema |
| `modal` | `modal:open` | Modal abierto |
| `modal` | `modal:close` | Modal cerrado |
| `search` | `search:query` | Búsqueda realizada |
| `game` | `game:selected` | Juego seleccionado |
| `game` | `game:rated` | Juego valorado |

---

### 💾 StateService - Estado Global

Servicio de estado global usando el patrón **BehaviorSubject** para almacenar datos compartidos entre componentes con persistencia en localStorage.

#### Diagrama de Estado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STATE SERVICE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         AppState                                     │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │                                                                      │   │
│   │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────┐  │   │
│   │  │    AuthState    │    │  UIPreferences  │    │   Metadata     │  │   │
│   │  ├─────────────────┤    ├─────────────────┤    ├────────────────┤  │   │
│   │  │ isAuthenticated │    │ theme           │    │ isOnline       │  │   │
│   │  │ user            │    │ language        │    │ lastSync       │  │   │
│   │  │ token           │    │ sidebarCollapsed│    │                │  │   │
│   │  │ expiresAt       │    │ notifications   │    │                │  │   │
│   │  └─────────────────┘    └─────────────────┘    └────────────────┘  │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────┐   │
│   │ BehaviorSubject │───▶│   Selectores     │───▶│     Componentes      │   │
│   │   state$        │    │ select(s=>s.ui)  │    │   isAuth$, theme$    │   │
│   └─────────────────┘    └──────────────────┘    └──────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PERSISTENCIA                                    │   │
│   │                                                                      │   │
│   │   localStorage.setItem('l4r-auth-state', ...)                       │   │
│   │   localStorage.setItem('l4r-ui-preferences', ...)                   │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Uso del Servicio

```typescript
// Importar el servicio
import { StateService } from './services';

// Obtener estado completo (observable)
stateService.state$.subscribe(state => console.log(state));

// Selectores específicos
stateService.isAuthenticated$.subscribe(isAuth => {
  console.log('Autenticado:', isAuth);
});

stateService.theme$.subscribe(theme => {
  console.log('Tema actual:', theme);
});

// Actualizar autenticación
stateService.setUser(
  { id: '1', username: 'user', email: 'user@example.com', role: 'user' },
  'jwt-token',
  3600 // expira en 1 hora
);

// Cerrar sesión
stateService.logout();

// Cambiar tema
stateService.setTheme('dark');

// Actualizar preferencias de UI
stateService.updateUIPreferences({
  sidebarCollapsed: true,
  notificationsEnabled: false
});
```

---

### ⏳ LoadingService - Estados de Carga

Servicio centralizado para gestionar estados de carga, soportando un spinner global y estados de carga locales por componente.

#### Diagrama de Funcionamiento

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LOADING SERVICE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    GlobalLoadingState                                 │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  isLoading: boolean        │ message: string                         │   │
│  │  count: number             │ activeLoaders: LoadingState[]           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   CARGA GLOBAL                           CARGA LOCAL                         │
│  ┌─────────────────────┐               ┌─────────────────────────────────┐  │
│  │ showGlobal()        │               │ show('btn-submit', 'Enviando')  │  │
│  │     │               │               │     │                           │  │
│  │     ▼               │               │     ▼                           │  │
│  │ ┌───────────┐       │               │ ┌─────────────────────────────┐ │  │
│  │ │ Spinner   │       │               │ │ isLoading$('btn-submit')    │ │  │
│  │ │ Overlay   │       │               │ │     │                       │ │  │
│  │ └───────────┘       │               │ │     ▼                       │ │  │
│  │     │               │               │ │ [disabled]="loading"        │ │  │
│  │     ▼               │               │ │ Spinner inline              │ │  │
│  │ hideGlobal()        │               │ └─────────────────────────────┘ │  │
│  └─────────────────────┘               │     │                           │  │
│                                        │     ▼                           │  │
│                                        │ hide('btn-submit')              │  │
│                                        └─────────────────────────────────┘  │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    WRAPPER ASYNC                                     │   │
│   │                                                                      │   │
│   │  await loadingService.withLoading('operation', async () => {        │   │
│   │    return await someAsyncOperation();                               │   │
│   │  });                                                                │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Uso del Servicio

```typescript
// Importar el servicio
import { LoadingService } from './services';

// Carga global simple
loadingService.showGlobal('Cargando datos...');
await fetchData();
loadingService.hideGlobal();

// Carga global con timeout automático (evita spinners eternos)
loadingService.showGlobal('Procesando...', 30000); // máx 30 segundos

// Carga local en un componente
loadingService.show('submit-button', 'Enviando...');
await submitForm();
loadingService.hide('submit-button');

// Verificar estado de carga local
loadingService.isLoading$('submit-button').subscribe(loading => {
  this.submitDisabled = loading;
});

// Wrapper async (maneja automáticamente show/hide)
const result = await loadingService.withLoading('my-operation', async () => {
  return await someAsyncOperation();
}, 'Procesando...');

// Con progreso
loadingService.showWithProgress('upload', 'Subiendo archivo...');
loadingService.updateProgress('upload', 25);
loadingService.updateProgress('upload', 50);
loadingService.updateProgress('upload', 100);
loadingService.hide('upload');
```

---

### 🔔 NotificationService - Sistema de Notificaciones

Sistema de notificaciones/toasts con soporte para diferentes tipos, posiciones y auto-dismiss.

#### Tipos de Notificación

| Tipo | Uso | Icono | Color |
|------|-----|-------|-------|
| `success` | Operaciones exitosas | ✓ | Verde |
| `error` | Errores y fallos | ✗ | Rojo |
| `warning` | Advertencias | ⚠ | Naranja |
| `info` | Información general | ℹ | Azul |

#### Posiciones Disponibles

```
┌─────────────────────────────────────────────────────────────┐
│  top-left          top-center            top-right         │
│     ┌───┐                                    ┌───┐         │
│     └───┘                                    └───┘         │
│                                                             │
│                       VIEWPORT                              │
│                                                             │
│     ┌───┐                                    ┌───┐         │
│     └───┘                                    └───┘         │
│  bottom-left     bottom-center         bottom-right        │
└─────────────────────────────────────────────────────────────┘
```

#### Uso del Servicio

```typescript
// Importar el servicio
import { NotificationService } from './services';

// Métodos de conveniencia
notificationService.success('Guardado correctamente');
notificationService.error('Error al guardar');
notificationService.warning('Conexión inestable');
notificationService.info('Nueva versión disponible');

// Configuración completa
notificationService.show({
  type: 'success',
  title: 'Operación exitosa',
  message: 'Los datos se guardaron correctamente',
  position: 'top-right',
  duration: 5000,      // Auto-dismiss en 5 segundos
  dismissible: true    // Mostrar botón de cerrar
});

// Cerrar notificación manualmente
notificationService.close();

// Pausar auto-dismiss (para hover)
notificationService.pauseAutoClose();
notificationService.resumeAutoClose();
```

---

### 🎨 SpinnerComponent - Componente Visual

Componente de spinner global que se suscribe automáticamente al LoadingService.

#### Características

- ✅ Animaciones CSS puras para rendimiento óptimo
- ✅ Overlay con blur de fondo
- ✅ Mensaje personalizable
- ✅ Barra de progreso opcional
- ✅ Bloquea scroll del body
- ✅ Accesible con `role="alert"` y `aria-busy`
- ✅ Soporte para `prefers-reduced-motion`

#### Integración

```html
<!-- En app.html (al final del template) -->
<app-spinner></app-spinner>
```

```typescript
// En app.ts
import { SpinnerComponent } from './components/shared/spinner/spinner';

@Component({
  imports: [..., SpinnerComponent],
  // ...
})
export class App {}
```

---

### 📁 Estructura de Servicios

```
src/app/
├── services/
│   ├── index.ts                  # Exportaciones centralizadas
│   ├── event-bus.service.ts      # Comunicación entre componentes
│   ├── state.service.ts          # Estado global de la aplicación
│   ├── loading.service.ts        # Estados de carga
│   └── notification.service.ts   # Servicio de notificaciones
│
└── components/shared/
    ├── notification/
    │   ├── notification.ts       # Componente visual
    │   ├── notification.html
    │   └── notification.scss
    │
    └── spinner/
        ├── spinner.ts            # Componente spinner global
        ├── spinner.html
        └── spinner.scss
```

---

### 🔀 Flujo de Datos entre Servicios

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FLUJO DE DATOS - EJEMPLO LOGIN                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Usuario                                                                     │
│     │                                                                        │
│     ▼                                                                        │
│  LoginForm                                                                   │
│     │ onSubmit()                                                             │
│     │                                                                        │
│     ├──────▶ LoadingService.showGlobal('Iniciando sesión...')               │
│     │                                                                        │
│     │        ┌────────────┐                                                  │
│     │        │  Spinner   │ ◀──── globalLoading$.subscribe()                │
│     │        │  Visible   │                                                  │
│     │        └────────────┘                                                  │
│     │                                                                        │
│     ├──────▶ API Call (async)                                               │
│     │                                                                        │
│     │        [Respuesta exitosa]                                             │
│     │                                                                        │
│     ├──────▶ StateService.setUser(user, token)                              │
│     │             │                                                          │
│     │             ▼                                                          │
│     │        ┌────────────────────────┐                                      │
│     │        │ localStorage.setItem() │                                      │
│     │        │ 'l4r-auth-state'       │                                      │
│     │        └────────────────────────┘                                      │
│     │                                                                        │
│     ├──────▶ EventBusService.emit('auth:login', { user })                   │
│     │             │                                                          │
│     │             ▼                                                          │
│     │        ┌────────────────────────┐                                      │
│     │        │ Header, ProfileMenu... │ ◀── on('auth:login').subscribe()    │
│     │        │ actualizan su estado   │                                      │
│     │        └────────────────────────┘                                      │
│     │                                                                        │
│     ├──────▶ NotificationService.success('Bienvenido!')                     │
│     │             │                                                          │
│     │             ▼                                                          │
│     │        ┌────────────────────────┐                                      │
│     │        │  Toast notification    │                                      │
│     │        │  Auto-dismiss 5s       │                                      │
│     │        └────────────────────────┘                                      │
│     │                                                                        │
│     └──────▶ LoadingService.hideGlobal()                                    │
│                                                                              │
│              ┌────────────┐                                                  │
│              │  Spinner   │ ──── Oculto                                     │
│              │  Hidden    │                                                  │
│              └────────────┘                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

<br><br>

# ═══════════════════════════════════════════════════════════════════════════════
# 📚 RECURSOS Y TESTING
# ═══════════════════════════════════════════════════════════════════════════════

## ⚡ Optimizaciones de Rendimiento

### ChangeDetectionStrategy.OnPush

Los siguientes componentes utilizan `OnPush` para mejor rendimiento:

| Componente | Archivo |
|------------|---------|
| Accordion | `components/shared/accordion/accordion.ts` |
| Tabs | `components/shared/tabs/tabs.ts` |
| Tooltip | `components/shared/tooltip/tooltip.ts` |
| Notification | `components/shared/notification/notification.ts` |
| Spinner | `components/shared/spinner/spinner.ts` |
| SearchBox | `components/shared/search-box/search-box.ts` |

### Otras Optimizaciones

- **Debounce en SearchBox**: Búsqueda con debounce configurable (300ms por defecto)
- **TrackBy functions**: En loops `@for` para optimizar re-rendering
- **Lazy Loading**: Componentes de páginas cargados bajo demanda
- **Bordes con gradiente**: Usando `mask-composite` en lugar de múltiples elementos

## 🧪 Ejecutar Tests

```bash
ng test
```

## 📖 Recursos Adicionales

### Fase 1 - DOM y Eventos
- [MDN Web Docs - DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Angular CLI Overview](https://angular.dev/tools/cli)

### Fase 2 - Servicios y RxJS
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Services](https://angular.dev/guide/di/creating-injectable-service)
- [Angular Dependency Injection](https://angular.dev/guide/di)
