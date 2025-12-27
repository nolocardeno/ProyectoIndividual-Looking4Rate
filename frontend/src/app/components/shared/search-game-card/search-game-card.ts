import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameCover } from '../game-cover/game-cover';

/** Interfaz para las plataformas del juego */
export interface SearchGamePlatform {
  name: string;
  routerLink?: string;
}

/** Interfaz para el desarrollador del juego */
export interface SearchGameDeveloper {
  name: string;
  routerLink?: string;
}

/**
 * Search Game Card Component
 *
 * Tarjeta compacta de juego para mostrar en resultados de búsqueda.
 * Muestra carátula, título, año, desarrollador y plataformas.
 *
 * @example
 * <app-search-game-card
 *   coverSrc="/assets/img/cod-black-ops.jpg"
 *   title="Call of Duty: Black Ops 7"
 *   releaseYear="2025"
 *   [developer]="{ name: 'Treyarch', routerLink: '/desarrolladora/1' }"
 *   [platforms]="[
 *     { name: 'PlayStation', routerLink: '/plataforma/1' },
 *     { name: 'Xbox', routerLink: '/plataforma/2' }
 *   ]"
 *   gameLink="/juego/1"
 * />
 */
@Component({
  selector: 'app-search-game-card',
  imports: [RouterLink, GameCover],
  templateUrl: './search-game-card.html',
  styleUrl: './search-game-card.scss',
})
export class SearchGameCard {
  /** URL de la imagen de carátula */
  @Input({ required: true }) coverSrc!: string;

  /** Título del juego */
  @Input({ required: true }) title!: string;

  /** Año de lanzamiento */
  @Input() releaseYear: string = '';

  /** Desarrollador del juego */
  @Input() developer: SearchGameDeveloper | null = null;

  /** Lista de plataformas disponibles */
  @Input() platforms: SearchGamePlatform[] = [];

  /** Enlace al detalle del juego */
  @Input() gameLink: string | null = null;
}
