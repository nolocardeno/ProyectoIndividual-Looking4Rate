# Documentación de Formularios Reactivos - Fase 3

## Índice
1. [Introducción](#introducción)
2. [Estructura del Sistema de Validación](#estructura-del-sistema-de-validación)
3. [Catálogo de Validadores](#catálogo-de-validadores)
4. [Validadores Asíncronos con Debounce](#validadores-asíncronos-con-debounce)
5. [FormArray - Gestión de Colecciones Dinámicas](#formarray---gestión-de-colecciones-dinámicas)
6. [Gestión del Estado del Formulario](#gestión-del-estado-del-formulario)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [Buenas Prácticas](#buenas-prácticas)

---

## Introducción

La Fase 3 del frontend de Looking4Rate implementa **Formularios Reactivos** de Angular siguiendo los requisitos de la rúbrica:

| Requisito | Implementación |
|-----------|----------------|
| FormBuilder | ✅ Uso en LoginForm, RegisterForm y EditProfileForm |
| Validadores personalizados | ✅ 13 validadores síncronos en `CustomValidators` |
| Validadores asíncronos con debounce | ✅ `AsyncValidators` con timer de 600ms |
| FormArray | ✅ Implementado en EditProfileForm (teléfonos dinámicos) |
| ViewChild y ElementRef | ✅ Focus automático y scroll en EditProfileForm |
| Gestión de estado | ✅ dirty, touched, valid, pending |
| Documentación | ✅ Este documento |

---

## Estructura del Sistema de Validación

```
src/app/validators/
├── index.ts                 # Exportaciones centralizadas
├── custom.validators.ts     # Validadores síncronos
├── async.validators.ts      # Validadores asíncronos
└── validation.service.ts    # Servicio de validación (API)
```

### Importación

```typescript
import { 
  CustomValidators, 
  AsyncValidators, 
  ValidationService 
} from '@app/validators';
```

---

## Catálogo de Validadores

### Validadores Síncronos (`CustomValidators`)

#### 1. `strongPassword()`
Valida que la contraseña contenga mayúsculas, minúsculas, números y símbolos.

```typescript
password: ['', [
  Validators.required,
  CustomValidators.strongPassword()
]]
```

**Error devuelto:** `{ passwordStrength: true }`

---

#### 2. `passwordComplexity(config)`
Valida la complejidad de la contraseña con requisitos configurables.

```typescript
password: ['', [
  CustomValidators.passwordComplexity({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true
  })
]]
```

**Errores devueltos:**
- `{ minLength: { actual, expected } }`
- `{ requireUppercase: true }`
- `{ requireLowercase: true }`
- `{ requireNumbers: true }`
- `{ requireSpecial: true }`

---

#### 3. `passwordMatch(passwordField, confirmField)`
Valida que dos campos de contraseña coincidan.

```typescript
this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, {
  validators: [CustomValidators.passwordMatch('password', 'confirmPassword')]
});
```

**Error devuelto:** `{ passwordMismatch: true }` (en el campo confirmPassword)

---

#### 4. `nif()`
Valida el formato de NIF/NIE español (8 dígitos + letra o X/Y/Z + 7 dígitos + letra).

```typescript
nif: ['', [Validators.required, CustomValidators.nif()]]
```

**Error devuelto:** `{ invalidNif: true }`

---

#### 5. `spanishPhone()`
Valida números de teléfono españoles (fijos y móviles).

```typescript
phone: ['', [CustomValidators.spanishPhone()]]
```

**Error devuelto:** `{ invalidPhone: true }`

---

#### 6. `spanishPostalCode()`
Valida códigos postales españoles (5 dígitos, 01-52).

```typescript
postalCode: ['', [CustomValidators.spanishPostalCode()]]
```

**Error devuelto:** `{ invalidPostalCode: true }`

---

#### 7. `username()`
Valida nombres de usuario (alfanuméricos, guiones y guiones bajos).

```typescript
username: ['', [
  Validators.required,
  Validators.minLength(3),
  CustomValidators.username()
]]
```

**Error devuelto:** `{ invalidUsername: true }`

---

#### 8. `url()`
Valida URLs con protocolo http/https.

```typescript
website: ['', [CustomValidators.url()]]
```

**Error devuelto:** `{ invalidUrl: true }`

---

#### 9. `range(min, max)`
Valida que un valor numérico esté dentro de un rango.

```typescript
age: ['', [CustomValidators.range(18, 100)]]
```

**Error devuelto:** `{ range: { min, max, actual } }`

---

#### 10. `minAge(years)`
Valida edad mínima basada en fecha de nacimiento.

```typescript
birthDate: ['', [CustomValidators.minAge(18)]]
```

**Error devuelto:** `{ minAge: { required, actual } }`

---

#### 11. `minArrayLength(min)`
Valida longitud mínima de un FormArray.

```typescript
phones: this.fb.array([], [CustomValidators.minArrayLength(1)])
```

**Error devuelto:** `{ minArrayLength: { min, actual } }`

---

#### 12. `maxArrayLength(max)`
Valida longitud máxima de un FormArray.

```typescript
addresses: this.fb.array([], [CustomValidators.maxArrayLength(5)])
```

**Error devuelto:** `{ maxArrayLength: { max, actual } }`

---

#### 13. `uniqueArrayItems(key?)`
Valida que no haya elementos duplicados en un FormArray.

```typescript
// Para arrays de valores simples
tags: this.fb.array([], [CustomValidators.uniqueArrayItems()])

// Para arrays de objetos con campo específico
emails: this.fb.array([], [CustomValidators.uniqueArrayItems('email')])
```

**Error devuelto:** `{ duplicateItems: true }`

---

## Validadores Asíncronos con Debounce

### Configuración del Debounce

Los validadores asíncronos implementan **debounce** usando RxJS `timer` y `switchMap`:

```typescript
static uniqueEmail(
  validationService: ValidationService,
  debounceMs: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    
    // Debounce: esperar antes de validar
    return timer(debounceMs).pipe(
      switchMap(() => validationService.checkEmailAvailability(control.value)),
      map(response => response.available ? null : { emailNotUnique: true }),
      catchError(() => of(null))
    );
  };
}
```

### Validadores Asíncronos Disponibles

#### `uniqueEmail(validationService, debounceMs?)`

```typescript
email: ['', 
  [Validators.required, Validators.email],
  [AsyncValidators.uniqueEmail(this.validationService, 600)]
]
```

**Error devuelto:** `{ emailNotUnique: true }`

---

#### `availableUsername(validationService, debounceMs?)`

```typescript
username: ['',
  [Validators.required, Validators.minLength(3)],
  [AsyncValidators.availableUsername(this.validationService, 600)]
]
```

**Error devuelto:** `{ usernameNotAvailable: true }`

---

#### `createValidator(checkFn, errorKey, debounceMs?)`

Factory para crear validadores asíncronos personalizados:

```typescript
const customValidator = AsyncValidators.createValidator(
  (value) => this.myService.checkValue(value),
  'customError',
  500
);
```

---

### Indicadores de Validación en Progreso

```typescript
// En el componente
get isEmailValidating(): boolean {
  return this.form.get('email')?.status === 'PENDING';
}

// En el template
@if (isEmailValidating) {
  <span class="validating">Verificando email...</span>
}
```

---

## FormArray - Gestión de Colecciones Dinámicas

### Implementación Real: EditProfileForm

El componente `EditProfileForm` demuestra el uso completo de FormArray con teléfonos dinámicos:

**Ubicación:** `src/app/components/shared/edit-profile-form/`

```typescript
export class EditProfileForm implements AfterViewInit {
  @ViewChild('phonesContainer') phonesContainer!: ElementRef<HTMLDivElement>;
  
  profileForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', 
        [Validators.required, CustomValidators.username()],
        [AsyncValidators.availableUsername(this.validationService, 600)]
      ],
      email: ['', 
        [Validators.required, Validators.email],
        [AsyncValidators.uniqueEmail(this.validationService, 600)]
      ],
      nif: ['', [CustomValidators.nif()]],
      phones: this.fb.array([]) // FormArray dinámico
    });
  }
  
  get phones(): FormArray {
    return this.profileForm.get('phones') as FormArray;
  }
  
  addPhone(): void {
    const phoneControl = this.fb.control('', [
      Validators.required,
      CustomValidators.spanishPhone()
    ]);
    
    this.phones.push(phoneControl);
    
    // Scroll automático usando ViewChild
    setTimeout(() => this.scrollToLastPhone(), 100);
  }
  
  removePhone(index: number): void {
    this.phones.removeAt(index);
  }
  
  private scrollToLastPhone(): void {
    if (this.phonesContainer?.nativeElement) {
      const container = this.phonesContainer.nativeElement;
      const lastPhone = container.lastElementChild as HTMLElement;
      
      if (lastPhone) {
        lastPhone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const input = lastPhone.querySelector('input');
        if (input) input.focus();
      }
    }
  }
}
```

### Template del FormArray

```html
<fieldset class="edit-profile__section">
  <legend>Teléfonos de Contacto</legend>
  
  <div #phonesContainer class="edit-profile__phones">
    @for (phone of phones.controls; track $index) {
      <article class="edit-profile__phone-item">
        <input
          [id]="'phone-' + $index"
          type="tel"
          [formControl]="$any(phone)"
          placeholder="+34 612345678"
        />
        <app-button
          type="button"
          variant="danger"
          (btnClick)="removePhone($index)"
        >
          Eliminar
        </app-button>
        @if (hasPhoneError($index)) {
          <span class="error">{{ getPhoneErrorMessage($index) }}</span>
        }
      </article>
    }
  </div>
  
  <app-button type="button" (btnClick)="addPhone()">
    + Añadir Teléfono
  </app-button>
</fieldset>
```

---

## ViewChild y ElementRef - Acceso al DOM

### Focus Automático con ViewChild

```typescript
export class EditProfileForm implements AfterViewInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;
  
  ngAfterViewInit(): void {
    this.focusFirstInput();
  }
  
  private focusFirstInput(): void {
    setTimeout(() => {
      if (this.firstNameInput?.nativeElement) {
        this.firstNameInput.nativeElement.focus();
      }
    }, 100);
  }
}
```

### Scroll Automático a Elementos

```typescript
@ViewChild('phonesContainer') phonesContainer!: ElementRef<HTMLDivElement>;

private scrollToLastPhone(): void {
  if (this.phonesContainer?.nativeElement) {
    const container = this.phonesContainer.nativeElement;
    const lastPhone = container.lastElementChild as HTMLElement;
    
    if (lastPhone) {
      lastPhone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}
```

### Ejemplo Adicional: FormArray con Direcciones (Documentación)

```typescript
export class DynamicFormExample implements OnInit {
  form!: FormGroup;
  
  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }
  
  ngOnInit() {
    this.form = this.fb.group({
      addresses: this.fb.array([], [
        CustomValidators.minArrayLength(1),
        CustomValidators.maxArrayLength(5)
      ])
    });
    
    // Añadir dirección inicial
    this.addAddress();
  }
  
  createAddressGroup(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, CustomValidators.spanishPostalCode()]],
      isDefault: [false]
    });
  }
  
  addAddress(): void {
    if (this.addresses.length < 5) {
      this.addresses.push(this.createAddressGroup());
    }
  }
  
  removeAddress(index: number): void {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }
}
```

### Template para FormArray

```html
<div formArrayName="addresses">
  @for (address of addresses.controls; track $index) {
    <div [formGroupName]="$index" class="address-item">
      <h4>Dirección {{ $index + 1 }}</h4>
      
      <input formControlName="street" placeholder="Calle">
      <input formControlName="city" placeholder="Ciudad">
      <input formControlName="postalCode" placeholder="Código postal">
      
      <label>
        <input type="checkbox" formControlName="isDefault">
        Principal
      </label>
      
      <button type="button" (click)="removeAddress($index)" 
              [disabled]="addresses.length === 1">
        Eliminar
      </button>
    </div>
  }
</div>

<button type="button" (click)="addAddress()" 
        [disabled]="addresses.length >= 5">
  Añadir dirección
</button>
```

### Validación de FormArray

```typescript
// Errores a nivel de array
get addressesErrors(): string[] {
  const errors: string[] = [];
  const arrayErrors = this.addresses.errors;
  
  if (arrayErrors?.['minArrayLength']) {
    errors.push(`Mínimo ${arrayErrors['minArrayLength'].min} direcciones`);
  }
  if (arrayErrors?.['maxArrayLength']) {
    errors.push(`Máximo ${arrayErrors['maxArrayLength'].max} direcciones`);
  }
  
  return errors;
}

// Errores a nivel de elemento
getAddressError(index: number, field: string): string {
  const control = this.addresses.at(index)?.get(field);
  if (!control?.touched || !control.errors) return '';
  
  if (control.hasError('required')) return 'Campo obligatorio';
  if (control.hasError('invalidPostalCode')) return 'Código postal inválido';
  
  return '';
}
```

---

## Gestión del Estado del Formulario

### Estados Disponibles

| Estado | Descripción | Uso |
|--------|-------------|-----|
| `valid` | Todos los validadores pasan | Habilitar submit |
| `invalid` | Al menos un validador falla | Mostrar errores |
| `pending` | Validación async en progreso | Mostrar spinner |
| `dirty` | El usuario ha modificado el valor | Advertir cambios no guardados |
| `touched` | El campo ha perdido el foco | Mostrar errores |
| `pristine` | El valor no ha sido modificado | Reset a estado inicial |
| `untouched` | El campo no ha perdido el foco | Ocultar errores |

### Ejemplo de Gestión de Estado

```typescript
export class MyFormComponent {
  form!: FormGroup;
  
  // Estado general del formulario
  get isFormValid(): boolean {
    return this.form?.valid ?? false;
  }
  
  get isFormPending(): boolean {
    return this.form?.pending ?? false;
  }
  
  get isFormDirty(): boolean {
    return this.form?.dirty ?? false;
  }
  
  // Verificar antes de abandonar la página
  canDeactivate(): boolean {
    if (this.isFormDirty) {
      return confirm('¿Seguro que quieres salir? Los cambios no guardados se perderán.');
    }
    return true;
  }
  
  // Marcar todos los campos como tocados para mostrar errores
  showAllErrors(): void {
    this.form.markAllAsTouched();
  }
  
  // Resetear formulario
  resetForm(): void {
    this.form.reset();
    // O con valores específicos:
    // this.form.reset({ email: '', username: '' });
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      // Procesar datos...
    } else if (this.form.pending) {
      // Esperar a que terminen las validaciones async
      this.form.statusChanges.pipe(
        filter(status => status !== 'PENDING'),
        take(1)
      ).subscribe(() => this.onSubmit());
    } else {
      this.showAllErrors();
    }
  }
}
```

---

## Ejemplos de Uso

### 1. LoginForm - Formulario Básico

**Ubicación:** `src/app/components/shared/login-form/`

```typescript
@Component({...})
export class LoginForm implements OnInit {
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  get usernameError(): string {
    const control = this.loginForm.get('username');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El usuario es obligatorio';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    return '';
  }
}
```

---

### 2. RegisterForm - Validadores Asíncronos

**Ubicación:** `src/app/components/shared/register-form/`

```typescript
@Component({...})
export class RegisterForm implements OnInit {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  registerForm!: FormGroup;
  
  ngOnInit() {
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
  
  get isEmailValidating(): boolean {
    return this.registerForm.get('email')?.status === 'PENDING';
  }
}
```

---

### 3. EditProfileForm - FormArray + ViewChild

**Ubicación:** `src/app/components/shared/edit-profile-form/`

Este formulario completo demuestra:
- ✅ FormBuilder
- ✅ Validadores síncronos y asíncronos
- ✅ FormArray (teléfonos dinámicos)
- ✅ ViewChild y ElementRef (focus y scroll automático)
- ✅ Feedback visual completo

```typescript
export class EditProfileForm implements AfterViewInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('phonesContainer') phonesContainer!: ElementRef<HTMLDivElement>;
  
  profileForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', 
        [Validators.required, CustomValidators.username()],
        [AsyncValidators.availableUsername(this.validationService, 600)]
      ],
      email: ['', 
        [Validators.required, Validators.email],
        [AsyncValidators.uniqueEmail(this.validationService, 600)]
      ],
      nif: ['', [CustomValidators.nif()]],
      phones: this.fb.array([])
    });
  }
  
  ngAfterViewInit(): void {
    this.focusFirstInput(); // ViewChild en acción
  }
  
  get phones(): FormArray {
    return this.profileForm.get('phones') as FormArray;
  }
  
  addPhone(): void {
    const phoneControl = this.fb.control('', [
      Validators.required,
      CustomValidators.spanishPhone()
    ]);
    this.phones.push(phoneControl);
    setTimeout(() => this.scrollToLastPhone(), 100);
  }
  
  removePhone(index: number): void {
    this.phones.removeAt(index);
  }
  
  private focusFirstInput(): void {
    setTimeout(() => {
      if (this.firstNameInput?.nativeElement) {
        this.firstNameInput.nativeElement.focus();
      }
    }, 100);
  }
}
```

---

## Buenas Prácticas

### 1. Inicialización en `ngOnInit`

```typescript
// ✅ Correcto
ngOnInit() {
  this.initForm();
}

// ❌ Evitar en constructor
constructor() {
  this.form = this.fb.group({...}); // Problemas con SSR
}
```

### 2. Usar Getters para Acceso a Controles

```typescript
// ✅ Correcto
get email() {
  return this.form.get('email');
}

// ❌ Evitar en template
// [class.error]="form.get('email').invalid" - puede fallar si es null
```

### 3. Limpiar Suscripciones

```typescript
private subscription?: Subscription;

ngOnInit() {
  this.subscription = this.form.valueChanges.subscribe(...);
}

ngOnDestroy() {
  this.subscription?.unsubscribe();
}
```

### 4. Debounce Adecuado

```typescript
// Para campos que validan contra servidor: 500-800ms
[AsyncValidators.uniqueEmail(service, 600)]

// Para búsquedas en tiempo real: 300-500ms
[AsyncValidators.searchSuggestions(service, 300)]
```

### 5. Mostrar Estado de Validación

```html
<!-- Indicador de validación en progreso -->
@if (isEmailValidating) {
  <span class="spinner"></span>
}

<!-- Feedback visual inmediato -->
<input [class.valid]="email?.valid && email?.touched"
       [class.invalid]="email?.invalid && email?.touched">
```

---

## Referencias

- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [Custom Validators](https://angular.io/guide/form-validation#custom-validators)
- [Async Validators](https://angular.io/guide/form-validation#async-validators)
- [FormArray](https://angular.io/api/forms/FormArray)
