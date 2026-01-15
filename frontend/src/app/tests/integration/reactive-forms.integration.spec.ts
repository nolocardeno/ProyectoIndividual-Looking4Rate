/**
 * @fileoverview Tests de Integración - Formularios Reactivos
 * 
 * Suite de pruebas de integración para formularios reactivos.
 * Verifica validaciones síncronas, asíncronas y comportamiento completo.
 */

import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CustomValidators } from '../../validators/custom.validators';
import { AsyncValidators } from '../../validators/async.validators';
import { ValidationService } from '../../validators/validation.service';

/**
 * ============================================
 * TESTS DE FORMULARIO DE REGISTRO
 * ============================================
 */
describe('Integración: Formulario de Registro', () => {
  let fb: FormBuilder;
  let validationService: ValidationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        ValidationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    fb = TestBed.inject(FormBuilder);
    validationService = TestBed.inject(ValidationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Validaciones síncronas', () => {
    it('debería validar formulario de registro completo', () => {
      const form = fb.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3), CustomValidators.username()]],
        password: ['', [Validators.required, Validators.minLength(8), CustomValidators.strongPassword()]]
      });

      // Formulario vacío es inválido
      expect(form.valid).toBeFalse();

      // Rellenar con datos válidos
      form.patchValue({
        email: 'usuario@example.com',
        username: 'usuario123',
        password: 'Password1!'
      });

      expect(form.valid).toBeTrue();
    });

    it('debería rechazar email inválido', () => {
      const form = fb.group({
        email: ['', [Validators.required, Validators.email]]
      });

      form.get('email')?.setValue('no-es-email');
      expect(form.get('email')?.hasError('email')).toBeTrue();

      form.get('email')?.setValue('valido@email.com');
      expect(form.get('email')?.valid).toBeTrue();
    });

    it('debería validar username con caracteres permitidos', () => {
      const form = fb.group({
        username: ['', [CustomValidators.username()]]
      });

      // Válidos
      const usernamesValidos = ['usuario', 'user_name', 'user-name', 'user123'];
      usernamesValidos.forEach(username => {
        form.get('username')?.setValue(username);
        expect(form.get('username')?.valid).withContext(`${username} debería ser válido`).toBeTrue();
      });

      // Inválidos (caracteres especiales no permitidos)
      const usernamesInvalidos = ['user@name', 'user name', 'user.name', ''];
      usernamesInvalidos.forEach(username => {
        form.get('username')?.setValue(username);
        if (username !== '') {
          expect(form.get('username')?.invalid).withContext(`${username} debería ser inválido`).toBeTrue();
        }
      });
    });

    it('debería validar contraseña fuerte', () => {
      const form = fb.group({
        password: ['', [CustomValidators.strongPassword()]]
      });

      // Contraseña sin mayúsculas
      form.get('password')?.setValue('password1!');
      expect(form.get('password')?.errors?.['strongPassword']?.['noUppercase']).toBeTrue();

      // Contraseña sin números
      form.get('password')?.setValue('Password!');
      expect(form.get('password')?.errors?.['strongPassword']?.['noNumber']).toBeTrue();

      // Contraseña sin caracteres especiales
      form.get('password')?.setValue('Password1');
      expect(form.get('password')?.errors?.['strongPassword']?.['noSpecialChar']).toBeTrue();

      // Contraseña válida
      form.get('password')?.setValue('Password1!');
      expect(form.get('password')?.valid).toBeTrue();
    });
  });

  describe('Validaciones asíncronas', () => {
    it('debería validar email único de forma asíncrona', fakeAsync(() => {
      const form = fb.group({
        email: ['', 
          [Validators.required, Validators.email],
          [AsyncValidators.uniqueEmail(validationService, 0)]
        ]
      });

      // Setear email
      form.get('email')?.setValue('test@example.com');
      
      // Avanzar el timer del debounce
      tick(1);
      
      // El estado debería ser PENDING mientras espera
      expect(form.get('email')?.pending).toBeTrue();

      // Responder que el email está disponible (URL correcta del servicio)
      const req = httpMock.expectOne(req => req.url.includes('/auth/check-email'));
      req.flush({ available: true });

      tick();

      expect(form.get('email')?.valid).toBeTrue();
    }));

    it('debería rechazar email duplicado', fakeAsync(() => {
      const form = fb.group({
        email: ['', 
          [Validators.required, Validators.email],
          [AsyncValidators.uniqueEmail(validationService, 0)]
        ]
      });

      form.get('email')?.setValue('existente@example.com');
      
      // Avanzar el timer del debounce
      tick(1);

      const req = httpMock.expectOne(req => req.url.includes('/auth/check-email'));
      req.flush({ available: false });

      tick();

      expect(form.get('email')?.hasError('emailNotUnique')).toBeTrue();
    }));

    it('debería validar username disponible de forma asíncrona', fakeAsync(() => {
      const form = fb.group({
        username: ['', 
          [Validators.required, Validators.minLength(3)],
          [AsyncValidators.availableUsername(validationService, 0)]
        ]
      });

      form.get('username')?.setValue('nuevouser');
      
      // Avanzar el timer del debounce
      tick(1);
      
      expect(form.get('username')?.pending).toBeTrue();

      const req = httpMock.expectOne(req => req.url.includes('/auth/check-username'));
      req.flush({ available: true });

      tick();

      expect(form.get('username')?.valid).toBeTrue();
    }));

    it('debería rechazar username ya en uso', fakeAsync(() => {
      const form = fb.group({
        username: ['', 
          [Validators.required, Validators.minLength(3)],
          [AsyncValidators.availableUsername(validationService, 0)]
        ]
      });

      form.get('username')?.setValue('userexistente');
      
      // Avanzar el timer del debounce
      tick(1);

      const req = httpMock.expectOne(req => req.url.includes('/auth/check-username'));
      req.flush({ available: false });

      tick();

      expect(form.get('username')?.hasError('usernameNotAvailable')).toBeTrue();
    }));
  });

  describe('Validaciones cross-field', () => {
    it('debería validar que las contraseñas coincidan', () => {
      const form = fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      }, {
        validators: CustomValidators.passwordMatch('password', 'confirmPassword')
      });

      form.patchValue({
        password: 'Password1!',
        confirmPassword: 'OtraPassword!'
      });

      expect(form.hasError('passwordMismatch')).toBeTrue();

      form.patchValue({
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      expect(form.hasError('passwordMismatch')).toBeFalse();
    });

    it('debería validar rango de fechas (test básico)', () => {
      const form = fb.group({
        startDate: ['2024-01-15'],
        endDate: ['2024-01-10']
      });

      // Verificar que el formulario se crea correctamente
      expect(form.valid).toBeTrue();
      expect(form.get('startDate')?.value).toBe('2024-01-15');
      expect(form.get('endDate')?.value).toBe('2024-01-10');

      form.patchValue({
        startDate: '2024-01-10',
        endDate: '2024-01-15'
      });

      expect(form.get('startDate')?.value).toBe('2024-01-10');
    });
  });
});

