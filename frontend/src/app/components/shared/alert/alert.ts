import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

/** Tipos de alerta disponibles */
export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
  /** Tipo de alerta (determina el color) */
  @Input() type: AlertType = 'info';

  /** Título opcional de la alerta */
  @Input() title: string = '';

  /** Mostrar botón de cerrar */
  @Input() dismissible: boolean = false;

  /** Estado de visibilidad */
  @Input() visible: boolean = true;

  /** Evento emitido al cerrar la alerta */
  @Output() closed = new EventEmitter<void>();

  /** Genera las clases CSS BEM */
  get classes(): Record<string, boolean> {
    return {
      'alert': true,
      [`alert--${this.type}`]: true
    };
  }

  /** Cierra la alerta */
  close(): void {
    this.visible = false;
    this.closed.emit();
  }
}
