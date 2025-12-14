/**
 * @fileoverview Componente Request State
 * 
 * Componente wrapper que maneja los diferentes estados de una petición HTTP:
 * - Loading: Muestra spinner mientras carga
 * - Error: Muestra mensaje de error con opción de reintentar
 * - Empty: Muestra estado vacío cuando no hay datos
 * - Success: Muestra el contenido cuando hay datos
 * 
 * @example
 * <app-request-state
 *   [status]="requestStatus"
 *   [error]="error"
 *   [isEmpty]="items.length === 0"
 *   emptyTitle="Sin resultados"
 *   (retry)="loadData()">
 *   
 *   <!-- Contenido cuando hay datos -->
 *   @for (item of items; track item.id) {
 *     <app-item [data]="item"></app-item>
 *   }
 * </app-request-state>
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { EmptyStateComponent, EmptyStateIcon } from '../empty-state/empty-state';
import { SpinnerInline, SpinnerSize } from '../spinner-inline/spinner-inline';
import { Alert } from '../alert/alert';
import { RequestStatus, NormalizedError } from '../../../models';

@Component({
  selector: 'app-request-state',
  standalone: true,
  imports: [EmptyStateComponent, SpinnerInline, Alert],
  template: `
    @switch (status) {
      <!-- Estado: Cargando -->
      @case ('loading') {
        <section class="request-state request-state--loading" role="status" aria-busy="true">
          <figure class="request-state__spinner-wrapper">
            <app-spinner-inline [size]="spinnerSizeMap"></app-spinner-inline>
            @if (loadingMessage) {
              <figcaption class="request-state__loading-message">{{ loadingMessage }}</figcaption>
            }
          </figure>
        </section>
      }
      
      <!-- Estado: Error -->
      @case ('error') {
        <section class="request-state request-state--error">
          <app-alert 
            type="error" 
            [title]="errorTitle"
            [dismissible]="false">
            {{ error?.userMessage || 'Ha ocurrido un error' }}
          </app-alert>
          
          @if (showRetry && error?.retryable !== false) {
            <footer class="request-state__actions">
              <button 
                type="button" 
                class="request-state__retry-btn"
                (click)="onRetry()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 21h5v-5"/>
                </svg>
                Reintentar
              </button>
            </footer>
          }
        </section>
      }
      
      <!-- Estado: Sin datos -->
      @case ('success') {
        @if (isEmpty) {
          <app-empty-state
            [icon]="emptyIcon"
            [title]="emptyTitle"
            [message]="emptyMessage"
            [showAction]="showEmptyAction"
            [actionText]="emptyActionText"
            (action)="onEmptyAction()">
          </app-empty-state>
        } @else {
          <!-- Contenido normal - proyectado -->
          <ng-content></ng-content>
        }
      }
      
      <!-- Estado: Idle (sin iniciar) -->
      @default {
        @if (showIdleState) {
          <section class="request-state request-state--idle">
            <ng-content select="[idle]"></ng-content>
          </section>
        }
      }
    }
  `,
  styles: [`
    .request-state {
      &--loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        padding: var(--space-lg, 1.5rem);
      }

      &__spinner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm, 0.5rem);
      }

      &__loading-message {
        font-size: var(--font-size-sm, 0.875rem);
        color: var(--color-text-alt);
      }

      &--error {
        padding: var(--space-md, 1rem);
      }

      &--idle {
        padding: var(--space-md, 1rem);
        text-align: center;
        color: var(--color-text-alt);
      }

      &__actions {
        display: flex;
        justify-content: center;
        margin-top: var(--space-md, 1rem);
      }

      &__retry-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs, 0.5rem);
        padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: 500;
        color: var(--color-text);
        background: transparent;
        border: 1px solid var(--color-secondary);
        border-radius: var(--border-radius, 0.5rem);
        cursor: pointer;
        transition: all 0.2s ease;

        svg {
          width: 16px;
          height: 16px;
        }

        &:hover {
          background: var(--color-secondary);
          border-color: var(--color-secondary);
        }

        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestStateComponent {
  // ========================================
  // ESTADO
  // ========================================
  
  /** Estado actual de la petición */
  @Input() status: RequestStatus = 'idle';
  
  /** Error normalizado (si status === 'error') */
  @Input() error: NormalizedError | null = null;
  
  /** Indica si no hay datos (para mostrar empty state) */
  @Input() isEmpty = false;

  // ========================================
  // LOADING
  // ========================================
  
  /** Mensaje mientras carga */
  @Input() loadingMessage = 'Cargando...';
  
  /** Tamaño del spinner */
  @Input() spinnerSize: 'small' | 'medium' | 'large' = 'medium';

  /** Mapea tamaño del spinner al tipo esperado */
  get spinnerSizeMap(): SpinnerSize {
    const sizeMap: Record<string, SpinnerSize> = {
      'small': 'sm',
      'medium': 'md',
      'large': 'lg'
    };
    return sizeMap[this.spinnerSize] || 'md';
  }

  // ========================================
  // ERROR
  // ========================================
  
  /** Título del error */
  @Input() errorTitle = 'Error';
  
  /** Mostrar botón de reintentar */
  @Input() showRetry = true;
  
  /** Evento al reintentar */
  @Output() retry = new EventEmitter<void>();

  // ========================================
  // EMPTY STATE
  // ========================================
  
  /** Icono del empty state */
  @Input() emptyIcon: EmptyStateIcon = 'empty';
  
  /** Título del empty state */
  @Input() emptyTitle = 'No hay datos';
  
  /** Mensaje del empty state */
  @Input() emptyMessage = '';
  
  /** Mostrar acción en empty state */
  @Input() showEmptyAction = false;
  
  /** Texto de la acción del empty state */
  @Input() emptyActionText = '';
  
  /** Evento al hacer clic en acción del empty state */
  @Output() emptyAction = new EventEmitter<void>();

  // ========================================
  // IDLE STATE
  // ========================================
  
  /** Mostrar contenido en estado idle */
  @Input() showIdleState = false;

  // ========================================
  // HANDLERS
  // ========================================

  onRetry(): void {
    this.retry.emit();
  }

  onEmptyAction(): void {
    this.emptyAction.emit();
  }
}
