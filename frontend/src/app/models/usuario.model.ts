/**
 * @fileoverview Modelos de Usuario
 * 
 * Interfaces TypeScript que reflejan los DTOs del backend para usuarios.
 * 
 * @see BACKEND_DOCUMENTATION.md - Sección 3: DTOs
 */

// ============================================
// INTERFACES DE RESPUESTA
// ============================================

/**
 * DTO de usuario para respuestas del API
 * Información pública del usuario (sin contraseña)
 */
export interface UsuarioDTO {
  /** Identificador único del usuario */
  id: number;
  /** Nombre de usuario */
  nombre: string;
  /** Correo electrónico */
  email: string;
  /** Fecha de registro (formato ISO) */
  fechaRegistro: string;
  /** URL del avatar del usuario */
  avatar: string | null;
  /** Rol del usuario */
  rol: 'USER' | 'ADMIN';
}

/**
 * Respuesta de autenticación del API
 */
export interface AuthResponse {
  /** Token JWT para autenticación */
  token: string;
  /** Información del usuario autenticado */
  usuario: UsuarioDTO;
  /** Mensaje de respuesta */
  mensaje: string;
}

/**
 * Respuesta de validación de token
 */
export interface TokenValidationResponse {
  /** Indica si el token es válido */
  valido: boolean;
}

// ============================================
// INTERFACES DE PETICIÓN
// ============================================

/**
 * DTO para registro de nuevos usuarios
 */
export interface UsuarioRegistroDTO {
  /** Nombre de usuario */
  nombre: string;
  /** Correo electrónico */
  email: string;
  /** Contraseña (mínimo 6 caracteres) */
  contrasenia: string;
}

/**
 * DTO para login de usuarios
 */
export interface UsuarioLoginDTO {
  /** Correo electrónico */
  email: string;
  /** Contraseña */
  contrasenia: string;
}

/**
 * DTO para actualización de usuario
 */
export interface UsuarioUpdateDTO {
  /** Nombre de usuario */
  nombre?: string;
  /** Correo electrónico */
  email?: string;
  /** Nueva contraseña (opcional) */
  contrasenia?: string;
}

/**
 * DTO para actualización de avatar
 */
export interface AvatarUpdateDTO {
  /** URL del nuevo avatar */
  avatarUrl: string;
}

// ============================================
// INTERFACES PARA ESTADO LOCAL
// ============================================

/**
 * Usuario autenticado en la aplicación
 * Extiende UsuarioDTO con campos adicionales del cliente
 */
export interface AuthenticatedUser extends UsuarioDTO {
  /** Token JWT almacenado */
  token: string;
  /** Timestamp de expiración del token */
  tokenExpires?: number;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  /** Indica si hay un usuario autenticado */
  isAuthenticated: boolean;
  /** Usuario actual o null */
  user: UsuarioDTO | null;
  /** Token JWT o null */
  token: string | null;
  /** Indica si hay una operación de auth en curso */
  loading: boolean;
  /** Error de autenticación si existe */
  error: string | null;
}
