import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { CustomValidators, AsyncValidators, ValidationService } from '../../../validators';

export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  nif: string;
  phones: string[];
}

/**
 * Formulario de edición de perfil con FormArray y ViewChild
 * Demuestra:
 * - Formularios reactivos avanzados con FormArray
 * - Validadores síncronos y asíncronos personalizados
 * - Uso de ViewChild y ElementRef para manipulación del DOM
 * - Feedback visual completo de validación
 */
@Component({
  selector: 'app-edit-profile-form',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './edit-profile-form.html',
  styleUrl: './edit-profile-form.scss',
})
export class EditProfileForm implements AfterViewInit {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);

  /** Referencia al primer input para hacer focus automático */
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;

  /** Referencia al contenedor de teléfonos para scroll automático */
  @ViewChild('phonesContainer') phonesContainer!: ElementRef<HTMLDivElement>;

  @Output() formSubmit = new EventEmitter<ProfileData>();
  @Output() formCancel = new EventEmitter<void>();

  /** FormGroup principal */
  profileForm: FormGroup;

  /** Estado de validación asíncrona */
  isUsernameValidating = false;
  isEmailValidating = false;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: [
        '', 
        [Validators.required, CustomValidators.username()],
        [AsyncValidators.availableUsername(this.validationService, 600)]
      ],
      email: [
        '', 
        [Validators.required, Validators.email],
        [AsyncValidators.uniqueEmail(this.validationService, 600)]
      ],
      nif: ['', [CustomValidators.nif()]],
      phones: this.fb.array([])
    });

    // Monitorear estado de validación asíncrona
    this.profileForm.get('username')?.statusChanges.subscribe(status => {
      this.isUsernameValidating = status === 'PENDING';
    });

    this.profileForm.get('email')?.statusChanges.subscribe(status => {
      this.isEmailValidating = status === 'PENDING';
    });
  }

  ngAfterViewInit(): void {
    // Focus automático en el primer campo usando ViewChild
    this.focusFirstInput();
  }

  /**
   * Getter para acceder al FormArray de teléfonos
   */
  get phones(): FormArray {
    return this.profileForm.get('phones') as FormArray;
  }

  /**
   * Añade un nuevo campo de teléfono al FormArray
   */
  addPhone(): void {
    const phoneControl = this.fb.control('', [
      Validators.required,
      CustomValidators.spanishPhone()
    ]);
    
    this.phones.push(phoneControl);

    // Scroll automático al último teléfono añadido
    setTimeout(() => {
      this.scrollToLastPhone();
    }, 100);
  }

  /**
   * Elimina un teléfono del FormArray por índice
   */
  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  /**
   * Carga datos iniciales en el formulario
   */
  loadProfile(data: ProfileData): void {
    // Limpiar FormArray de teléfonos
    while (this.phones.length) {
      this.phones.removeAt(0);
    }

    // Cargar teléfonos
    data.phones.forEach(phone => {
      this.phones.push(this.fb.control(phone, [
        Validators.required,
        CustomValidators.spanishPhone()
      ]));
    });

    // Cargar resto de datos
    this.profileForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      nif: data.nif
    });

    // Focus en el primer campo
    this.focusFirstInput();
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      this.formSubmit.emit({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        username: formValue.username,
        email: formValue.email,
        nif: formValue.nif,
        phones: formValue.phones
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markAllAsTouched();
    }
  }

  /**
   * Maneja la cancelación del formulario
   */
  onCancel(): void {
    this.resetForm();
    this.formCancel.emit();
  }

  /**
   * Reinicia el formulario a su estado inicial
   */
  resetForm(): void {
    this.profileForm.reset();
    while (this.phones.length) {
      this.phones.removeAt(0);
    }
    this.focusFirstInput();
  }

  /**
   * Marca todos los controles como touched para mostrar errores
   */
  private markAllAsTouched(): void {
    this.profileForm.markAllAsTouched();
    
    // Marcar también los controles del FormArray
    this.phones.controls.forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Hace focus en el primer input usando ViewChild y ElementRef
   */
  private focusFirstInput(): void {
    setTimeout(() => {
      if (this.firstNameInput?.nativeElement) {
        this.firstNameInput.nativeElement.focus();
      }
    }, 100);
  }

  /**
   * Scroll automático al último teléfono añadido
   */
  private scrollToLastPhone(): void {
    if (this.phonesContainer?.nativeElement) {
      const container = this.phonesContainer.nativeElement;
      const lastPhone = container.lastElementChild as HTMLElement;
      
      if (lastPhone) {
        lastPhone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Focus en el input del último teléfono
        const input = lastPhone.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['email']) return 'Email inválido';
    if (errors['invalidUsername']) return 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos';
    if (errors['usernameNotAvailable']) return 'Este nombre de usuario ya está en uso';
    if (errors['emailNotUnique']) return 'Este email ya está registrado';
    if (errors['invalidNIF']) return 'NIF inválido (formato: 12345678A)';

    return 'Error de validación';
  }

  /**
   * Obtiene el mensaje de error para un teléfono específico
   */
  getPhoneErrorMessage(index: number): string {
    const control = this.phones.at(index);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) return 'El teléfono es obligatorio';
    if (errors['invalidPhone']) return 'Formato inválido (ej: +34 612345678 o 612345678)';

    return 'Error de validación';
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control && control.errors && control.touched);
  }

  /**
   * Verifica si un teléfono tiene error
   */
  hasPhoneError(index: number): boolean {
    const control = this.phones.at(index);
    return !!(control && control.errors && control.touched);
  }
}
