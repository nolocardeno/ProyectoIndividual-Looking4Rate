/**
 * @fileoverview Constantes de Entorno
 * 
 * Configuración centralizada de URLs, endpoints y constantes
 * de la aplicación. Permite fácil cambio entre entornos.
 * 
 * @example
 * import { API_URL, ENDPOINTS } from './core/constants';
 * const url = `${API_URL}${ENDPOINTS.JUEGOS}`;
 */

// ============================================
// CONFIGURACIÓN BASE
// ============================================

/**
 * URL base del API backend
 * En desarrollo: http://localhost:8080/api
 * En producción (Docker): /api (rutas relativas para usar el proxy de Nginx)
 */
export const API_URL = '/api';

/**
 * URL base del backend (sin /api)
 */
export const BASE_URL = '';

/**
 * Versión actual del API
 */
export const API_VERSION = 'v1';

// ============================================
// ENDPOINTS
// ============================================

/**
 * Catálogo de endpoints del API
 * Organizados por recurso/entidad
 */
export const ENDPOINTS = {
  // --- Autenticación ---
  AUTH: {
    LOGIN: '/auth/login',
    REGISTRO: '/auth/registro',
    ME: '/auth/me',
    VALIDAR: '/auth/validar',
    REFRESH: '/auth/refresh'
  },

  // --- Usuarios ---
  USUARIOS: {
    BASE: '/usuarios',
    BY_ID: (id: number) => `/usuarios/${id}`,
    AVATAR: (id: number) => `/usuarios/${id}/avatar`,
    CONTRASENIA: (id: number) => `/usuarios/${id}/contrasenia`,
    BUSCAR: '/usuarios/buscar',
    BY_EMAIL: (email: string) => `/usuarios/email/${encodeURIComponent(email)}`
  },

  // --- Juegos ---
  JUEGOS: {
    BASE: '/juegos',
    BY_ID: (id: number) => `/juegos/${id}`,
    BUSCAR: '/juegos/buscar',
    NOVEDADES: '/juegos/novedades',
    PROXIMOS: '/juegos/proximos',
    TOP: '/juegos/top',
    POPULARES: '/juegos/populares'
  },

  // --- Interacciones ---
  INTERACCIONES: {
    BASE: '/interacciones',
    BY_ID: (id: number) => `/interacciones/${id}`,
    BY_USUARIO: (usuarioId: number) => `/interacciones/usuario/${usuarioId}`,
    BY_JUEGO: (juegoId: number) => `/interacciones/juego/${juegoId}`,
    BY_USUARIO_JUEGO: (usuarioId: number, juegoId: number) => 
      `/interacciones/usuario/${usuarioId}/juego/${juegoId}`,
    CREAR: (usuarioId: number) => `/interacciones/usuario/${usuarioId}`,
    ACTUALIZAR: (id: number, usuarioId: number) => 
      `/interacciones/${id}/usuario/${usuarioId}`,
    ELIMINAR: (id: number, usuarioId: number) => 
      `/interacciones/${id}/usuario/${usuarioId}`,
    JUGADOS: (usuarioId: number) => `/interacciones/usuario/${usuarioId}/jugados`
  },

  // --- Plataformas ---
  PLATAFORMAS: {
    BASE: '/plataformas',
    BY_ID: (id: number) => `/plataformas/${id}`,
    BUSCAR: '/plataformas/buscar',
    BY_FABRICANTE: (fabricante: string) => 
      `/plataformas/fabricante/${encodeURIComponent(fabricante)}`,
    RECIENTES: '/plataformas/recientes'
  },

  // --- Géneros ---
  GENEROS: {
    BASE: '/generos',
    BY_ID: (id: number) => `/generos/${id}`,
    BUSCAR: '/generos/buscar'
  },

  // --- Desarrolladoras ---
  DESARROLLADORAS: {
    BASE: '/desarrolladoras',
    BY_ID: (id: number) => `/desarrolladoras/${id}`,
    BUSCAR: '/desarrolladoras/buscar',
    BY_PAIS: (pais: string) => `/desarrolladoras/pais/${encodeURIComponent(pais)}`
  }
} as const;

// ============================================
// CONFIGURACIÓN HTTP
// ============================================

/**
 * Configuración de timeouts (en milisegundos)
 */
export const HTTP_CONFIG = {
  /** Timeout por defecto para peticiones */
  DEFAULT_TIMEOUT: 30000,
  /** Timeout para uploads de archivos */
  UPLOAD_TIMEOUT: 120000,
  /** Número de reintentos en caso de error */
  RETRY_COUNT: 3,
  /** Delay entre reintentos (ms) */
  RETRY_DELAY: 1000,
  /** Códigos de estado que permiten reintento */
  RETRYABLE_STATUS_CODES: [408, 500, 502, 503, 504]
} as const;

/**
 * Headers por defecto
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
} as const;

// ============================================
// STORAGE KEYS
// ============================================

/**
 * Claves para localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  /** Token de autenticación */
  AUTH_TOKEN: 'l4r_auth_token',
  /** Datos del usuario */
  AUTH_USER: 'l4r_auth_user',
  /** Preferencias de usuario */
  USER_PREFERENCES: 'l4r_preferences',
  /** Tema seleccionado */
  THEME: 'l4r_theme',
  /** Idioma seleccionado */
  LANGUAGE: 'l4r_language',
  /** Cache de búsquedas recientes */
  RECENT_SEARCHES: 'l4r_recent_searches'
} as const;

// ============================================
// MENSAJES DE ERROR
// ============================================

/**
 * Mensajes de error para el usuario
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
  TIMEOUT: 'La petición ha tardado demasiado. Inténtalo de nuevo.',
  UNAUTHORIZED: 'Tu sesión ha expirado. Inicia sesión de nuevo.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  VALIDATION: 'Los datos introducidos no son válidos.',
  SERVER: 'Error en el servidor. Inténtalo más tarde.',
  UNKNOWN: 'Ha ocurrido un error inesperado.'
} as const;

// ============================================
// CONFIGURACIÓN DE PAGINACIÓN
// ============================================

/**
 * Valores por defecto para paginación
 */
export const PAGINATION_CONFIG = {
  /** Elementos por página por defecto */
  DEFAULT_PAGE_SIZE: 12,
  /** Opciones de elementos por página */
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
  /** Máximo de páginas a mostrar en el paginador */
  MAX_VISIBLE_PAGES: 5
} as const;
