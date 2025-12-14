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
# � FASE 3: FORMULARIOS REACTIVOS BÁSICOS
# ═══════════════════════════════════════════════════════════════════════════════

> **Objetivo:** Implementación de formularios reactivos con validadores personalizados, validación asíncrona, FormArray y manipulación del DOM con ViewChild/ElementRef.

---

## 📋 Formularios Reactivos Implementados

La aplicación cuenta con **3 formularios reactivos completos**:

| Formulario | Archivo | Características |
|------------|---------|----------------|
| **LoginForm** | `components/shared/login-form/` | FormBuilder, validadores síncronos |
| **RegisterForm** | `components/shared/register-form/` | FormBuilder, validadores síncronos + asíncronos, barra de fortaleza de contraseña |
| **EditProfileForm** | `components/shared/edit-profile-form/` | FormBuilder, FormArray (teléfonos), ViewChild/ElementRef, validadores síncronos + asíncronos |

### Estructura de un Formulario Reactivo

```typescript
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, Button, FormInput],
  // ...
})
export class LoginForm implements OnInit {
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  
  ngOnInit(): void {
    // Construcción del formulario con FormBuilder
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      // Procesar datos...
    }
  }
}
```

---

## 🔐 Catálogo de Validadores Personalizados

### Validadores Síncronos (13 implementados)

Todos los validadores síncronos están centralizados en `src/app/components/shared/validators/custom.validators.ts`

#### 1. `strongPassword()`

Valida que la contraseña cumpla con requisitos de seguridad estrictos.

```typescript
password: ['', [
  Validators.required,
  Validators.minLength(8),
  CustomValidators.strongPassword()
]]
```

**Requisitos:**
- ✅ Mínimo 8 caracteres
- ✅ Al menos una mayúscula
- ✅ Al menos una minúscula
- ✅ Al menos un número
- ✅ Al menos un símbolo (cualquier carácter especial)

**Error devuelto:**
```typescript
{
  strongPassword: {
    minLength: boolean,
    uppercase: boolean,
    lowercase: boolean,
    number: boolean,
    special: boolean
  }
}
```

**Ejemplo de uso en template:**
```html
@if (passwordControl.hasError('strongPassword')) {
  <span class="error">
    @if (passwordControl.errors.strongPassword.minLength) {
      Mínimo 8 caracteres
    }
    @if (passwordControl.errors.strongPassword.uppercase) {
      Debe incluir mayúsculas
    }
    <!-- ... más errores -->
  </span>
}
```

---

#### 2. `username()`

Valida formato de nombre de usuario (letras, números, guiones y guiones bajos).

```typescript
username: ['', [
  Validators.required,
  CustomValidators.username()
]]
```

**Formato permitido:** `^[a-zA-Z0-9_-]+$`

**Error devuelto:** `{ invalidUsername: true }`

---

#### 3. `nif()`

Valida NIF/DNI español con letra de control.

```typescript
nif: ['', [CustomValidators.nif()]]
```

**Formato:** 8 dígitos + letra (ej: `12345678A`)

**Error devuelto:** `{ invalidNIF: true }`

---

#### 4. `spanishPhone()`

Valida número de teléfono español.

```typescript
phone: ['', [
  Validators.required,
  CustomValidators.spanishPhone()
]]
```

**Formatos permitidos:**
- `612345678` (9 dígitos)
- `+34 612345678`
- `+34612345678`

**Error devuelto:** `{ invalidPhone: true }`

---

#### 5. `spanishPostalCode()`

Valida código postal español.

```typescript
postalCode: ['', [CustomValidators.spanishPostalCode()]]
```

**Formato:** 5 dígitos (ej: `28001`)

**Error devuelto:** `{ invalidPostalCode: true }`

---

#### 6. `url()`

Valida URL con formato completo.

```typescript
website: ['', [CustomValidators.url()]]
```

**Formatos permitidos:**
- `https://example.com`
- `http://example.com`
- `https://subdomain.example.com/path`

**Error devuelto:** `{ invalidUrl: true }`

---

#### 7. `range(min, max)`

Valida que un número esté dentro de un rango.

```typescript
age: ['', [CustomValidators.range(18, 120)]]
```

**Error devuelto:** `{ range: { min: 18, max: 120, actual: value } }`

---

#### 8. `minAge(age)`

Valida edad mínima basada en fecha de nacimiento.

```typescript
birthDate: ['', [CustomValidators.minAge(18)]]
```

**Error devuelto:** `{ minAge: { required: 18, actual: calculatedAge } }`

---

#### 9. `passwordMatch(passwordField, confirmField)`

Valida que dos campos de contraseña coincidan (validador a nivel de FormGroup).

```typescript
this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, {
  validators: [CustomValidators.passwordMatch('password', 'confirmPassword')]
})
```

**Error devuelto:** `{ passwordMismatch: true }` (en el FormGroup)

---

#### 10-13. Otros validadores

