import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * Star Rating Component
 *
 * Componente reutilizable para mostrar y seleccionar puntuaciones con estrellas.
 * Soporta modo interactivo (selección) y modo solo lectura.
 * Usa estrellas CSS puras sin dependencias de iconos.
 *
 * @example
 * // Modo interactivo
 * <app-star-rating
 *   [rating]="userRating"
 *   (ratingChange)="onRatingChange($event)"
 * />
 *
 * // Modo solo lectura
 * <app-star-rating
 *   [rating]="4"
 *   [readonly]="true"
 * />
 */
@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss'
})
export class StarRating {
  /** Puntuación actual (1-5) */
  @Input() rating: number | null = null;

  /** Número máximo de estrellas */
  @Input() maxStars = 5;

  /** Si el componente es solo lectura */
  @Input() readonly = false;

  /** Tamaño de las estrellas */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** Evento de cambio de puntuación */
  @Output() ratingChange = new EventEmitter<number | null>();

  /** Puntuación temporal al hacer hover */
  hoverRating: number | null = null;

  /** Array de estrellas para iterar */
  get stars(): number[] {
    return Array.from({ length: this.maxStars }, (_, i) => i + 1);
  }

  /** Determina si una estrella está activa (seleccionada permanentemente) */
  isStarActive(star: number): boolean {
    if (this.hoverRating !== null) return false;
    return star <= (this.rating ?? 0);
  }

  /** Determina si una estrella está en hover */
  isStarHovered(star: number): boolean {
    // No mostrar hover si ya hay un rating activo
    if (this.rating !== null && this.rating !== undefined) return false;
    if (this.hoverRating === null) return false;
    return star <= this.hoverRating;
  }

  /** Maneja el hover sobre una estrella */
  onStarHover(star: number): void {
    if (!this.readonly && this.rating === null) {
      this.hoverRating = star;
    }
  }

  /** Limpia el hover al salir */
  onStarLeave(): void {
    this.hoverRating = null;
  }

  /** Selecciona una puntuación */
  onStarClick(star: number): void {
    if (!this.readonly) {
      // Si pulsamos la última estrella activa, desactivar todas
      if (this.rating === star) {
        this.rating = null;
        this.ratingChange.emit(null);
      } else {
        this.rating = star;
        this.ratingChange.emit(star);
      }
    }
  }

  /** Maneja navegación por teclado */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.readonly) return;

    const currentRating = this.rating ?? 0;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        if (currentRating < this.maxStars) {
          this.onStarClick(currentRating + 1);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        if (currentRating > 1) {
          this.onStarClick(currentRating - 1);
        }
        break;
    }
  }
}
