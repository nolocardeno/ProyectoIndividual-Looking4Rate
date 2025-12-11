import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Tipos de eventos que pueden ser emitidos entre componentes
 */
export type EventType = 
  | 'auth:login'
  | 'auth:logout'
  | 'auth:sessionExpired'
  | 'theme:changed'
  | 'search:query'
  | 'search:clear'
  | 'modal:open'
  | 'modal:close'
  | 'game:selected'
  | 'game:rated'
  | 'user:profileUpdated'
  | 'navigation:changed'
  | string; // Permite eventos personalizados

/**
 * Interfaz para los eventos del bus
 */
export interface BusEvent<T = any> {
  type: EventType;
  payload?: T;
  timestamp: Date;
  source?: string;
}

/**
 * EventBusService
 * 
 * Servicio centralizado para comunicación entre componentes hermanos
 * y no relacionados directamente en el árbol de componentes.
 * 
 * Implementa el patrón Publish/Subscribe usando RxJS Subject.
 * 
 * @example
 * // Emitir un evento
 * eventBus.emit('auth:login', { userId: '123', username: 'user' });
 * 
 * // Suscribirse a un evento específico
 * eventBus.on<UserData>('auth:login').subscribe(payload => {
 *   console.log('Usuario logueado:', payload);
 * });
 * 
 * // Suscribirse a múltiples eventos
 * eventBus.onMany(['auth:login', 'auth:logout']).subscribe(event => {
 *   console.log('Evento de auth:', event);
 * });
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  /** Subject principal para todos los eventos */
  private eventSubject = new Subject<BusEvent>();
  
  /** Observable público de todos los eventos */
  public events$ = this.eventSubject.asObservable();

  /** Historial de eventos (últimos 50) para debugging */
  private eventHistory: BusEvent[] = [];
  private readonly MAX_HISTORY = 50;

  /**
   * Emite un evento al bus
   * @param type - Tipo del evento
   * @param payload - Datos opcionales del evento
   * @param source - Identificador del componente que emite (para debugging)
   */
  emit<T = any>(type: EventType, payload?: T, source?: string): void {
    const event: BusEvent<T> = {
      type,
      payload,
      timestamp: new Date(),
      source
    };

    // Añadir al historial
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.pop();
    }

    // Emitir el evento
    this.eventSubject.next(event);
  }

  /**
   * Se suscribe a un tipo específico de evento
   * @param type - Tipo del evento a escuchar
   * @returns Observable que emite solo los payloads de ese tipo de evento
   */
  on<T = any>(type: EventType): Observable<T | undefined> {
    return this.events$.pipe(
      filter(event => event.type === type),
      map(event => event.payload as T | undefined)
    );
  }

  /**
   * Se suscribe a múltiples tipos de eventos
   * @param types - Array de tipos de eventos a escuchar
   * @returns Observable que emite los eventos completos
   */
  onMany(types: EventType[]): Observable<BusEvent> {
    return this.events$.pipe(
      filter(event => types.includes(event.type))
    );
  }

  /**
   * Se suscribe a todos los eventos de una categoría
   * @param category - Prefijo de la categoría (ej: 'auth', 'game')
   * @returns Observable que emite los eventos de esa categoría
   */
  onCategory(category: string): Observable<BusEvent> {
    return this.events$.pipe(
      filter(event => event.type.startsWith(`${category}:`))
    );
  }

  /**
   * Obtiene el historial de eventos (para debugging)
   */
  getHistory(): BusEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Limpia el historial de eventos
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
}