```typescript
// Validar longitud mínima de array
phones: this.fb.array([], [CustomValidators.minArrayLength(1)])

// Validar longitud máxima de array
phones: this.fb.array([], [CustomValidators.maxArrayLength(5)])

// Complejidad de contraseña configurable
password: ['', [CustomValidators.passwordComplexity({
  minLength: 10,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true
})]]
```

---

## 🔄 Validadores Asíncronos (2 implementados)

Los validadores asíncronos simulan llamadas a API y están en `src/app/components/shared/validators/async.validators.ts`

### 1. `uniqueEmail(validationService, debounceMs)`

Verifica que un email no esté registrado.

```typescript
email: ['', 
  [Validators.required, Validators.email],
  [AsyncValidators.uniqueEmail(this.validationService, 600)]
]
```

**Características:**
- ⏱️ Debounce de 600ms (configurable)
- 🔄 Usa RxJS `timer` + `switchMap`
- ❌ Emails de prueba que devuelven error: `test@test.com`, `admin@example.com`

**Error devuelto:** `{ emailNotUnique: true }`

**Flujo de validación:**
```
Usuario escribe → Espera 600ms → Sin más cambios → Llamada API → Respuesta
                     ↓
               Más cambios → Cancela validación anterior → Espera 600ms nuevamente
```

**Indicador visual:**
```typescript
get isEmailValidating(): boolean {
  return this.form.get('email')?.status === 'PENDING';
}
```

```html
@if (isEmailValidating) {
  <span class="validating">Verificando email...</span>
}
```

---

### 2. `availableUsername(validationService, debounceMs)`

Verifica disponibilidad de nombre de usuario.

```typescript
username: ['',
  [Validators.required, CustomValidators.username()],
  [AsyncValidators.availableUsername(this.validationService, 600)]
]
```

**Características:**
- ⏱️ Debounce de 600ms (configurable)
- 🔄 Usa RxJS `timer` + `switchMap`
- ❌ Usernames de prueba ocupados: `admin`, `test`, `user`

**Error devuelto:** `{ usernameNotAvailable: true }`

**Implementación del debounce:**
```typescript
static availableUsername(
  validationService: ValidationService,
  debounceMs: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    
    return timer(debounceMs).pipe(
      switchMap(() => validationService.checkUsernameAvailability(control.value)),
      map(response => response.available ? null : { usernameNotAvailable: true }),
      catchError(() => of(null))
    );
  };
}
```

---

## 📚 Guía de Uso de FormArray

### ¿Qué es FormArray?

`FormArray` es una estructura de Angular Reactive Forms que permite **gestionar colecciones dinámicas de controles** (añadir, eliminar, reordenar).

### Implementación Real: EditProfileForm

**Ubicación:** `src/app/components/shared/edit-profile-form/`

El formulario de edición de perfil implementa un FormArray para gestionar **teléfonos dinámicos**.

#### 1. Definición del FormArray

```typescript
export class EditProfileForm implements AfterViewInit {
  @ViewChild('phonesContainer') phonesContainer!: ElementRef<HTMLDivElement>;
  
  profileForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', 
        [Validators.required, CustomValidators.username()],
        [AsyncValidators.availableUsername(this.validationService, 600)]
      ],
      email: ['', 
        [Validators.required, Validators.email],
        [AsyncValidators.uniqueEmail(this.validationService, 600)]
      ],
      nif: ['', [CustomValidators.nif()]],
      phones: this.fb.array([]) // ← FormArray vacío inicialmente
    });
  }
}
```

#### 2. Getter para Acceso al FormArray

```typescript
get phones(): FormArray {
  return this.profileForm.get('phones') as FormArray;
}
```

#### 3. Añadir Elementos al FormArray

```typescript
addPhone(): void {
  // Crear un nuevo control con validadores
  const phoneControl = this.fb.control('', [
    Validators.required,
    CustomValidators.spanishPhone()
  ]);
  
  // Añadir al FormArray
  this.phones.push(phoneControl);
  
  // Scroll automático al nuevo elemento (ViewChild en acción)
  setTimeout(() => this.scrollToLastPhone(), 100);
}
```

#### 4. Eliminar Elementos del FormArray

```typescript
removePhone(index: number): void {
  this.phones.removeAt(index);
}
```

#### 5. Template del FormArray

