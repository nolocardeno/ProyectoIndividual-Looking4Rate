/**
 * @fileoverview Tests para EventBusService
 * 
 * Suite de pruebas unitarias para el servicio de eventos.
 */

import { TestBed } from '@angular/core/testing';
import { EventBusService, BusEvent, EventType } from './event-bus.service';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventBusService]
    });
    service = TestBed.inject(EventBusService);
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería exponer events$ como Observable', () => {
      expect(service.events$).toBeDefined();
    });
  });

  describe('emit', () => {
    it('debería emitir eventos correctamente', (done) => {
      service.events$.subscribe(event => {
        expect(event.type).toBe('auth:login');
        expect(event.payload).toEqual({ userId: '123' });
        done();
      });

      service.emit('auth:login', { userId: '123' });
    });

    it('debería incluir timestamp en los eventos', (done) => {
      const before = new Date();

      service.events$.subscribe(event => {
        expect(event.timestamp).toBeDefined();
        expect(event.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
        done();
      });

      service.emit('test:event');
    });

    it('debería incluir source opcional', (done) => {
      service.events$.subscribe(event => {
        expect(event.source).toBe('TestComponent');
        done();
      });

      service.emit('test:event', null, 'TestComponent');
    });

    it('debería funcionar sin payload', (done) => {
      service.events$.subscribe(event => {
        expect(event.type).toBe('auth:logout');
        expect(event.payload).toBeUndefined();
        done();
      });

      service.emit('auth:logout');
    });
  });

  describe('on', () => {
    it('debería filtrar eventos por tipo', (done) => {
      let receivedCount = 0;

      service.on('auth:login').subscribe(payload => {
        receivedCount++;
        expect(payload).toEqual({ userId: '123' });
        
        if (receivedCount === 1) {
          done();
        }
      });

      // Emitir diferentes tipos de eventos
      service.emit('auth:logout');
      service.emit('theme:changed', { theme: 'dark' });
      service.emit('auth:login', { userId: '123' });
    });

    it('debería recibir múltiples eventos del mismo tipo', (done) => {
      const receivedPayloads: any[] = [];

      service.on<{ count: number }>('test:count').subscribe(payload => {
        receivedPayloads.push(payload);
        
        if (receivedPayloads.length === 3) {
          expect(receivedPayloads).toEqual([
            { count: 1 },
            { count: 2 },
            { count: 3 }
          ]);
          done();
        }
      });

      service.emit('test:count', { count: 1 });
      service.emit('test:count', { count: 2 });
      service.emit('test:count', { count: 3 });
    });
  });

  describe('onMany', () => {
    it('debería escuchar múltiples tipos de eventos', (done) => {
      const receivedEvents: BusEvent[] = [];

      service.onMany(['auth:login', 'auth:logout']).subscribe(event => {
        receivedEvents.push(event);
        
        if (receivedEvents.length === 2) {
          expect(receivedEvents[0].type).toBe('auth:login');
          expect(receivedEvents[1].type).toBe('auth:logout');
          done();
        }
      });

      service.emit('theme:changed'); // No debería recibirse
      service.emit('auth:login', { userId: '1' });
      service.emit('auth:logout');
    });
  });

  describe('Eventos tipados', () => {
    it('debería manejar eventos de autenticación', (done) => {
      interface LoginPayload {
        userId: string;
        username: string;
      }

      service.on<LoginPayload>('auth:login').subscribe(payload => {
        expect(payload?.userId).toBe('123');
        expect(payload?.username).toBe('testuser');
        done();
      });

      service.emit('auth:login', { userId: '123', username: 'testuser' });
    });

    it('debería manejar eventos de tema', (done) => {
      interface ThemePayload {
        theme: 'dark' | 'light';
      }

      service.on<ThemePayload>('theme:changed').subscribe(payload => {
        expect(payload?.theme).toBe('dark');
        done();
      });

      service.emit('theme:changed', { theme: 'dark' });
    });

    it('debería manejar eventos de búsqueda', (done) => {
      service.on<string>('search:query').subscribe(query => {
        expect(query).toBe('zelda');
        done();
      });

      service.emit('search:query', 'zelda');
    });

    it('debería manejar eventos de juego', (done) => {
      interface GamePayload {
        gameId: number;
        rating: number;
      }

      service.on<GamePayload>('game:rated').subscribe(payload => {
        expect(payload?.gameId).toBe(1);
        expect(payload?.rating).toBe(9);
        done();
      });

      service.emit('game:rated', { gameId: 1, rating: 9 });
    });
  });

  describe('Eventos de modal', () => {
    it('debería manejar eventos de apertura de modal', (done) => {
      service.on<{ modal: string }>('modal:open').subscribe(payload => {
        expect(payload?.modal).toBe('login');
        done();
      });

      service.emit('modal:open', { modal: 'login' });
    });

    it('debería manejar eventos de cierre de modal', (done) => {
      service.on<void>('modal:close').subscribe(() => {
        expect(true).toBeTrue();
        done();
      });

      service.emit('modal:close');
    });
  });

  describe('Eventos personalizados', () => {
    it('debería permitir eventos personalizados', (done) => {
      service.on('custom:event').subscribe(payload => {
        expect(payload).toEqual({ custom: 'data' });
        done();
      });

      service.emit('custom:event', { custom: 'data' });
    });
  });

  describe('Historial de eventos', () => {
    it('debería mantener historial de eventos', () => {
      service.emit('event:1');
      service.emit('event:2');
      service.emit('event:3');

      const history = service.getHistory();
      expect(history.length).toBe(3);
    });

    it('debería limitar el tamaño del historial', () => {
      // Emitir más de 50 eventos (límite del historial)
      for (let i = 0; i < 60; i++) {
        service.emit(`event:${i}`);
      }

      const history = service.getHistory();
      expect(history.length).toBeLessThanOrEqual(50);
    });

    it('clearHistory debería limpiar el historial', () => {
      service.emit('first:event');
      service.emit('second:event');

      service.clearHistory();
      const history = service.getHistory();
      expect(history.length).toBe(0);
    });
  });

  describe('Limpieza de suscripciones', () => {
    it('debería permitir unsubscribe', () => {
      let callCount = 0;

      const subscription = service.on('test:event').subscribe(() => {
        callCount++;
      });

      service.emit('test:event');
      expect(callCount).toBe(1);

      subscription.unsubscribe();
      service.emit('test:event');
      
      // No debería incrementar después de unsubscribe
      expect(callCount).toBe(1);
    });
  });

  describe('Integración con casos de uso', () => {
    it('debería soportar flujo de login completo', (done) => {
      let loginReceived = false;
      let modalClosed = false;

      service.on('auth:login').subscribe(() => {
        loginReceived = true;
        service.emit('modal:close');
      });

      service.on('modal:close').subscribe(() => {
        modalClosed = true;
        expect(loginReceived).toBeTrue();
        expect(modalClosed).toBeTrue();
        done();
      });

      service.emit('auth:login', { userId: '1' });
    });

    it('debería soportar flujo de navegación', (done) => {
      const navigationHistory: string[] = [];

      service.on<{ path: string }>('navigation:changed').subscribe(payload => {
        navigationHistory.push(payload!.path);
        
        if (navigationHistory.length === 3) {
          expect(navigationHistory).toEqual(['/home', '/games', '/profile']);
          done();
        }
      });

      service.emit('navigation:changed', { path: '/home' });
      service.emit('navigation:changed', { path: '/games' });
      service.emit('navigation:changed', { path: '/profile' });
    });
  });
});
