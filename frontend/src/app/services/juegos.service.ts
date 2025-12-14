/**
 * @fileoverview Servicio de Juegos
 * 
 * Servicio para operaciones CRUD y búsquedas de juegos.
 * Extiende HttpBaseService para heredar funcionalidad común.
 * 
 * @example
 * private juegosService = inject(JuegosService);
 * 
 * // Obtener todos los juegos
 * this.juegosService.getAll().subscribe(juegos => ...);
 * 
 * // Buscar juegos
 * this.juegosService.buscar('zelda').subscribe(resultados => ...);
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpBaseService, HttpOptions } from './http-base.service';
import { ENDPOINTS } from '../core/constants';
import { 
  JuegoDTO, 
  JuegoResumenDTO, 
  JuegoCreacionDTO,
  JuegoBusquedaParams 
} from '../models';

/**
 * JuegosService
 * 
 * Gestiona todas las operaciones relacionadas con juegos:
 * - Listados (todos, novedades, populares, top)
 * - Detalle de juego
 * - Búsqueda
 * - CRUD (admin)
 */
@Injectable({
  providedIn: 'root'
})
export class JuegosService extends HttpBaseService {

  // ========================================
  // OPERACIONES DE LECTURA
  // ========================================

  /**
   * Obtiene todos los juegos (resumen)
   * GET /api/juegos
   */
  getAll(options?: HttpOptions): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.BASE, options);
  }

  /**
   * Obtiene un juego por ID (detalle completo)
   * GET /api/juegos/{id}
   */
  getById(id: number, options?: HttpOptions): Observable<JuegoDTO> {
    return this.get<JuegoDTO>(ENDPOINTS.JUEGOS.BY_ID(id), options);
  }

  /**
   * Busca juegos por nombre
   * GET /api/juegos/buscar?nombre=xxx
   */
  buscar(nombre: string, options?: HttpOptions): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.BUSCAR, {
      ...options,
      params: { ...options?.params, nombre }
    });
  }

  /**
   * Búsqueda avanzada con múltiples filtros
   */
  buscarAvanzado(params: JuegoBusquedaParams): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.BUSCAR, {
      params: {
        nombre: params.nombre,
        generoId: params.generoId,
        plataformaId: params.plataformaId,
        desarrolladoraId: params.desarrolladoraId,
        ordenarPor: params.ordenarPor,
        orden: params.orden
      }
    });
  }

  /**
   * Obtiene los juegos más recientes
   * GET /api/juegos/novedades
   */
  getNovedades(options?: HttpOptions): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.NOVEDADES, options);
  }

  /**
   * Obtiene los próximos lanzamientos
   * GET /api/juegos/proximos
   */
  getProximosLanzamientos(options?: HttpOptions): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.PROXIMOS, options);
  }

  /**
   * Obtiene los juegos mejor valorados
   * GET /api/juegos/top?limite=10
   */
  getTopRated(limite: number = 10, options?: HttpOptions): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.TOP, {
      ...options,
      params: { ...options?.params, limite }
    });
  }

  /**
   * Obtiene los juegos más populares (más reviews)
   * GET /api/juegos/populares?limite=10
   */
  getPopulares(limite: number = 10, options?: HttpOptions): Observable<JuegoResumenDTO[]> {
    return this.get<JuegoResumenDTO[]>(ENDPOINTS.JUEGOS.POPULARES, {
      ...options,
      params: { ...options?.params, limite }
    });
  }

  // ========================================
  // OPERACIONES DE ESCRITURA (ADMIN)
  // ========================================

  /**
   * Crea un nuevo juego
   * POST /api/juegos
   * Requiere rol ADMIN
   */
  crear(juego: JuegoCreacionDTO, options?: HttpOptions): Observable<JuegoDTO> {
    return this.post<JuegoDTO>(ENDPOINTS.JUEGOS.BASE, juego, options);
  }

  /**
   * Actualiza un juego existente
   * PUT /api/juegos/{id}
   * Requiere rol ADMIN
   */
  actualizar(id: number, juego: JuegoCreacionDTO, options?: HttpOptions): Observable<JuegoDTO> {
    return this.put<JuegoDTO>(ENDPOINTS.JUEGOS.BY_ID(id), juego, options);
  }

  /**
   * Elimina un juego
   * DELETE /api/juegos/{id}
   * Requiere rol ADMIN
   */
  eliminar(id: number, options?: HttpOptions): Observable<void> {
    return this.delete<void>(ENDPOINTS.JUEGOS.BY_ID(id), options);
  }

  // ========================================
  // UTILIDADES
  // ========================================

  /**
   * Verifica si un juego existe
   */
  existe(id: number): Observable<boolean> {
    return this.getById(id, { suppressError: true }).pipe(
      map(() => true)
    );
  }

  /**
   * Obtiene múltiples juegos por IDs
   */
  getByIds(ids: number[]): Observable<JuegoDTO[]> {
    // Si el backend no tiene endpoint batch, hacemos peticiones paralelas
    // En producción, sería mejor tener un endpoint /juegos/batch
    const requests = ids.map(id => this.getById(id, { suppressError: true }));
    return new Observable(subscriber => {
      Promise.all(requests.map(r => r.toPromise()))
        .then(results => {
          subscriber.next(results.filter((r): r is JuegoDTO => r !== undefined));
          subscriber.complete();
        })
        .catch(error => subscriber.error(error));
    });
  }
}
