import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewChecked, Inject, PLATFORM_ID, inject, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInput } from '../form-input/form-input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingService, NotificationService, EventBusService } from '../../../services';
import { AuthService } from '../../../services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);

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
      email: ['', [Validators.required, Validators.email]],
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
    const control = this.loginForm?.get('email');
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'El email es obligatorio';
    if (control.hasError('email')) return 'Introduce un email válido';
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
    this.loginForm.get('email')?.markAsTouched();
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
      const { email, password } = this.loginForm.value;
      
      // Mostrar loading global mientras se procesa el login
      this.loadingService.showGlobal('Iniciando sesión...');
      
      // Emitir evento de intento de login
      this.eventBus.emit('auth:login:attempt', { email });
      
      // Intentar login con AuthService
      this.authService.login(email, password).subscribe({
        next: (user) => {
          this.loadingService.hideGlobal();
          
          if (user) {
            this.notificationService.success('Inicio de sesión exitoso', `¡Bienvenido, ${user.nombre}!`);
            this.eventBus.emit('auth:login:success', { email });
            
            // Obtener URL de redirección o ir al home
            const redirectUrl = this.authService.getRedirectUrl() || '/';
            this.authService.clearRedirectUrl();
            
            // Cerrar modal
            this.closeModal();
            
            // Navegar a la página de destino
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.notificationService.error('Error de autenticación', 'Usuario o contraseña incorrectos');
          }
        },
        error: (error) => {
          this.loadingService.hideGlobal();
          
          // Detectar el tipo de error específico del backend
          const errorCode = error?.error?.message || error?.message || '';
          
          if (errorCode === 'EMAIL_NOT_FOUND') {
            this.notificationService.error('Email no encontrado', 'No existe una cuenta con este email. ¿Quieres registrarte?');
          } else if (errorCode === 'WRONG_PASSWORD') {
            this.notificationService.error('Contraseña incorrecta', 'La contraseña introducida no es correcta');
          } else if (error?.status === 0 || error?.status === 503) {
            this.notificationService.error('Error de conexión', 'No se pudo conectar con el servidor. Inténtalo más tarde.');
          } else {
            this.notificationService.error('Error de autenticación', 'Credenciales inválidas');
          }
          
          console.error('Login error:', error);
        }
      });
      
      // Emitir el evento de submit (para compatibilidad)
      this.loginSubmit.emit({ username: email, password });
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
