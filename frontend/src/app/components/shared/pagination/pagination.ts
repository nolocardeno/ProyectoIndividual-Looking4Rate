import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Button } from '../button/button';

/**
 * Pagination Component
 * 
 * Componente de paginación con controles de navegación (anterior, siguiente)
 * y números de página clicables.
 * 
 * @example
 * <app-pagination
 *   [currentPage]="1"
 *   [totalPages]="10"
 *   (pageChange)="onPageChange($event)"
 * />
 */
@Component({
  selector: 'app-pagination',
  imports: [Button],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pagination {
  /** Página actual (1-indexed) */
  @Input() currentPage = 1;

  /** Número total de páginas */
  @Input() totalPages = 1;

  /** Máximo de números de página visibles */
  @Input() maxVisiblePages = 5;

  /** Texto del botón para ir a la primera página */
  @Input() firstLabel = 'MÁS NUEVO';

  /** Texto del botón para ir a la última página */
  @Input() lastLabel = 'MÁS ANTIGUO';

  /** Evento emitido cuando cambia la página */
  @Output() pageChange = new EventEmitter<number>();

  /** Obtiene el array de números de página a mostrar */
  get visiblePages(): number[] {
    const pages: number[] = [];
    
    if (this.totalPages <= this.maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calcular rango de páginas visibles
      let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
      let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
      
      // Ajustar si estamos cerca del final
      if (end - start + 1 < this.maxVisiblePages) {
        start = Math.max(1, end - this.maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  /** Indica si estamos en la primera página */
  get isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  /** Indica si estamos en la última página */
  get isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  /** Navega a la primera página */
  goToFirstPage(): void {
    if (!this.isFirstPage) {
      this.goToPage(1);
    }
  }

  /** Navega a la última página */
  goToLastPage(): void {
    if (!this.isLastPage) {
      this.goToPage(this.totalPages);
    }
  }

  /** Navega a una página específica */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
