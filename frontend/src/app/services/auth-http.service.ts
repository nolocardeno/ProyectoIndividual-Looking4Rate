/**
 * @fileoverview Servicio HTTP de Autenticación
 * 
 * Servicio para comunicación HTTP con endpoints de autenticación.
 * Maneja login, registro, validación de token y obtención del usuario actual.
 * 
 * Este servicio se encarga solo de las peticiones HTTP.
 * Para gestión de estado de autenticación, ver auth.service.ts
 * 
 * @example
 * private authHttpService = inject(AuthHttpService);
 * 
 * // Login
 * this.authHttpService.login({ email, contrasenia }).subscribe(response => {
 *   // response.token, response.usuario
 * });
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpBaseService, HttpOptions } from './http-base.service';
import { ENDPOINTS, STORAGE_KEYS } from '../core/constants';
import { 
  AuthResponse, 
  UsuarioDTO, 
  UsuarioLoginDTO, 
  UsuarioRegistroDTO,
  TokenValidationResponse 
} from '../models';

/**
 * AuthHttpService
 * 
 * Servicio HTTP para autenticación:
 * - Login con email/contraseña
 * - Registro de nuevos usuarios
 * - Validación de token
 * - Obtener usuario actual
 */
@Injectable({
  providedIn: 'root'
})
export class AuthHttpService extends HttpBaseService {

  // ========================================
  // AUTENTICACIÓN
  // ========================================

  /**
   * Inicia sesión con email y contraseña
   * POST /api/auth/login
   * 
   * @returns AuthResponse con token y datos del usuario
   */
  login(credentials: UsuarioLoginDTO, options?: HttpOptions): Observable<AuthResponse> {
    return this.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials, {
      ...options,
      suppressError: true // Manejamos errores de login manualmente
    }).pipe(
      tap(response => {
        // Guardar token y usuario en localStorage
        this.saveAuthData(response.token, response.usuario);
      })
    );
  }

  /**
   * Registra un nuevo usuario y lo autentica
   * POST /api/auth/registro
   * 
   * @returns AuthResponse con token y datos del usuario
   */
  registro(userData: UsuarioRegistroDTO, options?: HttpOptions): Observable<AuthResponse> {
    return this.post<AuthResponse>(ENDPOINTS.AUTH.REGISTRO, userData, {
      ...options,
      suppressError: true
    }).pipe(
      tap(response => {
        // Guardar token y usuario en localStorage
        this.saveAuthData(response.token, response.usuario);
      })
    );
  }

  /**
   * Obtiene información del usuario autenticado actual
   * GET /api/auth/me
   * 
   * Requiere token válido en el header Authorization
   */
  getCurrentUser(options?: HttpOptions): Observable<UsuarioDTO> {
    return this.get<UsuarioDTO>(ENDPOINTS.AUTH.ME, options);
  }

  /**
   * Valida si un token es válido
   * POST /api/auth/validar
   */
  validarToken(token: string, options?: HttpOptions): Observable<TokenValidationResponse> {
    return this.post<TokenValidationResponse>(
      ENDPOINTS.AUTH.VALIDAR, 
      { token }, 
      { ...options, suppressError: true }
    );
  }

  /**
   * Cierra sesión
   * Limpia los datos de autenticación locales
   * 
   * Nota: Si el backend tuviera endpoint de logout, se llamaría aquí
   */
  logout(): void {
    this.clearAuthData();
  }

  // ========================================
  // GESTIÓN DE ALMACENAMIENTO
  // ========================================

  /**
   * Guarda datos de autenticación en localStorage
   */
  private saveAuthData(token: string, usuario: UsuarioDTO): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(usuario));
    } catch (error) {
      console.error('Error guardando datos de autenticación:', error);
    }
  }

  /**
   * Limpia datos de autenticación de localStorage
   */
  private clearAuthData(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch (error) {
      console.error('Error limpiando datos de autenticación:', error);
    }
  }

  /**
   * Obtiene el token almacenado
   */
  getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Obtiene el usuario almacenado
   */
  getStoredUser(): UsuarioDTO | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Verifica si hay una sesión almacenada
   */
  hasStoredSession(): boolean {
    return !!this.getStoredToken() && !!this.getStoredUser();
  }
}
