/**
 * @fileoverview Interceptores HTTP
 * 
 * Interceptores para modificar peticiones y respuestas HTTP:
 * - AuthInterceptor: Añade token JWT a las peticiones
 * - ErrorInterceptor: Manejo global de errores
 * - LoggingInterceptor: Logging de peticiones para debugging
 * 
 * @see https://angular.dev/guide/http/interceptors
 */

import { 
  HttpInterceptorFn, 
  HttpRequest, 
  HttpHandlerFn, 
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { STORAGE_KEYS, API_URL } from './constants';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';
import { EventBusService } from '../services/event-bus.service';

// ============================================
// AUTH INTERCEPTOR
// ============================================

/**
 * Interceptor de Autenticación
 * 
 * Añade automáticamente el token JWT a las peticiones al API.
 * Solo añade el header Authorization si:
 * - Existe un token en localStorage
 * - La petición va dirigida al API (no a recursos externos)
 * 
 * @example
 * // Se aplica automáticamente a todas las peticiones
 * // Headers resultantes:
 * // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Solo añadir token para peticiones al API
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  // Obtener token de localStorage
  const token = getStoredToken();

  if (token) {
    // Clonar la petición y añadir el header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};

/**
 * Obtiene el token almacenado de forma segura
 */
function getStoredToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
}

// ============================================
// ERROR INTERCEPTOR
// ============================================

/**
 * Interceptor de Errores Global
 * 
 * Maneja errores HTTP de forma centralizada:
 * - 401: Limpia sesión y redirige a login
 * - 403: Muestra notificación de permisos
 * - 404: Puede redirigir a página 404
 * - 500+: Muestra notificación de error del servidor
 * 
 * @example
 * // Errores manejados automáticamente
 * // Se pueden suprimir con el header 'X-Skip-Error-Handler'
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const eventBus = inject(EventBusService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Verificar si debemos saltar el manejo de errores
      if (req.headers.has('X-Skip-Error-Handler')) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 401:
          // Token expirado o inválido
          handleUnauthorized(router, eventBus);
          break;

        case 403:
          // Sin permisos
          notificationService.error('No tienes permisos para realizar esta acción');
          break;

        case 404:
          // Recurso no encontrado - no mostramos notificación,
          // dejamos que el componente maneje esto
          break;

        case 422:
          // Error de validación
          const validationMessage = extractValidationMessage(error);
          notificationService.warning(validationMessage);
          break;

        case 0:
          // Error de red
          notificationService.error('Error de conexión. Verifica tu internet.');
          break;

        default:
          // Errores del servidor (5xx) u otros
          if (error.status >= 500) {
            notificationService.error('Error en el servidor. Inténtalo más tarde.');
          }
      }

      return throwError(() => error);
    })
  );
};

/**
 * Maneja error 401 - No autorizado
 */
function handleUnauthorized(router: Router, eventBus: EventBusService): void {
  // Limpiar datos de sesión
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }

  // Emitir evento de sesión expirada
  eventBus.emit('sessionExpired', null);

  // Redirigir a home (el guard de auth mostrará el login si es necesario)
  // No redirigimos directamente para evitar ciclos
  router.navigate(['/'], {
    queryParams: { sessionExpired: true }
  });
}

/**
 * Extrae mensaje de error de validación
 */
function extractValidationMessage(error: HttpErrorResponse): string {
  if (error.error?.validationErrors?.length > 0) {
    return error.error.validationErrors
      .map((e: { field: string; message: string }) => e.message)
      .join('. ');
  }
  return error.error?.message || 'Error de validación';
}

// ============================================
// LOGGING INTERCEPTOR
// ============================================

/**
 * Interceptor de Logging
 * 
 * Registra información de las peticiones HTTP para debugging:
 * - Método y URL
 * - Tiempo de respuesta
 * - Estado de la respuesta
 * 
 * Solo activo en desarrollo (se puede condicionar con environment)
 */
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Solo loggear en desarrollo
  const isDevelopment = !isProdEnvironment();
  
  if (!isDevelopment) {
    return next(req);
  }

  const startTime = Date.now();
  const requestId = generateRequestId();

  // Log de petición
  console.groupCollapsed(
    `%c[HTTP] ${req.method} ${getShortUrl(req.url)}`,
    'color: #3B82F6; font-weight: bold;'
  );
  console.log('Request ID:', requestId);
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  
  if (req.body) {
    console.log('Body:', req.body);
  }
  
  if (req.params.keys().length > 0) {
    console.log('Params:', req.params.toString());
  }
  
  console.groupEnd();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log(
            `%c[HTTP] ✓ ${req.method} ${getShortUrl(req.url)} - ${event.status} (${duration}ms)`,
            'color: #22C55E;'
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        const duration = Date.now() - startTime;
        console.log(
          `%c[HTTP] ✗ ${req.method} ${getShortUrl(req.url)} - ${error.status} (${duration}ms)`,
          'color: #EF4444;'
        );
        console.error('Error details:', error.message);
      }
    })
  );
};

/**
 * Genera ID único para la petición
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Obtiene URL corta para logging
 */
function getShortUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url.replace(API_URL, '');
  }
}

/**
 * Verifica si estamos en producción
 * En un proyecto real, usaríamos environment.production
 */
function isProdEnvironment(): boolean {
  // Por ahora, siempre devolvemos false para ver logs en desarrollo
  return false;
}

// ============================================
// LOADING INTERCEPTOR
// ============================================

/**
 * Interceptor de Loading
 * 
 * Muestra/oculta el spinner de carga global durante las peticiones.
 * Se puede deshabilitar por petición con el header 'X-Skip-Loading'
 */
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);

  // Verificar si debemos saltar el loading
  if (req.headers.has('X-Skip-Loading')) {
    return next(req);
  }

  // Generar ID único para esta petición
  const loadingId = `http_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Mostrar loading
  loadingService.show(loadingId);

  return next(req).pipe(
    finalize(() => {
      // Ocultar loading cuando termine (éxito o error)
      loadingService.hide(loadingId);
    })
  );
};

// ============================================
// EXPORTACIÓN DE INTERCEPTORES
// ============================================

/**
 * Array de interceptores en orden de ejecución
 * El orden es importante:
 * 1. Logging (primero para ver la petición original)
 * 2. Loading (mostrar spinner)
 * 3. Auth (añadir token)
 * 4. Error (manejar errores - último para capturar todo)
 */
export const httpInterceptors = [
  loggingInterceptor,
  loadingInterceptor,
  authInterceptor,
  errorInterceptor
];
