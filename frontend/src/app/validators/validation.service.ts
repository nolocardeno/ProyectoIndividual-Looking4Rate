/**
 * @fileoverview Validation Service - Servicio de validación con API
 * 
 * Servicio para realizar validaciones asíncronas contra el backend.
 * Incluye métodos para verificar disponibilidad de email y username.
 * 
 * @author Looking4Rate Team
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

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

    // Simulación de llamada al backend
    return this.simulateApiCall(email, 'email').pipe(
      map(available => {
        this.setCache(cacheKey, available);
        return {
          available,
          message: available ? 'Email disponible' : 'Este email ya está registrado'
        };
      })
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

    return this.simulateApiCall(username, 'username').pipe(
      map(available => {
        this.setCache(cacheKey, available);
        return {
          available,
          message: available ? 'Usuario disponible' : 'Este nombre de usuario ya está en uso'
        };
      })
    );
  }

  /**
   * Simula una llamada a la API
   */
  private simulateApiCall(value: string, type: 'email' | 'username'): Observable<boolean> {
    const delay = Math.random() * 500 + 300;
    
    // Valores "ocupados" para simulación
    const takenEmails = ['admin@looking4rate.com', 'test@test.com', 'usuario@email.com'];
    const takenUsernames = ['admin', 'test', 'usuario', 'root', 'system'];
    
    return timer(delay).pipe(
      map(() => {
        if (type === 'email') {
          return !takenEmails.includes(value.toLowerCase());
        } else {
          return !takenUsernames.includes(value.toLowerCase());
        }
      })
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
