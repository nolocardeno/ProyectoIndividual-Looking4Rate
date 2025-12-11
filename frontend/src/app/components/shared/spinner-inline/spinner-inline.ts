/**
 * @fileoverview Componente SpinnerInline - Spinner para uso inline
 * 
 * Spinner ligero para usar dentro de botones, cards, secciones, etc.
 * Visualmente idéntico al spinner global pero sin overlay.
 * 
 * @example
 * <app-spinner-inline />
 * <app-spinner-inline size="sm" />
 * <app-spinner-inline size="lg" color="accent" />
 * 
 * @author Looking4Rate Team
 * @version 1.0.0
 */

import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/** Tamaños disponibles */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Colores disponibles */
export type SpinnerColor = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'white' | 'current';

@Component({
  selector: 'app-spinner-inline',
  standalone: true,
  template: `
    <span [class]="spinnerClasses()" role="status" aria-label="Cargando">
      <span class="spinner-inline__circle">
        <span class="spinner-inline__circle-inner"></span>
      </span>
    </span>
  `,
  styleUrls: ['./spinner-inline.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerInline {
  /** Tamaño del spinner */
  readonly size = input<SpinnerSize>('md');
  
  /** Color del spinner */
  readonly color = input<SpinnerColor>('primary');

  /** Clases CSS computadas */
  readonly spinnerClasses = computed(() => {
    return `spinner-inline spinner-inline--${this.size()} spinner-inline--${this.color()}`;
  });
}
