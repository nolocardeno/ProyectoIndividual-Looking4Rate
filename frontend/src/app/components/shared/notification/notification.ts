import { Component, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { 
  NotificationService, 
  NotificationState
} from '../../../services';

/**
 * @description Componente de notificaciones toast.
 * Se suscribe automáticamente al NotificationService para mostrar notificaciones.
 * Soporta múltiples notificaciones simultáneas con timers independientes.
 * 
 * @example
 * <!-- En el template de la app -->
 * <app-notification />
 */
@Component({
  selector: 'app-notification',
  imports: [NgClass],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notification implements OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private subscription: Subscription;

  /** Array de notificaciones activas */
  notifications: NotificationState[] = [];

  constructor() {
    this.subscription = this.notificationService.notifications$.subscribe(
      (notifications: NotificationState[]) => {
        this.notifications = notifications;
        this.cdr.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /** Genera las clases CSS BEM para una notificación */
  getClasses(notification: NotificationState): Record<string, boolean> {
    return {
      'notification': true,
      [`notification--${notification.type}`]: true,
      'notification--entering': notification.visible && !notification.isLeaving,
      'notification--leaving': notification.isLeaving
    };
  }

  close(id: number): void {
    this.notificationService.closeById(id);
  }

  onMouseEnter(id: number): void {
    this.notificationService.pauseAutoClose(id);
  }

  onMouseLeave(id: number): void {
    this.notificationService.resumeAutoClose(id);
  }
}
