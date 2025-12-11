import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewChecked, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormInput } from '../form-input/form-input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingService, NotificationService, EventBusService } from '../../../services';

@Component({
  selector: 'app-register-form',
  imports: [FormInput, FontAwesomeModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm implements AfterViewChecked {
  /** Referencia al contenedor del modal para manipulación del DOM */
  @ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;
  
  /** Referencia al botón de cerrar */
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() registerSubmit = new EventEmitter<{ email: string; username: string; password: string }>();
  @Output() switchToLogin = new EventEmitter<void>();

  email = '';
  username = '';
  password = '';
  emailTouched = false;
  usernameTouched = false;
  passwordTouched = false;

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private isBrowser: boolean;
  private previousActiveElement: HTMLElement | null = null;
  private hasSetInitialFocus = false;

  // Servicios inyectados
  private readonly loadingService = inject(LoadingService);
  private readonly notificationService = inject(NotificationService);
  private readonly eventBus = inject(EventBusService);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Maneja eventos de teclado a nivel de documento
   * Cierra el modal con ESC
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
   * Establece el foco inicial en el primer campo del formulario
   */
  private setInitialFocus(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    setTimeout(() => {
      if (this.modalContainer?.nativeElement) {
        const firstInput = this.modalContainer.nativeElement.querySelector('input');
        if (firstInput) {
          (firstInput as HTMLElement).focus();
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

  get emailError(): string {
    if (!this.emailTouched) return '';
    if (!this.email.trim()) return 'El email es obligatorio';
    if (!this.emailRegex.test(this.email)) return 'El email no es válido';
    return '';
  }

  get usernameError(): string {
    if (!this.usernameTouched) return '';
    if (!this.username.trim()) return 'El nombre de usuario es obligatorio';
    if (this.username.trim().length < 3) return 'Mínimo 3 caracteres';
    return '';
  }

  get passwordError(): string {
    if (!this.passwordTouched) return '';
    if (!this.password) return 'La contraseña es obligatoria';
    if (this.password.length < 6) return 'Mínimo 6 caracteres';
    return '';
  }

  get isFormValid(): boolean {
    return this.emailRegex.test(this.email) && 
           this.username.trim().length >= 3 && 
           this.password.length >= 6;
  }

  onEmailBlur(): void {
    this.emailTouched = true;
  }

  onUsernameBlur(): void {
    this.usernameTouched = true;
  }

  onPasswordBlur(): void {
    this.passwordTouched = true;
  }

  /**
   * Cierra el modal y restaura el foco
   */
  closeModal(): void {
    this.close.emit();
    this.resetForm();
    
    if (this.previousActiveElement && this.isBrowser) {
      setTimeout(() => {
        this.previousActiveElement?.focus();
      }, 50);
    }
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.isFormValid) {
      // Mostrar loading global mientras se procesa el registro
      this.loadingService.showGlobal('Creando cuenta...');
      
      // Emitir evento de intento de registro
      this.eventBus.emit('auth:register:attempt', { email: this.email, username: this.username });
      
      // Emitir el evento de submit
      this.registerSubmit.emit({ 
        email: this.email, 
        username: this.username, 
        password: this.password 
      });
      
      // Simular respuesta del servidor (en producción esto vendría del backend)
      setTimeout(() => {
        this.loadingService.hideGlobal();
        this.notificationService.success('Registro exitoso', `¡Bienvenido, ${this.username}! Tu cuenta ha sido creada.`);
        this.eventBus.emit('auth:register:success', { email: this.email, username: this.username });
        this.closeModal();
      }, 1500);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.emailTouched = true;
      this.usernameTouched = true;
      this.passwordTouched = true;
      this.notificationService.warning('Formulario incompleto', 'Por favor, completa todos los campos correctamente.');
    }
  }

  /**
   * Maneja click en el overlay
   */
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('register-modal__overlay')) {
      event.stopPropagation();
      this.closeModal();
    }
  }

  /**
   * Previene propagación de clicks dentro del modal
   */
  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Maneja eventos de teclado en el botón de cerrar
   */
  onCloseKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.closeModal();
    }
  }

  /**
   * Emite evento para cambiar al modal de login
   */
  goToLogin(): void {
    this.switchToLogin.emit();
  }

  private resetForm(): void {
    this.email = '';
    this.username = '';
    this.password = '';
    this.emailTouched = false;
    this.usernameTouched = false;
    this.passwordTouched = false;
  }
}
