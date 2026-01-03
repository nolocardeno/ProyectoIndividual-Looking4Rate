import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  HostListener, 
  ViewChild, 
  ElementRef, 
  AfterViewChecked, 
  Inject, 
  PLATFORM_ID,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser, CommonModule, UpperCasePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameCover } from '../game-cover/game-cover';
import { FormTextarea } from '../form-textarea/form-textarea';

/**
 * Review Form Modal Component
 *
 * Modal para escribir o editar reviews de juegos.
 * Muestra la carátula del juego, título y año, junto con un textarea
 * para escribir la review.
 *
 * @example
 * <app-review-form-modal
 *   [isOpen]="showReviewModal"
 *   [gameTitle]="game.nombre"
 *   [gameCover]="game.imagenPortada"
 *   [gameYear]="2010"
 *   [existingReview]="userInteraction?.review"
 *   (close)="closeReviewModal()"
 *   (reviewSubmit)="onReviewSubmit($event)"
 * />
 */
@Component({
  selector: 'app-review-form-modal',
  imports: [FontAwesomeModule, CommonModule, UpperCasePipe, GameCover, FormTextarea],
  templateUrl: './review-form-modal.html',
  styleUrl: './review-form-modal.scss'
})
export class ReviewFormModal implements AfterViewChecked, OnChanges {
  @ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  /** Si el modal está abierto */
  @Input() isOpen = false;

  /** Título del juego */
  @Input() gameTitle = '';

  /** URL de la carátula del juego */
  @Input() gameCover = '';

  /** Año de lanzamiento del juego */
  @Input() gameYear: string | number = '';

  /** Review existente (para edición) */
  @Input() existingReview: string | null = null;

  /** Si está en proceso de guardado */
  @Input() loading = false;

  /** Evento al cerrar el modal */
  @Output() close = new EventEmitter<void>();

  /** Evento al enviar la review */
  @Output() reviewSubmit = new EventEmitter<string>();

  /** Texto de la review */
  reviewText = '';

  private isBrowser: boolean;
  private previousActiveElement: HTMLElement | null = null;
  private hasSetInitialFocus = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Detecta cambios en los inputs
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Si el modal se abre o cambia la review existente, actualizar el texto
    if (changes['isOpen'] && this.isOpen) {
      this.reviewText = this.existingReview || '';
    }
    if (changes['existingReview'] && this.isOpen) {
      this.reviewText = this.existingReview || '';
    }
  }

  /**
   * Maneja eventos de teclado a nivel de documento
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.closeModal();
        break;
      case 'Tab':
        this.handleTabKey(event);
        break;
    }
  }

  /**
   * Se ejecuta después de cada verificación de la vista
   */
  ngAfterViewChecked(): void {
    if (this.isOpen && !this.hasSetInitialFocus && this.isBrowser) {
      this.setInitialFocus();
      this.hasSetInitialFocus = true;
    }
    
    if (!this.isOpen) {
      this.hasSetInitialFocus = false;
    }
  }

  /**
   * Establece el foco inicial en el textarea
   */
  private setInitialFocus(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    setTimeout(() => {
      if (this.modalContainer?.nativeElement) {
        const textarea = this.modalContainer.nativeElement.querySelector('textarea');
        if (textarea) {
          (textarea as HTMLElement).focus();
        }
      }
    }, 50);
  }

  /**
   * Maneja la navegación con Tab para atrapar el foco dentro del modal
   */
  private handleTabKey(event: KeyboardEvent): void {
    if (!this.modalContainer?.nativeElement) return;

    const focusableElements = this.modalContainer.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /** Verifica si se puede enviar el formulario */
  get canSubmit(): boolean {
    return this.reviewText.trim().length > 0;
  }

  /** Cierra el modal */
  closeModal(): void {
    this.close.emit();
    
    if (this.previousActiveElement && this.isBrowser) {
      setTimeout(() => {
        this.previousActiveElement?.focus();
      }, 50);
    }
  }

  /** Maneja el click en el overlay */
  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  /** Evita que el click en el modal cierre el overlay */
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  /** Maneja el teclado en el botón de cerrar */
  onCloseKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.closeModal();
    }
  }

  /** Maneja el envío del formulario */
  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.canSubmit && !this.loading) {
      this.reviewSubmit.emit(this.reviewText.trim());
    }
  }
}
