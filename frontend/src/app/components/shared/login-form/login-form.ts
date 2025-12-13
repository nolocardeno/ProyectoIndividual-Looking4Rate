import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewChecked, Inject, PLATFORM_ID, inject, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInput } from '../form-input/form-input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingService, NotificationService, EventBusService } from '../../../services';

@Component({
  selector: 'app-login-form',
  imports: [FormInput, FontAwesomeModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm implements AfterViewChecked, OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private eventBus = inject(EventBusService);
  private fb = inject(FormBuilder);

  loginForm!: FormGroup;

  @ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<{ username: string; password: string }>();
  @Output() switchToRegister = new EventEmitter<void>();
  
  private isBrowser: boolean;
  private previousActiveElement: HTMLElement | null = null;
  private hasSetInitialFocus = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Inicializa el formulario reactivo con FormBuilder
   */
  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  /**
   * Inicializa el FormGroup con sus controles y validadores
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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
        // Atrapar el foco dentro del modal
        this.handleTabKey(event);
        break;
    }
  }

  /**
   * Se ejecuta después de cada verificación de la vista
   * Usado para establecer el foco inicial cuando se abre el modal
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
    // Guardar el elemento que tenía el foco antes de abrir el modal
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    // Dar tiempo a Angular para renderizar
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
      // Shift + Tab: si estamos en el primer elemento, ir al último
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: si estamos en el último elemento, ir al primero
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  get usernameError(): string {
    const control = this.loginForm?.get('username');
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'El nombre de usuario es obligatorio';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    return '';
  }

  get passwordError(): string {
    const control = this.loginForm?.get('password');
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'La contraseña es obligatoria';
    if (control.hasError('minlength')) return 'Mínimo 6 caracteres';
    return '';
  }

  get isFormValid(): boolean {
    return this.loginForm?.valid ?? false;
  }

  /**
   * Verifica si el formulario está en estado dirty (modificado)
   */
  get isFormDirty(): boolean {
    return this.loginForm?.dirty ?? false;
  }

  /**
   * Verifica si el formulario ha sido tocado
   */
  get isFormTouched(): boolean {
    return this.loginForm?.touched ?? false;
  }

  onUsernameBlur(): void {
    this.loginForm.get('username')?.markAsTouched();
  }

  onPasswordBlur(): void {
    this.loginForm.get('password')?.markAsTouched();
  }

  /**
   * Cierra el modal y restaura el foco al elemento anterior
   */
  closeModal(): void {
    this.close.emit();
    this.resetForm();
    
    // Restaurar el foco al elemento que lo tenía antes
    if (this.previousActiveElement && this.isBrowser) {
      setTimeout(() => {
        this.previousActiveElement?.focus();
      }, 50);
    }
  }

  onSubmit(event?: Event): void {
    // Prevenir envío del formulario por defecto
    if (event) {
      event.preventDefault();
    }
    
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      // Mostrar loading global mientras se procesa el login
      this.loadingService.showGlobal('Iniciando sesión...');
      
      // Emitir evento de intento de login
      this.eventBus.emit('auth:login:attempt', { username });
      
      // Emitir el evento de submit
      this.loginSubmit.emit({ username, password });
      
      // Simular respuesta del servidor (en producción esto vendría del backend)
      setTimeout(() => {
        this.loadingService.hideGlobal();
        this.notificationService.success('Inicio de sesión exitoso', `¡Bienvenido, ${username}!`);
        this.eventBus.emit('auth:login:success', { username });
        this.closeModal();
      }, 1000);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.loginForm.markAllAsTouched();
      this.notificationService.warning('Formulario incompleto', 'Por favor, completa todos los campos correctamente.');
    }
  }

  /**
   * Maneja click en el overlay - cierra el modal si se hace click fuera del contenido
   */
  onOverlayClick(event: MouseEvent): void {
    // Solo cerrar si el click fue directamente en el overlay, no en sus hijos
    if ((event.target as HTMLElement).classList.contains('login-modal__overlay')) {
      event.stopPropagation();
      this.closeModal();
    }
  }

  /**
   * Previene que el click en el modal se propague al overlay
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
   * Emite evento para cambiar al modal de registro
   */
  goToRegister(): void {
    this.switchToRegister.emit();
  }

  private resetForm(): void {
    this.loginForm.reset();
  }
}
