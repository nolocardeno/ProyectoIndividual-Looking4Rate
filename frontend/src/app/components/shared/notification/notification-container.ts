import { Component, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationState } from './notification.service';

@Component({
  selector: 'app-notification-container',
  imports: [NgClass],
  template: `
    @if (notification) {
      <div 
        [ngClass]="getClasses(notification)"
        [attr.data-notification-id]="notification.id"
        role="alert"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()">
        
        <!-- Icono según el tipo -->
        <span class="notification__icon">
          @switch (notification.type) {
            @case ('success') { ✓ }
            @case ('error') { ✕ }
            @case ('warning') { ⚠ }
            @case ('info') { ℹ }
          }
        </span>

        <!-- Contenido -->
        <div class="notification__content">
          @if (notification.title) {
            <strong class="notification__title">{{ notification.title }}</strong>
          }
          <span class="notification__message">{{ notification.message }}</span>
        </div>

        <!-- Botón cerrar (opcional) -->
        @if (notification.dismissible) {
          <button 
            class="notification__close" 
            type="button" 
            aria-label="Cerrar notificación"
            (click)="close()">
            ✕
          </button>
        }

        <!-- Barra de progreso para auto-cierre -->
        @if (notification.duration && notification.duration > 0) {
          <div 
            class="notification__progress"
            [style.animation-duration.ms]="notification.duration"
            [attr.data-progress-id]="notification.id">
          </div>
        }
      </div>
    }
  `,
  styleUrl: './notification.scss'
})
export class NotificationContainer implements OnDestroy {
  notification: NotificationState | null = null;
  private subscription: Subscription;
  private currentId: number | null = null;

  constructor(private notificationService: NotificationService) {
    this.subscription = this.notificationService.notification$.subscribe(
      state => {
        // Si es una nueva notificación (diferente ID), forzar re-renderizado
        if (state && state.id !== this.currentId) {
          // Primero ponemos null para forzar que Angular destruya el elemento
          this.notification = null;
          this.currentId = state.id;
          // Luego en el siguiente ciclo, creamos el nuevo
          setTimeout(() => {
            this.notification = state;
          }, 0);
        } else {
          this.notification = state;
          this.currentId = state?.id ?? null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getClasses(notification: NotificationState): Record<string, boolean> {
    return {
      'notification': true,
      [`notification--${notification.type}`]: true,
      [`notification--${notification.position}`]: true,
      'notification--entering': notification.visible && !notification.isLeaving,
      'notification--leaving': notification.isLeaving
    };
  }

  close(): void {
    this.notificationService.close();
  }

  onMouseEnter(): void {
    this.notificationService.pauseAutoClose();
  }

  onMouseLeave(): void {
    this.notificationService.resumeAutoClose();
  }
}
