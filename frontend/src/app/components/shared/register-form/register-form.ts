import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewChecked, Inject, PLATFORM_ID, inject, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInput } from '../form-input/form-input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingService, NotificationService, EventBusService } from '../../../services';
import { AuthService } from '../../../services/auth.service';
import { CustomValidators, AsyncValidators, ValidationService } from '../../../validators';

@Component({
  selector: 'app-register-form',
  imports: [FormInput, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm implements AfterViewChecked, OnInit, OnDestroy {
  /** Referencia al contenedor del modal para manipulación del DOM */
  @ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;
  
  /** Referencia al botón de cerrar */
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() registerSubmit = new EventEmitter<{ email: string; username: string; password: string }>();
  @Output() switchToLogin = new EventEmitter<void>();

  registerForm!: FormGroup;

  private isBrowser: boolean;
  private previousActiveElement: HTMLElement | null = null;
  private hasSetInitialFocus = false;

  // Servicios inyectados
  private readonly loadingService = inject(LoadingService);
  private readonly notificationService = inject(NotificationService);
  private readonly eventBus = inject(EventBusService);
  private readonly fb = inject(FormBuilder);
  private readonly validationService = inject(ValidationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Inicializa el formulario reactivo
   */
  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  /**
   * Inicializa el FormGroup con validadores síncronos y asíncronos
   */
  private initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', 
        [Validators.required, Validators.email],
        [AsyncValidators.uniqueEmail(this.validationService, 600)]
      ],
      username: ['',
        [Validators.required, Validators.minLength(3), CustomValidators.username()],
        [AsyncValidators.availableUsername(this.validationService, 600)]
      ],
      password: ['',
        [Validators.required, Validators.minLength(8), CustomValidators.strongPassword()]
      ]
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
    const control = this.registerForm?.get('email');
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'El email es obligatorio';
    if (control.hasError('email')) return 'El email no es válido';
    if (control.hasError('emailNotUnique')) return 'Este email ya está registrado';
    return '';
  }

  /**
   * Indica si el email está siendo validado asíncronamente
   */
  get isEmailValidating(): boolean {
    return this.registerForm?.get('email')?.status === 'PENDING';
  }

  get usernameError(): string {
    const control = this.registerForm?.get('username');
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'El nombre de usuario es obligatorio';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (control.hasError('invalidUsername')) return 'Solo letras, números, guiones y guiones bajos';
    if (control.hasError('usernameNotAvailable')) return 'Este nombre de usuario ya está en uso';
    return '';
  }

  /**
   * Indica si el username está siendo validado asíncronamente
   */
  get isUsernameValidating(): boolean {
    return this.registerForm?.get('username')?.status === 'PENDING';
  }

  get passwordError(): string {
    const control = this.registerForm?.get('password');
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'La contraseña es obligatoria';
    if (control.hasError('minlength')) return 'Mínimo 8 caracteres';
    
    // Errores específicos de strongPassword
    const strongPasswordErrors = control.getError('strongPassword');
    if (strongPasswordErrors) {
      if (strongPasswordErrors['minLength']) return 'Mínimo 8 caracteres';
      if (strongPasswordErrors['noUppercase']) return 'Falta al menos una mayúscula';
      if (strongPasswordErrors['noLowercase']) return 'Falta al menos una minúscula';
      if (strongPasswordErrors['noNumber']) return 'Falta al menos un número';
      if (strongPasswordErrors['noSpecialChar']) return 'Falta al menos un símbolo (.,!@#$%&*...)';
      return 'Contraseña no cumple los requisitos';
    }
    
    return '';
  }

  /**
   * Calcula la fortaleza de la contraseña (0-4)
   */
  get passwordStrength(): number {
    const password = this.registerForm?.get('password')?.value || '';
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  }

  /**
   * Devuelve el texto descriptivo de la fortaleza de la contraseña
   */
  get passwordStrengthText(): string {
    const strength = this.passwordStrength;
    switch (strength) {
      case 0: return '';
      case 1: return 'Muy débil';
      case 2: return 'Débil';
      case 3: return 'Aceptable';
      case 4: return 'Fuerte';
      default: return '';
    }
  }

  get isFormValid(): boolean {
    return this.registerForm?.valid ?? false;
  }

  /**
   * Verifica si el formulario está pendiente de validaciones asíncronas
   */
  get isFormPending(): boolean {
    return this.registerForm?.pending ?? false;
  }

  onEmailBlur(): void {
    this.registerForm.get('email')?.markAsTouched();
  }

  onUsernameBlur(): void {
    this.registerForm.get('username')?.markAsTouched();
  }

  onPasswordBlur(): void {
    this.registerForm.get('password')?.markAsTouched();
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
    
    if (this.registerForm.valid) {
      const { email, username, password } = this.registerForm.value;
      
      // Mostrar loading global mientras se procesa el registro
      this.loadingService.showGlobal('Creando cuenta...');
      
      // Emitir evento de intento de registro
      this.eventBus.emit('auth:register:attempt', { email, username });
      
      // Registrar con AuthService
      this.authService.register(email, username, password).subscribe({
        next: (success) => {
          this.loadingService.hideGlobal();
          
          if (success) {
            this.notificationService.success('Registro exitoso', `¡Bienvenido, ${username}! Tu cuenta ha sido creada.`);
            this.eventBus.emit('auth:register:success', { email, username });
            
            // Cerrar modal
            this.closeModal();
            
            // Navegar al home (ya logueado)
            this.router.navigate(['/']);
          } else {
            this.notificationService.error('Error de registro', 'No se pudo crear la cuenta');
          }
        },
        error: (error) => {
          this.loadingService.hideGlobal();
          this.notificationService.error('Error de conexión', 'No se pudo conectar con el servidor');
          console.error('Register error:', error);
        }
      });
      
      // Emitir el evento de submit (para compatibilidad)
      this.registerSubmit.emit({ email, username, password });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.registerForm.markAllAsTouched();
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
    this.registerForm.reset();
  }
}
