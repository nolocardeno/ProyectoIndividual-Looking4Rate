/**
 * @fileoverview HTTP Base Service
 * 
 * Servicio base para comunicación HTTP con el backend.
 * Proporciona operaciones CRUD genéricas con tipado,
 * manejo de errores, transformación de datos y retry logic.
 * 
 * @example
 * // Uso directo
 * const juegos = await firstValueFrom(httpService.get<JuegoDTO[]>(ENDPOINTS.JUEGOS.BASE));
 * 
 * // Extender para servicios específicos
 * export class JuegosService extends HttpBaseService {
 *   getJuego(id: number) {
 *     return this.get<JuegoDTO>(ENDPOINTS.JUEGOS.BY_ID(id));
 *   }
 * }
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, retry, timeout, tap } from 'rxjs/operators';

import { 
  API_URL, 
  HTTP_CONFIG, 
  DEFAULT_HEADERS,
  ERROR_MESSAGES 
} from '../core/constants';
import { 
  ApiError, 
  NormalizedError, 
  ErrorType,
  PaginatedResponse,
  PaginationParams,
  UploadProgress
} from '../models';

/**
 * Opciones para peticiones HTTP
 */
export interface HttpOptions {
  /** Headers adicionales */
  headers?: Record<string, string>;
  /** Query params */
  params?: Record<string, string | number | boolean | undefined>;
  /** Timeout personalizado */
  timeout?: number;
  /** Número de reintentos */
  retries?: number;
  /** Mostrar loading global */
  showLoading?: boolean;
  /** Suprimir manejo de error global */
  suppressError?: boolean;
  /** Tipo de respuesta */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

/**
 * HttpBaseService
 * 
 * Servicio base para todas las peticiones HTTP de la aplicación.
 * Implementa:
 * - Operaciones CRUD genéricas tipadas
 * - Manejo centralizado de errores
 * - Retry automático para errores transitorios
 * - Timeout configurable
 * - Transformación de respuestas
 * - Soporte para FormData (upload)
 * - Query params y headers personalizados
 */
@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {
  protected http = inject(HttpClient);

  // ========================================
  // OPERACIONES CRUD
  // ========================================

  /**
   * GET - Obtener recurso(s)
   * @param endpoint - Endpoint relativo al API_URL
   * @param options - Opciones de la petición
   * @returns Observable con la respuesta tipada
   */
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.get<T>(url, httpOptions).pipe(
      timeout(options?.timeout ?? HTTP_CONFIG.DEFAULT_TIMEOUT),
      this.retryOnError(options?.retries ?? HTTP_CONFIG.RETRY_COUNT),
      catchError(error => this.handleError(error, options?.suppressError))
    );
  }

  /**
   * GET con paginación
   * @param endpoint - Endpoint relativo
   * @param pagination - Parámetros de paginación
   * @param options - Opciones adicionales
   */
  getPaginated<T>(
    endpoint: string, 
    pagination?: PaginationParams,
    options?: HttpOptions
  ): Observable<PaginatedResponse<T>> {
    const params = {
      ...options?.params,
      page: pagination?.page?.toString(),
      size: pagination?.size?.toString(),
      sort: pagination?.sort,
      direction: pagination?.direction
    };

    return this.get<PaginatedResponse<T>>(endpoint, { ...options, params });
  }

