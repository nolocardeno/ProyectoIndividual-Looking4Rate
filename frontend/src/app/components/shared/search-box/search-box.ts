import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/** Variantes visuales del SearchBox */
export type SearchBoxVariant = 'default' | 'icon-only';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  @Input() placeholder = 'Buscar...';
  @Input() value = '';
  /** Variante visual: 'default' muestra input + icono, 'icon-only' muestra solo el icono */
  @Input() variant: SearchBoxVariant = 'default';
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();
  /** Evento emitido cuando se hace clic en el icono en modo icon-only */
  @Output() iconClick = new EventEmitter<void>();

  onSearch(): void {
    if (this.variant === 'icon-only') {
      this.iconClick.emit();
    } else if (this.value.trim()) {
      this.search.emit(this.value);
    }
  }

  onInputChange(): void {
    this.valueChange.emit(this.value);
  }
}
