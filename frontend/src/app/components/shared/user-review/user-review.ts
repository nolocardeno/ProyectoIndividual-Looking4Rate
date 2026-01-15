/**
 * @fileoverview Componente User Review
 * 
 * Muestra una review individual de un usuario sobre un juego.
 * Incluye avatar, nombre, puntuación y texto de la review.
 * Permite eliminar la review si es propia.
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-review',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './user-review.html',
  styleUrls: ['./user-review.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserReviewComponent {
  /** Datos de la review */
  @Input({ required: true }) review!: {
    id: number;
    usuarioId?: number;
    nombreUsuario: string;
    avatarUsuario?: string;
    puntuacion: number;
    review: string;
    fechaInteraccion: string;
  };

  /** Indica si la review es del usuario actual */
  @Input() isOwn: boolean = false;

  /** Evento emitido cuando se quiere eliminar la review */
  @Output() deleteReview = new EventEmitter<number>();

  /**
   * Obtiene la URL del avatar o retorna un avatar por defecto
   */
  get avatarUrl(): string {
    return this.review.avatarUsuario || 'https://www.gravatar.com/avatar/?d=mp&s=512';
  }

  /**
   * Obtiene la ruta al perfil del usuario
   */
  get userProfileLink(): string[] {
    return this.review.usuarioId ? ['/usuario', this.review.usuarioId.toString()] : [];
  }

  /**
   * Maneja el clic en eliminar review
   */
  onDeleteClick(): void {
    this.deleteReview.emit(this.review.id);
  }
}
