import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService, BreadcrumbItem } from '../../../services/navigation.service';

/**
 * @component Breadcrumbs
 * @description Componente de migas de pan dinámicas.
 * Se actualiza automáticamente según la navegación.
 * 
 * @example
 * <app-breadcrumbs></app-breadcrumbs>
 */
@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  template: `
    @if (breadcrumbs.length > 1) {
      <nav class="breadcrumbs" aria-label="Migas de pan">
        <ol class="breadcrumbs__list">
          @for (crumb of breadcrumbs; track crumb.url; let isLast = $last) {
            <li class="breadcrumbs__item">
              @if (!isLast) {
                <a 
                  [routerLink]="crumb.url" 
                  class="breadcrumbs__link"
                  [attr.aria-label]="crumb.label">
                  @if (crumb.icon) {
                    <span class="breadcrumbs__icon" aria-hidden="true">{{ crumb.icon }}</span>
                  }
                  <span class="breadcrumbs__text">{{ crumb.label }}</span>
                </a>
                <span class="breadcrumbs__separator" aria-hidden="true">/</span>
              } @else {
                <span class="breadcrumbs__current" aria-current="page">
                  @if (crumb.icon) {
                    <span class="breadcrumbs__icon" aria-hidden="true">{{ crumb.icon }}</span>
                  }
                  <span class="breadcrumbs__text">{{ crumb.label }}</span>
                </span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
  styles: [`
    .breadcrumbs {
      padding: 1rem 0;

      &__list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 0.875rem;
      }

      &__item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      &__link {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: var(--color-primary);
        }
      }

      &__separator {
        color: var(--color-text-muted);
      }

      &__current {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--color-text-primary);
        font-weight: 500;
      }

      &__icon {
        font-size: 1rem;
      }

      &__text {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    @media (max-width: 480px) {
      .breadcrumbs {
        &__list {
          font-size: 0.75rem;
        }

        &__text {
          max-width: 100px;
        }
      }
    }
  `]
})
export default class Breadcrumbs implements OnInit, OnDestroy {
  private navigationService = inject(NavigationService);
  
  breadcrumbs: BreadcrumbItem[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.navigationService.breadcrumbs$.subscribe(
      breadcrumbs => this.breadcrumbs = breadcrumbs
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