```html
<fieldset class="edit-profile__section">
  <legend>Teléfonos de Contacto</legend>
  
  <!-- Contenedor con referencia para scroll automático -->
  <div #phonesContainer class="edit-profile__phones">
    
    <!-- Iteración sobre los controles del FormArray -->
    @for (phone of phones.controls; track $index) {
      <article class="edit-profile__phone-item">
        <div class="edit-profile__field">
          <label [for]="'phone-' + $index">
            Teléfono {{ $index + 1 }}
          </label>
          
          <!-- Binding del control individual -->
          <input
            [id]="'phone-' + $index"
            type="tel"
            [formControl]="$any(phone)"
            placeholder="+34 612345678"
          />
          
          <!-- Botón para eliminar -->
          <app-button
            type="button"
            variant="danger"
            size="sm"
            (btnClick)="removePhone($index)"
          >
            Eliminar
          </app-button>
        </div>
        
        <!-- Mostrar errores del control individual -->
        @if (hasPhoneError($index)) {
          <span class="error">{{ getPhoneErrorMessage($index) }}</span>
        }
      </article>
    }
    
    <!-- Mensaje cuando no hay elementos -->
    @if (phones.length === 0) {
      <p class="empty">No hay teléfonos añadidos</p>
    }
  </div>
  
  <!-- Botón para añadir nuevo teléfono -->
  <app-button
    type="button"
    variant="ghost"
    (btnClick)="addPhone()"
  >
    + Añadir Teléfono
  </app-button>
</fieldset>
```

#### 6. Validación de Elementos Individuales

```typescript
// Verificar si un teléfono específico tiene error
hasPhoneError(index: number): boolean {
  const control = this.phones.at(index);
  return !!(control && control.errors && control.touched);
}

// Obtener mensaje de error específico
getPhoneErrorMessage(index: number): string {
  const control = this.phones.at(index);
  
  if (!control || !control.errors || !control.touched) {
    return '';
  }

  const errors = control.errors;

  if (errors['required']) return 'El teléfono es obligatorio';
  if (errors['invalidPhone']) return 'Formato inválido (ej: +34 612345678)';

  return 'Error de validación';
}
```

#### 7. Cargar Datos Existentes

```typescript
loadProfile(data: ProfileData): void {
  // Limpiar FormArray existente
  while (this.phones.length) {
    this.phones.removeAt(0);
  }

  // Añadir controles con datos
  data.phones.forEach(phone => {
    this.phones.push(this.fb.control(phone, [
      Validators.required,
      CustomValidators.spanishPhone()
    ]));
  });

  // Cargar resto de datos del formulario
  this.profileForm.patchValue({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    nif: data.nif
  });
}
```

#### 8. Validación del FormArray Completo

```typescript
// Marcar todos los controles del FormArray como touched
private markAllAsTouched(): void {
  this.profileForm.markAllAsTouched();
  
  // Importante: también marcar controles del FormArray
  this.phones.controls.forEach(control => {
    control.markAsTouched();
  });
}

// Validar antes de enviar
onSubmit(): void {
  if (this.profileForm.valid) {
    const formValue = this.profileForm.value;
    this.formSubmit.emit({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      username: formValue.username,
      email: formValue.email,
      nif: formValue.nif,
      phones: formValue.phones // Array de teléfonos
    });
  } else {
    this.markAllAsTouched();
  }
}
```

### Otros Usos Comunes de FormArray

#### FormArray de FormGroups (Direcciones)

```typescript
// Definición
this.form = this.fb.group({
  addresses: this.fb.array([])
});

// Crear FormGroup para dirección
createAddressGroup(): FormGroup {
  return this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', [Validators.required, CustomValidators.spanishPostalCode()]],
    isDefault: [false]
  });
}

// Añadir dirección
addAddress(): void {
  const addresses = this.form.get('addresses') as FormArray;
  addresses.push(this.createAddressGroup());
}

// Template
@for (address of addresses.controls; track $index) {
  <div [formGroupName]="$index">
    <input formControlName="street" placeholder="Calle" />
    <input formControlName="city" placeholder="Ciudad" />
    <input formControlName="postalCode" placeholder="CP" />
    <label>
      <input type="checkbox" formControlName="isDefault" />
      Dirección predeterminada
    </label>
  </div>
}
```

---

## 🔍 ViewChild y ElementRef

EditProfileForm también demuestra el uso de `ViewChild` y `ElementRef` para manipulación del DOM.

### Focus Automático al Abrir Formulario

```typescript
export class EditProfileForm implements AfterViewInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;
  
  ngAfterViewInit(): void {
    this.focusFirstInput();
  }
  
  private focusFirstInput(): void {
    setTimeout(() => {
      if (this.firstNameInput?.nativeElement) {
        this.firstNameInput.nativeElement.focus();
      }
    }, 100);
  }
}
```

**Template:**
```html
<input
  #firstNameInput
  id="firstName"
  type="text"
  formControlName="firstName"
/>
```

### Scroll Automático al Añadir Elemento

```typescript
@ViewChild('phonesContainer') phonesContainer!: ElementRef<HTMLDivElement>;

addPhone(): void {
  const phoneControl = this.fb.control('', [
    Validators.required,
    CustomValidators.spanishPhone()
  ]);
  this.phones.push(phoneControl);
  
  // Scroll automático al nuevo elemento
  setTimeout(() => this.scrollToLastPhone(), 100);
}

private scrollToLastPhone(): void {
  if (this.phonesContainer?.nativeElement) {
    const container = this.phonesContainer.nativeElement;
    const lastPhone = container.lastElementChild as HTMLElement;
    
    if (lastPhone) {
      // Scroll suave al elemento
      lastPhone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Focus en el input del nuevo teléfono
      const input = lastPhone.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  }
}
```