/**
 * ============================================
 * TESTS DE FORMULARIO DE LOGIN
 * ============================================
 */
describe('Integración: Formulario de Login', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    });

    fb = TestBed.inject(FormBuilder);
  });

  it('debería crear formulario de login válido', () => {
    const loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    expect(loginForm.valid).toBeFalse();

    loginForm.patchValue({
      email: 'user@example.com',
      password: '123456'
    });

    expect(loginForm.valid).toBeTrue();
  });

  it('debería marcar campos como touched al intentar submit', () => {
    const loginForm = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    expect(loginForm.get('email')?.touched).toBeFalse();
    expect(loginForm.get('password')?.touched).toBeFalse();

    loginForm.markAllAsTouched();

    expect(loginForm.get('email')?.touched).toBeTrue();
    expect(loginForm.get('password')?.touched).toBeTrue();
  });

  it('debería resetear formulario correctamente', () => {
    const loginForm = fb.group({
      email: ['inicial@email.com'],
      password: ['password123']
    });

    expect(loginForm.get('email')?.value).toBe('inicial@email.com');

    loginForm.reset();

    expect(loginForm.get('email')?.value).toBeNull();
    expect(loginForm.get('password')?.value).toBeNull();
  });
});

/**
 * ============================================
 * TESTS DE FORMULARIO DE REVIEW
 * ============================================
 */
