import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

/**
 * Form Textarea Component
 *
 * Componente de textarea reutilizable con label, validación y estilos consistentes.
 * Similar a form-input pero para texto multilínea.
 *
 * @example
 * <app-form-textarea
 *   label="Descripción"
 *   name="description"
 *   placeholder="Escribe una descripción..."
 *   [required]="true"
 *   [(value)]="description"
 * />
 */
@Component({
  selector: 'app-form-textarea',
  standalone: true,
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormTextarea {
  /** Texto del label */
  @Input() label = '';

  /** Nombre del campo (usado para id y name) */
  @Input() name = '';

  /** Placeholder del textarea */
  @Input() placeholder = '';

  /** Si el campo es requerido */
  @Input() required = false;

  /** Si el campo está deshabilitado */
  @Input() disabled = false;

  /** Mensaje de error a mostrar */
  @Input() errorMessage = '';

  /** Texto de ayuda */
  @Input() helpText = '';

  /** Valor del textarea */
  @Input() value = '';

  /** Número de filas visibles */
  @Input() rows = 4;

  /** Número máximo de caracteres */
  @Input() maxLength: number | null = null;

  /** Si el textarea puede redimensionarse */
  @Input() resizable = true;

  /** Aria-label para accesibilidad cuando no hay label visible */
  @Input() ariaLabel = '';

  /** Evento de cambio de valor */
  @Output() valueChange = new EventEmitter<string>();

  /** Evento de blur */
  @Output() textareaBlur = new EventEmitter<void>();

  /** Genera el id único para el textarea */
  get id(): string {
    return `textarea-${this.name}`;
  }

  /** Cuenta los caracteres actuales */
  get characterCount(): number {
    return this.value?.length || 0;
  }

  /** Maneja el cambio de valor */
  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  /** Maneja el evento blur */
  onBlur(): void {
    this.textareaBlur.emit();
  }
}
