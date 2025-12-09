import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

/** Variantes visuales del botón */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Tamaños disponibles */
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  /** URL externa (abre en nueva pestaña) */
  @Input() href: string | null = null;
  
  /** Ruta interna de Angular */
  @Input() routerLink: string | null = null;
  
  /** Estado deshabilitado */
  @Input() disabled = false;
  
  /** Tipo de botón HTML */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  /** Variante visual */
  @Input() variant: ButtonVariant = 'primary';
  
  /** Tamaño */
  @Input() size: ButtonSize = 'md';

  /** Evento de click (solo se emite si no está deshabilitado) */
  @Output() btnClick = new EventEmitter<void>();

  /** Genera las clases CSS BEM */
  get classes(): string {
    return [
      'btn',
      `btn--${this.variant}`,
      `btn--${this.size}`,
      this.disabled ? 'btn--disabled' : ''
    ].filter(Boolean).join(' ');
  }

  /** Comprueba si el href es una ancla interna (empieza con #) */
  get isInternalAnchor(): boolean {
    return !!this.href && this.href.startsWith('#');
  }

  /** Añade clase 'disabled' al host */
  @HostBinding('class.disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  /** Maneja el click del botón */
  onClick(): void {
    if (!this.disabled) {
      this.btnClick.emit();
    }
  }
}
