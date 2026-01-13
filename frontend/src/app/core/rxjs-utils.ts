/**
 * @fileoverview RxJS Utilities
 * 
 * Utilidades y helpers para RxJS incluyendo patrones comunes
 * para optimización de rendimiento y gestión de suscripciones.
 */

import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, MonoTypeOperatorFunction, timer, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, share, switchMap } from 'rxjs/operators';

/**
 * Operador para debounce de búsqueda optimizado
 * Combina debounceTime, distinctUntilChanged y filtrado de strings vacíos
 * 
 * @param debounceMs - Tiempo de debounce en milisegundos (default: 300)
 * @param minLength - Longitud mínima del string (default: 2)
 * 
 * @example
 * this.searchInput$.pipe(
 *   searchDebounce(300, 2)
 * ).subscribe(query => this.performSearch(query));
 */
export function searchDebounce(
  debounceMs: number = 300,
  minLength: number = 2
): MonoTypeOperatorFunction<string> {
  return (source: Observable<string>) => source.pipe(
    debounceTime(debounceMs),
    distinctUntilChanged(),
    filter((query: string) => query.trim().length >= minLength)
  );
}

/**
 * Wrapper para takeUntilDestroyed que puede ser usado fuera del constructor
 * 
 * @example
 * export class MyComponent {
 *   private destroyRef = inject(DestroyRef);
 *   
 *   ngOnInit() {
 *     this.service.getData()
 *       .pipe(untilDestroyed(this.destroyRef))
 *       .subscribe(data => ...);
 *   }
 * }
 */
export function untilDestroyed<T>(destroyRef: DestroyRef): MonoTypeOperatorFunction<T> {
  return takeUntilDestroyed<T>(destroyRef);
}

/**
 * Crea un subject para destrucción manual (patrón clásico)
 * Útil cuando no se puede usar DestroyRef
 * 
 * @example
 * export class MyComponent implements OnDestroy {
 *   private destroy$ = createDestroySubject();
 *   
 *   ngOnInit() {
 *     this.service.getData()
 *       .pipe(takeUntil(this.destroy$))
 *       .subscribe(data => ...);
 *   }
 *   
 *   ngOnDestroy() {
 *     this.destroy$.next();
 *     this.destroy$.complete();
 *   }
 * }
 */
export function createDestroySubject(): Subject<void> {
  return new Subject<void>();
}

/**
 * Operador para refetch con polling
 * Útil para actualización periódica de datos
 * 
 * @param intervalMs - Intervalo en milisegundos
 * 
 * @example
 * this.dataService.getData()
 *   .pipe(pollEvery(30000)) // Cada 30 segundos
 *   .subscribe(data => ...);
 */
export function pollEvery<T>(intervalMs: number): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => timer(0, intervalMs).pipe(
    switchMap(() => source),
    share()
  );
}

/**
 * Compara dos arrays para detectar cambios
 * Útil para distinctUntilChanged con arrays
 */
export function arrayEquals<T>(a: T[], b: T[], compareById?: (item: T) => any): boolean {
  if (a.length !== b.length) return false;
  
  if (compareById) {
    const aIds = a.map(compareById);
    const bIds = b.map(compareById);
    return aIds.every((id, index) => id === bIds[index]);
  }
  
  return a.every((item, index) => item === b[index]);
}

/**
 * Operador distinctUntilChanged para arrays
 * 
 * @example
 * this.items$.pipe(
 *   distinctUntilArrayChanged(item => item.id)
 * ).subscribe(items => ...);
 */
export function distinctUntilArrayChanged<T>(
  compareById?: (item: T) => any
): MonoTypeOperatorFunction<T[]> {
  return distinctUntilChanged((prev: T[], curr: T[]) => 
    arrayEquals(prev, curr, compareById)
  );
}
