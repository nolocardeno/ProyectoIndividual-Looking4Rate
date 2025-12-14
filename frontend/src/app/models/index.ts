/**
 * @fileoverview Models Index - Exportación centralizada de interfaces y tipos
 * 
 * Este archivo proporciona una exportación centralizada de todas las
 * interfaces y modelos de datos de la aplicación.
 * 
 * @example
 * import { JuegoDTO, UsuarioDTO, InteraccionDTO } from './models';
 * 
 * @author Looking4Rate Team
 * @version 1.0.0
 */

// ============================================
// Modelos de Usuario
// ============================================

export * from './usuario.model';

// ============================================
// Modelos de Juego
// ============================================

export * from './juego.model';

// ============================================
// Modelos de Interacción
// ============================================

export * from './interaccion.model';

// ============================================
// Modelos de Catálogo (Plataformas, Géneros, etc.)
// ============================================

export * from './catalogo.model';

// ============================================
// Modelos de Respuestas API
// ============================================

export * from './api-response.model';
