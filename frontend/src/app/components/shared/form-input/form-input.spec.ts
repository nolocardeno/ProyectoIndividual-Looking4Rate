/**
 * @fileoverview Tests para FormInput Component
 * 
 * Suite de pruebas unitarias para el componente de input de formularios.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInput } from './form-input';

describe('FormInput', () => {
  let component: FormInput;
  let fixture: ComponentFixture<FormInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInput]
    }).compileComponents();

    fixture = TestBed.createComponent(FormInput);
    component = fixture.componentInstance;
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('debería tener valores por defecto', () => {
      expect(component.label).toBe('');
      expect(component.type).toBe('text');
      expect(component.name).toBe('');
      expect(component.placeholder).toBe('');
      expect(component.required).toBeFalse();
      expect(component.disabled).toBeFalse();
      expect(component.errorMessage).toBe('');
      expect(component.helpText).toBe('');
      expect(component.value).toBe('');
    });
  });

  describe('Propiedades de entrada', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería aceptar label', () => {
      component.label = 'Email';
      expect(component.label).toBe('Email');
    });

    it('debería aceptar tipo de input', () => {
      component.type = 'password';
      expect(component.type).toBe('password');
    });

    it('debería generar ID basado en name', () => {
      component.name = 'email';
      expect(component.id).toBe('input-email');
    });

    it('debería aceptar placeholder', () => {
      component.placeholder = 'Enter email...';
      expect(component.placeholder).toBe('Enter email...');
    });

    it('debería aceptar required', () => {
      component.required = true;
      expect(component.required).toBeTrue();
    });

    it('debería aceptar disabled', () => {
      component.disabled = true;
      expect(component.disabled).toBeTrue();
    });

    it('debería aceptar errorMessage', () => {
      component.errorMessage = 'Email inválido';
      expect(component.errorMessage).toBe('Email inválido');
    });

    it('debería aceptar helpText', () => {
      component.helpText = 'Introduce tu email';
      expect(component.helpText).toBe('Introduce tu email');
    });
  });

  describe('Eventos', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería emitir valueChange al cambiar el valor', () => {
      spyOn(component.valueChange, 'emit');
      const mockEvent = { target: { value: 'nuevo valor' } } as unknown as Event;
      
      component.onInputChange(mockEvent);
      
      expect(component.value).toBe('nuevo valor');
      expect(component.valueChange.emit).toHaveBeenCalledWith('nuevo valor');
    });

    it('debería emitir inputBlur al perder el foco', () => {
      spyOn(component.inputBlur, 'emit');
      
      component.onBlur();
      
      expect(component.inputBlur.emit).toHaveBeenCalled();
    });

    it('debería actualizar value internamente', () => {
      const mockEvent = { target: { value: 'test@email.com' } } as unknown as Event;
      
      component.onInputChange(mockEvent);
      
      expect(component.value).toBe('test@email.com');
    });
  });

  describe('ID generado', () => {
    it('debería generar ID único basado en name', () => {
      component.name = 'username';
      expect(component.id).toBe('input-username');

      component.name = 'password';
      expect(component.id).toBe('input-password');
    });

    it('debería manejar name vacío', () => {
      component.name = '';
      expect(component.id).toBe('input-');
    });
  });
});
