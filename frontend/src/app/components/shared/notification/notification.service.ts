import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationType, NotificationPosition } from './notification';

/** Configuración de una notificación */
export interface NotificationConfig {
  type: NotificationType;
  title?: string;
  message: string;
  position?: NotificationPosition;
  duration?: number;
  dismissible?: boolean;
}

/** Estado interno de la notificación */
export interface NotificationState extends NotificationConfig {
  id: number; // ID único para forzar re-renderizado
  visible: boolean;
  isLeaving: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultConfig: Partial<NotificationConfig> = {
    position: 'top-right',
    duration: 5000,
    dismissible: true
  };

  private state$ = new BehaviorSubject<NotificationState | null>(null);
  private autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private animationTimer: ReturnType<typeof setTimeout> | null = null;
  private notificationId = 0; // Contador para IDs únicos

  /** Observable del estado de la notificación */
  notification$ = this.state$.asObservable();

  /** Muestra una notificación (sobrescribe cualquier notificación existente) */
  show(config: NotificationConfig): void {
    // Limpiar cualquier timer existente
    this.clearAllTimers();

    // Incrementar ID para forzar re-renderizado y nueva animación
    this.notificationId++;

    // Crear el nuevo estado con la configuración por defecto
    const newState: NotificationState = {
      ...this.defaultConfig,
      ...config,
      id: this.notificationId,
      visible: true,
      isLeaving: false
    };

    this.state$.next(newState);

    // Iniciar auto-cierre si tiene duración
    this.startAutoCloseTimer(newState.duration);
  }

  /** Cierra la notificación con animación */
  close(): void {
    this.clearAllTimers();
    
    const current = this.state$.value;
    if (current && current.visible && !current.isLeaving) {
      // Activar animación de salida
      this.state$.next({ ...current, isLeaving: true });

      // Después de la animación, ocultar completamente
      this.animationTimer = setTimeout(() => {
        this.state$.next(null);
      }, 300);
    }
  }

  /** Pausa el auto-cierre (para hover) */
  pauseAutoClose(): void {
    this.clearAutoCloseTimer();
  }

  /** Reanuda el auto-cierre (al salir del hover) */
  resumeAutoClose(): void {
    const current = this.state$.value;
    if (current && current.duration && current.duration > 0 && !current.isLeaving) {
      // Usar un tiempo reducido al reanudar (la mitad del tiempo original)
      this.startAutoCloseTimer(Math.min(current.duration, 3000));
    }
  }

  private startAutoCloseTimer(duration?: number): void {
    if (duration && duration > 0) {
      this.autoCloseTimer = setTimeout(() => {
        this.close();
      }, duration);
    }
  }

  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  private clearAllTimers(): void {
    this.clearAutoCloseTimer();
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }

  // Métodos de conveniencia para cada tipo
  success(message: string, title?: string): void {
    this.show({ type: 'success', message, title });
  }

  error(message: string, title?: string): void {
    this.show({ type: 'error', message, title });
  }

  warning(message: string, title?: string): void {
    this.show({ type: 'warning', message, title });
  }

  info(message: string, title?: string): void {
    this.show({ type: 'info', message, title });
  }
}
