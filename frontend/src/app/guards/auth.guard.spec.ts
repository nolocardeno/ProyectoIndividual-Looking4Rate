/**
 * @fileoverview Tests para Guards de autenticación
 * 
 * Suite de pruebas para los guards de rutas.
 */

import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuard, authGuard, guestGuard, ownerGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('Auth Guards', () => {
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate']);
    authService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'setRedirectUrl',
      'requestLogin',
      'getCurrentUserId'
    ]);

    // Configurar retorno por defecto para createUrlTree
    const mockUrlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(mockUrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService }
      ]
    });

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected-route' } as RouterStateSnapshot;
  });

  describe('AuthGuard (clase)', () => {
    let guard: AuthGuard;

    beforeEach(() => {
      guard = TestBed.inject(AuthGuard);
    });

    it('debería crear el guard', () => {
      expect(guard).toBeTruthy();
    });

    it('debería permitir acceso si está autenticado', () => {
      authService.isAuthenticated.and.returnValue(true);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBeTrue();
    });

    it('debería denegar acceso y redirigir si no está autenticado', () => {
      authService.isAuthenticated.and.returnValue(false);

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).not.toBeTrue();
      expect(authService.setRedirectUrl).toHaveBeenCalledWith('/protected-route');
      expect(authService.requestLogin).toHaveBeenCalled();
      expect(router.createUrlTree).toHaveBeenCalledWith(['/'], {
        queryParams: { returnUrl: '/protected-route' }
      });
    });
  });

  describe('authGuard (funcional)', () => {
    it('debería permitir acceso si está autenticado', () => {
      authService.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => {
        const result = authGuard(mockRoute, mockState);
        expect(result).toBeTrue();
      });
    });

    it('debería redirigir si no está autenticado', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => {
        const result = authGuard(mockRoute, mockState);
        expect(result).not.toBeTrue();
        expect(authService.setRedirectUrl).toHaveBeenCalledWith('/protected-route');
        expect(authService.requestLogin).toHaveBeenCalled();
      });
    });
  });

  describe('guestGuard', () => {
    it('debería permitir acceso si NO está autenticado', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => {
        const result = guestGuard(mockRoute, mockState);
        expect(result).toBeTrue();
      });
    });

    it('debería redirigir al perfil si está autenticado', () => {
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUserId.and.returnValue(1);

      TestBed.runInInjectionContext(() => {
        const result = guestGuard(mockRoute, mockState);
        expect(result).not.toBeTrue();
        expect(router.createUrlTree).toHaveBeenCalledWith(['/usuario', 1]);
      });
    });
  });

  describe('ownerGuard', () => {
    beforeEach(() => {
      mockRoute = {
        params: { id: '1' }
      } as unknown as ActivatedRouteSnapshot;
    });

    it('debería permitir acceso si el usuario es el propietario', () => {
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUserId.and.returnValue(1);

      TestBed.runInInjectionContext(() => {
        const result = ownerGuard(mockRoute, mockState);
        expect(result).toBeTrue();
      });
    });

    it('debería denegar acceso si no es el propietario', () => {
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUserId.and.returnValue(2);

      TestBed.runInInjectionContext(() => {
        const result = ownerGuard(mockRoute, mockState);
        expect(result).not.toBeTrue();
      });
    });

    it('debería denegar acceso si no está autenticado', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => {
        const result = ownerGuard(mockRoute, mockState);
        expect(result).not.toBeTrue();
      });
    });
  });

  describe('Escenarios de redirección', () => {
    it('debería preservar la URL de retorno', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState = { url: '/juego/123/editar' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        authGuard(mockRoute, mockState);
        expect(authService.setRedirectUrl).toHaveBeenCalledWith('/juego/123/editar');
      });
    });

    it('debería incluir queryParams en la URL de retorno', () => {
      authService.isAuthenticated.and.returnValue(false);
      mockState = { url: '/buscar?q=zelda' } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        authGuard(mockRoute, mockState);
        expect(router.createUrlTree).toHaveBeenCalledWith(['/'], {
          queryParams: { returnUrl: '/buscar?q=zelda' }
        });
      });
    });
  });
});
