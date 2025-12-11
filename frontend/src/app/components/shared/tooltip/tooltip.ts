import { 
  Component, 
  Input, 
  ViewChild, 
  ElementRef, 
  AfterViewInit,
  OnDestroy,
  HostListener,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { isPlatformBrowser, NgStyle } from '@angular/common';

/**
 * Posiciones disponibles para el tooltip
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Componente Tooltip
 * 
 * Implementa tooltips accesibles con las siguientes características:
 * - Mostrar/ocultar al hover y focus
 * - Múltiples posiciones (top, bottom, left, right)
 * - Uso de ViewChild y ElementRef para posicionamiento dinámico
 * - Delay configurable para mostrar/ocultar
 * - Cierre con ESC
 * - Soporte para contenido HTML
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tooltip implements AfterViewInit, OnDestroy {
  /** Change detector para OnPush */
  private cdr = inject(ChangeDetectorRef);

  /** Texto del tooltip */
  @Input() text = '';

  /** Contenido del tooltip (alias de text para compatibilidad) */
  @Input() content = '';
  
  /** Posición del tooltip */
  @Input() position: TooltipPosition = 'top';
  
  /** Delay en ms antes de mostrar el tooltip */
  @Input() showDelay = 200;
  
  /** Delay en ms antes de ocultar el tooltip */
  @Input() hideDelay = 100;
  
  /** Si el tooltip está deshabilitado */
  @Input() disabled = false;
  
  /** Ancho máximo del tooltip */
  @Input() maxWidth = 250;

  /** Referencia al contenedor del tooltip */
  @ViewChild('tooltipContainer') tooltipContainer!: ElementRef<HTMLElement>;
  
  /** Referencia al elemento del tooltip */
  @ViewChild('tooltipElement') tooltipElement!: ElementRef<HTMLElement>;
  
  /** Referencia al trigger (contenido proyectado) */
  @ViewChild('triggerWrapper') triggerWrapper!: ElementRef<HTMLElement>;

  /** Estado de visibilidad del tooltip */
  isVisible = false;
  
  /** Posición calculada (puede cambiar si no hay espacio) */
  calculatedPosition: TooltipPosition = 'top';
  
  /** Estilos inline calculados para posicionamiento */
  tooltipStyles: { [key: string]: string } = {};

  private showTimeout: any;
  private hideTimeout: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.calculatedPosition = this.position;
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
  }

  /**
   * Maneja el evento ESC para cerrar el tooltip
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.hide();
    }
  }

  /**
   * Muestra el tooltip con delay
   */
  show(): void {
    const tooltipText = this.text || this.content;
    if (this.disabled || !tooltipText) return;
    
    this.clearTimeouts();
    
    this.showTimeout = setTimeout(() => {
      this.isVisible = true;
      this.calculatePosition();
      this.updateAriaAttributes();
      this.cdr.markForCheck();
    }, this.showDelay);
  }

  /**
   * Oculta el tooltip con delay
   */
  hide(): void {
    this.clearTimeouts();
    
    this.hideTimeout = setTimeout(() => {
      this.isVisible = false;
      this.updateAriaAttributes();
      this.cdr.markForCheck();
    }, this.hideDelay);
  }

  /**
   * Maneja el evento mouseenter
   */
  onMouseEnter(): void {
    this.show();
  }

  /**
   * Maneja el evento mouseleave
   */
  onMouseLeave(): void {
    this.hide();
  }

  /**
   * Maneja el evento focus
   */
  onFocus(): void {
    this.show();
  }

  /**
   * Maneja el evento blur
   */
  onBlur(): void {
    this.hide();
  }

  /**
   * Maneja el evento de teclado en el trigger
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isVisible) {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
    }
  }

  /**
   * Calcula la posición óptima del tooltip
   * Ajusta automáticamente si no hay espacio suficiente
   */
  private calculatePosition(): void {
    if (!this.isBrowser || !this.triggerWrapper?.nativeElement || !this.tooltipElement?.nativeElement) {
      return;
    }

    const trigger = this.triggerWrapper.nativeElement;
    const tooltip = this.tooltipElement.nativeElement;
    const triggerRect = trigger.getBoundingClientRect();
    
    // Forzar visibilidad temporal para obtener dimensiones
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    const tooltipRect = tooltip.getBoundingClientRect();
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Determinar la mejor posición si la preferida no tiene espacio
    this.calculatedPosition = this.findBestPosition(triggerRect, tooltipRect, viewport);
    
    // Calcular posición exacta
    const styles = this.calculateExactPosition(triggerRect, tooltipRect);
    this.tooltipStyles = styles;
    
    // Restaurar visibilidad
    tooltip.style.visibility = '';
    tooltip.style.display = '';
  }

  /**
   * Encuentra la mejor posición disponible
   */
  private findBestPosition(
    triggerRect: DOMRect, 
    tooltipRect: DOMRect, 
    viewport: { width: number; height: number }
  ): TooltipPosition {
    const positions: TooltipPosition[] = [this.position, 'top', 'bottom', 'right', 'left'];
    
    for (const pos of positions) {
      if (this.hasSpaceForPosition(pos, triggerRect, tooltipRect, viewport)) {
        return pos;
      }
    }
    
    return this.position; // Fallback a la posición original
  }

  /**
   * Verifica si hay espacio suficiente para una posición
   */
  private hasSpaceForPosition(
    position: TooltipPosition,
    triggerRect: DOMRect,
    tooltipRect: DOMRect,
    viewport: { width: number; height: number }
  ): boolean {
    const margin = 10;
    
    switch (position) {
      case 'top':
        return triggerRect.top - tooltipRect.height - margin > 0;
      case 'bottom':
        return triggerRect.bottom + tooltipRect.height + margin < viewport.height;
      case 'left':
        return triggerRect.left - tooltipRect.width - margin > 0;
      case 'right':
        return triggerRect.right + tooltipRect.width + margin < viewport.width;
      default:
        return true;
    }
  }

  /**
   * Calcula la posición exacta en píxeles
   */
  private calculateExactPosition(triggerRect: DOMRect, tooltipRect: DOMRect): { [key: string]: string } {
    const margin = 8;
    let top = 0;
    let left = 0;

    switch (this.calculatedPosition) {
      case 'top':
        top = -tooltipRect.height - margin;
        left = (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.height + margin;
        left = (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = (triggerRect.height - tooltipRect.height) / 2;
        left = -tooltipRect.width - margin;
        break;
      case 'right':
        top = (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.width + margin;
        break;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      maxWidth: `${this.maxWidth}px`
    };
  }

  /**
   * Actualiza los atributos ARIA
   */
  private updateAriaAttributes(): void {
    if (!this.triggerWrapper?.nativeElement) return;
    
    const trigger = this.triggerWrapper.nativeElement;
    trigger.setAttribute('aria-describedby', this.isVisible ? 'tooltip' : '');
  }

  /**
   * Limpia los timeouts pendientes
   */
  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Genera el ID único del tooltip
   */
  get tooltipId(): string {
    return 'tooltip';
  }
}
