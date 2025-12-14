/**
 * @fileoverview Servicio de Interacciones
 * 
 * Servicio para gestionar las interacciones usuario-juego:
 * puntuaciones, reviews y estado de jugado.
 * 
 * @example
 * private interaccionesService = inject(InteraccionesService);
 * 
 * // Obtener reviews de un juego
 * this.interaccionesService.getByJuego(juegoId).subscribe(reviews => ...);
 * 
 * // Crear una review
 * this.interaccionesService.crear(usuarioId, { juegoId, puntuacion: 9, review: '...' });
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { HttpBaseService, HttpOptions } from './http-base.service';
import { ENDPOINTS } from '../core/constants';
import { 
  InteraccionDTO, 
  InteraccionCreacionDTO,
  ReviewDTO,
  GameStats,
  UserGameStats
} from '../models';

/**
 * InteraccionesService
 * 
 * Gestiona las interacciones entre usuarios y juegos:
 * - Obtener interacciones por usuario o juego
 * - Crear/actualizar puntuaciones y reviews
 * - Marcar juegos como jugados
 * - Estadísticas
 */
@Injectable({
  providedIn: 'root'
})
export class InteraccionesService extends HttpBaseService {

  // ========================================
  // OPERACIONES DE LECTURA
  // ========================================

  /**
   * Obtiene todas las interacciones (solo ADMIN)
   * GET /api/interacciones
   */
  getAll(options?: HttpOptions): Observable<InteraccionDTO[]> {
    return this.get<InteraccionDTO[]>(ENDPOINTS.INTERACCIONES.BASE, options);
  }

  /**
   * Obtiene una interacción por ID
   * GET /api/interacciones/{id}
   */
  getById(id: number, options?: HttpOptions): Observable<InteraccionDTO> {
    return this.get<InteraccionDTO>(ENDPOINTS.INTERACCIONES.BY_ID(id), options);
  }

  /**
   * Obtiene las interacciones de un usuario
   * GET /api/interacciones/usuario/{usuarioId}
   */
  getByUsuario(usuarioId: number, options?: HttpOptions): Observable<InteraccionDTO[]> {
    return this.get<InteraccionDTO[]>(ENDPOINTS.INTERACCIONES.BY_USUARIO(usuarioId), options);
  }

  /**
   * Obtiene las interacciones (reviews) de un juego
   * GET /api/interacciones/juego/{juegoId}
   */
  getByJuego(juegoId: number, options?: HttpOptions): Observable<InteraccionDTO[]> {
    return this.get<InteraccionDTO[]>(ENDPOINTS.INTERACCIONES.BY_JUEGO(juegoId), options);
  }

