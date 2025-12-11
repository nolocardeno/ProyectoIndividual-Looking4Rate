import { 
  Component, 
  Input, 
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';

/**
 * Posiciones disponibles para el tooltip
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Componente Tooltip
 * 
 * Implementa tooltips accesibles con CSS puro para posicionamiento.
 * - Mostrar/ocultar al hover
 * - Múltiples posiciones (top, bottom, left, right)
 * - Cierre con ESC
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tooltip {
  private cdr = inject(ChangeDetectorRef);

  /** Texto del tooltip */
  @Input() text = '';

  /** Contenido del tooltip (alias de text) */
  @Input() content = '';
  
  /** Posición del tooltip */
  @Input() position: TooltipPosition = 'top';
  
  /** Si el tooltip está deshabilitado */
  @Input() disabled = false;

  /** Estado de visibilidad */
  isVisible = false;

  /** Texto a mostrar */
  get tooltipText(): string {
    if (this.disabled) return '';
    return this.text || this.content;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.hide();
    }
  }

  show(): void {
    if (!this.tooltipText) return;
    this.isVisible = true;
    this.cdr.detectChanges();
  }

  hide(): void {
    this.isVisible = false;
    this.cdr.detectChanges();
  }
}