  /**
   * POST - Crear recurso
   * @param endpoint - Endpoint relativo
   * @param body - Datos a enviar
   * @param options - Opciones de la petición
   */
  post<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.post<T>(url, body, httpOptions).pipe(
      timeout(options?.timeout ?? HTTP_CONFIG.DEFAULT_TIMEOUT),
      catchError(error => this.handleError(error, options?.suppressError))
    );
  }

  /**
   * PUT - Actualizar recurso completo
   * @param endpoint - Endpoint relativo
   * @param body - Datos a enviar
   * @param options - Opciones de la petición
   */
  put<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.put<T>(url, body, httpOptions).pipe(
      timeout(options?.timeout ?? HTTP_CONFIG.DEFAULT_TIMEOUT),
      catchError(error => this.handleError(error, options?.suppressError))
    );
  }

  /**
   * PATCH - Actualizar recurso parcialmente
   * @param endpoint - Endpoint relativo
   * @param body - Datos parciales a enviar
   * @param options - Opciones de la petición
   */
  patch<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.patch<T>(url, body, httpOptions).pipe(
      timeout(options?.timeout ?? HTTP_CONFIG.DEFAULT_TIMEOUT),
      catchError(error => this.handleError(error, options?.suppressError))
    );
  }

  /**
   * DELETE - Eliminar recurso
   * @param endpoint - Endpoint relativo
   * @param options - Opciones de la petición
   */
  delete<T = void>(endpoint: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.delete<T>(url, httpOptions).pipe(
      timeout(options?.timeout ?? HTTP_CONFIG.DEFAULT_TIMEOUT),
      catchError(error => this.handleError(error, options?.suppressError))
    );
  }

  // ========================================
  // UPLOAD DE ARCHIVOS
  // ========================================

  /**
   * Upload de archivo con FormData
   * @param endpoint - Endpoint relativo
   * @param file - Archivo a subir
   * @param fieldName - Nombre del campo (default: 'file')
   * @param additionalData - Datos adicionales a incluir
   */
  uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    
    formData.append(fieldName, file, file.name);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // No establecer Content-Type, el navegador lo hace automáticamente con boundary
    return this.http.post<T>(url, formData).pipe(
      timeout(HTTP_CONFIG.UPLOAD_TIMEOUT),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Upload con progreso
   * @param endpoint - Endpoint relativo
   * @param file - Archivo a subir
   * @param onProgress - Callback para progreso
   */
  uploadFileWithProgress<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Observable<T> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<T>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      timeout(HTTP_CONFIG.UPLOAD_TIMEOUT),
      tap((event: HttpEvent<T>) => {
        if (event.type === HttpEventType.UploadProgress && event.total && onProgress) {
          onProgress({
            progress: Math.round(100 * event.loaded / event.total),
            loaded: event.loaded,
            total: event.total
          });
        }
      }),
      map((event: HttpEvent<T>) => {
        if (event.type === HttpEventType.Response) {
          return event.body as T;
        }
        return null as T;
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ========================================
  // UTILIDADES
  // ========================================

  /**
   * Construye la URL completa
   */
  protected buildUrl(endpoint: string): string {
    // Si ya es una URL completa, devolverla
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    // Asegurar que el endpoint empieza con /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_URL}${path}`;
  }

  /**
   * Construye las opciones HTTP
   */
  protected buildHttpOptions(options?: HttpOptions): {
    headers: HttpHeaders;
    params: HttpParams;
  } {
    let headers = new HttpHeaders(DEFAULT_HEADERS);
    let params = new HttpParams();

    // Añadir headers personalizados
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers = headers.set(key, value);
      });
    }

    // Añadir query params (filtrando undefined)
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return {
      headers,
      params
    };
  }

  /**
   * Operador de retry con delay exponencial
   */
  protected retryOnError(maxRetries: number) {
    return <T>(source: Observable<T>): Observable<T> => {
      return source.pipe(
        retry({
          count: maxRetries,
          delay: (error: HttpErrorResponse, retryCount: number) => {
            // Solo reintentar para ciertos códigos de estado
            const retryableCodes: number[] = [...HTTP_CONFIG.RETRYABLE_STATUS_CODES];
            if (!retryableCodes.includes(error.status)) {
              return throwError(() => error);
            }
            // Delay exponencial
            const delay = HTTP_CONFIG.RETRY_DELAY * Math.pow(2, retryCount - 1);
            console.warn(`Reintentando petición (${retryCount}/${maxRetries}) en ${delay}ms`);
            return timer(delay);
          }
        })
      );
    };
  }

  /**
   * Maneja errores HTTP y los normaliza
   */
  protected handleError(error: HttpErrorResponse, suppressError?: boolean): Observable<never> {
    const normalized = this.normalizeError(error);
    
    // Log para debugging
    console.error('[HTTP Error]', {
      url: error.url,
      status: error.status,
      message: normalized.userMessage,
      technical: normalized.technicalMessage
    });

    // Si no se suprime, podríamos emitir evento global (se hace en interceptor)
    
    return throwError(() => normalized);
  }

  /**
   * Normaliza un error HTTP a un formato consistente
   */
  protected normalizeError(error: HttpErrorResponse): NormalizedError {
    let type: ErrorType = 'unknown';
    let userMessage: string = ERROR_MESSAGES.UNKNOWN;
    let retryable = false;

    // Error de red (sin conexión)
    if (error.status === 0) {
      type = 'network';
      userMessage = ERROR_MESSAGES.NETWORK;
      retryable = true;
    }
    // Timeout (verificamos el nombre y tipo del error)
    else if (error.error instanceof Error && error.error.name === 'TimeoutError') {
      type = 'timeout';
      userMessage = ERROR_MESSAGES.TIMEOUT;
      retryable = true;
    }
    // No autorizado
    else if (error.status === 401) {
      type = 'unauthorized';
      userMessage = ERROR_MESSAGES.UNAUTHORIZED;
    }
    // Prohibido
    else if (error.status === 403) {
      type = 'forbidden';
      userMessage = ERROR_MESSAGES.FORBIDDEN;
    }
    // No encontrado
    else if (error.status === 404) {
      type = 'not_found';
      userMessage = ERROR_MESSAGES.NOT_FOUND;
    }
    // Error de validación
    else if (error.status === 400) {
      type = 'validation';
      userMessage = error.error?.message || ERROR_MESSAGES.VALIDATION;
    }
    // Error del servidor
    else if (error.status >= 500) {
      type = 'server';
      userMessage = ERROR_MESSAGES.SERVER;
      retryable = true;
    }

    // Intentar obtener mensaje más específico del backend
    if (error.error?.message && type !== 'validation') {
      userMessage = error.error.message;
    }

    return {
      type,
      userMessage,
      technicalMessage: error.message || 'Unknown error',
      statusCode: error.status,
      validationErrors: error.error?.validationErrors,
      retryable
    };
  }
}
