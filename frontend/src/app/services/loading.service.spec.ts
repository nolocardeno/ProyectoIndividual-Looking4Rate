/**
 * @fileoverview Tests para LoadingService
 * 
 * Suite de pruebas unitarias para el servicio de estados de carga.
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadingService, LoadingState, GlobalLoadingState } from './loading.service';
import { firstValueFrom, take } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar con estado no cargando', (done) => {
      service.isLoading$.pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeFalse();
        done();
      });
    });

    it('debería iniciar con mensaje vacío', (done) => {
      service.message$.pipe(take(1)).subscribe(message => {
        expect(message).toBe('');
        done();
      });
    });

    it('debería iniciar con contador en 0', (done) => {
      service.activeCount$.pipe(take(1)).subscribe(count => {
        expect(count).toBe(0);
        done();
      });
    });
  });

  describe('Carga global', () => {
    it('debería activar carga global con showGlobal', (done) => {
      service.showGlobal('Cargando...');
      
      service.isLoading$.pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeTrue();
        done();
      });
    });

    it('debería mostrar mensaje con showGlobal', (done) => {
      service.showGlobal('Procesando datos...');
      
      service.message$.pipe(take(1)).subscribe(message => {
        expect(message).toBe('Procesando datos...');
        done();
      });
    });

    it('debería desactivar carga global con hideGlobal', (done) => {
      service.showGlobal('Cargando...');
      service.hideGlobal();
      
      service.isLoading$.pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeFalse();
        done();
      });
    });

    it('debería manejar múltiples llamadas a showGlobal', (done) => {
      service.showGlobal('Primera carga');
      service.showGlobal('Segunda carga');
      
      service.activeCount$.pipe(take(1)).subscribe(count => {
        expect(count).toBe(2);
        done();
      });
    });

    it('debería decrementar contador con hideGlobal', (done) => {
      service.showGlobal('Primera');
      service.showGlobal('Segunda');
      service.hideGlobal();
      
      service.activeCount$.pipe(take(1)).subscribe(count => {
        expect(count).toBe(1);
        done();
      });
    });

    it('no debería tener contador negativo', (done) => {
      service.hideGlobal();
      service.hideGlobal();
      
      service.activeCount$.pipe(take(1)).subscribe(count => {
        expect(count).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });

  describe('Carga local (por ID)', () => {
    it('debería activar carga local con show', (done) => {
      service.show('button-submit', 'Enviando...');
      
      service.isLoadingId('button-submit').pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeTrue();
        done();
      });
    });

    it('debería desactivar carga local con hide', (done) => {
      service.show('button-submit', 'Enviando...');
      service.hide('button-submit');
      
      service.isLoadingId('button-submit').pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeFalse();
        done();
      });
    });

    it('debería manejar múltiples cargas locales independientes', (done) => {
      service.show('loader-1', 'Cargando 1');
      service.show('loader-2', 'Cargando 2');
      
      service.isLoadingId('loader-1').pipe(take(1)).subscribe(isLoading1 => {
        expect(isLoading1).toBeTrue();
        
        service.isLoadingId('loader-2').pipe(take(1)).subscribe(isLoading2 => {
          expect(isLoading2).toBeTrue();
          
          service.hide('loader-1');
          
          service.isLoadingId('loader-1').pipe(take(1)).subscribe(isLoading1After => {
            expect(isLoading1After).toBeFalse();
            
            service.isLoadingId('loader-2').pipe(take(1)).subscribe(isLoading2After => {
              expect(isLoading2After).toBeTrue();
              done();
            });
          });
        });
      });
    });

    it('debería retornar false para IDs no existentes', (done) => {
      service.isLoadingId('no-existe').pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeFalse();
        done();
      });
    });
  });

  describe('isLoadingId observable', () => {
    it('debería emitir cambios de estado para un ID específico', (done) => {
      let emissionCount = 0;
      
      service.isLoadingId('test-id').pipe(take(2)).subscribe(isLoading => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(isLoading).toBeFalse();
        } else if (emissionCount === 2) {
          expect(isLoading).toBeTrue();
          done();
        }
      });
      
      service.show('test-id');
    });
  });

  describe('withLoading wrapper', () => {
    it('debería envolver operación async con loading', async () => {
      const result = await service.withLoading('async-op', async () => {
        return 'resultado';
      });
      
      expect(result).toBe('resultado');
    });

    it('debería ocultar loading incluso si la operación falla', async () => {
      try {
        await service.withLoading('failing-op', async () => {
          throw new Error('Error de prueba');
        });
      } catch (e) {
        // Error esperado
      }
      
      const isLoading = await firstValueFrom(service.isLoadingId('failing-op').pipe(take(1)));
      expect(isLoading).toBeFalse();
    });
  });

  describe('forceHideGlobal', () => {
    it('debería forzar ocultación del spinner global', (done) => {
      service.showGlobal('Primera');
      service.showGlobal('Segunda');
      
      service.forceHideGlobal();
      
      service.isLoading$.pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBeFalse();
        done();
      });
    });
  });

  describe('updateGlobalMessage', () => {
    it('debería actualizar el mensaje del spinner global', (done) => {
      service.showGlobal('Mensaje inicial');
      service.updateGlobalMessage('Mensaje actualizado');
      
      service.message$.pipe(take(1)).subscribe(message => {
        expect(message).toBe('Mensaje actualizado');
        done();
      });
    });
  });

  describe('Estado observable', () => {
    it('debería exponer el estado completo como observable', (done) => {
      service.state$.pipe(take(1)).subscribe(state => {
        expect(state).toBeDefined();
        expect(state.isLoading).toBeDefined();
        expect(state.message).toBeDefined();
        expect(state.activeLoaders).toBeDefined();
        expect(state.count).toBeDefined();
        done();
      });
    });
  });

  describe('globalLoading$', () => {
    it('debería emitir null cuando no hay carga', (done) => {
      service.globalLoading$.pipe(take(1)).subscribe(loading => {
        expect(loading).toBeNull();
        done();
      });
    });

    it('debería emitir estado cuando hay carga global', (done) => {
      service.showGlobal('Cargando...');
      
      service.globalLoading$.pipe(take(1)).subscribe(loading => {
        expect(loading).toBeDefined();
        expect(loading?.isLoading).toBeTrue();
        expect(loading?.message).toBe('Cargando...');
        done();
      });
    });
  });

  describe('getLoaderState', () => {
    it('debería obtener estado de un loader específico', (done) => {
      service.show('test-loader', 'Test message');
      
      service.getLoaderState('test-loader').pipe(take(1)).subscribe(state => {
        expect(state).toBeDefined();
        expect(state?.id).toBe('test-loader');
        expect(state?.isLoading).toBeTrue();
        done();
      });
    });

    it('debería retornar undefined para loader no existente', (done) => {
      service.getLoaderState('no-existe').pipe(take(1)).subscribe(state => {
        expect(state).toBeUndefined();
        done();
      });
    });
  });
});
