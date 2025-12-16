/**
 * @fileoverview Tests para Home Page
 * 
 * Suite de pruebas para la página principal.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { of, throwError } from 'rxjs';
import Home from './home';
import { JuegosService, EventBusService } from '../../services';
import { JuegoResumenDTO } from '../../models';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let juegosServiceSpy: jasmine.SpyObj<JuegosService>;
  let eventBusSpy: jasmine.SpyObj<EventBusService>;

  const mockJuegos: JuegoResumenDTO[] = [
    {
      id: 1,
      nombre: 'Test Game 1',
      imagenPortada: 'cover1.jpg',
      fechaSalida: '2024-01-15',
      puntuacionMedia: 8.5
    },
    {
      id: 2,
      nombre: 'Test Game 2',
      imagenPortada: 'cover2.jpg',
      fechaSalida: '2024-02-20',
      puntuacionMedia: 7.0
    },
    {
      id: 3,
      nombre: 'Test Game 3',
      imagenPortada: 'cover3.jpg',
      fechaSalida: '2024-03-10',
      puntuacionMedia: 9.0
    }
  ];

  beforeEach(async () => {
    juegosServiceSpy = jasmine.createSpyObj('JuegosService', ['getNovedades', 'getAll']);
    eventBusSpy = jasmine.createSpyObj('EventBusService', ['emit', 'on']);

    juegosServiceSpy.getNovedades.and.returnValue(of(mockJuegos));
    juegosServiceSpy.getAll.and.returnValue(of(mockJuegos));

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: JuegosService, useValue: juegosServiceSpy },
        { provide: EventBusService, useValue: eventBusSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería iniciar con estados de carga', () => {
      expect(component.novedadesLoading()).toBeTrue();
      expect(component.proximosLoading()).toBeTrue();
    });

    it('debería iniciar con datos vacíos', () => {
      expect(component.novedadesData()).toEqual([]);
      expect(component.proximosData()).toEqual([]);
    });
  });

  describe('ngOnInit', () => {
    it('debería cargar novedades al inicializar', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(juegosServiceSpy.getNovedades).toHaveBeenCalled();
    }));

    it('debería cargar próximos lanzamientos al inicializar', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(juegosServiceSpy.getAll).toHaveBeenCalled();
    }));
  });

  describe('cargarNovedades', () => {
    it('debería actualizar estado con datos recibidos', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.novedadesLoading()).toBeFalse();
      expect(component.novedadesError()).toBeNull();
      expect(component.novedadesData().length).toBeGreaterThan(0);
    }));

    it('debería limitar a 5 juegos', fakeAsync(() => {
      const muchasNovedades = Array(10).fill(null).map((_, i) => ({
        id: i,
        nombre: `Game ${i}`,
        imagenPortada: `cover${i}.jpg`,
        fechaSalida: '2024-01-01',
        puntuacionMedia: 8.0
      }));

      juegosServiceSpy.getNovedades.and.returnValue(of(muchasNovedades));
      fixture.detectChanges();
      tick();

      expect(component.novedadesData().length).toBeLessThanOrEqual(5);
    }));

    it('debería manejar error correctamente', fakeAsync(() => {
      juegosServiceSpy.getNovedades.and.returnValue(
        throwError(() => ({ userMessage: 'Error de prueba' }))
      );
      
      fixture.detectChanges();
      tick();

      expect(component.novedadesLoading()).toBeFalse();
      expect(component.novedadesError()).toBeTruthy();
      expect(component.novedadesData()).toEqual([]);
    }));

    it('debería mostrar mensaje de error genérico si no hay userMessage', fakeAsync(() => {
      juegosServiceSpy.getNovedades.and.returnValue(
        throwError(() => new Error('Error sin mensaje'))
      );
      
      fixture.detectChanges();
      tick();

      expect(component.novedadesError()).toContain('Error al cargar novedades');
    }));
  });

  describe('cargarProximosLanzamientos', () => {
    it('debería actualizar estado con datos recibidos', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.proximosLoading()).toBeFalse();
      expect(component.proximosError()).toBeNull();
    }));

    it('debería tomar los últimos 5 juegos', fakeAsync(() => {
      const muchosJuegos = Array(10).fill(null).map((_, i) => ({
        id: i,
        nombre: `Game ${i}`,
        imagenPortada: `cover${i}.jpg`,
        fechaSalida: '2024-01-01',
        puntuacionMedia: 8.0
      }));

      juegosServiceSpy.getAll.and.returnValue(of(muchosJuegos));
      fixture.detectChanges();
      tick();

      expect(component.proximosData().length).toBeLessThanOrEqual(5);
    }));

    it('debería manejar error correctamente', fakeAsync(() => {
      juegosServiceSpy.getAll.and.returnValue(
        throwError(() => ({ userMessage: 'Error de prueba' }))
      );
      
      fixture.detectChanges();
      tick();

      expect(component.proximosLoading()).toBeFalse();
      expect(component.proximosError()).toBeTruthy();
    }));
  });

  describe('Computed signals', () => {
    it('novedadesData debería reflejar el estado interno', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const data = component.novedadesData();
      expect(data).toEqual(jasmine.arrayContaining([
        jasmine.objectContaining({ nombre: 'Test Game 1' })
      ]));
    }));

    it('novedadesLoading debería reflejar estado de carga', fakeAsync(() => {
      expect(component.novedadesLoading()).toBeTrue();
      
      fixture.detectChanges();
      tick();

      expect(component.novedadesLoading()).toBeFalse();
    }));

    it('novedadesError debería reflejar estado de error', fakeAsync(() => {
      juegosServiceSpy.getNovedades.and.returnValue(
        throwError(() => ({ userMessage: 'Error' }))
      );

      fixture.detectChanges();
      tick();

      expect(component.novedadesError()).toBe('Error');
    }));
  });

  describe('ngOnDestroy', () => {
    it('debería completar el subject de destrucción', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // No debería lanzar error al destruir
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    }));

    it('debería cancelar suscripciones pendientes', fakeAsync(() => {
      fixture.detectChanges();
      component.ngOnDestroy();
      tick();

      // No debería haber actualizaciones después de destruir
      expect(component.novedadesLoading()).toBeFalse();
    }));
  });

  describe('Renderizado (SSR)', () => {
    it('no debería cargar datos en SSR', async () => {
      // Recrear con PLATFORM_ID de servidor
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [Home],
        providers: [
          provideRouter([]),
          { provide: JuegosService, useValue: juegosServiceSpy },
          { provide: EventBusService, useValue: eventBusSpy },
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      }).compileComponents();

      const serverFixture = TestBed.createComponent(Home);
      const serverComponent = serverFixture.componentInstance;
      serverFixture.detectChanges();

      expect(juegosServiceSpy.getNovedades).not.toHaveBeenCalled();
    });
  });

  describe('Integración con secciones', () => {
    it('debería mostrar sección de novedades', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      // Verificar que existe contenido
      expect(compiled.querySelector('.home, main, section')).toBeTruthy();
    }));
  });
});
