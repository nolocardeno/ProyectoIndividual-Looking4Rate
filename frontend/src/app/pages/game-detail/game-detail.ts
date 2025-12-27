import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { GameCard, GamePlatform } from '../../components/shared/game-card/game-card';
import { GameInteractionPanel } from '../../components/shared/game-interaction-panel/game-interaction-panel';
import { JuegosService } from '../../services/juegos.service';
import { InteraccionesService } from '../../services/interacciones.service';
import { AuthService } from '../../services/auth.service';
import { JuegoDTO, InteraccionDTO } from '../../models';

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
  imports: [RouterLink, GameCard, GameInteractionPanel],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export default class GameDetailPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private juegosService = inject(JuegosService);
  private interaccionesService = inject(InteraccionesService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  /** ID del juego actual */
  gameId: number | null = null;

  /** Datos del juego */
  game = signal<JuegoDTO | null>(null);

  /** Interacción del usuario con el juego */
  userInteraction = signal<InteraccionDTO | null>(null);

  /** Estado de carga */
  loading = signal(true);

  /** Error de carga */
  error = signal<string | null>(null);

  /** Estado de carga de interacciones */
  interactionLoading = signal(false);

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
  get userRating(): number | null {
    const interaction = this.userInteraction();
    if (!interaction?.puntuacion) return null;
    // La puntuación del backend es 1-10, convertimos a 1-5
    return Math.round(interaction.puntuacion / 2);
  }

  /** Indica si el usuario ha marcado el juego como jugado */
  get isPlayed(): boolean {
    return this.userInteraction()?.estadoJugado ?? false;
  }

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

    return forkJoin({
      game: game$,
      interaction: interaction$
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

    this.interactionLoading.set(true);
    
    const currentInteraction = this.userInteraction();
    // Convertimos la puntuación de 1-5 a 1-10 (o null si se deselecciona)
    const puntuacion10 = rating !== null ? rating * 2 : null;
    
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
        this.interactionLoading.set(false);
      },
      error: (err) => {
        console.error('Error actualizando puntuación:', err);
        this.interactionLoading.set(false);
      }
    });
  }

  /** Abre el modal/formulario para escribir review */
  onWriteReviewClick(): void {
    // TODO: Implementar modal de review
    console.log('Abrir modal de review');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
