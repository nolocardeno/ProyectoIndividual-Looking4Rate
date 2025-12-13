/**
 * @fileoverview Async Validators - Validadores asíncronos
 * 
 * Colección de validadores asíncronos para formularios reactivos.
 * Incluye validaciones contra el backend con debounce integrado.
 * 
 * @author Looking4Rate Team
 * @version 1.0.0
 */

import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError, first } from 'rxjs/operators';
import { ValidationService } from './validation.service';

/**
 * Clase estática con validadores asíncronos
 */
export class AsyncValidators {

  private static readonly DEFAULT_DEBOUNCE_TIME = 500;

  /**
   * Validador asíncrono de email único
   * 
   * @param validationService Servicio de validación inyectado
   * @param debounceTime Tiempo de debounce en ms (por defecto 500ms)
   */
  static uniqueEmail(
    validationService: ValidationService,
    debounceTime: number = AsyncValidators.DEFAULT_DEBOUNCE_TIME
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (!value || !AsyncValidators.isValidEmailFormat(value)) {
        return of(null);
      }

      return timer(debounceTime).pipe(
        switchMap(() => validationService.checkEmailAvailability(value)),
        map(result => result.available ? null : { emailNotUnique: true }),
        catchError(() => of(null)),
        first()
      );
    };
  }

  /**
   * Validador asíncrono de username disponible
   */
  static availableUsername(
    validationService: ValidationService,
    debounceTime: number = AsyncValidators.DEFAULT_DEBOUNCE_TIME
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (!value || value.length < 3) {
        return of(null);
      }

      return timer(debounceTime).pipe(
        switchMap(() => validationService.checkUsernameAvailability(value)),
        map(result => result.available ? null : { usernameNotAvailable: true }),
        catchError(() => of(null)),
        first()
      );
    };
  }

  /**
   * Factory para crear validadores asíncronos genéricos
   */
  static createValidator(
    checkFn: (value: string) => Observable<boolean>,
    errorKey: string,
    debounceTime: number = AsyncValidators.DEFAULT_DEBOUNCE_TIME
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (!value) return of(null);

      return timer(debounceTime).pipe(
        switchMap(() => checkFn(value)),
        map(isValid => isValid ? null : { [errorKey]: true }),
        catchError(() => of(null)),
        first()
      );
    };
  }

  private static isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
