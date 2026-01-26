import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { GameCard, GamePlatform } from '../../components/shared/game-card/game-card';
import { GameGallery } from '../../components/shared/game-gallery/game-gallery';
import { GameInteractionPanel } from '../../components/shared/game-interaction-panel/game-interaction-panel';
import { ReviewFormModal } from '../../components/shared/review-form-modal/review-form-modal';
import { UserReviewComponent } from '../../components/shared/user-review/user-review';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';
import { JuegosService } from '../../services/juegos.service';
import { InteraccionesService } from '../../services/interacciones.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { GameStateService } from '../../services/game-state.service';
import { JuegoDTO, InteraccionDTO, ReviewDTO } from '../../models';

export interface UserReviewData {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  avatarUsuario?: string;
  puntuacion: number;
  review: string;
  fechaInteraccion: string;
}

/**
 * @component GameDetailPage
 * @description Página de detalle de un juego específico.
 * Muestra información completa del juego, permite interacciones
 * (puntuar, marcar como jugado, escribir review) y muestra reviews.
 * 
 * @example
 * // Ruta: /juego/1
 */
@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, GameCard, GameGallery, GameInteractionPanel, ReviewFormModal, UserReviewComponent, FeaturedSection],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GameDetailPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private juegosService = inject(JuegosService);
  private interaccionesService = inject(InteraccionesService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private gameStateService = inject(GameStateService);
  private destroy$ = new Subject<void>();
  
  /** ID del juego actual */
  gameId: number | null = null;

  /** Datos del juego */
  game = signal<JuegoDTO | null>(null);

  /** Interacción del usuario con el juego */
  userInteraction = signal<InteraccionDTO | null>(null);

  /** Reviews del juego */
  gameReviews = signal<UserReviewData[]>([]);

  /** Estado de carga */
  loading = signal(true);

  /** Error de carga */
  error = signal<string | null>(null);

  /** Estado de carga de interacciones */
  interactionLoading = signal(false);

  /** Estado del modal de review */
  showReviewModal = signal(false);

  /** Estado de carga del envío de review */
  reviewLoading = signal(false);

  /** Usuario autenticado */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /** ID del usuario actual */
  get currentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  /** Plataformas formateadas para el componente game-card */
  get platforms(): GamePlatform[] {
    const juego = this.game();
    if (!juego?.plataformas) return [];
    
    return juego.plataformas.map(p => ({
      name: p,
      routerLink: undefined // Podrías añadir rutas a páginas de plataformas
    }));
  }

  /** Puntuación del usuario convertida a escala 1-5 */
  userRating = computed(() => {
    const interaction = this.userInteraction();
    if (interaction?.puntuacion === null || interaction?.puntuacion === undefined) return null;
    // La puntuación del backend es 1-10, convertimos a 1-5
    return Math.round(interaction.puntuacion / 2);
  });

  /** Indica si el usuario ha marcado el juego como jugado */
  isPlayed = computed(() => this.userInteraction()?.estadoJugado ?? false);

  /** Desarrolladores como string */
  get developerName(): string {
    const juego = this.game();
    if (!juego?.desarrolladoras?.length) return '';
    return juego.desarrolladoras.join(', ');
  }

  /** Fecha de lanzamiento formateada */
  get releaseDate(): string {
    const juego = this.game();
    if (!juego?.fechaSalida) return '';
    
    try {
      const date = new Date(juego.fechaSalida);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return juego.fechaSalida;
    }
  }

  /** Año de lanzamiento del juego */
  get gameYear(): string {
    const juego = this.game();
    if (!juego?.fechaSalida) return '';
    
    try {
      const date = new Date(juego.fechaSalida);
      return date.getFullYear().toString();
    } catch {
      return '';
    }
  }

  /** Indica si el usuario tiene una review escrita */
  get hasReview(): boolean {
    const review = this.userInteraction()?.review;
    return !!review && review.trim().length > 0;
  }

  /** Obtiene la review existente del usuario */
  get existingReview(): string | null {
    return this.userInteraction()?.review ?? null;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.gameId = parseInt(params['id'], 10) || null;
          
          if (!this.gameId) {
            this.error.set('ID de juego no válido');
            this.loading.set(false);
            return of(null);
          }

          this.loading.set(true);
          this.error.set(null);
          
          return this.loadGameData(this.gameId);
        })
      )
      .subscribe();
  }

  /** Carga los datos del juego y la interacción del usuario */
  private loadGameData(gameId: number) {
    const game$ = this.juegosService.getById(gameId);
    
    // Si el usuario está autenticado, cargamos también su interacción
    const interaction$ = this.currentUserId
      ? this.interaccionesService.getByUsuarioYJuego(this.currentUserId, gameId)
      : of(null);

    // Cargar reviews del juego
    const reviews$ = this.interaccionesService.getByJuego(gameId).pipe(
      map(interacciones => 
        interacciones
          .filter(i => i.review !== null && i.review.trim().length > 0)
          .map(i => ({
            id: i.id,
            usuarioId: i.usuarioId,
            nombreUsuario: i.nombreUsuario,
            avatarUsuario: i.avatarUsuario,
            puntuacion: i.puntuacion || 0,
            review: i.review || '',
            fechaInteraccion: i.fechaInteraccion
          }))
          .sort((a, b) => new Date(b.fechaInteraccion).getTime() - new Date(a.fechaInteraccion).getTime()) // Más reciente primero
      ),
      catchError(() => of([]))
    );

    return forkJoin({
      game: game$,
      interaction: interaction$,
      reviews: reviews$
    }).pipe(
      catchError(err => {
        console.error('Error cargando datos del juego:', err);
        this.error.set('Error al cargar el juego');
        this.loading.set(false);
        return of(null);
      })
    ).pipe(
      switchMap(result => {
        if (result) {
          this.game.set(result.game);
          this.userInteraction.set(result.interaction);
          this.gameReviews.set(result.reviews);
        }
        this.loading.set(false);
        return of(result);
      })
    );
  }

  /** Maneja el cambio de estado "jugado" */
  onPlayedChange(isPlayed: boolean): void {
    if (!this.currentUserId || !this.gameId) return;

    this.interactionLoading.set(true);
    
    const currentInteraction = this.userInteraction();
    
    this.interaccionesService.crearOActualizar(
      this.currentUserId,
      this.gameId,
      {
        estadoJugado: isPlayed,
        puntuacion: currentInteraction?.puntuacion ?? null,
        review: currentInteraction?.review ?? null
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (interaction) => {
        this.userInteraction.set(interaction);
        this.interactionLoading.set(false);
        // Actualizar estado global
        this.gameStateService.upsertInteraction(interaction);
      },
      error: (err) => {
        console.error('Error actualizando estado de jugado:', err);
        this.interactionLoading.set(false);
      }
    });
  }

  /** Maneja el cambio de puntuación */
  onRatingChange(rating: number | null): void {
    if (!this.currentUserId || !this.gameId) return;

    const currentInteraction = this.userInteraction();
    // Convertimos la puntuación de 1-5 a 1-10 (o null si se deselecciona)
    const puntuacion10 = rating !== null ? rating * 2 : null;
    
    // Actualización optimista - mostrar el cambio inmediatamente
    const previousInteraction = currentInteraction;
    this.userInteraction.set({
      ...currentInteraction,
      id: currentInteraction?.id ?? 0,
      usuarioId: this.currentUserId,
      nombreUsuario: currentInteraction?.nombreUsuario ?? '',
      juegoId: this.gameId,
      nombreJuego: currentInteraction?.nombreJuego ?? '',
      puntuacion: puntuacion10,
      review: currentInteraction?.review ?? null,
      estadoJugado: currentInteraction?.estadoJugado ?? false,
      fechaInteraccion: currentInteraction?.fechaInteraccion ?? new Date().toISOString()
    });
    
    this.interaccionesService.crearOActualizar(
      this.currentUserId,
      this.gameId,
      {
        puntuacion: puntuacion10,
        estadoJugado: currentInteraction?.estadoJugado ?? false,
        review: currentInteraction?.review ?? null
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (interaction) => {
        this.userInteraction.set(interaction);
        // Actualizar estado global
        this.gameStateService.upsertInteraction(interaction);
      },
      error: (err) => {
        console.error('Error actualizando puntuación:', err);
        // Revertir al estado anterior en caso de error
        this.userInteraction.set(previousInteraction);
      }
    });
  }

  /** Abre el modal/formulario para escribir review */
  onWriteReviewClick(): void {
    this.showReviewModal.set(true);
  }

  /** Cierra el modal de review */
  closeReviewModal(): void {
    this.showReviewModal.set(false);
  }

  /** Maneja el envío de la review */
  onReviewSubmit(reviewText: string): void {
    if (!this.currentUserId || !this.gameId) return;

    this.reviewLoading.set(true);
    
    const currentInteraction = this.userInteraction();
    
    this.interaccionesService.crearOActualizar(
      this.currentUserId,
      this.gameId,
      {
        review: reviewText,
        puntuacion: currentInteraction?.puntuacion ?? null,
        estadoJugado: currentInteraction?.estadoJugado ?? false
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (interaction) => {
        this.userInteraction.set(interaction);
        this.reviewLoading.set(false);
        this.showReviewModal.set(false);
        this.notificationService.success(
          this.hasReview ? 'Review actualizada correctamente' : 'Review guardada correctamente'
        );
        
        // Actualizar el estado global para sincronizar con otros componentes
        this.gameStateService.upsertInteraction(interaction);
        
        // Recargar las reviews del juego
        if (this.gameId) {
          this.loadGameReviews(this.gameId);
        }
      },
      error: (err) => {
        console.error('Error guardando review:', err);
        this.reviewLoading.set(false);
        this.notificationService.error('Error al guardar la review');
      }
    });
  }

  /** Carga solo las reviews del juego (para recargar después de crear/editar) */
  private loadGameReviews(gameId: number): void {
    this.interaccionesService.getByJuego(gameId).pipe(
      map(interacciones => 
        interacciones
          .filter(i => i.review !== null && i.review.trim().length > 0)
          .map(i => ({
            id: i.id,
            usuarioId: i.usuarioId,
            nombreUsuario: i.nombreUsuario,
            avatarUsuario: i.avatarUsuario,
            puntuacion: i.puntuacion || 0,
            review: i.review || '',
            fechaInteraccion: i.fechaInteraccion
          }))
          .sort((a, b) => new Date(b.fechaInteraccion).getTime() - new Date(a.fechaInteraccion).getTime()) // Más reciente primero
      ),
      catchError(() => of([])),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (reviews) => {
        this.gameReviews.set(reviews);
      }
    });
  }

  /** Verifica si una review es del usuario actual */
  isOwnReview(review: UserReviewData): boolean {
    return this.currentUserId !== null && review.usuarioId === this.currentUserId;
  }

  /** Elimina una review del usuario */
  onDeleteReview(reviewId: number): void {
    if (!this.currentUserId || !this.gameId) return;

    // Confirmar eliminación
    if (!confirm('¿Estás seguro de que quieres eliminar tu review?')) return;

    this.interactionLoading.set(true);
    
    const currentInteraction = this.userInteraction();
    
    // Actualizar la interacción quitando la review
    this.interaccionesService.crearOActualizar(
      this.currentUserId,
      this.gameId,
      {
        estadoJugado: currentInteraction?.estadoJugado ?? false,
        puntuacion: currentInteraction?.puntuacion ?? null,
        review: null // Eliminar la review
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (interaction) => {
        this.userInteraction.set(interaction);
        this.interactionLoading.set(false);
        this.notificationService.success('Review eliminada');
        
        // Actualizar el estado global
        this.gameStateService.upsertInteraction(interaction);
        
        // Recargar las reviews
        if (this.gameId) {
          this.loadGameReviews(this.gameId);
        }
      },
      error: (err) => {
        console.error('Error eliminando review:', err);
        this.interactionLoading.set(false);
        this.notificationService.error('Error al eliminar la review');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
