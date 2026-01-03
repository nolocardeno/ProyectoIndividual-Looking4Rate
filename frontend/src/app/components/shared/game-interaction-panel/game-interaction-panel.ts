import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { StarRating } from '../star-rating/star-rating';

/**
 * Game Interaction Panel Component
 *
 * Panel de interacción del usuario con un juego.
 * Permite marcar como jugado, puntuar con estrellas y escribir una review.
 *
 * @example
 * <app-game-interaction-panel
 *   [isPlayed]="userInteraction.estadoJugado"
 *   [rating]="userInteraction.puntuacion"
 *   (playedChange)="onPlayedChange($event)"
 *   (ratingChange)="onRatingChange($event)"
 *   (writeReviewClick)="openReviewModal()"
 * />
 */
@Component({
  selector: 'app-game-interaction-panel',
  imports: [FaIconComponent, StarRating],
  templateUrl: './game-interaction-panel.html',
  styleUrl: './game-interaction-panel.scss'
})
export class GameInteractionPanel {
  /** Indica si el juego está marcado como jugado */
  @Input() isPlayed = false;

  /** Puntuación actual del usuario (1-5, null si no ha puntuado) */
  @Input() rating: number | null = null;

  /** Si el panel está en modo cargando */
  @Input() loading = false;

  /** Si el usuario está autenticado */
  @Input() isAuthenticated = true;

  /** Indica si el usuario ya tiene una review escrita */
  @Input() hasReview = false;

  /** Evento cuando cambia el estado de jugado */
  @Output() playedChange = new EventEmitter<boolean>();

  /** Evento cuando cambia la puntuación */
  @Output() ratingChange = new EventEmitter<number | null>();

  /** Evento cuando se hace click en escribir review */
  @Output() writeReviewClick = new EventEmitter<void>();

  /** Alterna el estado de jugado */
  togglePlayed(): void {
    if (!this.loading) {
      this.playedChange.emit(!this.isPlayed);
    }
  }

  /** Maneja el cambio de puntuación */
  onRatingChange(newRating: number | null): void {
    if (!this.loading) {
      this.ratingChange.emit(newRating);
    }
  }

  /** Emite el evento de escribir review */
  onWriteReviewClick(): void {
    if (!this.loading) {
      this.writeReviewClick.emit();
    }
  }
}
