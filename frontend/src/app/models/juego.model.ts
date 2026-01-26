/**
 * @fileoverview Modelos de Juego
 * 
 * Interfaces TypeScript que reflejan los DTOs del backend para juegos.
 * 
 * @see BACKEND_DOCUMENTATION.md - Sección 3: DTOs
 */

// ============================================
// INTERFACES DE IMAGEN DE GALERÍA
// ============================================

/**
 * DTO de imagen de galería de un juego
 */
export interface ImagenJuegoDTO {
  /** Identificador único de la imagen */
  id: number;
  /** URL de la imagen */
  url: string;
  /** Texto alternativo para accesibilidad */
  alt: string;
  /** Título/caption de la imagen */
  caption: string | null;
}

// ============================================
// INTERFACES DE RESPUESTA
// ============================================

/**
 * DTO de juego completo para respuestas del API
 * Información detallada incluyendo relaciones
 */
export interface JuegoDTO {
  /** Identificador único del juego */
  id: number;
  /** Nombre del juego */
  nombre: string;
  /** Descripción del juego */
  descripcion: string;
  /** URL de la imagen de portada */
  imagenPortada: string;
  /** Fecha de lanzamiento (formato ISO) */
  fechaSalida: string;
  /** Lista de nombres de plataformas */
  plataformas: string[];
  /** Lista de nombres de desarrolladoras */
  desarrolladoras: string[];
  /** Lista de nombres de géneros */
  generos: string[];
  /** Puntuación media del juego (1-10) */
  puntuacionMedia: number | null;
  /** Total de reviews del juego */
  totalReviews: number;
  /** Imágenes de galería del juego */
  imagenes: ImagenJuegoDTO[];
}

/**
 * DTO de juego resumido para listados
 * Información mínima para tarjetas de juego
 */
export interface JuegoResumenDTO {
  /** Identificador único del juego */
  id: number;
  /** Nombre del juego */
  nombre: string;
  /** URL de la imagen de portada */
  imagenPortada: string;
  /** Fecha de lanzamiento (formato ISO) */
  fechaSalida: string;
  /** Puntuación media del juego (1-10) */
  puntuacionMedia: number | null;
}

// ============================================
// INTERFACES DE PETICIÓN
// ============================================

/**
 * DTO para crear/actualizar juegos
 * Solo para usuarios ADMIN
 */
export interface JuegoCreacionDTO {
  /** Nombre del juego */
  nombre: string;
  /** Descripción del juego */
  descripcion: string;
  /** URL de la imagen de portada */
  imagenPortada: string;
  /** Fecha de lanzamiento (formato ISO) */
  fechaSalida: string;
  /** IDs de plataformas asociadas */
  plataformaIds: number[];
  /** IDs de desarrolladoras asociadas */
  desarrolladoraIds: number[];
  /** IDs de géneros asociados */
  generoIds: number[];
}

// ============================================
// INTERFACES PARA BÚSQUEDA Y FILTROS
// ============================================

/**
 * Parámetros de búsqueda de juegos
 */
export interface JuegoBusquedaParams {
  /** Texto de búsqueda */
  nombre?: string;
  /** ID de género para filtrar */
  generoId?: number;
  /** ID de plataforma para filtrar */
  plataformaId?: number;
  /** ID de desarrolladora para filtrar */
  desarrolladoraId?: number;
  /** Ordenar por campo */
  ordenarPor?: 'nombre' | 'fechaSalida' | 'puntuacion';
  /** Dirección de ordenación */
  orden?: 'asc' | 'desc';
  /** Página actual (paginación) */
  pagina?: number;
  /** Elementos por página */
  porPagina?: number;
}

/**
 * Respuesta paginada de juegos
 */
export interface JuegosPaginados {
  /** Lista de juegos */
  contenido: JuegoResumenDTO[];
  /** Página actual */
  paginaActual: number;
  /** Total de páginas */
  totalPaginas: number;
  /** Total de elementos */
  totalElementos: number;
  /** Elementos por página */
  porPagina: number;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

/**
 * Tipo para el estado de un juego en relación al usuario
 */
export type EstadoJuego = 'no-jugado' | 'jugando' | 'completado' | 'abandonado' | 'pendiente';

/**
 * Tipo para las tabs de detalle de juego
 */
export type GameDetailTab = 'info' | 'reviews' | 'similares';
