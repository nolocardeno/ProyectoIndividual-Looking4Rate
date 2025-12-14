/**
 * @fileoverview Modelos de Respuestas API
 * 
 * Interfaces genéricas para manejar respuestas del backend,
 * errores, paginación y estados de carga.
 */

// ============================================
// RESPUESTAS GENÉRICAS
// ============================================

/**
 * Respuesta genérica del API
 */
export interface ApiResponse<T> {
  /** Datos de la respuesta */
  data: T;
  /** Mensaje opcional */
  message?: string;
  /** Timestamp de la respuesta */
  timestamp?: string;
}

/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  /** Contenido de la página */
  content: T[];
  /** Número de página actual (0-indexed) */
  page: number;
  /** Elementos por página */
  size: number;
  /** Total de elementos */
  totalElements: number;
  /** Total de páginas */
  totalPages: number;
  /** Es primera página */
  first: boolean;
  /** Es última página */
  last: boolean;
  /** Tiene página siguiente */
  hasNext: boolean;
  /** Tiene página anterior */
  hasPrevious: boolean;
}

// ============================================
// ERRORES
// ============================================

/**
 * Error del API
 */
export interface ApiError {
  /** Código de estado HTTP */
  status: number;
  /** Código de error interno */
  error: string;
  /** Mensaje descriptivo del error */
  message: string;
  /** Ruta que causó el error */
  path?: string;
  /** Timestamp del error */
  timestamp?: string;
  /** Errores de validación (si aplica) */
  validationErrors?: ValidationError[];
}

/**
 * Error de validación de campo
 */
export interface ValidationError {
  /** Campo con error */
  field: string;
  /** Mensaje de error */
  message: string;
  /** Valor rechazado */
  rejectedValue?: unknown;
}

/**
 * Tipos de error de la aplicación
 */
export type ErrorType = 
  | 'network'      // Error de conexión
  | 'timeout'      // Timeout de petición
  | 'unauthorized' // No autorizado (401)
  | 'forbidden'    // Prohibido (403)
  | 'not_found'    // No encontrado (404)
  | 'validation'   // Error de validación (400)
  | 'server'       // Error del servidor (5xx)
  | 'unknown';     // Error desconocido

/**
 * Error normalizado para la UI
 */
export interface NormalizedError {
  /** Tipo de error */
  type: ErrorType;
  /** Mensaje para mostrar al usuario */
  userMessage: string;
  /** Mensaje técnico (para logs) */
  technicalMessage: string;
  /** Código de estado HTTP */
  statusCode?: number;
  /** Errores de validación si aplican */
  validationErrors?: ValidationError[];
  /** Si se puede reintentar */
  retryable: boolean;
}

// ============================================
// ESTADOS DE PETICIÓN
// ============================================

/**
 * Estado de una petición HTTP
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Estado genérico para datos asíncronos
 */
export interface AsyncState<T> {
  /** Datos cargados */
  data: T | null;
  /** Estado de la petición */
  status: RequestStatus;
  /** Error si existe */
  error: NormalizedError | null;
  /** Timestamp de última actualización */
  lastUpdated: number | null;
}

/**
 * Estado inicial para AsyncState
 */
export const initialAsyncState = <T>(): AsyncState<T> => ({
  data: null,
  status: 'idle',
  error: null,
  lastUpdated: null
});

// ============================================
// QUERY PARAMS
// ============================================

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  /** Número de página (0-indexed) */
  page?: number;
  /** Elementos por página */
  size?: number;
  /** Campo por el que ordenar */
  sort?: string;
  /** Dirección de ordenación */
  direction?: 'asc' | 'desc';
}

/**
 * Parámetros de filtro genéricos
 */
export interface FilterParams {
  /** Texto de búsqueda */
  search?: string;
  /** Filtros adicionales */
  [key: string]: string | number | boolean | undefined;
}

// ============================================
// UPLOAD DE ARCHIVOS
// ============================================

/**
 * Respuesta de upload de archivo
 */
export interface FileUploadResponse {
  /** URL del archivo subido */
  url: string;
  /** Nombre original del archivo */
  originalName: string;
  /** Tipo MIME */
  mimeType: string;
  /** Tamaño en bytes */
  size: number;
}

/**
 * Progreso de upload
 */
export interface UploadProgress {
  /** Porcentaje completado (0-100) */
  progress: number;
  /** Bytes cargados */
  loaded: number;
  /** Total de bytes */
  total: number;
}
