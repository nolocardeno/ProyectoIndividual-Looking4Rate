import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Tamaños disponibles para la carátula */
export type GameCoverSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-game-cover',
  imports: [RouterLink],
  templateUrl: './game-cover.html',
  styleUrl: './game-cover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCover {
  /** URL de la imagen de carátula */
  @Input({ required: true }) src!: string;

  /** Texto alternativo para accesibilidad */
  @Input({ required: true }) alt!: string;

  /** Enlace al detalle del juego (opcional) */
  @Input() routerLink: string | null = null;

  /** Tamaño de la carátula */
  @Input() size: GameCoverSize = 'md';

  /** Genera las clases CSS BEM */
  get classes(): string {
    return ['game-cover', `game-cover--${this.size}`].join(' ');
  }
}
