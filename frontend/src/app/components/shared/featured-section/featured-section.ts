import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-section',
  imports: [RouterLink],
  templateUrl: './featured-section.html',
  styleUrl: './featured-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedSection {
  /** Título de la sección */
  @Input({ required: true }) title!: string;

  /** Texto del enlace "Ver más" (opcional) */
  @Input() linkText: string = 'VER MÁS';

  /** Ruta del enlace (opcional, si no se proporciona no se muestra el enlace) */
  @Input() linkRoute: string | null = null;
}