---

## 🎨 Feedback Visual de Validación

### Estados de Validación en Formularios

| Estado | Propiedad | Descripción |
|--------|-----------|-------------|
| **Pristine** | `control.pristine` | El usuario no ha interactuado con el campo |
| **Dirty** | `control.dirty` | El usuario ha modificado el valor |
| **Touched** | `control.touched` | El usuario ha dado foco y salido del campo |
| **Untouched** | `control.untouched` | El usuario nunca ha dado foco al campo |
| **Valid** | `control.valid` | El campo cumple todas las validaciones |
| **Invalid** | `control.invalid` | El campo tiene errores de validación |
| **Pending** | `control.pending` | Validación asíncrona en progreso |
| **Disabled** | `control.disabled` | El campo está deshabilitado |

### Mostrar Errores Solo Después de Interacción

```typescript
get usernameError(): string {
  const control = this.form.get('username');
  
  // Solo mostrar error si el usuario ha interactuado
  if (!control?.touched) return '';
  
  if (control.hasError('required')) return 'El usuario es obligatorio';
  if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
  if (control.hasError('invalidUsername')) return 'Solo letras, números, - y _';
  if (control.hasError('usernameNotAvailable')) return 'Este usuario ya existe';
  
  return '';
}
```

### Clases CSS Dinámicas

```html
<input
  type="text"
  formControlName="username"
  [class.input--error]="hasError('username')"
  [class.input--valid]="isValid('username')"
  [class.input--validating]="isPending('username')"
/>
```

```typescript
hasError(fieldName: string): boolean {
  const control = this.form.get(fieldName);
  return !!(control && control.errors && control.touched);
}

isValid(fieldName: string): boolean {
  const control = this.form.get(fieldName);
  return !!(control && control.valid && control.touched);
}

isPending(fieldName: string): boolean {
  return this.form.get(fieldName)?.status === 'PENDING';
}
```

### Spinner de Validación Asíncrona

**RegisterForm con spinner de validación:**

```html
<div class="field">
  <label for="email">Email</label>
  <div class="input-wrapper">
    <input
      id="email"
      type="email"
      formControlName="email"
      [class.input--error]="hasError('email')"
    />
    
    <!-- Spinner mientras valida -->
    @if (isEmailValidating) {
      <span class="validating" aria-live="polite">
        <span class="spinner"></span>
        Verificando email...
      </span>
    }
  </div>
  
  @if (hasError('email')) {
    <span class="error">{{ getEmailError() }}</span>
  }
</div>
```

```scss
.validating {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-accent);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .spinner {
    width: 12px;
    height: 12px;
    border: 2px solid var(--color-accent);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Barra de Fortaleza de Contraseña (RegisterForm)

```html
<aside class="strength" aria-label="Indicador de fortaleza de contraseña">
  <span class="strength__label">Fortaleza:</span>
  <progress 
    class="strength-bar" 
    [value]="passwordStrength" 
    max="4"
    [attr.aria-valuenow]="passwordStrength"
    [attr.aria-valuetext]="passwordStrengthText"
  ></progress>
  <span class="strength__text">{{ passwordStrengthText }}</span>
</aside>
```

```typescript
get passwordStrength(): number {
  const control = this.registerForm.get('password');
  if (!control?.value) return 0;
  
  const errors = control.errors?.['strongPassword'];
  if (!errors) return 4; // Contraseña fuerte
  
  // Calcular fortaleza basada en requisitos cumplidos
  let strength = 0;
  if (!errors.minLength) strength++;
  if (!errors.uppercase) strength++;
  if (!errors.lowercase) strength++;
  if (!errors.number) strength++;
  if (!errors.special) strength++;
  
  return Math.min(strength, 4);
}

get passwordStrengthText(): string {
  switch (this.passwordStrength) {
    case 0: return 'Muy débil';
    case 1: return 'Débil';
    case 2: return 'Aceptable';
    case 3: return 'Fuerte';
    case 4: return 'Muy fuerte';
    default: return '';
  }
}
```

```scss
.strength-bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  
  // Colores según valor
  &[value="1"] {
    &::-webkit-progress-value, &::-moz-progress-bar {
      background-color: $color-error-dark;
    }
  }
  
  &[value="2"] {
    &::-webkit-progress-value, &::-moz-progress-bar {
      background-color: $color-warning-dark;
    }
  }
  
  &[value="3"] {
    &::-webkit-progress-value, &::-moz-progress-bar {
      background-color: $color-success-dark;
    }
  }
  
  &[value="4"] {
    &::-webkit-progress-value, &::-moz-progress-bar {
      background-color: $color-accent-dark;
    }
  }
}
```

---

## 📁 Estructura de Archivos - Fase 3

```
src/app/
├── components/shared/
│   ├── validators/
│   │   ├── index.ts                      # Exportaciones centralizadas
│   │   ├── custom.validators.ts          # 13 validadores síncronos
│   │   ├── async.validators.ts           # 2 validadores asíncronos
│   │   └── validation.service.ts         # Servicio de validación (simula API)
│   │
│   ├── login-form/
│   │   ├── login-form.ts                 # Formulario de login
│   │   ├── login-form.html
│   │   └── login-form.scss
│   │
│   ├── register-form/
│   │   ├── register-form.ts              # Formulario de registro
│   │   ├── register-form.html            # Con barra de fortaleza
│   │   └── register-form.scss
│   │
│   └── edit-profile-form/
│       ├── edit-profile-form.ts          # Formulario con FormArray
│       ├── edit-profile-form.html        # Template con ViewChild
│       ├── edit-profile-form.scss
│       ├── README.md                     # Documentación del componente
│       └── index.ts
│
└── docs/
    └── REACTIVE_FORMS.md                 # Documentación completa
