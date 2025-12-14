/**
 * @fileoverview Modelos de Interacción
 * 
 * Interfaces TypeScript que reflejan los DTOs del backend para interacciones.
 * Una interacción representa la relación entre un usuario y un juego
 * (puntuación, review, estado de jugado).
 * 
 * @see BACKEND_DOCUMENTATION.md - Sección 3: DTOs
 */

// ============================================
// INTERFACES DE RESPUESTA
// ============================================

/**
 * DTO de interacción para respuestas del API
 */
export interface InteraccionDTO {
  /** Identificador único de la interacción */
  id: number;
  /** ID del usuario */
  usuarioId: number;
  /** Nombre del usuario */
  nombreUsuario: string;
  /** Avatar del usuario */
  avatarUsuario?: string;
  /** ID del juego */
  juegoId: number;
  /** Nombre del juego */
  nombreJuego: string;
  /** Imagen de portada del juego */
  imagenJuego?: string;
  /** Puntuación del 1 al 10 (null si no ha puntuado) */
  puntuacion: number | null;
  /** Texto de la review (null si no ha escrito) */
  review: string | null;
  /** Indica si el usuario ha jugado al juego */
  estadoJugado: boolean;
  /** Fecha de la interacción (formato ISO) */
  fechaInteraccion: string;
}

/**
 * DTO simplificado para listados de reviews
 */
export interface ReviewDTO {
  /** Identificador único */
  id: number;
  /** Nombre del usuario que escribió la review */
  nombreUsuario: string;
  /** Avatar del usuario */
  avatarUsuario: string | null;
  /** Puntuación del 1 al 10 */
  puntuacion: number;
  /** Texto de la review */
  review: string;
  /** Fecha de la review */
  fechaInteraccion: string;
  /** Indica si es del usuario actual (para editar/eliminar) */
  esPropia?: boolean;
}

// ============================================
// INTERFACES DE PETICIÓN
// ============================================

/**
 * DTO para crear/actualizar interacciones
 */
export interface InteraccionCreacionDTO {
  /** ID del juego */
  juegoId: number;
  /** Puntuación del 1 al 10 (opcional) */
  puntuacion?: number | null;
  /** Texto de la review (opcional) */
  review?: string | null;
  /** Estado de jugado */
  estadoJugado: boolean;
}

/**
 * DTO para crear una review rápida
 */
export interface ReviewCreacionDTO {
  /** Puntuación del 1 al 10 */
  puntuacion: number;
  /** Texto de la review */
  review: string;
}

// ============================================
// INTERFACES PARA ESTADÍSTICAS
// ============================================

/**
 * Estadísticas de interacciones de un usuario
 */
export interface UserGameStats {
  /** Total de juegos en la biblioteca */
  totalJuegos: number;
  /** Juegos completados */
  juegosCompletados: number;
  /** Juegos con review */
  juegosRevieweados: number;
  /** Puntuación media dada por el usuario */
  puntuacionMediaDada: number | null;
  /** Distribución de puntuaciones */
  distribucionPuntuaciones: Record<number, number>;
}

/**
 * Estadísticas de un juego
 */
export interface GameStats {
  /** Total de interacciones */
  totalInteracciones: number;
  /** Total de reviews con texto */
  totalReviews: number;
  /** Puntuación media */
  puntuacionMedia: number | null;
  /** Distribución de puntuaciones (1-10) */
  distribucionPuntuaciones: Record<number, number>;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

/**
 * Estado de jugado del usuario con un juego
 */
export type EstadoJugado = 
  | 'no_jugado'
  | 'jugando'
  | 'completado'
  | 'abandonado'
  | 'en_pausa';

/**
 * Orden para listados de reviews
 */
export type ReviewOrden = 
  | 'recientes'
  | 'antiguos'
  | 'mejor_valorados'
  | 'peor_valorados';
