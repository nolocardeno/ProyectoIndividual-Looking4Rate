import { Component, Input, Output, EventEmitter, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/** Interfaz para las opciones del select */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Form Select Component
 *
 * Componente de dropdown/select personalizado con diseño consistente.
 * Incluye label asociado, validación y estilos mejorados.
 *
 * @example
 * <app-form-select
 *   label="Plataforma"
 *   name="platform"
 *   [options]="platforms"
 *   [(value)]="selectedPlatform"
 * />
 */
@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormSelect {
  /** Texto del label */
  @Input() label = '';

  /** Nombre del campo (usado para id y name) */
  @Input() name = '';

  /** Placeholder para la opción vacía */
  @Input() placeholder = 'Selecciona una opción';

  /** Opciones del select */
  @Input() options: SelectOption[] = [];

  /** Si el campo es requerido */
  @Input() required = false;

  /** Si el campo está deshabilitado */
  @Input() disabled = false;

  /** Mensaje de error a mostrar */
  @Input() errorMessage = '';

  /** Valor seleccionado */
  @Input() value = '';

  /** Evento de cambio de valor */
  @Output() valueChange = new EventEmitter<string>();

  /** Evento de blur */
  @Output() selectBlur = new EventEmitter<void>();

  /** Estado del dropdown */
  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  /** Genera el id único para el select */
  get id(): string {
    return `select-${this.name}`;
  }

  /** Obtiene el label de la opción seleccionada */
  get selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : '';
  }

  /** Alterna el estado del dropdown */
  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  /** Selecciona una opción */
  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.value = option.value;
      this.valueChange.emit(this.value);
      this.isOpen = false;
    }
  }

  /** Cierra el dropdown al hacer click fuera */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.selectBlur.emit();
      }
    }
  }

  /** Maneja navegación con teclado */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.isOpen = false;
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
        }
        break;
    }
  }
}
