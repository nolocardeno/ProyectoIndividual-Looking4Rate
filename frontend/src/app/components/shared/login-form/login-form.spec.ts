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
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
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
      expect(component.loginForm.get('username')).toBeDefined();
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
        username: 'testuser',
        password: 'password123'
      });

      expect(component.loginForm.valid).toBeTrue();
    });

    it('debería requerir username', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      
      expect(usernameControl?.hasError('required')).toBeTrue();
    });

    it('debería requerir username mínimo 3 caracteres', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('ab');
      
      expect(usernameControl?.hasError('minlength')).toBeTrue();
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
    it('usernameError debería retornar mensaje de requerido', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      expect(component.usernameError).toContain('obligatorio');
    });

    it('usernameError debería retornar mensaje de longitud mínima', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('ab');
      usernameControl?.markAsTouched();

      expect(component.usernameError).toContain('3');
    });

    it('passwordError debería retornar mensaje de requerido', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(component.passwordError).toContain('obligatoria');
    });

    it('passwordError debería retornar mensaje de longitud mínima', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('12345');
      passwordControl?.markAsTouched();

      expect(component.passwordError).toContain('6');
    });

    it('no debería mostrar error si campo no está touched', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      // No marcar como touched

      expect(component.usernameError).toBe('');
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
      authServiceSpy.getRedirectUrl.and.returnValue(null);
    });

    it('no debería enviar si el formulario es inválido', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });

      component.onSubmit();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('debería llamar al servicio de auth con credenciales', fakeAsync(() => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();
      tick(1100);

      expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'password123');
    }));

    it('debería mostrar notificación de éxito', fakeAsync(() => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      component.onSubmit();
      tick(1100);

      expect(notificationServiceSpy.success).toHaveBeenCalled();
    }));

    it('debería mostrar notificación de error en caso de fallo', fakeAsync(() => {
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Error de login')));

      component.loginForm.patchValue({
        username: 'testuser',
        password: 'wrongpassword'
      });

      component.onSubmit();
      tick(1100);

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
