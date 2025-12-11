import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Tipos de notificación disponibles */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** Posiciones de la notificación en pantalla */
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

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
  id: number;
  visible: boolean;
  isLeaving: boolean;
  isPaused: boolean;
  remainingTime: number;
}

/** Datos internos del timer de cada notificación */
interface NotificationTimer {
  timerId: ReturnType<typeof setTimeout>;
  startTime: number;
  remainingTime: number;
}

/**
 * @description Servicio para gestionar notificaciones toast en la aplicación.
 * Soporta múltiples notificaciones simultáneas, cada una con su propio timer independiente.
 * 
 * @example
 * // Inyección y uso básico
 * private notificationService = inject(NotificationService);
 * 
 * // Métodos de conveniencia
 * this.notificationService.success('Operación exitosa');
 * this.notificationService.error('Error al procesar');
 * this.notificationService.warning('Advertencia');
 * this.notificationService.info('Información');
 * 
 * // Configuración personalizada
 * this.notificationService.show({
 *   type: 'success',
 *   title: 'Éxito',
 *   message: 'La operación se completó correctamente',
 *   position: 'top-center',
 *   duration: 3000
 * });
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultConfig: Partial<NotificationConfig> = {
    position: 'top-right',
    duration: 5000,
    dismissible: true
  };

  /** Almacén de notificaciones activas */
  private notificationsState$ = new BehaviorSubject<NotificationState[]>([]);
  
  /** Timers independientes para cada notificación */
  private timers = new Map<number, NotificationTimer>();
  
  /** Contador de IDs únicos */
  private notificationId = 0;
  
  /** Máximo de notificaciones visibles simultáneamente */
  private readonly maxNotifications = 5;

  /** Observable del array de notificaciones */
  readonly notifications$ = this.notificationsState$.asObservable();

  /** Muestra una nueva notificación */
  show(config: NotificationConfig): number {
    this.notificationId++;
    const id = this.notificationId;
    const duration = config.duration ?? this.defaultConfig.duration ?? 5000;

    const newNotification: NotificationState = {
      ...this.defaultConfig,
      ...config,
      id,
      visible: true,
      isLeaving: false,
      isPaused: false,
      remainingTime: duration
    };

    // Obtener notificaciones actuales
    let current = [...this.notificationsState$.value];
    
    // Si hay demasiadas, cerrar la más antigua
    if (current.length >= this.maxNotifications) {
      const oldest = current[0];
      this.closeById(oldest.id);
      current = current.slice(1);
    }

    // Añadir la nueva notificación
    this.notificationsState$.next([...current, newNotification]);

    // Iniciar timer de auto-cierre
    if (duration > 0) {
      this.startTimer(id, duration);
    }

    return id;
  }

  /** Cierra una notificación específica por su ID */
  closeById(id: number): void {
    this.clearTimer(id);
    
    const current = this.notificationsState$.value;
    const notification = current.find(n => n.id === id);
    
    if (notification && !notification.isLeaving) {
      // Marcar como saliendo para la animación
      const updated = current.map(n => 
        n.id === id ? { ...n, isLeaving: true } : n
      );
      this.notificationsState$.next(updated);

      // Remover después de la animación
      setTimeout(() => {
        const final = this.notificationsState$.value.filter(n => n.id !== id);
        this.notificationsState$.next(final);
      }, 300);
    }
  }

  /** Cierra todas las notificaciones */
  closeAll(): void {
    const current = this.notificationsState$.value;
    current.forEach(n => this.clearTimer(n.id));
    
    // Animar salida de todas
    const leaving = current.map(n => ({ ...n, isLeaving: true }));
    this.notificationsState$.next(leaving);

    setTimeout(() => {
      this.notificationsState$.next([]);
    }, 300);
  }

  /** @deprecated Usar closeById() o closeAll() */
  close(): void {
    const current = this.notificationsState$.value;
    if (current.length > 0) {
      this.closeById(current[current.length - 1].id);
    }
  }

  /** Pausa el auto-cierre de una notificación específica */
  pauseAutoClose(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.timerId);
      const elapsed = Date.now() - timer.startTime;
      timer.remainingTime = Math.max(0, timer.remainingTime - elapsed);
      
      // Actualizar estado para pausar la animación CSS
      const current = this.notificationsState$.value;
      const updated = current.map(n => 
        n.id === id ? { ...n, isPaused: true, remainingTime: timer.remainingTime } : n
      );
      this.notificationsState$.next(updated);
    }
  }

  /** Reanuda el auto-cierre de una notificación específica */
  resumeAutoClose(id: number): void {
    const timer = this.timers.get(id);
    if (timer && timer.remainingTime > 0) {
      // Usar un tiempo mínimo razonable
      const timeToUse = Math.max(timer.remainingTime, 1000);
      
      // Actualizar estado para reanudar animación
      const current = this.notificationsState$.value;
      const updated = current.map(n => 
        n.id === id ? { ...n, isPaused: false, remainingTime: timeToUse } : n
      );
      this.notificationsState$.next(updated);
      
      // Reiniciar timer
      this.startTimer(id, timeToUse);
    }
  }

  /** Inicia el timer de auto-cierre para una notificación */
  private startTimer(id: number, duration: number): void {
    this.clearTimer(id);
    
    const timerId = setTimeout(() => {
      this.closeById(id);
    }, duration);

    this.timers.set(id, {
      timerId,
      startTime: Date.now(),
      remainingTime: duration
    });
  }

  /** Limpia el timer de una notificación */
  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.timerId);
      this.timers.delete(id);
    }
  }

  // -------------------------------------------------------------------------
  // Métodos de conveniencia
  // -------------------------------------------------------------------------
  
  success(message: string, title?: string): number {
    return this.show({ type: 'success', message, title });
  }

  error(message: string, title?: string): number {
    return this.show({ type: 'error', message, title });
  }

  warning(message: string, title?: string): number {
    return this.show({ type: 'warning', message, title });
  }

  info(message: string, title?: string): number {
    return this.show({ type: 'info', message, title });
  }
}
