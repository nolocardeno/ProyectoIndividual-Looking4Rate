/**
 * @fileoverview Tests para CustomValidators
 * 
 * Suite de pruebas para validadores síncronos personalizados.
 */

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from './custom.validators';

describe('CustomValidators', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('strongPassword', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.strongPassword());
    });

    it('debería ser válido con contraseña fuerte', () => {
      control.setValue('Password1!');
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido sin mayúsculas', () => {
      control.setValue('password1!');
      expect(control.invalid).toBeTrue();
      expect(control.errors?.['strongPassword']?.['noUppercase']).toBeTrue();
    });

    it('debería ser inválido sin minúsculas', () => {
      control.setValue('PASSWORD1!');
      expect(control.invalid).toBeTrue();
      expect(control.errors?.['strongPassword']?.['noLowercase']).toBeTrue();
    });

    it('debería ser inválido sin números', () => {
      control.setValue('Password!');
      expect(control.invalid).toBeTrue();
      expect(control.errors?.['strongPassword']?.['noNumber']).toBeTrue();
    });

    it('debería ser inválido sin caracteres especiales', () => {
      control.setValue('Password1');
      expect(control.invalid).toBeTrue();
      expect(control.errors?.['strongPassword']?.['noSpecialChar']).toBeTrue();
    });

    it('debería ser inválido si es muy corta', () => {
      control.setValue('Pa1!');
      expect(control.invalid).toBeTrue();
      expect(control.errors?.['strongPassword']?.['minLength']).toBeDefined();
    });

    it('debería retornar null para campo vacío (dejar que required maneje)', () => {
      control.setValue('');
      expect(control.errors).toBeNull();
    });

    it('debería aceptar varios caracteres especiales', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
      
      specialChars.forEach(char => {
        control.setValue(`Password1${char}`);
        expect(control.valid).withContext(`Debería aceptar ${char}`).toBeTrue();
      });
    });
  });

  describe('passwordComplexity', () => {
    it('debería validar nivel 1 (solo longitud)', () => {
      const control = new FormControl('', CustomValidators.passwordComplexity(1));
      control.setValue('abcdef');
      expect(control.valid).toBeTrue();
    });

    it('debería validar nivel 2 (longitud + mayúsculas/minúsculas)', () => {
      const control = new FormControl('', CustomValidators.passwordComplexity(2));
      control.setValue('Abcdef');
      expect(control.valid).toBeTrue();
      
      control.setValue('abcdef');
      expect(control.invalid).toBeTrue();
    });

    it('debería validar nivel 3 (nivel 2 + números)', () => {
      const control = new FormControl('', CustomValidators.passwordComplexity(3));
      control.setValue('Abcdef1');
      expect(control.valid).toBeTrue();
      
      control.setValue('Abcdef');
      expect(control.invalid).toBeTrue();
    });

    it('debería validar nivel 4 (nivel 3 + caracteres especiales)', () => {
      const control = new FormControl('', CustomValidators.passwordComplexity(4));
      control.setValue('Abcdef1!');
      expect(control.valid).toBeTrue();
      
      control.setValue('Abcdef1');
      expect(control.invalid).toBeTrue();
    });

    it('debería incluir mensaje de nivel', () => {
      const control = new FormControl('', CustomValidators.passwordComplexity(3));
      control.setValue('abc');
      expect(control.errors?.['passwordComplexity']?.['message']).toBeDefined();
    });
  });

  describe('passwordMatch', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = fb.group({
        password: [''],
        confirmPassword: ['']
      }, {
        validators: CustomValidators.passwordMatch('password', 'confirmPassword')
      });
    });

    it('debería ser válido si las contraseñas coinciden', () => {
      form.patchValue({
        password: 'Password1!',
        confirmPassword: 'Password1!'
      });
      expect(form.valid).toBeTrue();
    });

    it('debería ser inválido si las contraseñas no coinciden', () => {
      form.patchValue({
        password: 'Password1!',
        confirmPassword: 'Different1!'
      });
      expect(form.errors?.['passwordMismatch']).toBeTrue();
    });

    it('debería ser válido si ambos campos están vacíos', () => {
      form.patchValue({
        password: '',
        confirmPassword: ''
      });
      expect(form.errors).toBeNull();
    });

    it('debería establecer error en campo de confirmación', () => {
      form.patchValue({
        password: 'Password1!',
        confirmPassword: 'Different1!'
      });
      
      const confirmControl = form.get('confirmPassword');
      expect(confirmControl?.errors?.['passwordMismatch']).toBeTrue();
    });

    it('debería limpiar error cuando coinciden', () => {
      form.patchValue({
        password: 'Password1!',
        confirmPassword: 'Different1!'
      });
      
      form.patchValue({
        confirmPassword: 'Password1!'
      });
      
      const confirmControl = form.get('confirmPassword');
      expect(confirmControl?.errors?.['passwordMismatch']).toBeFalsy();
    });
  });

  describe('fieldsMatch', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = fb.group({
        email: [''],
        confirmEmail: ['']
      }, {
        validators: CustomValidators.fieldsMatch('email', 'confirmEmail', 'emailMismatch')
      });
    });

    it('debería ser válido si los campos coinciden', () => {
      form.patchValue({
        email: 'test@email.com',
        confirmEmail: 'test@email.com'
      });
      expect(form.valid).toBeTrue();
    });

    it('debería ser inválido si los campos no coinciden', () => {
      form.patchValue({
        email: 'test@email.com',
        confirmEmail: 'other@email.com'
      });
      expect(form.errors?.['emailMismatch']).toBeDefined();
    });

    it('debería usar nombre de error personalizado', () => {
      form.patchValue({
        email: 'test@email.com',
        confirmEmail: 'other@email.com'
      });
      expect(form.errors?.['emailMismatch'].field1).toBe('email');
      expect(form.errors?.['emailMismatch'].field2).toBe('confirmEmail');
    });
  });

  describe('nif', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.nif());
    });

    it('debería validar NIF correcto', () => {
      control.setValue('12345678Z');
      expect(control.valid).toBeTrue();
    });

    it('debería validar NIE correcto con X', () => {
      control.setValue('X1234567L');
      expect(control.valid).toBeTrue();
    });

    it('debería validar NIE correcto con Y', () => {
      control.setValue('Y1234567X');
      expect(control.valid).toBeTrue();
    });

    it('debería validar NIE correcto con Z', () => {
      control.setValue('Z1234567R');
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido con formato incorrecto', () => {
      control.setValue('1234567');
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido con letra incorrecta', () => {
      control.setValue('12345678A');
      expect(control.invalid).toBeTrue();
    });

    it('debería aceptar minúsculas', () => {
      control.setValue('12345678z');
      expect(control.valid).toBeTrue();
    });
  });

  describe('spanishPhone', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.spanishPhone());
    });

    it('debería validar teléfono móvil español', () => {
      control.setValue('612345678');
      expect(control.valid).toBeTrue();
    });

    it('debería validar teléfono fijo español', () => {
      control.setValue('912345678');
      expect(control.valid).toBeTrue();
    });

    it('debería validar con prefijo +34', () => {
      control.setValue('+34612345678');
      expect(control.valid).toBeTrue();
    });

    it('debería validar con prefijo 0034', () => {
      control.setValue('0034612345678');
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido con formato incorrecto', () => {
      control.setValue('1234567');
      expect(control.invalid).toBeTrue();
    });

    it('debería ignorar espacios', () => {
      control.setValue('612 345 678');
      expect(control.valid).toBeTrue();
    });
  });

  describe('spanishPostalCode', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.spanishPostalCode());
    });

    it('debería validar código postal válido', () => {
      control.setValue('28001');
      expect(control.valid).toBeTrue();
    });

    it('debería validar código postal con provincia baja', () => {
      control.setValue('01001');
      expect(control.valid).toBeTrue();
    });

    it('debería validar código postal con provincia alta', () => {
      control.setValue('52001');
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido con provincia > 52', () => {
      control.setValue('53001');
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido con menos de 5 dígitos', () => {
      control.setValue('2800');
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido con letras', () => {
      control.setValue('28A01');
      expect(control.invalid).toBeTrue();
    });
  });

  describe('url', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.url());
    });

    it('debería validar URL con http', () => {
      control.setValue('http://example.com');
      expect(control.valid).toBeTrue();
    });

    it('debería validar URL con https', () => {
      control.setValue('https://example.com');
      expect(control.valid).toBeTrue();
    });

    it('debería validar URL con path', () => {
      control.setValue('https://example.com/path/to/resource');
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido sin protocolo', () => {
      control.setValue('example.com');
      expect(control.invalid).toBeTrue();
    });
  });

  describe('minAge', () => {
    let control: FormControl;

    it('debería validar edad mayor al mínimo', () => {
      control = new FormControl('', CustomValidators.minAge(18));
      const adultBirthDate = new Date();
      adultBirthDate.setFullYear(adultBirthDate.getFullYear() - 20);
      control.setValue(adultBirthDate.toISOString().split('T')[0]);
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido para edad menor al mínimo', () => {
      control = new FormControl('', CustomValidators.minAge(18));
      const minorBirthDate = new Date();
      minorBirthDate.setFullYear(minorBirthDate.getFullYear() - 15);
      control.setValue(minorBirthDate.toISOString().split('T')[0]);
      expect(control.invalid).toBeTrue();
    });

    it('debería aceptar valor vacío', () => {
      control = new FormControl('', CustomValidators.minAge(18));
      control.setValue('');
      expect(control.valid).toBeTrue();
    });
  });

  describe('range', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.range(1, 10));
    });

    it('debería validar número dentro del rango', () => {
      control.setValue(5);
      expect(control.valid).toBeTrue();
    });

    it('debería validar valor en el límite inferior', () => {
      control.setValue(1);
      expect(control.valid).toBeTrue();
    });

    it('debería validar valor en el límite superior', () => {
      control.setValue(10);
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido debajo del rango', () => {
      control.setValue(0);
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido encima del rango', () => {
      control.setValue(11);
      expect(control.invalid).toBeTrue();
    });
  });

  describe('username', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', CustomValidators.username());
    });

    it('debería validar username válido', () => {
      control.setValue('usuario123');
      expect(control.valid).toBeTrue();
    });

    it('debería validar username con guiones', () => {
      control.setValue('user-name_123');
      expect(control.valid).toBeTrue();
    });

    it('debería ser inválido con menos de 3 caracteres', () => {
      control.setValue('ab');
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido con más de 20 caracteres', () => {
      control.setValue('a'.repeat(21));
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido si empieza con guión', () => {
      control.setValue('-username');
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido si termina con guión', () => {
      control.setValue('username_');
      expect(control.invalid).toBeTrue();
    });

    it('debería ser inválido con caracteres especiales', () => {
      control.setValue('user@name');
      expect(control.invalid).toBeTrue();
    });
  });
});
