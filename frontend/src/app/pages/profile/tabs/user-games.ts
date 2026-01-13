import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, of, catchError } from 'rxjs';

import { GameCover } from '../../../components/shared/game-cover/game-cover';
import { StarRating } from '../../../components/shared/star-rating/star-rating';
import { Pagination } from '../../../components/shared/pagination/pagination';
import { Button } from '../../../components/shared/button/button';
import { FeaturedSection } from '../../../components/shared/featured-section/featured-section';
import { InteraccionesService, GameStateService, AuthService } from '../../../services';
import { InteraccionDTO } from '../../../models';

/** Número de juegos por página */
const GAMES_PER_PAGE = 15;

/**
 * @component UserGamesTab
 * @description Tab que muestra los juegos del usuario en su perfil
 */
@Component({
  selector: 'app-user-games',
  imports: [RouterLink, GameCover, StarRating, Pagination, Button, FeaturedSection],
  templateUrl: './user-games.html',
  styleUrl: './user-games.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UserGamesTab implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private interaccionesService = inject(InteraccionesService);
  private gameStateService = inject(GameStateService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  /** ID del usuario */
  private userId = signal<number | null>(null);
  
  /** Lista de juegos (interacciones) */
  games = signal<InteraccionDTO[]>([]);
  
  /** Estado de carga */
  loading = signal(true);
  
  /** Error */
  error = signal<string | null>(null);
  
  /** Página actual */
  currentPage = signal(1);
  
  /** Items para skeleton */
  skeletonItems = Array.from({ length: 15 }, (_, i) => i);
  
  /** Juegos ordenados por fecha de añadido (más recientes primero) */
  sortedGames = computed(() => {
    const gamesList = [...this.games()];
    return gamesList.sort((a, b) => 
      new Date(b.fechaInteraccion).getTime() - new Date(a.fechaInteraccion).getTime()
    );
  });
  
  /** Total de páginas */
  totalPages = computed(() => 
    Math.max(1, Math.ceil(this.sortedGames().length / GAMES_PER_PAGE))
  );
  
  /** Juegos de la página actual */
  paginatedGames = computed(() => {
    const start = (this.currentPage() - 1) * GAMES_PER_PAGE;
    const end = start + GAMES_PER_PAGE;
    return this.sortedGames().slice(start, end);
  });

  ngOnInit(): void {
    // Obtener el userId del padre (profile)
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = parseInt(params['id'], 10) || null;
        this.userId.set(id);
        if (id) {
          this.loadGames();
        }
      });
    
    // Suscribirse a cambios del estado global para actualizar dinámicamente
    this.gameStateService.updates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const currentUserId = this.authService.getCurrentUserId();
        // Solo refrescar si es el perfil del usuario actual y hubo un cambio relevante
        if (this.userId() === currentUserId && 
            (event.type === 'interaction-created' || 
             event.type === 'interaction-updated' || 
             event.type === 'interaction-deleted')) {
          // Usar los datos del estado global en lugar de recargar
          const playedGames = this.gameStateService.playedGames();
          if (playedGames.length > 0) {
            this.games.set(playedGames);
          }
        }
      });
  }
  
  /**
   * Carga los juegos del usuario
   */
  loadGames(): void {
    const userId = this.userId();
    if (!userId) return;
    
    this.loading.set(true);
    this.error.set(null);
    
    this.interaccionesService.getByUsuario(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Error cargando juegos:', err);
          this.error.set('Error al cargar los juegos');
          return of([]);
        })
      )
      .subscribe(interacciones => {
        // Filtrar solo los que tienen estado jugado
        this.games.set(interacciones.filter(i => i.estadoJugado));
        this.loading.set(false);
      });
  }
  
  /**
   * Cambia de página
   */
  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Convierte puntuación de 1-10 a 1-5 estrellas
   */
  convertToStars(puntuacion: number | null): number | null {
    if (puntuacion === null) return null;
    return Math.round(puntuacion / 2);
  }

  /**
   * TrackBy para optimizar el rendimiento de la lista de juegos
   */
  trackByGameId(index: number, game: InteraccionDTO): number {
    return game.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
