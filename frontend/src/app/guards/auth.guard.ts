import { Injectable, inject } from '@angular/core';
import { 
  CanActivate, 
  CanActivateFn,
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * @guard AuthGuard
 * @description Guard de autenticación para proteger rutas que requieren login.
 * Redirige a la página de inicio si el usuario no está autenticado.
 * 
 * @example
 * // En configuración de rutas:
 * {
 *   path: 'ajustes',
 *   loadComponent: () => import('./pages/settings/settings'),
 *   canActivate: [authGuard]
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Guardar la URL intentada para redirigir después del login
    this.authService.setRedirectUrl(state.url);

    // Emitir evento para abrir modal de login
    this.authService.requestLogin();

    // Redirigir al inicio
    return this.router.createUrlTree(['/'], {
      queryParams: { returnUrl: state.url }
    });
  }
}

/**
 * Guard funcional de autenticación (forma moderna de Angular 14+)
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar URL para redirección post-login
  authService.setRedirectUrl(state.url);
  authService.requestLogin();

  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Guard para rutas de invitados (login, registro)
 * Redirige al perfil si el usuario ya está autenticado
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Usuario ya autenticado, redirigir a su perfil
  const userId = authService.getCurrentUserId();
  return router.createUrlTree(['/usuario', userId]);
};

/**
 * Guard para verificar si el usuario es el propietario del recurso
 */
export const ownerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    authService.setRedirectUrl(state.url);
    authService.requestLogin();
    return router.createUrlTree(['/']);
  }

  // Verificar si el ID del usuario en la ruta coincide con el usuario actual
  const routeUserId = parseInt(route.params['id'], 10);
  const currentUserId = authService.getCurrentUserId();

  if (routeUserId === currentUserId || authService.isAdmin()) {
    return true;
  }

  // No es el propietario, redirigir al perfil público
  return router.createUrlTree(['/usuario', routeUserId]);
};

/**
 * Guard para rutas de administrador
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    authService.setRedirectUrl(state.url);
    authService.requestLogin();
  }

  return router.createUrlTree(['/']);
};