```

---

## 🎯 Resumen de Cumplimiento - Fase 3

| Requisito | Mínimo | Implementado | Estado |
|-----------|--------|--------------|--------|
| **Formularios reactivos** | 3 | 3 | ✅ |
| - LoginForm | - | ✅ | Usuario + contraseña |
| - RegisterForm | - | ✅ | Email, usuario, contraseña con validación async |
| - EditProfileForm | - | ✅ | Datos personales + FormArray de teléfonos |
| **Validadores síncronos** | 3 | **13** | ✅ |
| - strongPassword | - | ✅ | Requisitos de seguridad estrictos |
| - username, nif, spanishPhone | - | ✅ | Validaciones específicas |
| - url, range, minAge, etc. | - | ✅ | 9 validadores adicionales |
| **Validadores asíncronos** | 2 | 2 | ✅ |
| - uniqueEmail | - | ✅ | Con debounce de 600ms |
| - availableUsername | - | ✅ | Con debounce de 600ms |
| **FormArray** | 1 | 1 | ✅ |
| - Teléfonos en EditProfileForm | - | ✅ | Añadir/eliminar dinámicamente |
| **ViewChild + ElementRef** | Requerido | ✅ | ✅ |
| - Focus automático | - | ✅ | firstNameInput en EditProfileForm |
| - Scroll automático | - | ✅ | phonesContainer en EditProfileForm |
| **Feedback visual** | Completo | ✅ | ✅ |
| - Spinners de validación async | - | ✅ | RegisterForm + EditProfileForm |
| - Mensajes de error | - | ✅ | Todos los formularios |
| - Barra fortaleza contraseña | - | ✅ | RegisterForm |
| **Documentación** | Requerida | ✅ | ✅ |
| - Catálogo de validadores | - | ✅ | Este documento |
| - Guía FormArray | - | ✅ | Este documento |
| - Ejemplos validación async | - | ✅ | Este documento |

---

<br><br>

# ═══════════════════════════════════════════════════════════════════════════════
# �📚 RECURSOS Y TESTING
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

### Fase 3 - Formularios Reactivos
- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Form Validation](https://angular.dev/guide/forms/form-validation)
- [Dynamic Forms](https://angular.dev/guide/forms/dynamic-forms)
- [Documentación completa interna](./REACTIVE_FORMS.md)
---

<br><br>

# ═══════════════════════════════════════════════════════════════════════════════
# 🗺️ FASE 4: SISTEMA DE ENRUTAMIENTO
# ═══════════════════════════════════════════════════════════════════════════════

> **Objetivo:** Configuración completa del sistema de rutas, navegación programática, lazy loading, guards, resolvers y breadcrumbs dinámicos.

---

## 📍 Mapa Completo de Rutas

### Estructura de Rutas

```
/                           → Home (página principal)
├── /buscar                 → Búsqueda de juegos
│   └── ?q=query&page=1     → Con query params
├── /juego/:id              → Detalle de juego
│   └── #reviews            → Con fragment para scroll
├── /usuario/:id            → Perfil de usuario
│   ├── /juegos             → Tab de juegos (ruta hija)
│   └── /reviews            → Tab de reviews (ruta hija)
├── /ajustes                → Ajustes de cuenta (protegido)
│   ├── /perfil             → Tab de perfil (ruta hija)
│   ├── /contrasenia        → Tab de contraseña (ruta hija)
│   └── /avatar             → Tab de avatar (ruta hija)
├── /about                  → Página "Sobre nosotros"
├── /style-guide            → Guía de estilos (desarrollo)
├── /404                    → Página de error
└── /**                     → Wildcard → redirige a /404
```

### Diagrama Visual de Navegación

```
                                    ┌─────────────┐
                                    │    HOME     │
                                    │     /       │
                                    └──────┬──────┘
                 ┌──────────────┬─────────┼─────────┬──────────────┐
                 ▼              ▼         ▼         ▼              ▼
           ┌──────────┐  ┌───────────┐ ┌─────┐ ┌───────────┐ ┌───────────┐
           │  BUSCAR  │  │   JUEGO   │ │ABOUT│ │  USUARIO  │ │  AJUSTES  │
           │ /buscar  │  │ /juego/:id│ │     │ │/usuario/:id│ │ /ajustes │
           └──────────┘  └───────────┘ └─────┘ └─────┬─────┘ └─────┬─────┘
                                                     │             │
                                            ┌────────┴────────┐   ┌┴─────────────┐
                                            ▼                 ▼   ▼              ▼
                                       ┌─────────┐      ┌──────────┐ ┌──────┐ ┌──────┐
                                       │ /juegos │      │/perfil   │ │/pass │ │/avatar│
                                       │ /reviews│      └──────────┘ └──────┘ └──────┘
                                       └─────────┘
```

---

## 🔧 Configuración de Rutas

### Archivo Principal: `app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from './guards';
import { gameResolver, userResolver } from './resolvers';

export const routes: Routes = [
  // Ruta principal - Home
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
    title: 'Looking4Rate - Tu plataforma de valoración de videojuegos',
    data: { breadcrumb: 'Inicio', breadcrumbIcon: '🏠' }
  },

  // Búsqueda de juegos
  {
    path: 'buscar',
    loadComponent: () => import('./pages/search/search'),
    title: 'Buscar juegos - Looking4Rate',
    data: { breadcrumb: 'Buscar', breadcrumbIcon: '🔍' }
  },

  // Detalle de juego con parámetro :id y resolver
  {
    path: 'juego/:id',
    loadComponent: () => import('./pages/game-detail/game-detail'),
    resolve: { game: gameResolver },
    data: { breadcrumb: 'Juego', breadcrumbIcon: '🎮' }
  },

  // Perfil de usuario con rutas hijas
  {
    path: 'usuario/:id',
    loadComponent: () => import('./pages/profile/profile'),
    resolve: { user: userResolver },
    children: [
      { path: '', redirectTo: 'juegos', pathMatch: 'full' },
      { path: 'juegos', loadComponent: () => import('./pages/profile/tabs/user-games') },
      { path: 'reviews', loadComponent: () => import('./pages/profile/tabs/user-reviews') }
    ]
  },

  // Ajustes protegidos con guard y canDeactivate
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/settings/settings'),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', loadComponent: () => import('./pages/settings/tabs/settings-profile') },
      { path: 'contrasenia', loadComponent: () => import('./pages/settings/tabs/settings-password') },
      { path: 'avatar', loadComponent: () => import('./pages/settings/tabs/settings-avatar') }
    ]
  },

  // Página 404 y wildcard
  { path: '404', loadComponent: () => import('./pages/not-found/not-found') },
  { path: '**', redirectTo: '404' }
];
```

### Rutas con Parámetros

| Tipo | Ejemplo | Descripción |
|------|---------|-------------|
| **Parámetro de ruta** | `/juego/:id` | ID del juego (obligatorio) |
| **Query params** | `/buscar?q=call+of+duty&page=2` | Término de búsqueda y paginación |
| **Fragment** | `/juego/1#reviews` | Scroll a sección específica |
| **Estado** | `NavigationExtras.state` | Datos privados entre rutas |

---

## 🚀 Lazy Loading

### Estrategia Implementada

La aplicación utiliza **lazy loading** para todas las páginas, cargando los componentes bajo demanda:

```typescript
// En lugar de:
import Home from './pages/home/home';
{ path: '', component: Home }

// Usamos:
{ path: '', loadComponent: () => import('./pages/home/home') }
```

### Configuración de Precarga

En `app.config.ts` se configura la estrategia **PreloadAllModules**:

```typescript
import { PreloadAllModules, withPreloading } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules), // Precarga todos los módulos
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withComponentInputBinding()
    )
  ]
};
```

### Verificar Chunking en Build

Al compilar para producción, se generan chunks separados:

```bash
ng build --configuration production
```

Resultado esperado:
```
dist/looking4rate/browser/
├── main-XXXXX.js           # Bundle principal
├── chunk-home-XXXXX.js     # Home (lazy)
├── chunk-search-XXXXX.js   # Búsqueda (lazy)
├── chunk-game-XXXXX.js     # Detalle juego (lazy)
├── chunk-profile-XXXXX.js  # Perfil (lazy)
├── chunk-settings-XXXXX.js # Ajustes (lazy)
└── ...
```

---

## 🔐 Route Guards

### Guards Implementados

#### 1. AuthGuard (CanActivate)

Protege rutas que requieren autenticación:

```typescript
// guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar URL para redirección post-login
  authService.setRedirectUrl(state.url);
  authService.requestLogin();

  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};
```

**Uso:**
```typescript
{
  path: 'ajustes',
  loadComponent: () => import('./pages/settings/settings'),
  canActivate: [authGuard]
}
```

#### 2. CanDeactivateGuard

Previene salir de una página con cambios sin guardar:

```typescript
// guards/can-deactivate.guard.ts
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component
) => {
  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  return true;
};
```

**Uso en componente:**
```typescript
export class SettingsPage implements CanComponentDeactivate {
  hasUnsavedChanges = false;

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('¿Tienes cambios sin guardar. ¿Salir?');
    }
    return true;
  }
}
```

#### 3. Otros Guards

| Guard | Tipo | Descripción |
|-------|------|-------------|
| `guestGuard` | CanActivate | Solo acceso para usuarios NO autenticados |
| `ownerGuard` | CanActivate | Verifica que el usuario sea propietario del recurso |
| `adminGuard` | CanActivate | Solo acceso para administradores |

---

## 📦 Resolvers

### GameResolver

Precarga datos del juego antes de activar la ruta:

```typescript
// resolvers/data.resolver.ts
export const gameResolver: ResolveFn<GameData | null> = (route, state) => {
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  
  const gameId = parseInt(route.params['id'], 10);
  
  if (isNaN(gameId) || gameId <= 0) {
    router.navigate(['/404']);
    return of(null);
  }

  loadingService.show('Cargando juego...');

  return gameService.getById(gameId).pipe(
    tap(() => loadingService.hide()),
    catchError(() => {
      loadingService.hide();
      router.navigate(['/404']);
      return of(null);
    })
  );
};
```

**Uso en componente:**
```typescript
export class GameDetailPage implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Los datos ya están disponibles
    this.route.data.subscribe(data => {
      this.game = data['game'];
    });
  }
}
```

### UserResolver

Similar al GameResolver pero para perfiles de usuario:

```typescript
{
  path: 'usuario/:id',
  loadComponent: () => import('./pages/profile/profile'),
  resolve: { user: userResolver }
}
```

---

## 🧭 Navegación Programática

### NavigationService

Servicio centralizado para la navegación:

```typescript
// services/navigation.service.ts
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);

  // Navegación básica
  navigate(path: string | string[]): Promise<boolean>;
  navigateByUrl(url: string): Promise<boolean>;
  goBack(): void;

  // Navegación con parámetros
  navigateWithQueryParams(path: string, params: Record<string, any>): Promise<boolean>;
  navigateWithFragment(path: string, fragment: string): Promise<boolean>;
  navigateWithState(path: string, state: NavigationState): Promise<boolean>;

  // Navegación a rutas específicas
  navigateToHome(): Promise<boolean>;
  navigateToSearch(query?: string): Promise<boolean>;
  navigateToGameDetail(gameId: number, fragment?: string): Promise<boolean>;
  navigateToUserProfile(userId: number, tab?: 'juegos' | 'reviews'): Promise<boolean>;
  navigateToSettings(tab?: 'perfil' | 'contrasenia' | 'avatar'): Promise<boolean>;
}
```

### Ejemplos de Uso

```typescript
// Navegación simple
this.navigationService.navigateToHome();

// Con query params
this.navigationService.navigateToSearch('call of duty');
// Resultado: /buscar?q=call+of+duty

// Con parámetro de ruta
this.navigationService.navigateToGameDetail(42);
// Resultado: /juego/42

// Con fragment
this.navigationService.navigateToGameDetail(42, 'reviews');
// Resultado: /juego/42#reviews

// Con estado
this.navigationService.navigateWithState('/juego/42', {
  previousUrl: '/buscar',
  data: { fromSearch: true }
});

// Rutas hijas
this.navigationService.navigateToUserProfile(1, 'reviews');
// Resultado: /usuario/1/reviews

this.navigationService.navigateToSettings('contrasenia');
// Resultado: /ajustes/contrasenia
```

### Pasar Parámetros de Ruta

```typescript
// Query params
this.router.navigate(['/buscar'], {
  queryParams: { q: 'elden ring', page: 1 },
  queryParamsHandling: 'merge' // Mantiene params existentes
});

// Parámetros de ruta
this.router.navigate(['/juego', gameId]);

// Fragment para scroll
this.router.navigate(['/juego', gameId], { fragment: 'reviews' });

// NavigationExtras con estado
this.router.navigate(['/juego', gameId], {
  state: { previousUrl: this.router.url }
});
```

---

## 🍞 Breadcrumbs Dinámicos

### Componente Breadcrumbs

```typescript
// components/shared/breadcrumbs/breadcrumbs.ts
@Component({
  selector: 'app-breadcrumbs',
  template: `
    @if (breadcrumbs.length > 1) {
      <nav class="breadcrumbs" aria-label="Migas de pan">
        <ol>
          @for (crumb of breadcrumbs; track crumb.url; let isLast = $last) {
            <li>
              @if (!isLast) {
                <a [routerLink]="crumb.url">{{ crumb.label }}</a>
                <span>/</span>
              } @else {
                <span aria-current="page">{{ crumb.label }}</span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `
})
export class Breadcrumbs implements OnInit {
  private navigationService = inject(NavigationService);
  breadcrumbs: BreadcrumbItem[] = [];

  ngOnInit() {
    this.navigationService.breadcrumbs$.subscribe(
      breadcrumbs => this.breadcrumbs = breadcrumbs
    );
  }
}
```

### Configuración en Rutas

Los breadcrumbs se generan automáticamente desde los datos de ruta:

```typescript
{
  path: 'juego/:id',
  loadComponent: () => import('./pages/game-detail/game-detail'),
  data: {
    breadcrumb: 'Juego',      // Texto del breadcrumb
    breadcrumbIcon: '🎮'       // Icono opcional
  }
}
```

### Ejemplo de Breadcrumbs Generados

| Ruta | Breadcrumbs |
|------|-------------|
| `/` | 🏠 Inicio |
| `/buscar` | 🏠 Inicio / 🔍 Buscar |
| `/juego/1` | 🏠 Inicio / 🎮 Juego |
| `/usuario/1/reviews` | 🏠 Inicio / 👤 Usuario / Reviews |
| `/ajustes/contrasenia` | 🏠 Inicio / ⚙️ Ajustes / Contraseña |

---

## 📁 Estructura de Archivos - Fase 4

```
src/app/
├── guards/
│   ├── index.ts                    # Exportaciones centralizadas
│   ├── auth.guard.ts               # Guards de autenticación
│   └── can-deactivate.guard.ts     # Guard para cambios sin guardar
│
├── resolvers/
│   ├── index.ts                    # Exportaciones centralizadas
│   └── data.resolver.ts            # Resolvers de datos
│
├── services/
│   ├── navigation.service.ts       # Servicio de navegación
│   ├── auth.service.ts             # Servicio de autenticación
│   └── index.ts                    # Exportaciones actualizadas
│
├── components/shared/
│   └── breadcrumbs/
│       └── breadcrumbs.ts          # Componente de breadcrumbs
│
├── pages/
│   ├── home/                       # Página principal
│   ├── search/                     # Búsqueda de juegos
│   ├── game-detail/                # Detalle de juego
│   ├── profile/                    # Perfil de usuario
│   │   └── tabs/
│   │       ├── user-games.ts       # Tab de juegos
│   │       └── user-reviews.ts     # Tab de reviews
│   ├── settings/                   # Ajustes de cuenta
│   │   └── tabs/
│   │       ├── settings-profile.ts
│   │       ├── settings-password.ts
│   │       └── settings-avatar.ts
│   ├── about/                      # Página "Sobre nosotros"
│   └── not-found/                  # Página 404
│
├── app.routes.ts                   # Configuración de rutas
└── app.config.ts                   # Configuración con precarga
```

---

## 🎯 Resumen de Cumplimiento - Fase 4

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| **Configuración de rutas** | ✅ | |
| - Rutas principales | ✅ | Home, buscar, detalle, formularios, about |
| - Rutas con parámetros | ✅ | `/juego/:id`, `/usuario/:id` |
| - Rutas hijas anidadas | ✅ | Perfil (juegos/reviews), Ajustes (perfil/pass/avatar) |
| - Ruta wildcard 404 | ✅ | `path: '**'` redirige a `/404` |
| **Navegación programática** | ✅ | |
| - Router para navegación | ✅ | NavigationService con todos los métodos |
| - Pasar parámetros de ruta | ✅ | `:id`, query params |
| - Query params y fragments | ✅ | `?q=...&page=...`, `#reviews` |
| - NavigationExtras para estado | ✅ | `navigateWithState()` |
| **Lazy Loading** | ✅ | |
| - Módulos con carga perezosa | ✅ | Todas las páginas con `loadComponent` |
| - Estrategia PreloadAllModules | ✅ | Configurado en app.config.ts |
| - Verificar chunking | ✅ | Chunks separados en build |
| **Route Guards** | ✅ | |
| - CanActivate | ✅ | authGuard, guestGuard, ownerGuard, adminGuard |
| - Simular autenticación | ✅ | AuthService completo |
| - Redirección si no autorizado | ✅ | A home con returnUrl |
| - CanDeactivate | ✅ | Para formularios con cambios |
| **Resolvers** | ✅ | |
| - Precargar datos | ✅ | gameResolver, userResolver |
| - Loading state | ✅ | LoadingService integrado |
| - Manejo de errores | ✅ | Redirige a 404 |
| **Breadcrumbs dinámicos** | ✅ | |
| - Generar desde rutas | ✅ | NavigationService + data.breadcrumb |
| - Actualizar según navegación | ✅ | Observable breadcrumbs$ |
| **Documentación** | ✅ | |
| - Mapa de rutas | ✅ | Este documento |
| - Estrategia lazy loading | ✅ | Este documento |
| - Guards y resolvers | ✅ | Este documento |

---

## 📖 Recursos Adicionales - Fase 4

- [Angular Router Guide](https://angular.dev/guide/routing)
- [Lazy Loading Feature Modules](https://angular.dev/guide/routing/lazy-loading-ngmodules)
- [Route Guards](https://angular.dev/guide/routing/router-guards)
- [Preloading Strategies](https://angular.dev/guide/routing/preloading-modules)
- [Resolvers](https://angular.dev/guide/routing/resolver)