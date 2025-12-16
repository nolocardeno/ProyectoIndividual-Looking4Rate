/**
 * @fileoverview Tests para CanDeactivateGuard
 * 
 * Suite de pruebas para el guard de confirmación de salida.
 */

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { 
  CanDeactivateGuard, 
  canDeactivateGuard, 
  createFormDeactivateGuard,
  CanComponentDeactivate 
} from './can-deactivate.guard';
import { of, Observable } from 'rxjs';

describe('CanDeactivate Guards', () => {
  let mockCurrentRoute: ActivatedRouteSnapshot;
  let mockCurrentState: RouterStateSnapshot;
  let mockNextState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard]
    });

    mockCurrentRoute = {} as ActivatedRouteSnapshot;
    mockCurrentState = { url: '/current' } as RouterStateSnapshot;
    mockNextState = { url: '/next' } as RouterStateSnapshot;
  });

  describe('CanDeactivateGuard (clase)', () => {
    let guard: CanDeactivateGuard;

    beforeEach(() => {
      guard = TestBed.inject(CanDeactivateGuard);
    });

    it('debería crear el guard', () => {
      expect(guard).toBeTruthy();
    });

    it('debería permitir navegación si canDeactivate retorna true', () => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => true
      };

      const result = guard.canDeactivate(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });

    it('debería bloquear navegación si canDeactivate retorna false', () => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => false
      };

      const result = guard.canDeactivate(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeFalse();
    });

    it('debería manejar Observable retornado por canDeactivate', (done) => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => of(true)
      };

      const result = guard.canDeactivate(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      ) as Observable<boolean>;

      result.subscribe(value => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('debería manejar Promise retornada por canDeactivate', async () => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => Promise.resolve(true)
      };

      const result = guard.canDeactivate(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      ) as Promise<boolean>;

      const value = await result;
      expect(value).toBeTrue();
    });

    it('debería permitir navegación si componente no implementa canDeactivate', () => {
      const component = {} as CanComponentDeactivate;

      const result = guard.canDeactivate(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });
  });

  describe('canDeactivateGuard (funcional)', () => {
    it('debería permitir navegación si canDeactivate retorna true', () => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => true
      };

      const result = canDeactivateGuard(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });

    it('debería bloquear navegación si canDeactivate retorna false', () => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => false
      };

      const result = canDeactivateGuard(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeFalse();
    });

    it('debería permitir navegación si componente no implementa interfaz', () => {
      const component = {} as CanComponentDeactivate;

      const result = canDeactivateGuard(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });
  });

  describe('createFormDeactivateGuard', () => {
    interface FormComponent {
      hasChanges: boolean;
    }

    it('debería crear guard con función personalizada', () => {
      const guard = createFormDeactivateGuard<FormComponent>(
        (component) => component.hasChanges
      );

      expect(guard).toBeDefined();
      expect(typeof guard).toBe('function');
    });

    it('debería bloquear navegación si hay cambios sin guardar', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      const guard = createFormDeactivateGuard<FormComponent>(
        (component) => component.hasChanges
      );

      const component: FormComponent = { hasChanges: true };

      const result = guard(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(window.confirm).toHaveBeenCalled();
      expect(result).toBeFalse();
    });

    it('debería permitir navegación si usuario confirma', () => {
      spyOn(window, 'confirm').and.returnValue(true);

      const guard = createFormDeactivateGuard<FormComponent>(
        (component) => component.hasChanges
      );

      const component: FormComponent = { hasChanges: true };

      const result = guard(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });

    it('debería permitir navegación si no hay cambios', () => {
      spyOn(window, 'confirm');

      const guard = createFormDeactivateGuard<FormComponent>(
        (component) => component.hasChanges
      );

      const component: FormComponent = { hasChanges: false };

      const result = guard(
        component, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(window.confirm).not.toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('debería usar mensaje personalizado', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const customMessage = '¿Deseas abandonar el formulario?';

      const guard = createFormDeactivateGuard<FormComponent>(
        (component) => component.hasChanges,
        customMessage
      );

      const component: FormComponent = { hasChanges: true };

      guard(component, mockCurrentRoute, mockCurrentState, mockNextState);

      expect(window.confirm).toHaveBeenCalledWith(customMessage);
    });

    it('debería usar mensaje por defecto', () => {
      spyOn(window, 'confirm').and.returnValue(true);

      const guard = createFormDeactivateGuard<FormComponent>(
        (component) => component.hasChanges
      );

      const component: FormComponent = { hasChanges: true };

      guard(component, mockCurrentRoute, mockCurrentState, mockNextState);

      expect(window.confirm).toHaveBeenCalledWith(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
    });
  });

  describe('Escenarios de componentes reales', () => {
    it('debería funcionar con componente Settings', () => {
      const settingsComponent: CanComponentDeactivate = {
        canDeactivate: () => {
          // Simular lógica de Settings
          const hasUnsavedChanges = false;
          return !hasUnsavedChanges || window.confirm('¿Salir sin guardar?');
        }
      };

      const result = canDeactivateGuard(
        settingsComponent, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });

    it('debería funcionar con componente de edición de perfil', () => {
      const profileEditComponent: CanComponentDeactivate = {
        canDeactivate: () => {
          const formDirty = false;
          return !formDirty;
        }
      };

      const result = canDeactivateGuard(
        profileEditComponent, 
        mockCurrentRoute, 
        mockCurrentState, 
        mockNextState
      );

      expect(result).toBeTrue();
    });
  });
});