  /**
   * Obtiene la interacción de un usuario con un juego específico
   * GET /api/interacciones/usuario/{usuarioId}/juego/{juegoId}
   */
  getByUsuarioYJuego(
    usuarioId: number, 
    juegoId: number, 
    options?: HttpOptions
  ): Observable<InteraccionDTO | null> {
    return this.get<InteraccionDTO>(
      ENDPOINTS.INTERACCIONES.BY_USUARIO_JUEGO(usuarioId, juegoId), 
      { ...options, suppressError: true }
    ).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Obtiene los juegos jugados por un usuario
   * GET /api/interacciones/usuario/{usuarioId}/jugados
   */
  getJuegosJugados(usuarioId: number, options?: HttpOptions): Observable<InteraccionDTO[]> {
    return this.get<InteraccionDTO[]>(ENDPOINTS.INTERACCIONES.JUGADOS(usuarioId), options);
  }

  /**
   * Obtiene reviews de un juego formateadas para mostrar
   */
  getReviewsJuego(juegoId: number): Observable<ReviewDTO[]> {
    return this.getByJuego(juegoId).pipe(
      map(interacciones => 
        interacciones
          .filter(i => i.puntuacion !== null || i.review !== null)
          .map(i => ({
            id: i.id,
            nombreUsuario: i.nombreUsuario,
            avatarUsuario: i.avatarUsuario || null,
            puntuacion: i.puntuacion!,
            review: i.review || '',
            fechaInteraccion: i.fechaInteraccion
          }))
      )
    );
  }

  // ========================================
  // OPERACIONES DE ESCRITURA
  // ========================================

  /**
   * Crea una nueva interacción
   * POST /api/interacciones/usuario/{usuarioId}
   */
  crear(
    usuarioId: number, 
    interaccion: InteraccionCreacionDTO, 
    options?: HttpOptions
  ): Observable<InteraccionDTO> {
    return this.post<InteraccionDTO>(
      ENDPOINTS.INTERACCIONES.CREAR(usuarioId), 
      interaccion, 
      options
    );
  }

  /**
   * Actualiza una interacción existente
   * PUT /api/interacciones/{id}/usuario/{usuarioId}
   */
  actualizar(
    id: number,
    usuarioId: number, 
    interaccion: InteraccionCreacionDTO, 
    options?: HttpOptions
  ): Observable<InteraccionDTO> {
    return this.put<InteraccionDTO>(
      ENDPOINTS.INTERACCIONES.ACTUALIZAR(id, usuarioId), 
      interaccion, 
      options
    );
  }

  /**
   * Elimina una interacción
   * DELETE /api/interacciones/{id}/usuario/{usuarioId}
   */
  eliminar(
    id: number, 
    usuarioId: number, 
    options?: HttpOptions
  ): Observable<void> {
    return this.delete<void>(ENDPOINTS.INTERACCIONES.ELIMINAR(id, usuarioId), options);
  }

  // ========================================
  // OPERACIONES CONVENIENTES
  // ========================================

  /**
   * Crea o actualiza una interacción (upsert)
   * Útil cuando no sabemos si ya existe
   */
  crearOActualizar(
    usuarioId: number,
    juegoId: number,
    datos: Partial<InteraccionCreacionDTO>
  ): Observable<InteraccionDTO> {
    return new Observable(subscriber => {
      // Primero verificamos si existe
      this.getByUsuarioYJuego(usuarioId, juegoId).subscribe({
        next: (existente) => {
          const interaccion: InteraccionCreacionDTO = {
            juegoId,
            puntuacion: datos.puntuacion ?? existente?.puntuacion ?? null,
            review: datos.review ?? existente?.review ?? null,
            estadoJugado: datos.estadoJugado ?? existente?.estadoJugado ?? false
          };

          if (existente) {
            // Actualizar
            this.actualizar(existente.id, usuarioId, interaccion).subscribe({
              next: result => {
                subscriber.next(result);
                subscriber.complete();
              },
              error: err => subscriber.error(err)
            });
          } else {
            // Crear
            this.crear(usuarioId, interaccion).subscribe({
              next: result => {
                subscriber.next(result);
                subscriber.complete();
              },
              error: err => subscriber.error(err)
            });
          }
        },
        error: err => subscriber.error(err)
      });
    });
  }

  /**
   * Marca un juego como jugado
   */
  marcarComoJugado(usuarioId: number, juegoId: number): Observable<InteraccionDTO> {
    return this.crearOActualizar(usuarioId, juegoId, { estadoJugado: true });
  }

  /**
   * Añade o actualiza puntuación
   */
  puntuar(
    usuarioId: number, 
    juegoId: number, 
    puntuacion: number
  ): Observable<InteraccionDTO> {
    return this.crearOActualizar(usuarioId, juegoId, { 
      puntuacion, 
      estadoJugado: true 
    });
  }

  /**
   * Añade o actualiza review
   */
  escribirReview(
    usuarioId: number,
    juegoId: number,
    review: string,
    puntuacion?: number
  ): Observable<InteraccionDTO> {
    return this.crearOActualizar(usuarioId, juegoId, {
      review,
      puntuacion,
      estadoJugado: true
    });
  }

  // ========================================
  // ESTADÍSTICAS
  // ========================================

  /**
   * Calcula estadísticas de un juego desde las interacciones
   */
  getGameStats(juegoId: number): Observable<GameStats> {
    return this.getByJuego(juegoId).pipe(
      map(interacciones => {
        const conPuntuacion = interacciones.filter(i => i.puntuacion !== null);
        const conReview = interacciones.filter(i => i.review !== null && i.review !== '');
        
        const distribucion: Record<number, number> = {};
        for (let i = 1; i <= 10; i++) distribucion[i] = 0;
        conPuntuacion.forEach(i => {
          if (i.puntuacion) distribucion[i.puntuacion]++;
        });

        return {
          totalInteracciones: interacciones.length,
          totalReviews: conReview.length,
          puntuacionMedia: conPuntuacion.length > 0
            ? conPuntuacion.reduce((sum, i) => sum + (i.puntuacion || 0), 0) / conPuntuacion.length
            : null,
          distribucionPuntuaciones: distribucion
        };
      })
    );
  }

  /**
   * Calcula estadísticas de un usuario
   */
  getUserStats(usuarioId: number): Observable<UserGameStats> {
    return this.getByUsuario(usuarioId).pipe(
      map(interacciones => {
        const jugados = interacciones.filter(i => i.estadoJugado);
        const conReview = interacciones.filter(i => i.review !== null && i.review !== '');
        const conPuntuacion = interacciones.filter(i => i.puntuacion !== null);

        const distribucion: Record<number, number> = {};
        for (let i = 1; i <= 10; i++) distribucion[i] = 0;
        conPuntuacion.forEach(i => {
          if (i.puntuacion) distribucion[i.puntuacion]++;
        });

        return {
          totalJuegos: interacciones.length,
          juegosCompletados: jugados.length,
          juegosRevieweados: conReview.length,
          puntuacionMediaDada: conPuntuacion.length > 0
            ? conPuntuacion.reduce((sum, i) => sum + (i.puntuacion || 0), 0) / conPuntuacion.length
            : null,
          distribucionPuntuaciones: distribucion
        };
      })
    );
  }
}
