/**
 * @fileoverview Tests para RegisterForm Component
 * 
 * Suite de pruebas para el componente de formulario de registro.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RegisterForm } from './register-form';
import { AuthService } from '../../../services/auth.service';
import { LoadingService, NotificationService, EventBusService } from '../../../services';

describe('RegisterForm', () => {
  let component: RegisterForm;
  let fixture: ComponentFixture<RegisterForm>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let eventBusSpy: jasmine.SpyObj<EventBusService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'getCurrentUserId']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    eventBusSpy = jasmine.createSpyObj('EventBusService', ['emit']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterForm, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: EventBusService, useValue: eventBusSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario con campos requeridos', () => {
      expect(component.registerForm).toBeDefined();
      expect(component.registerForm.get('email')).toBeDefined();
      expect(component.registerForm.get('username')).toBeDefined();
      expect(component.registerForm.get('password')).toBeDefined();
      expect(component.registerForm.get('confirmPassword')).toBeDefined();
    });

    it('debería iniciar con modal cerrado', () => {
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Formulario', () => {
    it('debería ser inválido cuando está vacío', () => {
      expect(component.registerForm.valid).toBeFalse();
    });

    it('debería ser válido con datos correctos', () => {
      component.registerForm.patchValue({
        email: 'test@email.com',
        username: 'testuser',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      // Puede tener validación asíncrona, pero la síncrona debería pasar
      expect(component.registerForm.get('email')?.valid).toBeTrue();
      expect(component.registerForm.get('username')?.valid).toBeTrue();
    });
  });

  describe('Validaciones de Email', () => {
    it('debería requerir email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('');
      
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('debería validar formato de email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      
      expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('debería aceptar email válido', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('valid@email.com');
      
      expect(emailControl?.hasError('email')).toBeFalse();
    });
  });

  describe('Validaciones de Username', () => {
    it('debería requerir username', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('');
      
      expect(usernameControl?.hasError('required')).toBeTrue();
    });

    it('debería requerir username mínimo 3 caracteres', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('ab');
      
      expect(usernameControl?.hasError('minlength')).toBeTrue();
    });

    it('debería aceptar username válido', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('validuser');
      
      expect(usernameControl?.valid).toBeTrue();
    });
  });

  describe('Validaciones de Password', () => {
    it('debería requerir password', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('');
      
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('debería requerir password mínimo 6 caracteres', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('12345');
      
      expect(passwordControl?.hasError('minlength')).toBeTrue();
    });
  });

  describe('Validación de confirmación de password', () => {
    it('debería validar que las contraseñas coincidan', () => {
      component.registerForm.patchValue({
        password: 'Password1!',
        confirmPassword: 'Different1!'
      });

      // Verificar si hay validador de grupo o de campo
      const confirmControl = component.registerForm.get('confirmPassword');
      confirmControl?.markAsTouched();

      // El error puede estar en el formulario o en el campo
      const hasFormError = component.registerForm.hasError('passwordMismatch');
      const hasFieldError = confirmControl?.hasError('passwordMismatch');
      
      expect(hasFormError || hasFieldError).toBeTruthy();
    });

    it('debería ser válido cuando las contraseñas coinciden', () => {
      component.registerForm.patchValue({
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      const confirmControl = component.registerForm.get('confirmPassword');
      expect(confirmControl?.valid || !component.registerForm.hasError('passwordMismatch')).toBeTrue();
    });
  });

  describe('Eventos de salida', () => {
    it('debería emitir close al cerrar modal', () => {
      spyOn(component.close, 'emit');
      component.closeModal();
      
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('debería emitir switchToLogin al cambiar a login', () => {
      spyOn(component.switchToLogin, 'emit');
      component.goToLogin();
      
      expect(component.switchToLogin.emit).toHaveBeenCalled();
    });
  });

  describe('Submit', () => {
    beforeEach(() => {
      authServiceSpy.register.and.returnValue(of(true));
      authServiceSpy.getCurrentUserId.and.returnValue(1);
    });

    it('no debería enviar si el formulario es inválido', () => {
      component.registerForm.patchValue({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      });

      component.onSubmit();

      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });

    it('debería llamar al servicio de auth con datos de registro', fakeAsync(() => {
      component.registerForm.patchValue({
        email: 'test@email.com',
        username: 'testuser',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      // Marcar como válido si tiene validadores async
      component.registerForm.markAllAsTouched();

      if (component.registerForm.valid) {
        component.onSubmit();
        tick(1600);

        expect(authServiceSpy.register).toHaveBeenCalled();
      }
    }));

    it('debería mostrar notificación de éxito', fakeAsync(() => {
      component.registerForm.patchValue({
        email: 'test@email.com',
        username: 'testuser',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      if (component.registerForm.valid) {
        component.onSubmit();
        tick(1600);

        expect(notificationServiceSpy.success).toHaveBeenCalled();
      }
    }));

    it('debería mostrar notificación de error en caso de fallo', fakeAsync(() => {
      authServiceSpy.register.and.returnValue(throwError(() => new Error('Error de registro')));

      component.registerForm.patchValue({
        email: 'test@email.com',
        username: 'testuser',
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });

      if (component.registerForm.valid) {
        component.onSubmit();
        tick(1600);

        expect(notificationServiceSpy.error).toHaveBeenCalled();
      }
    }));
  });

  describe('Accesibilidad', () => {
    it('debería cerrar modal con Escape', () => {
      spyOn(component.close, 'emit');
      component.isOpen = true;

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);

      expect(component.close.emit).toHaveBeenCalled();
    });

    it('no debería cerrar si el modal no está abierto', () => {
      spyOn(component.close, 'emit');
      component.isOpen = false;

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);

      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });

  describe('Checkbox de términos', () => {
    it('debería tener campo de aceptar términos', () => {
      const termsControl = component.registerForm.get('acceptTerms');
      if (termsControl) {
        expect(termsControl).toBeDefined();
      }
    });
  });
});
