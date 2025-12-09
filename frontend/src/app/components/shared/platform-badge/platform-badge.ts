import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Platform Badge Component
 *
 * Muestra una plataforma de videojuego como badge/enlace.
 * Reutilizable en cards, listas, filtros, etc.
 *
 * @example
 * <app-platform-badge name="PlayStation" [routerLink]="'/platforms/playstation'" />
 */
@Component({
  selector: 'app-platform-badge',
  imports: [RouterLink],
  templateUrl: './platform-badge.html',
  styleUrl: './platform-badge.scss',
})
export class PlatformBadge {
  /** Nombre de la plataforma a mostrar */
  @Input({ required: true }) name!: string;

  /** Enlace opcional a la página de la plataforma */
  @Input() routerLink: string | null = null;
}