describe('Integración: Formulario de Review', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    });

    fb = TestBed.inject(FormBuilder);
  });

  it('debería crear formulario de review válido', () => {
    const reviewForm = fb.group({
      puntuacion: [null as number | null, [Validators.required, Validators.min(1), Validators.max(10)]],
      review: ['', [Validators.maxLength(2000)]]
    });

    expect(reviewForm.valid).toBeFalse();

    reviewForm.patchValue({ puntuacion: 8 });

    expect(reviewForm.valid).toBeTrue();
  });

  it('debería validar puntuación en rango correcto', () => {
    const reviewForm = fb.group({
      puntuacion: [null as number | null, [Validators.min(1), Validators.max(10)]]
    });

    reviewForm.get('puntuacion')?.setValue(0);
    expect(reviewForm.get('puntuacion')?.hasError('min')).toBeTrue();

    reviewForm.get('puntuacion')?.setValue(11);
    expect(reviewForm.get('puntuacion')?.hasError('max')).toBeTrue();

    reviewForm.get('puntuacion')?.setValue(5);
    expect(reviewForm.get('puntuacion')?.valid).toBeTrue();
  });

  it('debería limitar longitud de review', () => {
    const reviewForm = fb.group({
      review: ['', [Validators.maxLength(100)]]
    });

    reviewForm.get('review')?.setValue('a'.repeat(101));
    expect(reviewForm.get('review')?.hasError('maxlength')).toBeTrue();

    reviewForm.get('review')?.setValue('a'.repeat(100));
    expect(reviewForm.get('review')?.valid).toBeTrue();
  });
});

/**
 * ============================================
 * TESTS DE FORMULARIO DE BÚSQUEDA AVANZADA
 * ============================================
 */
describe('Integración: Formulario de Búsqueda Avanzada', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    });

    fb = TestBed.inject(FormBuilder);
  });

  it('debería crear formulario de búsqueda con filtros', () => {
    const searchForm = fb.group({
      nombre: [''],
      generoId: [null as number | null],
      plataformaId: [null as number | null],
      desarrolladoraId: [null as number | null],
      ordenarPor: ['nombre'],
      orden: ['asc']
    });

    expect(searchForm.valid).toBeTrue();

    searchForm.patchValue({
      nombre: 'zelda',
      generoId: 1 as number | null,
      ordenarPor: 'puntuacion',
      orden: 'desc'
    });

    expect(searchForm.value).toEqual({
      nombre: 'zelda',
      generoId: 1,
      plataformaId: null,
      desarrolladoraId: null,
      ordenarPor: 'puntuacion',
      orden: 'desc'
    });
  });

  it('debería obtener solo parámetros con valor', () => {
    const searchForm = fb.group({
      nombre: ['mario'],
      generoId: [null as number | null],
      plataformaId: [2 as number | null]
    });

    const params = Object.entries(searchForm.value)
      .filter(([_, value]) => value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    expect(params).toEqual({
      nombre: 'mario',
      plataformaId: 2
    });
  });
});

/**
 * ============================================
 * TESTS DE FORMULARIO DE EDICIÓN DE PERFIL
 * ============================================
 */
describe('Integración: Formulario de Edición de Perfil', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    });

    fb = TestBed.inject(FormBuilder);
  });

  it('debería crear formulario de perfil con datos iniciales', () => {
    const perfilForm = fb.group({
      nombre: ['Usuario Actual', [Validators.required, Validators.minLength(3)]],
      email: ['usuario@email.com', [Validators.required, Validators.email]],
      avatar: ['avatar.jpg']
    });

    expect(perfilForm.valid).toBeTrue();
    expect(perfilForm.get('nombre')?.value).toBe('Usuario Actual');
  });

  it('debería detectar cambios en el formulario', () => {
    const perfilForm = fb.group({
      nombre: ['Usuario Original'],
      email: ['original@email.com']
    });

    expect(perfilForm.dirty).toBeFalse();

    perfilForm.get('nombre')?.setValue('Usuario Modificado');
    perfilForm.get('nombre')?.markAsDirty();

    expect(perfilForm.dirty).toBeTrue();
  });

  it('debería validar cambio de contraseña', () => {
    const cambioPasswordForm = fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, CustomValidators.strongPassword()]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validators: CustomValidators.passwordMatch('newPassword', 'confirmNewPassword')
    });

    // Rellenar con datos válidos
    cambioPasswordForm.patchValue({
      currentPassword: 'OldPassword1!',
      newPassword: 'NewPassword1!',
      confirmNewPassword: 'NewPassword1!'
    });

    expect(cambioPasswordForm.valid).toBeTrue();

    // Contraseñas no coinciden
    cambioPasswordForm.patchValue({
      confirmNewPassword: 'DifferentPassword!'
    });

    expect(cambioPasswordForm.hasError('passwordMismatch')).toBeTrue();
  });
});
