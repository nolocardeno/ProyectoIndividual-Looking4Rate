import { Injectable, inject } from '@angular/core';
import { 
  CanDeactivate,
  CanDeactivateFn,
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interfaz para componentes que implementan CanDeactivate
 */
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

/**
 * @guard CanDeactivateGuard
 * @description Guard para prevenir salir de una página con cambios sin guardar.
 * El componente debe implementar la interfaz CanComponentDeactivate.
 * 
 * @example
 * // En el componente:
 * export class SettingsPage implements CanComponentDeactivate {
 *   hasUnsavedChanges = false;
 * 
 *   canDeactivate(): boolean {
 *     if (this.hasUnsavedChanges) {
 *       return confirm('¿Estás seguro de que quieres salir?');
 *     }
 *     return true;
 *   }
 * }
 * 
 * // En configuración de rutas:
 * {
 *   path: 'ajustes',
 *   loadComponent: () => import('./pages/settings/settings'),
 *   canDeactivate: [canDeactivateGuard]
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Si el componente implementa canDeactivate, usarlo
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    
    // Si no implementa la interfaz, permitir navegación
    return true;
  }
}

/**
 * Guard funcional de CanDeactivate (forma moderna de Angular 14+)
 */
export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot
) => {
  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  return true;
};

/**
 * Guard genérico para formularios con cambios sin guardar
 * Usa una función callback para determinar si hay cambios
 */
export function createFormDeactivateGuard<T>(
  hasUnsavedChanges: (component: T) => boolean,
  message = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
): CanDeactivateFn<T> {
  return (
    component: T,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ) => {
    if (hasUnsavedChanges(component)) {
      return confirm(message);
    }
    return true;
  };
}
