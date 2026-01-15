/**
 * @fileoverview Tests para StarRating Component
 * 
 * Suite de pruebas unitarias para el componente de puntuación con estrellas.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  let component: StarRating;
  let fixture: ComponentFixture<StarRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRating]
    }).compileComponents();

    fixture = TestBed.createComponent(StarRating);
    component = fixture.componentInstance;
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('debería tener valores por defecto correctos', () => {
      expect(component.rating).toBeNull();
      expect(component.maxStars).toBe(5);
      expect(component.readonly).toBeFalse();
      expect(component.size).toBe('md');
      expect(component.hoverRating).toBeNull();
    });
  });

  describe('Array de estrellas', () => {
    it('debería generar 5 estrellas por defecto', () => {
      expect(component.stars).toEqual([1, 2, 3, 4, 5]);
    });

    it('debería generar número configurable de estrellas', () => {
      component.maxStars = 10;
      expect(component.stars).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('debería generar 3 estrellas si se configura', () => {
      component.maxStars = 3;
      expect(component.stars).toEqual([1, 2, 3]);
    });
  });

  describe('displayRating', () => {
    it('debería mostrar 0 si no hay rating ni hover', () => {
      expect(component.displayRating).toBe(0);
    });

    it('debería mostrar rating si está definido', () => {
      component.rating = 3;
      expect(component.displayRating).toBe(3);
    });

    it('debería priorizar hover sobre rating', () => {
      component.rating = 3;
      component.hoverRating = 5;
      expect(component.displayRating).toBe(5);
    });

    it('debería mostrar hover aunque rating sea null', () => {
      component.hoverRating = 4;
      expect(component.displayRating).toBe(4);
    });
  });

  describe('isStarActive', () => {
    it('debería retornar false para todas si rating es 0', () => {
      expect(component.isStarActive(1)).toBeFalse();
      expect(component.isStarActive(5)).toBeFalse();
    });

    it('debería retornar true para estrellas <= rating', () => {
      component.rating = 3;
      expect(component.isStarActive(1)).toBeTrue();
      expect(component.isStarActive(2)).toBeTrue();
      expect(component.isStarActive(3)).toBeTrue();
      expect(component.isStarActive(4)).toBeFalse();
      expect(component.isStarActive(5)).toBeFalse();
    });

    it('debería usar hover para determinar activo', () => {
      component.rating = 2;
      component.hoverRating = 4;
      expect(component.isStarActive(3)).toBeTrue();
      expect(component.isStarActive(4)).toBeTrue();
      expect(component.isStarActive(5)).toBeFalse();
    });
  });

  describe('isStarHovered', () => {
    it('debería retornar false si no hay hover', () => {
      expect(component.isStarHovered(1)).toBeFalse();
      expect(component.isStarHovered(5)).toBeFalse();
    });

    it('debería retornar true para estrellas <= hoverRating', () => {
      component.hoverRating = 3;
      expect(component.isStarHovered(1)).toBeTrue();
      expect(component.isStarHovered(2)).toBeTrue();
      expect(component.isStarHovered(3)).toBeTrue();
      expect(component.isStarHovered(4)).toBeFalse();
    });
  });

  describe('Interacción - Hover', () => {
    it('debería establecer hoverRating al hacer hover', () => {
      component.onStarHover(3);
      expect(component.hoverRating).toBe(3);
    });

    it('debería no establecer hover si es readonly', () => {
      component.readonly = true;
      component.onStarHover(3);
      expect(component.hoverRating).toBeNull();
    });

    it('debería limpiar hover al salir', () => {
      component.hoverRating = 3;
      component.onStarLeave();
      expect(component.hoverRating).toBeNull();
    });
  });

  describe('Interacción - Click', () => {
    it('debería emitir nuevo rating al hacer click', () => {
      spyOn(component.ratingChange, 'emit');
      
      component.onStarClick(4);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(4);
    });

    it('debería no emitir si es readonly', () => {
      spyOn(component.ratingChange, 'emit');
      component.readonly = true;
      
      component.onStarClick(4);
      
      expect(component.ratingChange.emit).not.toHaveBeenCalled();
    });

    it('debería emitir null al hacer click en la misma estrella', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 3;
      
      component.onStarClick(3);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(null);
    });
  });

  describe('Navegación por teclado', () => {
    it('debería incrementar rating con ArrowRight', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 2;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(3);
    });

    it('debería incrementar rating con ArrowUp', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 3;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(4);
    });

    it('debería decrementar rating con ArrowLeft', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 3;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(2);
    });

    it('debería decrementar rating con ArrowDown', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 4;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(3);
    });

    it('debería no incrementar más allá del máximo', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 5;
      component.maxStars = 5;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).not.toHaveBeenCalled();
    });

    it('debería no decrementar por debajo de 1', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 1;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).not.toHaveBeenCalled();
    });

    it('debería no responder a teclado si es readonly', () => {
      spyOn(component.ratingChange, 'emit');
      component.readonly = true;
      component.rating = 3;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).not.toHaveBeenCalled();
    });

    it('debería empezar desde 0 si no hay rating', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = null;
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).toHaveBeenCalledWith(1);
    });

    it('debería ignorar otras teclas', () => {
      spyOn(component.ratingChange, 'emit');
      component.rating = 3;
      
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);
      
      expect(component.ratingChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('Tamaños', () => {
    it('debería aceptar diferentes tamaños', () => {
      component.size = 'sm';
      expect(component.size).toBe('sm');

      component.size = 'base';
      expect(component.size).toBe('base');

      component.size = 'lg';
      expect(component.size).toBe('lg');
    });
  });
});
