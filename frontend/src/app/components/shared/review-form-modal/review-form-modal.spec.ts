/**
 * @fileoverview Tests para ReviewFormModal Component
 * 
 * Suite de pruebas unitarias para el componente de modal de reviews.
 * Incluye tests de estado del modal, validaciones y comportamiento.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID, SimpleChange, SimpleChanges } from '@angular/core';
import { ReviewFormModal } from './review-form-modal';

describe('ReviewFormModal', () => {
  let component: ReviewFormModal;
  let fixture: ComponentFixture<ReviewFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormModal],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ========================================
  // TESTS DE CREACIÓN Y ESTADO INICIAL
  // ========================================

  describe('Creación y estado inicial', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería iniciar con modal cerrado', () => {
      expect(component.isOpen).toBeFalse();
    });

    it('debería iniciar con texto de review vacío', () => {
      expect(component.reviewText).toBe('');
    });

    it('debería iniciar sin loading', () => {
      expect(component.loading).toBeFalse();
    });

    it('debería tener título de juego vacío por defecto', () => {
      expect(component.gameTitle).toBe('');
    });

    it('debería tener carátula vacía por defecto', () => {
      expect(component.gameCover).toBe('');
    });

    it('debería tener año vacío por defecto', () => {
      expect(component.gameYear).toBe('');
    });

    it('debería tener existingReview null por defecto', () => {
      expect(component.existingReview).toBeNull();
    });
  });

  // ========================================
  // TESTS DE INPUTS
  // ========================================

  describe('Inputs', () => {
    it('debería aceptar título de juego', () => {
      component.gameTitle = 'The Legend of Zelda';
      fixture.detectChanges();

      expect(component.gameTitle).toBe('The Legend of Zelda');
    });

    it('debería aceptar carátula de juego', () => {
      component.gameCover = 'zelda-cover.jpg';
      fixture.detectChanges();

      expect(component.gameCover).toBe('zelda-cover.jpg');
    });

    it('debería aceptar año de juego como string', () => {
      component.gameYear = '2017';
      fixture.detectChanges();

      expect(component.gameYear).toBe('2017');
    });

    it('debería aceptar año de juego como número', () => {
      component.gameYear = 2017;
      fixture.detectChanges();

      expect(component.gameYear).toBe(2017);
    });

    it('debería aceptar review existente', () => {
      component.existingReview = 'Esta es una review existente';
      fixture.detectChanges();

      expect(component.existingReview).toBe('Esta es una review existente');
    });

    it('debería aceptar estado de loading', () => {
      component.loading = true;
      fixture.detectChanges();

      expect(component.loading).toBeTrue();
    });
  });

  // ========================================
  // TESTS DE ngOnChanges
  // ========================================

  describe('ngOnChanges', () => {
    it('debería actualizar reviewText cuando se abre el modal', () => {
      component.existingReview = 'Review existente';
      
      const changes: SimpleChanges = {
        isOpen: new SimpleChange(false, true, false)
      };
      component.isOpen = true;
      component.ngOnChanges(changes);

      expect(component.reviewText).toBe('Review existente');
    });

    it('debería limpiar reviewText si no hay review existente al abrir', () => {
      component.existingReview = null;
      component.reviewText = 'texto anterior';
      
      const changes: SimpleChanges = {
        isOpen: new SimpleChange(false, true, false)
      };
      component.isOpen = true;
      component.ngOnChanges(changes);

      expect(component.reviewText).toBe('');
    });

    it('debería actualizar reviewText cuando cambia existingReview con modal abierto', () => {
      component.isOpen = true;
      
      const changes: SimpleChanges = {
        existingReview: new SimpleChange(null, 'Nueva review', false)
      };
      component.existingReview = 'Nueva review';
      component.ngOnChanges(changes);

      expect(component.reviewText).toBe('Nueva review');
    });
  });

  // ========================================
  // TESTS DE canSubmit
  // ========================================

  describe('canSubmit', () => {
    it('debería poder enviar si hay texto de review', () => {
      component.reviewText = 'Esta es una review válida';
      
      expect(component.canSubmit).toBeTrue();
    });

    it('no debería poder enviar si el texto está vacío', () => {
      component.reviewText = '';
      
      expect(component.canSubmit).toBeFalse();
    });

    it('no debería poder enviar si el texto tiene solo espacios', () => {
      component.reviewText = '   ';
      
      expect(component.canSubmit).toBeFalse();
    });

    it('no debería poder enviar si el texto tiene solo tabs y newlines', () => {
      component.reviewText = '\t\n  \t';
      
      expect(component.canSubmit).toBeFalse();
    });
  });

  // ========================================
  // TESTS DE CIERRE DEL MODAL
  // ========================================

  describe('Cierre del modal', () => {
    it('debería emitir evento close al cerrar', () => {
      const closeSpy = spyOn(component.close, 'emit');
      
      component.closeModal();
      
      expect(closeSpy).toHaveBeenCalled();
    });

    it('debería cerrar al hacer click en overlay', () => {
      const closeSpy = spyOn(component, 'closeModal');
      const targetElement = {};
      const mockEvent = {
        target: targetElement,
        currentTarget: targetElement
      } as Event;
      
      component.onOverlayClick(mockEvent);
      
      expect(closeSpy).toHaveBeenCalled();
    });

    it('no debería cerrar si el click no es en el overlay', () => {
      const closeSpy = spyOn(component, 'closeModal');
      const differentTarget = { different: true };
      const mockEvent = {
        target: {},
        currentTarget: differentTarget
      } as unknown as Event;
      
      component.onOverlayClick(mockEvent);
      
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('debería detener propagación en click del modal', () => {
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as unknown as Event;
      
      component.onModalClick(mockEvent);
      
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  // ========================================
  // TESTS DE ACCESIBILIDAD (TECLADO)
  // ========================================

  describe('Accesibilidad - Teclado', () => {
    it('debería cerrar con tecla Escape', () => {
      component.isOpen = true;
      const closeSpy = spyOn(component, 'closeModal');
      
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      Object.defineProperty(event, 'preventDefault', { value: jasmine.createSpy() });
      Object.defineProperty(event, 'stopPropagation', { value: jasmine.createSpy() });
      
      component.onKeyDown(event);
      
      expect(closeSpy).toHaveBeenCalled();
    });

    it('no debería procesar teclas si el modal está cerrado', () => {
      component.isOpen = false;
      const closeSpy = spyOn(component, 'closeModal');
      
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('debería manejar la tecla Tab', () => {
      component.isOpen = true;
      
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      // No debería lanzar error
      expect(() => component.onKeyDown(event)).not.toThrow();
    });
  });

  // ========================================
  // TESTS DE ENVÍO DE REVIEW
  // ========================================

  describe('Envío de review', () => {
    it('debería emitir reviewSubmit con el texto', () => {
      const submitSpy = spyOn(component.reviewSubmit, 'emit');
      component.reviewText = 'Esta es mi review del juego';
      
      component.reviewSubmit.emit(component.reviewText);
      
      expect(submitSpy).toHaveBeenCalledWith('Esta es mi review del juego');
    });

    it('debería poder enviar review larga', () => {
      const reviewLarga = 'Este es un texto de review muy largo. '.repeat(50);
      component.reviewText = reviewLarga;
      
      expect(component.canSubmit).toBeTrue();
      expect(component.reviewText.length).toBeGreaterThan(1000);
    });

    it('debería poder enviar review con caracteres especiales', () => {
      component.reviewText = '¡Excelente juego! 10/10 ⭐🎮 <script>alert()</script>';
      
      expect(component.canSubmit).toBeTrue();
    });

    it('debería poder enviar review con emojis', () => {
      component.reviewText = '🎮 Un juego increíble 🌟';
      
      expect(component.canSubmit).toBeTrue();
    });

    it('debería poder enviar review con saltos de línea', () => {
      component.reviewText = 'Primera línea\nSegunda línea\nTercera línea';
      
      expect(component.canSubmit).toBeTrue();
    });
  });

  // ========================================
  // TESTS DE OUTPUTS
  // ========================================

  describe('Outputs', () => {
    it('debería tener EventEmitter para close', () => {
      expect(component.close).toBeDefined();
      expect(component.close.observed).toBeDefined();
    });

    it('debería tener EventEmitter para reviewSubmit', () => {
      expect(component.reviewSubmit).toBeDefined();
      expect(component.reviewSubmit.observed).toBeDefined();
    });
  });

  // ========================================
  // TESTS DE CICLO DE VIDA
  // ========================================

  describe('Ciclo de vida', () => {
    it('debería manejar ngAfterViewChecked sin errores', () => {
      component.isOpen = true;
      expect(() => component.ngAfterViewChecked()).not.toThrow();
    });

    it('debería resetear hasSetInitialFocus cuando se cierra', () => {
      component.isOpen = true;
      component.ngAfterViewChecked();
      
      component.isOpen = false;
      component.ngAfterViewChecked();
      
      // No debería lanzar errores al volver a abrir
      component.isOpen = true;
      expect(() => component.ngAfterViewChecked()).not.toThrow();
    });
  });

  // ========================================
  // TESTS DE EDICIÓN DE REVIEW
  // ========================================

  describe('Edición de review', () => {
    it('debería mostrar review existente al editar', () => {
      component.existingReview = 'Mi review anterior';
      component.isOpen = true;
      
      const changes: SimpleChanges = {
        isOpen: new SimpleChange(false, true, false)
      };
      component.ngOnChanges(changes);
      
      expect(component.reviewText).toBe('Mi review anterior');
    });

    it('debería permitir modificar review existente', () => {
      component.existingReview = 'Review original';
      component.isOpen = true;
      
      const changes: SimpleChanges = {
        isOpen: new SimpleChange(false, true, false)
      };
      component.ngOnChanges(changes);
      
      // Simular que el usuario modifica el texto
      component.reviewText = 'Review modificada';
      
      expect(component.reviewText).toBe('Review modificada');
      expect(component.canSubmit).toBeTrue();
    });
  });

  // ========================================
  // TESTS DE ESTADO LOADING
  // ========================================

  describe('Estado loading', () => {
    it('debería reflejar estado de loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      expect(component.loading).toBeTrue();
    });

    it('debería permitir cambiar loading', () => {
      component.loading = false;
      expect(component.loading).toBeFalse();
      
      component.loading = true;
      expect(component.loading).toBeTrue();
    });
  });
});
