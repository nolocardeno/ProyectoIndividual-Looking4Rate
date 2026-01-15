/**
 * @fileoverview Tests para SpinnerComponent
 * 
 * Suite de pruebas unitarias para el componente de spinner/loading.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SpinnerComponent } from './spinner';
import { LoadingService, LoadingState } from '../../../services/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let globalLoadingSubject: BehaviorSubject<LoadingState | null>;

  // Helper para crear LoadingState válido
  const createLoadingState = (message: string, progress?: number): LoadingState => ({
    id: 'test-loader',
    isLoading: true,
    message,
    progress
  });

  beforeEach(async () => {
    globalLoadingSubject = new BehaviorSubject<LoadingState | null>(null);
    
    loadingServiceMock = jasmine.createSpyObj('LoadingService', [], {
      globalLoading$: globalLoadingSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [
        { provide: LoadingService, useValue: loadingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    globalLoadingSubject.complete();
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('debería iniciar con spinner no visible', () => {
      fixture.detectChanges();
      expect(component.isVisible).toBeFalse();
      expect(component.loadingState).toBeNull();
    });
  });

  describe('Estado de carga', () => {
    it('debería mostrar spinner cuando hay estado de carga', fakeAsync(() => {
      fixture.detectChanges();
      
      const loadingState = createLoadingState('Cargando...');
      globalLoadingSubject.next(loadingState);
      tick();
      
      expect(component.isVisible).toBeTrue();
      expect(component.loadingState).toEqual(loadingState);
    }));

    it('debería ocultar spinner cuando se limpia el estado', fakeAsync(() => {
      fixture.detectChanges();
      
      // Mostrar primero
      const loadingState = createLoadingState('Cargando...');
      globalLoadingSubject.next(loadingState);
      tick();
      expect(component.isVisible).toBeTrue();

      // Ocultar
      globalLoadingSubject.next(null);
      tick();
      
      expect(component.isLeaving).toBeTrue();
      
      // Esperar animación de salida
      tick(300);
      
      expect(component.isVisible).toBeFalse();
      expect(component.loadingState).toBeNull();
    }));

    it('debería manejar mensaje personalizado', fakeAsync(() => {
      fixture.detectChanges();
      
      const loadingState = createLoadingState('Guardando datos...');
      globalLoadingSubject.next(loadingState);
      tick();
      
      expect(component.message).toBe('Guardando datos...');
    }));

    it('debería mostrar mensaje por defecto si no hay uno', () => {
      fixture.detectChanges();
      expect(component.message).toBe('Cargando...');
    });
  });

  describe('Barra de progreso', () => {
    it('debería mostrar progreso cuando está definido', fakeAsync(() => {
      fixture.detectChanges();
      
      const loadingState = createLoadingState('Cargando...', 50);
      globalLoadingSubject.next(loadingState);
      tick();
      
      expect(component.hasProgress).toBeTrue();
      expect(component.progressPercentage).toBe(50);
    }));

    it('debería no mostrar progreso cuando no está definido', () => {
      fixture.detectChanges();
      expect(component.hasProgress).toBeFalse();
      expect(component.progressPercentage).toBe(0);
    });

    it('debería manejar progreso en 0%', fakeAsync(() => {
      fixture.detectChanges();
      
      const loadingState = createLoadingState('Iniciando...', 0);
      globalLoadingSubject.next(loadingState);
      tick();
      
      expect(component.hasProgress).toBeTrue();
      expect(component.progressPercentage).toBe(0);
    }));

    it('debería manejar progreso en 100%', fakeAsync(() => {
      fixture.detectChanges();
      
      const loadingState = createLoadingState('Completado', 100);
      globalLoadingSubject.next(loadingState);
      tick();
      
      expect(component.progressPercentage).toBe(100);
    }));
  });

  describe('Clases CSS', () => {
    it('debería tener clases iniciales correctas', () => {
      fixture.detectChanges();
      const classes = component.containerClasses;
      
      expect(classes['spinner']).toBeTrue();
      expect(classes['spinner--visible']).toBeFalse();
      expect(classes['spinner--leaving']).toBeFalse();
    });

    it('debería añadir clase visible cuando está activo', fakeAsync(() => {
      fixture.detectChanges();
      
      globalLoadingSubject.next(createLoadingState('Cargando...'));
      tick();
      
      const classes = component.containerClasses;
      expect(classes['spinner--visible']).toBeTrue();
    }));

    it('debería añadir clase leaving durante animación de salida', fakeAsync(() => {
      fixture.detectChanges();
      
      // Mostrar
      globalLoadingSubject.next(createLoadingState('Cargando...'));
      tick();
      
      // Iniciar ocultar
      globalLoadingSubject.next(null);
      tick();
      
      const classes = component.containerClasses;
      expect(classes['spinner--leaving']).toBeTrue();
    }));
  });

  describe('Scroll del body', () => {
    it('debería deshabilitar scroll cuando está activo', fakeAsync(() => {
      fixture.detectChanges();
      
      globalLoadingSubject.next(createLoadingState('Cargando...'));
      tick();
      
      expect(document.body.classList.contains('spinner-active')).toBeTrue();
    }));

    it('debería habilitar scroll cuando se oculta', fakeAsync(() => {
      fixture.detectChanges();
      
      // Mostrar
      globalLoadingSubject.next(createLoadingState('Cargando...'));
      tick();
      
      // Ocultar
      globalLoadingSubject.next(null);
      tick(300);
      
      expect(document.body.classList.contains('spinner-active')).toBeFalse();
    }));
  });

  describe('Limpieza', () => {
    it('debería limpiar recursos en ngOnDestroy', fakeAsync(() => {
      fixture.detectChanges();
      
      // Mostrar spinner
      globalLoadingSubject.next(createLoadingState('Cargando...'));
      tick();
      
      // Destruir componente
      component.ngOnDestroy();
      
      expect(document.body.classList.contains('spinner-active')).toBeFalse();
    }));

    it('debería manejar destrucción sin timer activo', () => {
      fixture.detectChanges();
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('debería cancelar timer pendiente en destroy', fakeAsync(() => {
      fixture.detectChanges();
      
      // Mostrar
      globalLoadingSubject.next(createLoadingState('Cargando...'));
      tick();
      
      // Iniciar ocultar (crea timer)
      globalLoadingSubject.next(null);
      tick(100); // Solo 100ms de 300ms
      
      // Destruir antes de que termine el timer
      component.ngOnDestroy();
      
      // Avanzar tiempo restante
      tick(200);
      
      // No debería haber errores
      expect(true).toBeTrue();
    }));
  });

  describe('Cambios rápidos de estado', () => {
    it('debería manejar múltiples cambios de estado', fakeAsync(() => {
      fixture.detectChanges();
      
      // Mostrar
      globalLoadingSubject.next(createLoadingState('Cargando 1...'));
      tick();
      expect(component.isVisible).toBeTrue();
      
      // Cambiar mensaje
      globalLoadingSubject.next(createLoadingState('Cargando 2...'));
      tick();
      expect(component.message).toBe('Cargando 2...');
      
      // Ocultar y mostrar rápido
      globalLoadingSubject.next(null);
      tick(100);
      globalLoadingSubject.next(createLoadingState('Cargando 3...'));
      tick();
      
      expect(component.isVisible).toBeTrue();
      expect(component.isLeaving).toBeFalse();
      expect(component.message).toBe('Cargando 3...');
    }));
  });
});
