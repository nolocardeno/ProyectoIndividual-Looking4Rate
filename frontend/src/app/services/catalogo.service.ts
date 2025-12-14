/**
 * @fileoverview Servicio de Catálogos
 * 
 * Servicio para obtener datos de catálogo:
 * plataformas, géneros y desarrolladoras.
 * 
 * @example
 * private catalogoService = inject(CatalogoService);
 * 
 * // Obtener todas las plataformas
 * this.catalogoService.getPlataformas().subscribe(plataformas => ...);
 */

import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { HttpBaseService, HttpOptions } from './http-base.service';
import { ENDPOINTS } from '../core/constants';
import { 
  PlataformaDTO, 
  PlataformaCreacionDTO,
  GeneroDTO, 
  GeneroCreacionDTO,
  DesarrolladoraDTO, 
  DesarrolladoraCreacionDTO,
  CatalogoOption
} from '../models';
import { map } from 'rxjs/operators';

/**
 * CatalogoService
 * 
 * Gestiona los datos de catálogo de la aplicación.
 * Incluye caché para evitar peticiones repetidas.
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogoService extends HttpBaseService {

  // Cache de datos (shareReplay mantiene la última emisión)
  private plataformasCache$?: Observable<PlataformaDTO[]>;
  private generosCache$?: Observable<GeneroDTO[]>;
  private desarrolladorasCache$?: Observable<DesarrolladoraDTO[]>;

  // ========================================
  // PLATAFORMAS
  // ========================================

  /**
   * Obtiene todas las plataformas (con caché)
   * GET /api/plataformas
   */
  getPlataformas(options?: HttpOptions): Observable<PlataformaDTO[]> {
    if (!this.plataformasCache$) {
      this.plataformasCache$ = this.get<PlataformaDTO[]>(
        ENDPOINTS.PLATAFORMAS.BASE, 
        options
      ).pipe(shareReplay(1));
    }
    return this.plataformasCache$;
  }

  /**
   * Obtiene una plataforma por ID
   * GET /api/plataformas/{id}
   */
  getPlataforma(id: number, options?: HttpOptions): Observable<PlataformaDTO> {
    return this.get<PlataformaDTO>(ENDPOINTS.PLATAFORMAS.BY_ID(id), options);
  }

  /**
   * Busca plataformas por nombre
   * GET /api/plataformas/buscar?nombre=xxx
   */
  buscarPlataformas(nombre: string, options?: HttpOptions): Observable<PlataformaDTO[]> {
    return this.get<PlataformaDTO[]>(ENDPOINTS.PLATAFORMAS.BUSCAR, {
      ...options,
      params: { ...options?.params, nombre }
    });
  }

  /**
   * Obtiene plataformas por fabricante
   * GET /api/plataformas/fabricante/{fabricante}
   */
  getPlataformasPorFabricante(
    fabricante: string, 
    options?: HttpOptions
  ): Observable<PlataformaDTO[]> {
    return this.get<PlataformaDTO[]>(
      ENDPOINTS.PLATAFORMAS.BY_FABRICANTE(fabricante), 
      options
    );
  }

  /**
   * Obtiene plataformas más recientes
   * GET /api/plataformas/recientes
   */
  getPlataformasRecientes(options?: HttpOptions): Observable<PlataformaDTO[]> {
    return this.get<PlataformaDTO[]>(ENDPOINTS.PLATAFORMAS.RECIENTES, options);
  }

  /**
   * Crea una plataforma (ADMIN)
   */
  crearPlataforma(
    plataforma: PlataformaCreacionDTO, 
    options?: HttpOptions
  ): Observable<PlataformaDTO> {
    this.invalidatePlataformasCache();
    return this.post<PlataformaDTO>(ENDPOINTS.PLATAFORMAS.BASE, plataforma, options);
  }

  /**
   * Actualiza una plataforma (ADMIN)
   */
  actualizarPlataforma(
    id: number, 
    plataforma: PlataformaCreacionDTO, 
    options?: HttpOptions
  ): Observable<PlataformaDTO> {
    this.invalidatePlataformasCache();
    return this.put<PlataformaDTO>(ENDPOINTS.PLATAFORMAS.BY_ID(id), plataforma, options);
  }

  /**
   * Elimina una plataforma (ADMIN)
   */
  eliminarPlataforma(id: number, options?: HttpOptions): Observable<void> {
    this.invalidatePlataformasCache();
    return this.delete<void>(ENDPOINTS.PLATAFORMAS.BY_ID(id), options);
  }

  // ========================================
  // GÉNEROS
  // ========================================

  /**
   * Obtiene todos los géneros (con caché)
   * GET /api/generos
   */
  getGeneros(options?: HttpOptions): Observable<GeneroDTO[]> {
    if (!this.generosCache$) {
      this.generosCache$ = this.get<GeneroDTO[]>(
        ENDPOINTS.GENEROS.BASE, 
        options
      ).pipe(shareReplay(1));
    }
    return this.generosCache$;
  }

  /**
   * Obtiene un género por ID
   * GET /api/generos/{id}
   */
  getGenero(id: number, options?: HttpOptions): Observable<GeneroDTO> {
    return this.get<GeneroDTO>(ENDPOINTS.GENEROS.BY_ID(id), options);
  }

  /**
   * Busca géneros por nombre
   * GET /api/generos/buscar?nombre=xxx
   */
  buscarGeneros(nombre: string, options?: HttpOptions): Observable<GeneroDTO[]> {
    return this.get<GeneroDTO[]>(ENDPOINTS.GENEROS.BUSCAR, {
      ...options,
      params: { ...options?.params, nombre }
    });
  }

  /**
   * Crea un género (ADMIN)
   */
  crearGenero(genero: GeneroCreacionDTO, options?: HttpOptions): Observable<GeneroDTO> {
    this.invalidateGenerosCache();
    return this.post<GeneroDTO>(ENDPOINTS.GENEROS.BASE, genero, options);
  }

  /**
   * Actualiza un género (ADMIN)
   */
  actualizarGenero(
    id: number, 
    genero: GeneroCreacionDTO, 
    options?: HttpOptions
  ): Observable<GeneroDTO> {
    this.invalidateGenerosCache();
    return this.put<GeneroDTO>(ENDPOINTS.GENEROS.BY_ID(id), genero, options);
  }

  /**
   * Elimina un género (ADMIN)
   */
  eliminarGenero(id: number, options?: HttpOptions): Observable<void> {
    this.invalidateGenerosCache();
    return this.delete<void>(ENDPOINTS.GENEROS.BY_ID(id), options);
  }

  // ========================================
  // DESARROLLADORAS
  // ========================================

  /**
   * Obtiene todas las desarrolladoras (con caché)
   * GET /api/desarrolladoras
   */
  getDesarrolladoras(options?: HttpOptions): Observable<DesarrolladoraDTO[]> {
    if (!this.desarrolladorasCache$) {
      this.desarrolladorasCache$ = this.get<DesarrolladoraDTO[]>(
        ENDPOINTS.DESARROLLADORAS.BASE, 
        options
      ).pipe(shareReplay(1));
    }
    return this.desarrolladorasCache$;
  }

  /**
   * Obtiene una desarrolladora por ID
   * GET /api/desarrolladoras/{id}
   */
  getDesarrolladora(id: number, options?: HttpOptions): Observable<DesarrolladoraDTO> {
    return this.get<DesarrolladoraDTO>(ENDPOINTS.DESARROLLADORAS.BY_ID(id), options);
  }

  /**
   * Busca desarrolladoras por nombre
   * GET /api/desarrolladoras/buscar?nombre=xxx
   */
  buscarDesarrolladoras(nombre: string, options?: HttpOptions): Observable<DesarrolladoraDTO[]> {
    return this.get<DesarrolladoraDTO[]>(ENDPOINTS.DESARROLLADORAS.BUSCAR, {
      ...options,
      params: { ...options?.params, nombre }
    });
  }

  /**
   * Obtiene desarrolladoras por país
   * GET /api/desarrolladoras/pais/{pais}
   */
  getDesarrolladorasPorPais(
    pais: string, 
    options?: HttpOptions
  ): Observable<DesarrolladoraDTO[]> {
    return this.get<DesarrolladoraDTO[]>(
      ENDPOINTS.DESARROLLADORAS.BY_PAIS(pais), 
      options
    );
  }

  /**
   * Crea una desarrolladora (ADMIN)
   */
  crearDesarrolladora(
    desarrolladora: DesarrolladoraCreacionDTO, 
    options?: HttpOptions
  ): Observable<DesarrolladoraDTO> {
    this.invalidateDesarrolladorasCache();
    return this.post<DesarrolladoraDTO>(
      ENDPOINTS.DESARROLLADORAS.BASE, 
      desarrolladora, 
      options
    );
  }

  /**
   * Actualiza una desarrolladora (ADMIN)
   */
  actualizarDesarrolladora(
    id: number, 
    desarrolladora: DesarrolladoraCreacionDTO, 
    options?: HttpOptions
  ): Observable<DesarrolladoraDTO> {
    this.invalidateDesarrolladorasCache();
    return this.put<DesarrolladoraDTO>(
      ENDPOINTS.DESARROLLADORAS.BY_ID(id), 
      desarrolladora, 
      options
    );
  }

  /**
   * Elimina una desarrolladora (ADMIN)
   */
  eliminarDesarrolladora(id: number, options?: HttpOptions): Observable<void> {
    this.invalidateDesarrolladorasCache();
    return this.delete<void>(ENDPOINTS.DESARROLLADORAS.BY_ID(id), options);
  }

  // ========================================
  // UTILIDADES PARA SELECTS
  // ========================================

  /**
   * Obtiene plataformas formateadas para select
   */
  getPlataformasOptions(): Observable<CatalogoOption[]> {
    return this.getPlataformas().pipe(
      map(plataformas => plataformas.map(p => ({
        value: p.id,
        label: p.nombre,
        data: p
      })))
    );
  }

  /**
   * Obtiene géneros formateados para select
   */
  getGenerosOptions(): Observable<CatalogoOption[]> {
    return this.getGeneros().pipe(
      map(generos => generos.map(g => ({
        value: g.id,
        label: g.nombre,
        data: g
      })))
    );
  }

  /**
   * Obtiene desarrolladoras formateadas para select
   */
  getDesarrolladorasOptions(): Observable<CatalogoOption[]> {
    return this.getDesarrolladoras().pipe(
      map(desarrolladoras => desarrolladoras.map(d => ({
        value: d.id,
        label: d.nombre,
        data: d
      })))
    );
  }

  // ========================================
  // GESTIÓN DE CACHÉ
  // ========================================

  /**
   * Invalida la caché de plataformas
   */
  invalidatePlataformasCache(): void {
    this.plataformasCache$ = undefined;
  }

  /**
   * Invalida la caché de géneros
   */
  invalidateGenerosCache(): void {
    this.generosCache$ = undefined;
  }

  /**
   * Invalida la caché de desarrolladoras
   */
  invalidateDesarrolladorasCache(): void {
    this.desarrolladorasCache$ = undefined;
  }

  /**
   * Invalida toda la caché
   */
  invalidateAllCache(): void {
    this.invalidatePlataformasCache();
    this.invalidateGenerosCache();
    this.invalidateDesarrolladorasCache();
  }
}
