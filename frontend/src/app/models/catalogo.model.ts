/**
 * @fileoverview Modelos de Catálogo
 * 
 * Interfaces TypeScript para las entidades de catálogo:
 * plataformas, géneros y desarrolladoras.
 * 
 * @see BACKEND_DOCUMENTATION.md - Sección 3: DTOs
 */

// ============================================
// PLATAFORMA
// ============================================

/**
 * DTO de plataforma
 */
export interface PlataformaDTO {
  /** Identificador único */
  id: number;
  /** Nombre de la plataforma */
  nombre: string;
  /** Año de lanzamiento */
  anioLanzamiento: number;
  /** Empresa fabricante */
  fabricante: string;
  /** URL del logo */
  imagenLogo: string | null;
}

/**
 * DTO para crear/actualizar plataformas
 */
export interface PlataformaCreacionDTO {
  /** Nombre de la plataforma */
  nombre: string;
  /** Año de lanzamiento */
  anioLanzamiento: number;
  /** Empresa fabricante */
  fabricante: string;
  /** URL del logo */
  imagenLogo?: string;
}

// ============================================
// GÉNERO
// ============================================

/**
 * DTO de género
 */
export interface GeneroDTO {
  /** Identificador único */
  id: number;
  /** Nombre del género */
  nombre: string;
  /** Descripción del género */
  descripcion: string | null;
}

/**
 * DTO para crear/actualizar géneros
 */
export interface GeneroCreacionDTO {
  /** Nombre del género */
  nombre: string;
  /** Descripción del género */
  descripcion?: string;
}

// ============================================
// DESARROLLADORA
// ============================================

/**
 * DTO de desarrolladora
 */
export interface DesarrolladoraDTO {
  /** Identificador único */
  id: number;
  /** Nombre de la empresa */
  nombre: string;
  /** Fecha de fundación (formato ISO) */
  fechaCreacion: string;
  /** País de origen */
  pais: string;
}

/**
 * DTO para crear/actualizar desarrolladoras
 */
export interface DesarrolladoraCreacionDTO {
  /** Nombre de la empresa */
  nombre: string;
  /** Fecha de fundación (formato ISO) */
  fechaCreacion: string;
  /** País de origen */
  pais: string;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

/**
 * Tipo unión para items de catálogo (para componentes genéricos)
 */
export type CatalogoItem = PlataformaDTO | GeneroDTO | DesarrolladoraDTO;

/**
 * Tipo para identificar el tipo de catálogo
 */
export type CatalogoTipo = 'plataforma' | 'genero' | 'desarrolladora';

/**
 * Opción de select para catálogos
 */
export interface CatalogoOption {
  /** ID del elemento */
  value: number;
  /** Texto a mostrar */
  label: string;
  /** Datos adicionales */
  data?: CatalogoItem;
}
