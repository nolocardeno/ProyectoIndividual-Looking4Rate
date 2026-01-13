/**
 * @fileoverview GameStateService - Servicio de Estado Centralizado con Signals
 * 
 * Implementa el patrón de gestión de estado moderno usando Angular Signals.
 * Proporciona un almacén reactivo y centralizado para:
 * - Juegos e interacciones del usuario
 * - Actualización dinámica sin recargas
 * - Sincronización entre componentes
 * 
 * @example
 * private gameState = inject(GameStateService);
 * 
 * // Obtener interacciones
 * this.gameState.userInteractions(); // Signal<InteraccionDTO[]>
 * 
 * // Actualizar después de crear/editar
 * this.gameState.updateInteraction(interaction);
 */

import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';

import { InteraccionDTO, JuegoResumenDTO, UserGameStats } from '../models';

/**
 * Evento de actualización de estado
 */
export interface StateUpdateEvent {
  type: 'interaction-created' | 'interaction-updated' | 'interaction-deleted' | 'game-rated' | 'review-added';
  payload: any;
  timestamp: Date;
}

/**
 * Cache de juegos por ID
 */
interface GameCache {
  [key: number]: {
    data: JuegoResumenDTO;
    timestamp: number;
  };
}

/**
 * GameStateService
 * 
 * Servicio centralizado para gestión de estado usando Angular Signals.
 * Permite:
 * - Actualización reactiva de listas sin recargas
 * - Sincronización de contadores y estadísticas
 * - Cache de datos para evitar peticiones duplicadas
 * - Eventos de actualización entre componentes
 */
