import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';

/** Tipos de notificación disponibles */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** Posiciones de la notificación en pantalla */
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

@Component({
  selector: 'app-notification',
  imports: [NgClass],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit, OnDestroy {
  /** Tipo de notificación (determina el color) */
  @Input() type: NotificationType = 'info';

  /** Título opcional de la notificación */
  @Input() title: string = '';

  /** Mensaje de la notificación */
  @Input() message: string = '';

  /** Posición en pantalla */
  @Input() position: NotificationPosition = 'top-right';

  /** Duración en ms antes de auto-cerrarse (0 = no auto-cerrar) */
  @Input() duration: number = 5000;

  /** Mostrar botón de cerrar */
  @Input() dismissible: boolean = true;

  /** Estado de visibilidad */
  @Input() visible: boolean = true;

  /** Evento emitido al cerrar la notificación */
  @Output() closed = new EventEmitter<void>();

  /** Estado interno para animación de salida */
  isLeaving = false;

  private autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

  /** Genera las clases CSS BEM */
  get classes(): Record<string, boolean> {
    return {
      'notification': true,
      [`notification--${this.type}`]: true,
      [`notification--${this.position}`]: true,
      'notification--entering': this.visible && !this.isLeaving,
      'notification--leaving': this.isLeaving
    };
  }

  ngOnInit(): void {
    this.startAutoCloseTimer();
  }

  ngOnDestroy(): void {
    this.clearAutoCloseTimer();
  }

  /** Inicia el temporizador de auto-cierre */
  private startAutoCloseTimer(): void {
    if (this.duration > 0) {
      this.autoCloseTimer = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  /** Limpia el temporizador */
  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  /** Cierra la notificación con animación */
  close(): void {
    this.clearAutoCloseTimer();
    this.isLeaving = true;
    
    // Esperar a que termine la animación antes de emitir el evento
    setTimeout(() => {
      this.visible = false;
      this.closed.emit();
    }, 300); // Duración de la animación
  }

  /** Pausar auto-cierre al hover */
  onMouseEnter(): void {
    this.clearAutoCloseTimer();
  }

  /** Reanudar auto-cierre al salir del hover */
  onMouseLeave(): void {
    this.startAutoCloseTimer();
  }
}
