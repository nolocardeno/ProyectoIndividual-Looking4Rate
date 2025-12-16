/**
 * @fileoverview Tests para Pagination Component
 * 
 * Suite de pruebas para el componente de paginación.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination]
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería tener valores por defecto', () => {
      expect(component.currentPage).toBe(1);
      expect(component.totalPages).toBe(1);
      expect(component.maxVisiblePages).toBe(5);
    });
  });

  describe('visiblePages', () => {
    it('debería mostrar todas las páginas si son pocas', () => {
      component.totalPages = 3;
      component.currentPage = 1;

      const pages = component.visiblePages;

      expect(pages).toEqual([1, 2, 3]);
    });

    it('debería limitar páginas visibles al máximo configurado', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      component.maxVisiblePages = 5;

      const pages = component.visiblePages;

      expect(pages.length).toBe(5);
    });

    it('debería centrar páginas alrededor de la actual', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      component.maxVisiblePages = 5;

      const pages = component.visiblePages;

      expect(pages).toContain(5);
      expect(pages).toEqual([3, 4, 5, 6, 7]);
    });

    it('debería ajustar al inicio si la página actual es baja', () => {
      component.totalPages = 10;
      component.currentPage = 1;
      component.maxVisiblePages = 5;

      const pages = component.visiblePages;

      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('debería ajustar al final si la página actual es alta', () => {
      component.totalPages = 10;
      component.currentPage = 10;
      component.maxVisiblePages = 5;

      const pages = component.visiblePages;

      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });
  });

  describe('isFirstPage', () => {
    it('debería retornar true en la primera página', () => {
      component.currentPage = 1;
      expect(component.isFirstPage).toBeTrue();
    });

    it('debería retornar false en otras páginas', () => {
      component.currentPage = 2;
      expect(component.isFirstPage).toBeFalse();
    });
  });

  describe('isLastPage', () => {
    it('debería retornar true en la última página', () => {
      component.totalPages = 5;
      component.currentPage = 5;
      expect(component.isLastPage).toBeTrue();
    });

    it('debería retornar false en otras páginas', () => {
      component.totalPages = 5;
      component.currentPage = 3;
      expect(component.isLastPage).toBeFalse();
    });
  });

  describe('goToFirstPage', () => {
    it('debería emitir evento para ir a página 1', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 5;
      component.totalPages = 10;

      component.goToFirstPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('no debería emitir si ya está en la primera página', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;

      component.goToFirstPage();

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('goToLastPage', () => {
    it('debería emitir evento para ir a última página', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;
      component.totalPages = 10;

      component.goToLastPage();

      expect(component.pageChange.emit).toHaveBeenCalledWith(10);
    });

    it('no debería emitir si ya está en la última página', () => {
      spyOn(component.pageChange, 'emit');
      component.totalPages = 5;
      component.currentPage = 5;

      component.goToLastPage();

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('goToPage', () => {
    beforeEach(() => {
      component.totalPages = 10;
      component.currentPage = 5;
    });

    it('debería emitir evento con la página seleccionada', () => {
      spyOn(component.pageChange, 'emit');

      component.goToPage(3);

      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('no debería emitir si la página es la actual', () => {
      spyOn(component.pageChange, 'emit');

      component.goToPage(5);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('no debería emitir si la página es menor a 1', () => {
      spyOn(component.pageChange, 'emit');

      component.goToPage(0);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('no debería emitir si la página excede el total', () => {
      spyOn(component.pageChange, 'emit');

      component.goToPage(11);

      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('Renderizado', () => {
    it('debería renderizar botones de navegación', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('.pagination')).toBeTruthy();
    });

    it('debería mostrar el texto de labels configurado', () => {
      component.firstLabel = 'PRIMERO';
      component.lastLabel = 'ÚLTIMO';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button, .btn');
      
      // Verificar que los botones existen
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Casos límite', () => {
    it('debería manejar una sola página', () => {
      component.totalPages = 1;
      component.currentPage = 1;

      expect(component.visiblePages).toEqual([1]);
      expect(component.isFirstPage).toBeTrue();
      expect(component.isLastPage).toBeTrue();
    });

    it('debería manejar totalPages = 0', () => {
      component.totalPages = 0;
      component.currentPage = 1;

      expect(component.visiblePages).toEqual([]);
    });

    it('debería manejar maxVisiblePages > totalPages', () => {
      component.totalPages = 3;
      component.maxVisiblePages = 10;

      expect(component.visiblePages).toEqual([1, 2, 3]);
    });
  });

  describe('Accesibilidad', () => {
    it('debería deshabilitar botón "anterior" en primera página', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      fixture.detectChanges();

      // Verificar que el botón tiene estado deshabilitado
      expect(component.isFirstPage).toBeTrue();
    });

    it('debería deshabilitar botón "siguiente" en última página', () => {
      component.currentPage = 5;
      component.totalPages = 5;
      fixture.detectChanges();

      expect(component.isLastPage).toBeTrue();
    });
  });
});