@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // ========================================
  // SIGNALS DE ESTADO
  // ========================================

  /** Interacciones del usuario actual */
  private _userInteractions = signal<InteraccionDTO[]>([]);
  public readonly userInteractions = this._userInteractions.asReadonly();

  /** ID del usuario actual (para invalidar cache) */
  private _currentUserId = signal<number | null>(null);
  public readonly currentUserId = this._currentUserId.asReadonly();

  /** Reviews del juego actual (para página de detalle) */
  private _currentGameReviews = signal<InteraccionDTO[]>([]);
  public readonly currentGameReviews = this._currentGameReviews.asReadonly();

  /** ID del juego actual */
  private _currentGameId = signal<number | null>(null);
  public readonly currentGameId = this._currentGameId.asReadonly();

  /** Estado de carga global */
  private _isLoading = signal(false);
  public readonly isLoading = this._isLoading.asReadonly();

  /** Cache de juegos */
  private _gamesCache = signal<GameCache>({});

  /** Posición de scroll guardada por ruta */
  private _scrollPositions = signal<{ [route: string]: number }>({});

  // ========================================
  // COMPUTED SIGNALS (DERIVADOS)
  // ========================================

  /** Estadísticas del usuario calculadas */
  public readonly userStats = computed<UserGameStats>(() => {
    const interactions = this._userInteractions();
    const conPuntuacion = interactions.filter((i: InteraccionDTO) => i.puntuacion !== null && i.puntuacion !== undefined);
    const promedio = conPuntuacion.length > 0 
      ? conPuntuacion.reduce((sum: number, i: InteraccionDTO) => sum + (i.puntuacion || 0), 0) / conPuntuacion.length
      : null;
    
    // Calcular distribución de puntuaciones
    const distribucion: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    conPuntuacion.forEach((i: InteraccionDTO) => {
      if (i.puntuacion && i.puntuacion >= 1 && i.puntuacion <= 5) {
        distribucion[i.puntuacion] = (distribucion[i.puntuacion] || 0) + 1;
      }
    });
    
    return {
      totalJuegos: interactions.filter((i: InteraccionDTO) => i.estadoJugado).length,
      juegosCompletados: interactions.filter((i: InteraccionDTO) => i.estadoJugado).length,
      juegosRevieweados: interactions.filter((i: InteraccionDTO) => i.review && i.review.trim().length > 0).length,
      puntuacionMediaDada: promedio,
      distribucionPuntuaciones: distribucion
    };
  });

  /** Juegos jugados del usuario */
  public readonly playedGames = computed(() => 
    this._userInteractions().filter((i: InteraccionDTO) => i.estadoJugado)
  );

  /** Reviews del usuario */
  public readonly userReviews = computed(() => 
    this._userInteractions().filter((i: InteraccionDTO) => i.review && i.review.trim().length > 0)
  );

  /** Número de reviews del juego actual */
  public readonly currentGameReviewsCount = computed(() => 
    this._currentGameReviews().length
  );

  // ========================================
  // EVENTOS
  // ========================================

  /** Subject para eventos de actualización */
  private updateEvents$ = new Subject<StateUpdateEvent>();

  /** Observable de eventos de actualización */
  public readonly updates$ = this.updateEvents$.asObservable();

  // ========================================
  // MÉTODOS DE ACTUALIZACIÓN
  // ========================================

  /**
   * Establece el usuario actual y limpia el cache si cambió
   */
  setCurrentUser(userId: number | null): void {
    const previousUserId = this._currentUserId();
    this._currentUserId.set(userId);
    
    // Limpiar interacciones si cambió el usuario
    if (previousUserId !== userId) {
      this._userInteractions.set([]);
    }
  }

  /**
   * Carga las interacciones del usuario (llamar desde componentes)
   */
  setUserInteractions(interactions: InteraccionDTO[]): void {
    this._userInteractions.set(interactions);
  }

  /**
   * Añade una nueva interacción y emite evento
   */
  addInteraction(interaction: InteraccionDTO): void {
    this._userInteractions.update((list: InteraccionDTO[]) => [...list, interaction]);
    
    this.emitEvent('interaction-created', interaction);
    
    // Si es del juego actual, actualizar sus reviews
    if (interaction.juegoId === this._currentGameId() && interaction.review) {
      this._currentGameReviews.update((reviews: InteraccionDTO[]) => [interaction, ...reviews]);
    }
  }

  /**
   * Actualiza una interacción existente
   */
  updateInteraction(updated: InteraccionDTO): void {
    this._userInteractions.update((list: InteraccionDTO[]) => 
      list.map((i: InteraccionDTO) => i.id === updated.id ? updated : i)
    );
    
    this.emitEvent('interaction-updated', updated);

    // Actualizar en reviews del juego actual si aplica
    if (updated.juegoId === this._currentGameId()) {
      this._currentGameReviews.update((reviews: InteraccionDTO[]) => {
        const exists = reviews.some((r: InteraccionDTO) => r.id === updated.id);
        if (exists) {
          return reviews.map((r: InteraccionDTO) => r.id === updated.id ? updated : r);
        } else if (updated.review && updated.review.trim().length > 0) {
          return [updated, ...reviews];
        }
        return reviews;
      });
    }
  }

  /**
   * Elimina una interacción
   */
  removeInteraction(interactionId: number): void {
    const removed = this._userInteractions().find((i: InteraccionDTO) => i.id === interactionId);
    
    this._userInteractions.update((list: InteraccionDTO[]) => 
      list.filter((i: InteraccionDTO) => i.id !== interactionId)
    );
    
    if (removed) {
      this.emitEvent('interaction-deleted', removed);
    }

    // Quitar de reviews del juego actual
    this._currentGameReviews.update((reviews: InteraccionDTO[]) => 
      reviews.filter((r: InteraccionDTO) => r.id !== interactionId)
    );
  }

  /**
   * Obtiene la interacción del usuario para un juego específico
   */
  getInteractionForGame(gameId: number): InteraccionDTO | undefined {
    return this._userInteractions().find((i: InteraccionDTO) => i.juegoId === gameId);
  }

  /**
   * Actualiza o añade interacción (upsert)
   */
  upsertInteraction(interaction: InteraccionDTO): void {
    const exists = this._userInteractions().some((i: InteraccionDTO) => i.id === interaction.id);
    
    if (exists) {
      this.updateInteraction(interaction);
    } else {
      this.addInteraction(interaction);
    }
  }

  // ========================================
  // GESTIÓN DE REVIEWS DEL JUEGO
  // ========================================

  /**
   * Establece el juego actual y sus reviews
   */
  setCurrentGame(gameId: number, reviews: InteraccionDTO[]): void {
    this._currentGameId.set(gameId);
    this._currentGameReviews.set(reviews);
  }

  /**
   * Limpia el juego actual
   */
  clearCurrentGame(): void {
    this._currentGameId.set(null);
    this._currentGameReviews.set([]);
  }

  /**
   * Añade una review al juego actual
   */
  addGameReview(review: InteraccionDTO): void {
    this._currentGameReviews.update((reviews: InteraccionDTO[]) => [review, ...reviews]);
    this.emitEvent('review-added', review);
  }

  // ========================================
  // GESTIÓN DE SCROLL POSITION
  // ========================================

  /**
   * Guarda la posición de scroll para una ruta
   */
  saveScrollPosition(route: string): void {
    if (!this.isBrowser) return;
    
    const position = window.scrollY;
    this._scrollPositions.update((positions: { [route: string]: number }) => ({
      ...positions,
      [route]: position
    }));
  }

  /**
   * Restaura la posición de scroll para una ruta
   */
  restoreScrollPosition(route: string): void {
    if (!this.isBrowser) return;
    
    const position = this._scrollPositions()[route];
    if (position !== undefined) {
      // Usar requestAnimationFrame para asegurar que el DOM está listo
      requestAnimationFrame(() => {
        window.scrollTo({ top: position, behavior: 'instant' });
      });
    }
  }

  /**
   * Limpia la posición de scroll guardada
   */
  clearScrollPosition(route: string): void {
    this._scrollPositions.update((positions: { [route: string]: number }) => {
      const { [route]: _, ...rest } = positions;
      return rest;
    });
  }

  // ========================================
  // CACHE DE JUEGOS
  // ========================================

  /**
   * Obtiene un juego del cache
   */
  getGameFromCache(gameId: number): JuegoResumenDTO | null {
    const cached = this._gamesCache()[gameId];
    if (!cached) return null;
    
    // Cache válido por 5 minutos
    const CACHE_TTL = 5 * 60 * 1000;
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      return null;
    }
    
    return cached.data;
  }

  /**
   * Guarda un juego en cache
   */
  cacheGame(game: JuegoResumenDTO): void {
    this._gamesCache.update((cache: GameCache) => ({
      ...cache,
      [game.id]: {
        data: game,
        timestamp: Date.now()
      }
    }));
  }

  /**
   * Limpia el cache de juegos
   */
  clearGamesCache(): void {
    this._gamesCache.set({});
  }

  // ========================================
  // ESTADO DE CARGA
  // ========================================

  /**
   * Establece el estado de carga global
   */
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // ========================================
  // UTILIDADES PRIVADAS
  // ========================================

  /**
   * Calcula el promedio de puntuaciones
   */
  private calcularPromedioEstrellas(interactions: InteraccionDTO[]): number {
    const conPuntuacion = interactions.filter(i => i.puntuacion !== null && i.puntuacion !== undefined);
    if (conPuntuacion.length === 0) return 0;
    
    const suma = conPuntuacion.reduce((acc, i) => acc + (i.puntuacion || 0), 0);
    return Math.round((suma / conPuntuacion.length) * 10) / 10;
  }

  /**
   * Emite un evento de actualización
   */
  private emitEvent(type: StateUpdateEvent['type'], payload: any): void {
    this.updateEvents$.next({
      type,
      payload,
      timestamp: new Date()
    });
  }

  /**
   * Resetea todo el estado (para logout)
   */
  reset(): void {
    this._userInteractions.set([]);
    this._currentUserId.set(null);
    this._currentGameId.set(null);
    this._currentGameReviews.set([]);
    this._gamesCache.set({});
    this._scrollPositions.set({});
  }
}
