/**
 * @fileoverview Componente Empty State
 * 
 * Componente reutilizable para mostrar cuando no hay datos disponibles.
 * Proporciona un mensaje visual amigable con icono y acción opcional.
 * 
 * @example
 * <app-empty-state
 *   icon="search"
 *   title="No se encontraron resultados"
 *   message="Intenta con otros términos de búsqueda"
 *   [showAction]="true"
 *   actionText="Limpiar búsqueda"
 *   (action)="limpiarBusqueda()">
 * </app-empty-state>
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

/** Iconos predefinidos para estados vacíos */
export type EmptyStateIcon = 
  | 'search'      // Sin resultados de búsqueda
  | 'games'       // Sin juegos
  | 'reviews'     // Sin reviews
  | 'users'       // Sin usuarios
  | 'library'     // Biblioteca vacía
  | 'error'       // Error genérico
  | 'network'     // Error de red
  | 'empty';      // Estado vacío genérico

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [NgClass],
  template: `
    <article 
      class="empty-state" 
      [ngClass]="'empty-state--' + variant"
      role="status"
      aria-live="polite">
      
      <!-- Icono -->
      <figure class="empty-state__icon" aria-hidden="true">
        @switch (icon) {
          @case ('search') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <path d="M8 11h6"/>
            </svg>
          }
          @case ('games') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="12" x="2" y="6" rx="2"/>
              <path d="M12 12h.01"/>
              <path d="M17 12h.01"/>
              <path d="M7 10v4"/>
              <path d="M5 12h4"/>
            </svg>
          }
          @case ('reviews') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M8 10h.01"/>
              <path d="M12 10h.01"/>
              <path d="M16 10h.01"/>
            </svg>
          }
          @case ('users') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
          @case ('library') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              <path d="M12 6v7"/>
              <path d="m9 10 3 3 3-3"/>
            </svg>
          }
          @case ('error') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="m15 9-6 6"/>
              <path d="m9 9 6 6"/>
            </svg>
          }
          @case ('network') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <line x1="12" x2="12.01" y1="20" y2="20"/>
              <line x1="2" x2="22" y1="2" y2="22"/>
            </svg>
          }
          @default {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
          }
        }
      </figure>

      <!-- Contenido -->
      <header class="empty-state__content">
        <h3 class="empty-state__title">{{ title }}</h3>
        @if (message) {
          <p class="empty-state__message">{{ message }}</p>
        }
      </header>

      <!-- Acción -->
      @if (showAction && actionText) {
        <footer class="empty-state__actions">
          <button 
            type="button"
            class="empty-state__button"
            (click)="onAction()">
            {{ actionText }}
          </button>
        </footer>
      }
    </article>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl, 2rem);
      text-align: center;
      min-height: 200px;

      &--compact {
        min-height: 120px;
        padding: var(--space-md, 1rem);
      }

      &--large {
        min-height: 300px;
        padding: var(--space-2xl, 3rem);
      }

      &__icon {
        width: 64px;
        height: 64px;
        margin: 0 0 var(--space-md, 1rem);
        color: var(--color-text-alt);
        opacity: 0.5;

        svg {
          width: 100%;
          height: 100%;
        }
      }

      &--compact &__icon {
        width: 48px;
        height: 48px;
      }

      &__content {
        max-width: 400px;
      }

      &__title {
        margin: 0 0 var(--space-xs, 0.5rem);
        font-size: var(--font-size-lg, 1.25rem);
        font-weight: 600;
        color: var(--color-text);
      }

      &__message {
        margin: 0;
        font-size: var(--font-size-sm, 0.875rem);
        color: var(--color-text-alt);
        line-height: 1.5;
      }

      &__actions {
        margin-top: var(--space-md, 1rem);
      }

      &__button {
        padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: 500;
        color: var(--color-accent);
        background: transparent;
        border: 1px solid var(--color-accent);
        border-radius: var(--border-radius, 0.5rem);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--color-accent);
          color: var(--color-primary);
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
export class EmptyStateComponent {
  /** Icono a mostrar */
  @Input() icon: EmptyStateIcon = 'empty';
  
  /** Título principal */
  @Input() title = 'No hay datos disponibles';
  
  /** Mensaje descriptivo */
  @Input() message = '';
  
  /** Variante de tamaño */
  @Input() variant: 'compact' | 'default' | 'large' = 'default';
  
  /** Mostrar botón de acción */
  @Input() showAction = false;
  
  /** Texto del botón de acción */
  @Input() actionText = '';
  
  /** Evento emitido al hacer clic en la acción */
  @Output() action = new EventEmitter<void>();

  /** Handler para el botón de acción */
  onAction(): void {
    this.action.emit();
  }
}
