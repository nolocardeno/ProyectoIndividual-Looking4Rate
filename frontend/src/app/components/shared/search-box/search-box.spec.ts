/**
 * @fileoverview Tests para SearchBox Component
 * 
 * Suite de pruebas para el componente de búsqueda.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SearchBox, SearchBoxVariant } from './search-box';

describe('SearchBox', () => {
  let component: SearchBox;
  let fixture: ComponentFixture<SearchBox>;
  let library: FaIconLibrary;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBox]
    })
    .compileComponents();

    library = TestBed.inject(FaIconLibrary);
    library.addIcons(faSearch, faTimes);

    fixture = TestBed.createComponent(SearchBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería tener valores por defecto', () => {
      expect(component.placeholder).toBe('Buscar...');
      expect(component.value).toBe('');
      expect(component.variant).toBe('default');
      expect(component.debounceMs).toBe(300);
    });
  });

  describe('Inputs', () => {
    it('debería aceptar placeholder personalizado', () => {
      component.placeholder = 'Buscar juegos...';
      fixture.detectChanges();
      
      const input = fixture.nativeElement.querySelector('input');
      expect(input?.placeholder).toBe('Buscar juegos...');
    });

    it('debería aceptar valor inicial', () => {
      component.value = 'zelda';
      fixture.detectChanges();
      
      expect(component.value).toBe('zelda');
    });

    it('debería aceptar variante icon-only', () => {
      component.variant = 'icon-only';
      fixture.detectChanges();
      
      expect(component.variant).toBe('icon-only');
    });

    it('debería aceptar debounce personalizado', () => {
      component.debounceMs = 500;
      expect(component.debounceMs).toBe(500);
    });
  });

  describe('Eventos', () => {
    it('debería emitir search al enviar formulario', () => {
      spyOn(component.search, 'emit');
      component.value = 'mario';

      component.onSearch();

      expect(component.search.emit).toHaveBeenCalledWith('mario');
    });

    it('no debería emitir search si el valor está vacío', () => {
      spyOn(component.search, 'emit');
      component.value = '   ';

      component.onSearch();

      expect(component.search.emit).not.toHaveBeenCalled();
    });

    it('debería emitir valueChange al cambiar input', () => {
      spyOn(component.valueChange, 'emit');
      component.value = 'nuevo valor';

      component.onInputChange();

      expect(component.valueChange.emit).toHaveBeenCalledWith('nuevo valor');
    });

    it('debería emitir iconClick en variante icon-only', () => {
      spyOn(component.iconClick, 'emit');
      component.variant = 'icon-only';

      component.onSearch();

      expect(component.iconClick.emit).toHaveBeenCalled();
    });
  });

  describe('Debounce', () => {
    it('debería aplicar debounce a la búsqueda', fakeAsync(() => {
      spyOn(component.search, 'emit');
      component.value = 'test';

      component.onInputChange();
      
      // No debería emitir inmediatamente
      expect(component.search.emit).not.toHaveBeenCalled();

      tick(350); // Esperar más que el debounce

      expect(component.search.emit).toHaveBeenCalledWith('test');
    }));

    it('debería cancelar emisiones anteriores con cambios rápidos', fakeAsync(() => {
      spyOn(component.search, 'emit');

      component.value = 'a';
      component.onInputChange();
      tick(100);

      component.value = 'ab';
      component.onInputChange();
      tick(100);

      component.value = 'abc';
      component.onInputChange();
      tick(350);

      // Solo debería emitir el último valor
      expect(component.search.emit).toHaveBeenCalledTimes(1);
      expect(component.search.emit).toHaveBeenCalledWith('abc');
    }));

    it('debería emitir solo valores distintos', fakeAsync(() => {
      spyOn(component.search, 'emit');

      component.value = 'test';
      component.onInputChange();
      tick(350);

      component.value = 'test'; // Mismo valor
      component.onInputChange();
      tick(350);

      expect(component.search.emit).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Variantes', () => {
    it('variante default debería mostrar input', () => {
      component.variant = 'default';
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input).toBeTruthy();
    });

    it('variante icon-only no debería procesar búsqueda de texto', () => {
      spyOn(component.search, 'emit');
      component.variant = 'icon-only';
      component.value = 'texto';

      component.onSearch();

      expect(component.search.emit).not.toHaveBeenCalled();
    });
  });

  describe('Limpieza', () => {
    it('debería limpiar suscripciones en ngOnDestroy', fakeAsync(() => {
      component.ngOnDestroy();
      
      // No debería fallar al emitir después de destruir
      expect(() => {
        component.value = 'test';
        component.onInputChange();
        tick(350);
      }).not.toThrow();
    }));
  });

  describe('Renderizado', () => {
    it('debería renderizar icono de búsqueda', () => {
      fixture.detectChanges();
      // El componente debería tener algún tipo de icono o form
      expect(fixture.nativeElement.querySelector('form, .search-box')).toBeTruthy();
    });
  });
});
