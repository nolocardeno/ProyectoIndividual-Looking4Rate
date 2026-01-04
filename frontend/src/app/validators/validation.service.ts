/**
 * @fileoverview Validation Service - Servicio de validación con API
 * 
 * Servicio para realizar validaciones asíncronas contra el backend.
 * Incluye métodos para verificar disponibilidad de email y username.
 * 
 * @author Looking4Rate Team
 * @version 1.0.0
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_URL } from '../core/constants';

/**
 * Respuesta de verificación de disponibilidad
 */
export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

/**
 * Servicio de validación con backend
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  private readonly http = inject(HttpClient);
  
  /** Caché de resultados */
  private cache = new Map<string, { result: boolean; timestamp: number }>();
  
  /** Tiempo de vida del caché (5 minutos) */
  private readonly CACHE_TTL = 5 * 60 * 1000;

  /**
   * Verifica si un email está disponible
   */
  checkEmailAvailability(email: string): Observable<AvailabilityResponse> {
    if (!email) {
      return of({ available: true });
    }

    const cacheKey = `email:${email.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached !== null) {
      return of({ 
        available: cached, 
        message: cached ? 'Email disponible' : 'Este email ya está registrado' 
      });
    }

    // Llamada real al backend
    return this.http.get<AvailabilityResponse>(
      `${API_URL}/auth/check-email`,
      { params: { email } }
    ).pipe(
      map(response => {
        this.setCache(cacheKey, response.available);
        return response;
      }),
      catchError(() => of({ available: true, message: 'No se pudo verificar' }))
    );
  }

  /**
   * Verifica si un nombre de usuario está disponible
   */
  checkUsernameAvailability(username: string): Observable<AvailabilityResponse> {
    if (!username || username.length < 3) {
      return of({ available: true });
    }

    const cacheKey = `username:${username.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached !== null) {
      return of({ 
        available: cached, 
        message: cached ? 'Usuario disponible' : 'Este nombre de usuario ya está en uso' 
      });
    }

    // Llamada real al backend
    return this.http.get<AvailabilityResponse>(
      `${API_URL}/auth/check-username`,
      { params: { username } }
    ).pipe(
      map(response => {
        this.setCache(cacheKey, response.available);
        return response;
      }),
      catchError(() => of({ available: true, message: 'No se pudo verificar' }))
    );
  }

  private getFromCache(key: string): boolean | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.result;
  }

  private setCache(key: string, result: boolean): void {
    this.cache.set(key, { result, timestamp: Date.now() });
  }

  /**
   * Limpia el caché de validaciones
   */
  clearCache(): void {
    this.cache.clear();
  }
}
