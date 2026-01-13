/**
 * @fileoverview Componente User Review
 * 
 * Muestra una review individual de un usuario sobre un juego.
 * Incluye avatar, nombre, puntuación y texto de la review.
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-review.html',
  styleUrls: ['./user-review.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserReviewComponent {
  /** Datos de la review */
  @Input({ required: true }) review!: {
    id: number;
    nombreUsuario: string;
    avatarUsuario?: string;
    puntuacion: number;
    review: string;
    fechaInteraccion: string;
  };

  /**
   * Obtiene la URL del avatar o retorna un avatar por defecto
   */
  get avatarUrl(): string {
    return this.review.avatarUsuario || 'https://www.gravatar.com/avatar/?d=mp&s=512';
  }
}
