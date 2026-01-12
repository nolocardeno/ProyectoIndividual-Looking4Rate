/**
 * @fileoverview Servicio de Usuarios
 * 
 * Servicio para operaciones relacionadas con usuarios.
 * Extiende HttpBaseService para heredar funcionalidad común.
 * 
 * Nota: Para autenticación (login/registro), usar AuthHttpService
 * 
 * @example
 * private usuariosService = inject(UsuariosService);
 * 
 * // Obtener perfil de usuario
 * this.usuariosService.getById(userId).subscribe(usuario => ...);
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpBaseService, HttpOptions } from './http-base.service';
import { ENDPOINTS } from '../core/constants';
import { UsuarioDTO, UsuarioRegistroDTO } from '../models';

/**
 * UsuariosService
 * 
 * Gestiona operaciones de usuarios (no autenticación):
 * - Obtener perfiles
 * - Actualizar datos
 * - Búsquedas (admin)
 */
@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends HttpBaseService {

  // ========================================
  // OPERACIONES DE LECTURA
  // ========================================

  /**
   * Obtiene todos los usuarios (solo ADMIN)
   * GET /api/usuarios
   */
  getAll(options?: HttpOptions): Observable<UsuarioDTO[]> {
    return this.get<UsuarioDTO[]>(ENDPOINTS.USUARIOS.BASE, options);
  }

  /**
   * Obtiene un usuario por ID
   * GET /api/usuarios/{id}
   */
  getById(id: number, options?: HttpOptions): Observable<UsuarioDTO> {
    return this.get<UsuarioDTO>(ENDPOINTS.USUARIOS.BY_ID(id), options);
  }

  /**
   * Busca usuarios por nombre (solo ADMIN)
   * GET /api/usuarios/buscar?nombre=xxx
   */
  buscarPorNombre(nombre: string, options?: HttpOptions): Observable<UsuarioDTO[]> {
    return this.get<UsuarioDTO[]>(ENDPOINTS.USUARIOS.BUSCAR, {
      ...options,
      params: { ...options?.params, nombre }
    });
  }

  /**
   * Obtiene un usuario por email (solo ADMIN)
   * GET /api/usuarios/email/{email}
   */
  getByEmail(email: string, options?: HttpOptions): Observable<UsuarioDTO> {
    return this.get<UsuarioDTO>(ENDPOINTS.USUARIOS.BY_EMAIL(email), options);
  }

  // ========================================
  // OPERACIONES DE ESCRITURA
  // ========================================

  /**
   * Registra un nuevo usuario
   * POST /api/usuarios
   * 
   * Nota: Para registro con login automático, usar AuthHttpService.registro()
   */
  registrar(usuario: UsuarioRegistroDTO, options?: HttpOptions): Observable<UsuarioDTO> {
    return this.post<UsuarioDTO>(ENDPOINTS.USUARIOS.BASE, usuario, options);
  }

  /**
   * Actualiza el avatar de un usuario
   * PUT /api/usuarios/{id}/avatar
   */
  actualizarAvatar(
    id: number, 
    avatarUrl: string, 
    options?: HttpOptions
  ): Observable<UsuarioDTO> {
    return this.put<UsuarioDTO>(ENDPOINTS.USUARIOS.AVATAR(id), { avatarUrl }, options);
  }

  /**
   * Elimina un usuario (solo ADMIN)
   * DELETE /api/usuarios/{id}
   */
  eliminar(id: number, options?: HttpOptions): Observable<void> {
    return this.delete<void>(ENDPOINTS.USUARIOS.BY_ID(id), options);
  }

  // ========================================
  // OPERACIONES DE PERFIL
  // ========================================

  /**
   * Actualiza el perfil del usuario (nombre y email)
   * La contraseña es opcional - si no se envía, se mantiene la actual
   */
  actualizarPerfil(
    id: number, 
    datos: { nombre: string; email: string; contrasenia?: string }
  ): Observable<UsuarioDTO> {
    return this.put<UsuarioDTO>(ENDPOINTS.USUARIOS.BY_ID(id), datos);
  }

  /**
   * Cambia la contraseña del usuario
   * Requiere la contraseña actual para validación
   * PUT /api/usuarios/{id}/contrasenia
   * 
   * NOTA: Usa header X-Skip-Error-Handler para evitar que el interceptor
   * cierre la sesión cuando la contraseña actual es incorrecta (401)
   */
  cambiarContrasenia(
    id: number, 
    contraseniaActual: string,
    contraseniaNueva: string
  ): Observable<UsuarioDTO> {
    return this.put<UsuarioDTO>(
      ENDPOINTS.USUARIOS.CONTRASENIA(id), 
      { contraseniaActual, contraseniaNueva },
      { headers: { 'X-Skip-Error-Handler': 'true' } }
    );
  }
}
