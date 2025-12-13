/**
 * @fileoverview Custom Validators - Validadores síncronos personalizados
 * 
 * Colección de validadores personalizados para formularios reactivos.
 * Incluye validaciones para contraseñas, documentos de identidad,
 * teléfonos, códigos postales y validaciones cross-field.
 * 
 * @example
 * import { CustomValidators } from '../validators';
 * 
 * this.form = this.fb.group({
 *   password: ['', [Validators.required, CustomValidators.strongPassword()]],
 *   confirmPassword: ['', Validators.required],
 *   nif: ['', CustomValidators.nif()],
 *   phone: ['', CustomValidators.spanishPhone()]
 * }, {
 *   validators: CustomValidators.passwordMatch('password', 'confirmPassword')
 * });
 * 
 * @author Looking4Rate Team
 * @version 1.0.0
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Clase estática con validadores síncronos personalizados
 */
export class CustomValidators {

  // ============================================
  // VALIDADORES DE CONTRASEÑA
  // ============================================

  /**
   * Validador de contraseña fuerte
   * 
   * Requisitos:
   * - Mínimo 8 caracteres
   * - Al menos una letra mayúscula
   * - Al menos una letra minúscula
   * - Al menos un número
   * - Al menos un carácter especial (cualquiera que no sea letra o número)
   * 
   * @returns ValidatorFn que retorna objeto de errores o null
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Dejar que 'required' maneje campos vacíos
      }

      const errors: ValidationErrors = {};
      
      if (value.length < 8) {
        errors['minLength'] = { requiredLength: 8, actualLength: value.length };
      }
      
      if (!/[A-Z]/.test(value)) {
        errors['noUppercase'] = true;
      }
      
      if (!/[a-z]/.test(value)) {
        errors['noLowercase'] = true;
      }
      
      if (!/[0-9]/.test(value)) {
        errors['noNumber'] = true;
      }
      
      // Cualquier carácter que no sea letra o número
      if (!/[^a-zA-Z0-9]/.test(value)) {
        errors['noSpecialChar'] = true;
      }

      return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
    };
  }

  /**
   * Validador de complejidad de contraseña con niveles
   * 
   * @param minLevel Nivel mínimo requerido (1-4)
   * - Nivel 1: Solo longitud mínima (6 caracteres)
   * - Nivel 2: Longitud + mayúsculas/minúsculas
   * - Nivel 3: Nivel 2 + números
   * - Nivel 4: Nivel 3 + caracteres especiales
   */
  static passwordComplexity(minLevel: number = 3): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) return null;

      let level = 0;
      
      if (value.length >= 6) level++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) level++;
      if (/[0-9]/.test(value)) level++;
      if (/[@$!%*?&_\-#]/.test(value)) level++;

      if (level < minLevel) {
        return {
          passwordComplexity: {
            requiredLevel: minLevel,
            actualLevel: level,
            message: CustomValidators.getPasswordLevelMessage(level)
          }
        };
      }

      return null;
    };
  }

  private static getPasswordLevelMessage(level: number): string {
    const messages = [
      'Muy débil - Añade más caracteres',
      'Débil - Añade mayúsculas y minúsculas',
      'Regular - Añade números',
      'Buena - Añade caracteres especiales',
      'Excelente'
    ];
    return messages[level] || messages[0];
  }

  // ============================================
  // VALIDADORES CROSS-FIELD
  // ============================================

  /**
   * Validador de coincidencia de contraseñas
   * Se aplica a nivel de FormGroup
   * 
   * @param passwordField Nombre del campo de contraseña
   * @param confirmField Nombre del campo de confirmación
   */
  static passwordMatch(passwordField: string, confirmField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField);
      const confirm = formGroup.get(confirmField);

      if (!password || !confirm) {
        return null;
      }

      if (!password.value || !confirm.value) {
        return null;
      }

      if (password.value !== confirm.value) {
        confirm.setErrors({ ...confirm.errors, passwordMismatch: true });
        return { passwordMismatch: true };
      }

      // Limpiar error si coinciden
      if (confirm.errors) {
        const { passwordMismatch, ...otherErrors } = confirm.errors;
        confirm.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
      }

      return null;
    };
  }

  /**
   * Validador genérico de coincidencia de campos
   */
  static fieldsMatch(field1: string, field2: string, errorKey: string = 'fieldsMismatch'): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control1 = formGroup.get(field1);
      const control2 = formGroup.get(field2);

      if (!control1 || !control2 || !control1.value || !control2.value) {
        return null;
      }

      if (control1.value !== control2.value) {
        return { [errorKey]: { field1, field2 } };
      }

      return null;
    };
  }

  // ============================================
  // VALIDADORES DE DOCUMENTOS ESPAÑOLES
  // ============================================

  /**
   * Validador de NIF/NIE español
   * 
   * Formatos válidos:
   * - NIF: 8 números + 1 letra (ej: 12345678Z)
   * - NIE: X/Y/Z + 7 números + 1 letra (ej: X1234567L)
   */
  static nif(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toUpperCase().replace(/\s/g, '');
      
      if (!value) return null;

      const letrasNIF = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const nifPattern = /^[0-9]{8}[A-Z]$/;
      const niePattern = /^[XYZ][0-9]{7}[A-Z]$/;

      if (nifPattern.test(value)) {
        const numero = parseInt(value.substring(0, 8), 10);
        const letraEsperada = letrasNIF[numero % 23];
        const letraActual = value.charAt(8);

        if (letraActual !== letraEsperada) {
          return { nif: { message: 'La letra del NIF no es correcta' } };
        }
        return null;
      }

      if (niePattern.test(value)) {
        let numeroStr = value.substring(1, 8);
        const primeraLetra = value.charAt(0);
        const conversion: Record<string, string> = { 'X': '0', 'Y': '1', 'Z': '2' };
        numeroStr = conversion[primeraLetra] + numeroStr;
        
        const numero = parseInt(numeroStr, 10);
        const letraEsperada = letrasNIF[numero % 23];
        const letraActual = value.charAt(8);

        if (letraActual !== letraEsperada) {
          return { nif: { message: 'La letra del NIE no es correcta' } };
        }
        return null;
      }

      return { nif: { message: 'Formato de NIF/NIE no válido' } };
    };
  }

  // ============================================
  // VALIDADORES DE TELÉFONO
  // ============================================

  /**
   * Validador de teléfono español
   * 
   * Formatos válidos:
   * - Móvil: 6XX XXX XXX o 7XX XXX XXX
   * - Fijo: 9XX XXX XXX o 8XX XXX XXX
   * - Con prefijo: +34 XXX XXX XXX
   * 
   * @param allowLandline Permitir teléfonos fijos (por defecto true)
   */
  static spanishPhone(allowLandline: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value;
      
      if (!value) return null;

      value = value.replace(/[\s\-\.]/g, '');
      
      if (value.startsWith('+34')) {
        value = value.substring(3);
      } else if (value.startsWith('0034')) {
        value = value.substring(4);
      }

      if (!/^[0-9]{9}$/.test(value)) {
        return { spanishPhone: { message: 'El teléfono debe tener 9 dígitos' } };
      }

      const firstDigit = value.charAt(0);
      
      if (allowLandline) {
        if (!['6', '7', '8', '9'].includes(firstDigit)) {
          return { spanishPhone: { message: 'Número de teléfono no válido' } };
        }
      } else {
        if (!['6', '7'].includes(firstDigit)) {
          return { spanishPhone: { message: 'Debe ser un número de móvil (6XX o 7XX)' } };
        }
      }

      return null;
    };
  }

  // ============================================
  // VALIDADORES DE CÓDIGO POSTAL
  // ============================================

  /**
   * Validador de código postal español
   * 
   * @param allowedProvinces Array de códigos de provincia permitidos (opcional)
   */
  static spanishPostalCode(allowedProvinces?: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.replace(/\s/g, '');
      
      if (!value) return null;

      if (!/^[0-9]{5}$/.test(value)) {
        return { postalCode: { message: 'El código postal debe tener 5 dígitos' } };
      }

      const provincia = value.substring(0, 2);
      const provinciaNum = parseInt(provincia, 10);

      if (provinciaNum < 1 || provinciaNum > 52) {
        return { postalCode: { message: 'Código de provincia no válido' } };
      }

      if (allowedProvinces && allowedProvinces.length > 0) {
        if (!allowedProvinces.includes(provincia)) {
          return { 
            postalCode: { 
              message: 'Código postal fuera de las provincias permitidas',
              allowedProvinces 
            } 
          };
        }
      }

      return null;
    };
  }

  // ============================================
  // VALIDADORES DE FORMATO GENERAL
  // ============================================

  /**
   * Validador de nombre de usuario
   * 
   * Requisitos:
   * - Entre 3 y 20 caracteres
   * - Solo letras, números, guiones y guiones bajos
   * - No puede empezar ni terminar con guión/guión bajo
   */
  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) return null;

      const errors: ValidationErrors = {};

      if (value.length < 3) {
        errors['tooShort'] = { minLength: 3, actualLength: value.length };
      }

      if (value.length > 20) {
        errors['tooLong'] = { maxLength: 20, actualLength: value.length };
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        errors['invalidChars'] = true;
      }

      if (/^[-_]|[-_]$/.test(value)) {
        errors['invalidStartEnd'] = true;
      }

      return Object.keys(errors).length > 0 ? { username: errors } : null;
    };
  }

  /**
   * Validador de URL
   */
  static url(requireHttps: boolean = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) return null;

      try {
        const url = new URL(value);
        
        if (requireHttps && url.protocol !== 'https:') {
          return { url: { message: 'La URL debe usar HTTPS' } };
        }

        if (!['http:', 'https:'].includes(url.protocol)) {
          return { url: { message: 'Protocolo no válido' } };
        }

        return null;
      } catch {
        return { url: { message: 'URL no válida' } };
      }
    };
  }

  /**
   * Validador de rango numérico
   */
  static range(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined || value === '') return null;

      const numValue = Number(value);

      if (isNaN(numValue)) {
        return { range: { message: 'Debe ser un número' } };
      }

      if (numValue < min || numValue > max) {
        return { 
          range: { 
            min, 
            max, 
            actual: numValue,
            message: `Debe estar entre ${min} y ${max}` 
          } 
        };
      }

      return null;
    };
  }

  /**
   * Validador de edad mínima
   */
  static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) return null;

      const birthDate = new Date(value);
      
      if (isNaN(birthDate.getTime())) {
        return { minAge: { message: 'Fecha no válida' } };
      }

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < minAge) {
        return { 
          minAge: { 
            required: minAge,
            actual: age,
            message: `Debes tener al menos ${minAge} años`
          } 
        };
      }

      return null;
    };
  }

  // ============================================
  // VALIDADORES DE ARRAY (Para FormArray)
  // ============================================

  /**
   * Validador de longitud mínima de array
   */
  static minArrayLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as any;
      if (formArray.controls && formArray.controls.length < minLength) {
        return { 
          minArrayLength: { 
            required: minLength, 
            actual: formArray.controls.length 
          } 
        };
      }
      return null;
    };
  }

  /**
   * Validador de longitud máxima de array
   */
  static maxArrayLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as any;
      if (formArray.controls && formArray.controls.length > maxLength) {
        return { 
          maxArrayLength: { 
            allowed: maxLength, 
            actual: formArray.controls.length 
          } 
        };
      }
      return null;
    };
  }

  /**
   * Validador de elementos únicos en array
   */
  static uniqueArrayItems(fieldName?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as any;
      
      if (!formArray.controls) return null;

      const values = formArray.controls.map((c: AbstractControl) => {
        if (fieldName) {
          return c.get(fieldName)?.value;
        }
        return c.value;
      });

      const uniqueValues = new Set(values.filter((v: any) => v !== null && v !== ''));
      
      if (uniqueValues.size !== values.filter((v: any) => v !== null && v !== '').length) {
        return { uniqueArrayItems: { message: 'Los elementos deben ser únicos' } };
      }

      return null;
    };
  }
}
