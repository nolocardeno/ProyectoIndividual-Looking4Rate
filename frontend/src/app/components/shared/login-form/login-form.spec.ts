/**
 * @fileoverview Tests para LoginForm Component
 * 
 * Suite de pruebas para el componente de formulario de login.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginForm } from './login-form';
import { AuthService } from '../../../services/auth.service';
import { LoadingService, NotificationService, EventBusService } from '../../../services';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let eventBusSpy: jasmine.SpyObj<EventBusService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getRedirectUrl', 'clearRedirectUrl']);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide', 'showGlobal', 'hideGlobal']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    eventBusSpy = jasmine.createSpyObj('EventBusService', ['emit']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginForm, ReactiveFormsModule],
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

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')).toBeDefined();
      expect(component.loginForm.get('password')).toBeDefined();
    });

    it('debería iniciar con modal cerrado', () => {
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Formulario', () => {
    it('debería ser inválido cuando está vacío', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('debería ser válido con datos correctos', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(component.loginForm.valid).toBeTrue();
    });

    it('debería requerir email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('debería validar formato de email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      
      expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('debería requerir password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      
      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('debería requerir password mínimo 6 caracteres', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('12345');
      
      expect(passwordControl?.hasError('minlength')).toBeTrue();
    });
  });

  describe('Mensajes de error', () => {
    it('debería mostrar error en email inválido', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('debería mostrar error en email con formato incorrecto', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalidemail');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('debería mostrar error en password requerido', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('required')).toBeTrue();
    });

    it('debería mostrar error en password corto', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('12345');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('minlength')).toBeTrue();
    });

    it('no debería mostrar error si campo no está touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      // No marcar como touched

      expect(emailControl?.touched).toBeFalse();
    });
  });

  describe('Eventos de salida', () => {
    it('debería emitir close al cerrar modal', () => {
      spyOn(component.close, 'emit');
      component.closeModal();
      
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('debería emitir switchToRegister al cambiar a registro', () => {
      spyOn(component.switchToRegister, 'emit');
      component.goToRegister();
      
      expect(component.switchToRegister.emit).toHaveBeenCalled();
    });
  });

  describe('Submit', () => {
    beforeEach(() => {
      authServiceSpy.login.and.returnValue(of({
        id: 1,
        nombre: 'TestUser',
        email: 'test@email.com',
        avatar: '',
        rol: 'USER' as const
      }));
      authServiceSpy.getRedirectUrl.and.returnValue('/home');
    });

    it('no debería enviar si el formulario es inválido', () => {
      component.loginForm.patchValue({
        email: '',
        password: ''
      });

      component.onSubmit();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
      expect(notificationServiceSpy.warning).toHaveBeenCalled();
    });

    it('debería llamar al servicio de auth con credenciales', fakeAsync(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();
      tick();

      expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    }));

    it('debería mostrar notificación de éxito', fakeAsync(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });

      component.onSubmit();
      tick();

      expect(notificationServiceSpy.success).toHaveBeenCalled();
    }));

    it('debería mostrar notificación de error en caso de fallo', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401, message: 'Error' })));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      component.onSubmit();
      tick();

      expect(notificationServiceSpy.error).toHaveBeenCalled();
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

  describe('Cierre de modal', () => {
    it('closeModal debería emitir evento close', () => {
      spyOn(component.close, 'emit');
      component.closeModal();
      
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('debería cerrar haciendo click en overlay', () => {
      spyOn(component.close, 'emit');
      const mockOverlay = document.createElement('div');
      mockOverlay.classList.add('login-modal__overlay');
      
      const event = {
        target: mockOverlay,
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as unknown as MouseEvent;
      
      component.onOverlayClick(event);
      
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('no debería cerrar si click no es en overlay', () => {
      spyOn(component.close, 'emit');
      const mockElement = document.createElement('div');
      
      const event = {
        target: mockElement,
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as unknown as MouseEvent;
      
      component.onOverlayClick(event);
      
      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });

  describe('Focus trap', () => {
    it('debería manejar Tab key cuando modal está abierto', () => {
      component.isOpen = true;
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      
      // No debería lanzar error
      expect(() => component.onKeyDown(event)).not.toThrow();
    });
  });
});
