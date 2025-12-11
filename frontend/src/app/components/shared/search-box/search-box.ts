import { Component, EventEmitter, Input, Output, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

/** Variantes visuales del SearchBox */
export type SearchBoxVariant = 'default' | 'icon-only';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBox implements OnInit, OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Input() value = '';
  /** Variante visual: 'default' muestra input + icono, 'icon-only' muestra solo el icono */
  @Input() variant: SearchBoxVariant = 'default';
  /** Tiempo de debounce en milisegundos */
  @Input() debounceMs = 300;
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();
  /** Evento emitido cuando se hace clic en el icono en modo icon-only */
  @Output() iconClick = new EventEmitter<void>();

  private searchSubject = new Subject<string>();
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    // Configurar debounce para la búsqueda
    this.subscription = this.searchSubject.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged()
    ).subscribe(query => {
      this.search.emit(query);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.searchSubject.complete();
  }

  onSearch(): void {
    if (this.variant === 'icon-only') {
      this.iconClick.emit();
    } else if (this.value.trim()) {
      // Emitir inmediatamente al presionar Enter/submit
      this.search.emit(this.value);
    }
  }

  onInputChange(): void {
    this.valueChange.emit(this.value);
    // Usar debounce para la búsqueda
    this.searchSubject.next(this.value);
  }
}
