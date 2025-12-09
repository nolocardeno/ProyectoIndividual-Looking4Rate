import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameCover } from '../game-cover/game-cover';
import { PlatformBadge } from '../platform-badge/platform-badge';

/** Interfaz para las plataformas del juego */
export interface GamePlatform {
  name: string;
  routerLink?: string;
}

/**
 * Game Card Component
 *
 * Card de detalle de videojuego que muestra la carátula grande
 * junto con información completa: título, fecha, desarrollador,
 * descripción y plataformas.
 *
 * @example
 * <app-game-card
 *   coverSrc="/assets/img/cod-black-ops.jpg"
 *   title="Call of Duty: Black Ops"
 *   releaseDate="09-11-2010"
 *   developer="Treyarch"
 *   developerLink="/developers/treyarch"
 *   description="La volátil Guerra Fría como telón de fondo..."
 *   [platforms]="[
 *     { name: 'PlayStation', routerLink: '/platforms/playstation' },
 *     { name: 'Xbox', routerLink: '/platforms/xbox' },
 *     { name: 'PC', routerLink: '/platforms/pc' }
 *   ]"
 * />
 */
@Component({
  selector: 'app-game-card',
  imports: [RouterLink, GameCover, PlatformBadge],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
})
export class GameCard {
  /** URL de la imagen de carátula */
  @Input({ required: true }) coverSrc!: string;

  /** Título del juego */
  @Input({ required: true }) title!: string;

  /** Fecha de lanzamiento (formato: DD-MM-YYYY) */
  @Input() releaseDate: string = '';

  /** Nombre del desarrollador */
  @Input() developer: string = '';

  /** Enlace opcional a la página del desarrollador */
  @Input() developerLink: string | null = null;

  /** Descripción del juego */
  @Input() description: string = '';

  /** Lista de plataformas disponibles */
  @Input() platforms: GamePlatform[] = [];

  /** Enlace al detalle del juego (para la carátula) */
  @Input() gameLink: string | null = null;
}
