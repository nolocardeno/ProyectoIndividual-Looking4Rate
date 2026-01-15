/**
 * @fileoverview Tests para GameStateService
 * 
 * Suite de pruebas unitarias para el servicio de estado de juegos.
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GameStateService, StateUpdateEvent } from './game-state.service';
import { InteraccionDTO, JuegoResumenDTO } from '../models';
import { take } from 'rxjs';

describe('GameStateService', () => {
  let service: GameStateService;

  const mockInteraction: InteraccionDTO = {
    id: 1,
    usuarioId: 100,
    nombreUsuario: 'TestUser',
    juegoId: 200,
    nombreJuego: 'Test Game',
    puntuacion: 4,
    estadoJugado: true,
    review: 'Great game!',
    fechaInteraccion: '2024-01-01T00:00:00Z'
  };

  const mockInteraction2: InteraccionDTO = {
    id: 2,
    usuarioId: 100,
    nombreUsuario: 'TestUser',
    juegoId: 201,
    nombreJuego: 'Test Game 2',
    puntuacion: 5,
    estadoJugado: true,
    review: 'Amazing!',
    fechaInteraccion: '2024-01-02T00:00:00Z'
  };

  const mockGame: JuegoResumenDTO = {
    id: 200,
    nombre: 'Test Game',
    imagenPortada: 'test.jpg',
    fechaSalida: '2024-01-01',
    puntuacionMedia: 4.5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameStateService]
    });
    service = TestBed.inject(GameStateService);
  });

  afterEach(() => {
    service.reset();
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar con interacciones vacías', () => {
      expect(service.userInteractions()).toEqual([]);
    });

    it('debería iniciar con userId null', () => {
      expect(service.currentUserId()).toBeNull();
    });

    it('debería iniciar con gameId null', () => {
      expect(service.currentGameId()).toBeNull();
    });

    it('debería iniciar con isLoading false', () => {
      expect(service.isLoading()).toBeFalse();
    });
  });

  describe('setCurrentUser', () => {
    it('debería establecer el usuario actual', () => {
      service.setCurrentUser(100);
      expect(service.currentUserId()).toBe(100);
    });

    it('debería limpiar interacciones cuando cambia el usuario', () => {
      service.setCurrentUser(100);
      service.setUserInteractions([mockInteraction]);
      expect(service.userInteractions().length).toBe(1);

      service.setCurrentUser(200); // Usuario diferente
      expect(service.userInteractions()).toEqual([]);
    });

    it('no debería limpiar interacciones si el usuario es el mismo', () => {
      service.setCurrentUser(100);
      service.setUserInteractions([mockInteraction]);
      
      service.setCurrentUser(100); // Mismo usuario
      expect(service.userInteractions().length).toBe(1);
    });

    it('debería manejar cambio a null', () => {
      service.setCurrentUser(100);
      service.setUserInteractions([mockInteraction]);
      
      service.setCurrentUser(null);
      expect(service.currentUserId()).toBeNull();
      expect(service.userInteractions()).toEqual([]);
    });
  });

  describe('setUserInteractions', () => {
    it('debería establecer las interacciones', () => {
      service.setUserInteractions([mockInteraction, mockInteraction2]);
      expect(service.userInteractions().length).toBe(2);
    });

    it('debería reemplazar interacciones existentes', () => {
      service.setUserInteractions([mockInteraction]);
      service.setUserInteractions([mockInteraction2]);
      expect(service.userInteractions().length).toBe(1);
      expect(service.userInteractions()[0].id).toBe(2);
    });
  });

  describe('addInteraction', () => {
    it('debería añadir una interacción', () => {
      service.addInteraction(mockInteraction);
      expect(service.userInteractions().length).toBe(1);
      expect(service.userInteractions()[0]).toEqual(mockInteraction);
    });

    it('debería emitir evento interaction-created', (done) => {
      service.updates$.pipe(take(1)).subscribe((event: StateUpdateEvent) => {
        expect(event.type).toBe('interaction-created');
        expect(event.payload).toEqual(mockInteraction);
        expect(event.timestamp).toBeDefined();
        done();
      });

      service.addInteraction(mockInteraction);
    });

    it('debería añadir a reviews del juego actual si coincide', () => {
      service.setCurrentGame(mockInteraction.juegoId, []);
      service.addInteraction(mockInteraction);
      
      expect(service.currentGameReviews().length).toBe(1);
    });

    it('no debería añadir a reviews si no es del juego actual', () => {
      service.setCurrentGame(999, []);
      service.addInteraction(mockInteraction);
      
      expect(service.currentGameReviews().length).toBe(0);
    });

    it('no debería añadir a reviews si no tiene review', () => {
      const interactionWithoutReview = { ...mockInteraction, review: null };
      service.setCurrentGame(mockInteraction.juegoId, []);
      service.addInteraction(interactionWithoutReview);
      
      expect(service.currentGameReviews().length).toBe(0);
    });
  });

  describe('updateInteraction', () => {
    it('debería actualizar una interacción existente', () => {
      service.setUserInteractions([mockInteraction]);
      
      const updated = { ...mockInteraction, puntuacion: 5 };
      service.updateInteraction(updated);
      
      expect(service.userInteractions()[0].puntuacion).toBe(5);
    });

    it('debería emitir evento interaction-updated', (done) => {
      service.setUserInteractions([mockInteraction]);
      
      service.updates$.pipe(take(1)).subscribe((event: StateUpdateEvent) => {
        expect(event.type).toBe('interaction-updated');
        done();
      });

      service.updateInteraction({ ...mockInteraction, puntuacion: 5 });
    });

    it('debería actualizar review del juego actual si existe', () => {
      service.setCurrentGame(mockInteraction.juegoId, [mockInteraction]);
      service.setUserInteractions([mockInteraction]);
      
      const updated = { ...mockInteraction, review: 'Updated review' };
      service.updateInteraction(updated);
      
      expect(service.currentGameReviews()[0].review).toBe('Updated review');
    });

    it('debería añadir a reviews del juego actual si tiene nueva review', () => {
      const interactionWithoutReview = { ...mockInteraction, review: null };
      service.setCurrentGame(mockInteraction.juegoId, []);
      service.setUserInteractions([interactionWithoutReview]);
      
      const updated = { ...interactionWithoutReview, review: 'New review' };
      service.updateInteraction(updated);
      
      expect(service.currentGameReviews().length).toBe(1);
    });

    it('no debería añadir review vacía al juego actual', () => {
      const interactionWithoutReview = { ...mockInteraction, review: null };
      service.setCurrentGame(mockInteraction.juegoId, []);
      service.setUserInteractions([interactionWithoutReview]);
      
      const updated = { ...interactionWithoutReview, review: '   ' };
      service.updateInteraction(updated);
      
      expect(service.currentGameReviews().length).toBe(0);
    });
  });

  describe('removeInteraction', () => {
    it('debería eliminar una interacción', () => {
      service.setUserInteractions([mockInteraction, mockInteraction2]);
      service.removeInteraction(mockInteraction.id);
      
      expect(service.userInteractions().length).toBe(1);
      expect(service.userInteractions()[0].id).toBe(2);
    });

    it('debería emitir evento interaction-deleted', (done) => {
      service.setUserInteractions([mockInteraction]);
      
      service.updates$.pipe(take(1)).subscribe((event: StateUpdateEvent) => {
        expect(event.type).toBe('interaction-deleted');
        expect(event.payload).toEqual(mockInteraction);
        done();
      });

      service.removeInteraction(mockInteraction.id);
    });

    it('no debería emitir evento si no existe la interacción', () => {
      const spy = jasmine.createSpy('updatesSpy');
      service.updates$.subscribe(spy);
      
      service.removeInteraction(999);
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería eliminar de reviews del juego actual', () => {
      service.setCurrentGame(mockInteraction.juegoId, [mockInteraction]);
      service.setUserInteractions([mockInteraction]);
      
      service.removeInteraction(mockInteraction.id);
      
      expect(service.currentGameReviews().length).toBe(0);
    });
  });

  describe('getInteractionForGame', () => {
    it('debería retornar la interacción para un juego', () => {
      service.setUserInteractions([mockInteraction, mockInteraction2]);
      
      const result = service.getInteractionForGame(200);
      expect(result).toEqual(mockInteraction);
    });

    it('debería retornar undefined si no existe', () => {
      service.setUserInteractions([mockInteraction]);
      
      const result = service.getInteractionForGame(999);
      expect(result).toBeUndefined();
    });
  });

  describe('upsertInteraction', () => {
    it('debería añadir si no existe', () => {
      service.upsertInteraction(mockInteraction);
      expect(service.userInteractions().length).toBe(1);
    });

    it('debería actualizar si ya existe', () => {
      service.setUserInteractions([mockInteraction]);
      
      const updated = { ...mockInteraction, puntuacion: 5 };
      service.upsertInteraction(updated);
      
      expect(service.userInteractions().length).toBe(1);
      expect(service.userInteractions()[0].puntuacion).toBe(5);
    });
  });

  describe('setCurrentGame / clearCurrentGame', () => {
    it('debería establecer el juego actual', () => {
      const reviews = [mockInteraction];
      service.setCurrentGame(200, reviews);
      
      expect(service.currentGameId()).toBe(200);
      expect(service.currentGameReviews()).toEqual(reviews);
    });

    it('debería limpiar el juego actual', () => {
      service.setCurrentGame(200, [mockInteraction]);
      service.clearCurrentGame();
      
      expect(service.currentGameId()).toBeNull();
      expect(service.currentGameReviews()).toEqual([]);
    });
  });

  describe('addGameReview', () => {
    it('debería añadir review al inicio', () => {
      const existingReview = { ...mockInteraction2, juegoId: 200 };
      service.setCurrentGame(200, [existingReview]);
      
      service.addGameReview(mockInteraction);
      
      expect(service.currentGameReviews().length).toBe(2);
      expect(service.currentGameReviews()[0]).toEqual(mockInteraction);
    });

    it('debería emitir evento review-added', (done) => {
      service.setCurrentGame(200, []);
      
      service.updates$.pipe(take(1)).subscribe((event: StateUpdateEvent) => {
        expect(event.type).toBe('review-added');
        done();
      });

      service.addGameReview(mockInteraction);
    });
  });

  describe('userStats computed', () => {
    it('debería calcular estadísticas correctamente', () => {
      const interactions: InteraccionDTO[] = [
        { ...mockInteraction, puntuacion: 4, estadoJugado: true, review: 'Review 1' },
        { ...mockInteraction2, puntuacion: 5, estadoJugado: true, review: '' },
        { id: 3, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 202, nombreJuego: 'Game 3', puntuacion: 3, estadoJugado: false, review: null, fechaInteraccion: '2024-01-03' }
      ];
      
      service.setUserInteractions(interactions);
      
      const stats = service.userStats();
      expect(stats.totalJuegos).toBe(2); // Solo los que tienen estadoJugado: true
      expect(stats.juegosRevieweados).toBe(1); // Solo con review no vacía
      expect(stats.puntuacionMediaDada).toBe(4); // (4+5+3)/3 = 4
    });

    it('debería retornar null si no hay puntuaciones', () => {
      const interactions: InteraccionDTO[] = [
        { id: 1, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 200, nombreJuego: 'Game', estadoJugado: true, review: null, puntuacion: null, fechaInteraccion: '2024-01-01' }
      ];
      
      service.setUserInteractions(interactions);
      
      expect(service.userStats().puntuacionMediaDada).toBeNull();
    });

    it('debería calcular distribución de puntuaciones', () => {
      const interactions: InteraccionDTO[] = [
        { id: 1, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 200, nombreJuego: 'Game 1', puntuacion: 5, estadoJugado: true, review: null, fechaInteraccion: '2024-01-01' },
        { id: 2, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 201, nombreJuego: 'Game 2', puntuacion: 5, estadoJugado: true, review: null, fechaInteraccion: '2024-01-02' },
        { id: 3, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 202, nombreJuego: 'Game 3', puntuacion: 3, estadoJugado: true, review: null, fechaInteraccion: '2024-01-03' }
      ];
      
      service.setUserInteractions(interactions);
      
      expect(service.userStats().distribucionPuntuaciones[5]).toBe(2);
      expect(service.userStats().distribucionPuntuaciones[3]).toBe(1);
    });

    it('debería ignorar puntuaciones fuera de rango', () => {
      const interactions: InteraccionDTO[] = [
        { id: 1, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 200, nombreJuego: 'Game 1', puntuacion: 6 as any, estadoJugado: true, review: null, fechaInteraccion: '2024-01-01' },
        { id: 2, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 201, nombreJuego: 'Game 2', puntuacion: 0 as any, estadoJugado: true, review: null, fechaInteraccion: '2024-01-02' }
      ];
      
      service.setUserInteractions(interactions);
      
      // Puntuaciones fuera de rango no se añaden a distribución
      expect(service.userStats().distribucionPuntuaciones[5]).toBe(0);
    });
  });

  describe('playedGames / userReviews computed', () => {
    it('debería filtrar juegos jugados', () => {
      const interactions: InteraccionDTO[] = [
        { ...mockInteraction, estadoJugado: true },
        { ...mockInteraction2, estadoJugado: false }
      ];
      
      service.setUserInteractions(interactions);
      
      expect(service.playedGames().length).toBe(1);
    });

    it('debería filtrar reviews del usuario', () => {
      const interactions: InteraccionDTO[] = [
        { ...mockInteraction, review: 'Has review' },
        { ...mockInteraction2, review: '' },
        { id: 3, usuarioId: 100, nombreUsuario: 'TestUser', juegoId: 202, nombreJuego: 'Game 3', review: null, estadoJugado: true, puntuacion: null, fechaInteraccion: '2024-01-03' }
      ];
      
      service.setUserInteractions(interactions);
      
      expect(service.userReviews().length).toBe(1);
    });
  });

  describe('currentGameReviewsCount computed', () => {
    it('debería contar las reviews del juego actual', () => {
      service.setCurrentGame(200, [mockInteraction, mockInteraction2]);
      
      expect(service.currentGameReviewsCount()).toBe(2);
    });
  });

  describe('Cache de juegos', () => {
    it('debería guardar juego en cache', () => {
      service.cacheGame(mockGame);
      
      const cached = service.getGameFromCache(mockGame.id);
      expect(cached).toEqual(mockGame);
    });

    it('debería retornar null si no está en cache', () => {
      const cached = service.getGameFromCache(999);
      expect(cached).toBeNull();
    });

    it('debería retornar null si el cache expiró', fakeAsync(() => {
      service.cacheGame(mockGame);
      
      // Avanzar 6 minutos (cache TTL es 5 min)
      tick(6 * 60 * 1000);
      
      const cached = service.getGameFromCache(mockGame.id);
      expect(cached).toBeNull();
    }));

    it('debería limpiar todo el cache', () => {
      service.cacheGame(mockGame);
      service.clearGamesCache();
      
      const cached = service.getGameFromCache(mockGame.id);
      expect(cached).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('debería establecer estado de carga', () => {
      service.setLoading(true);
      expect(service.isLoading()).toBeTrue();
      
      service.setLoading(false);
      expect(service.isLoading()).toBeFalse();
    });
  });

  describe('reset', () => {
    it('debería resetear todo el estado', () => {
      // Establecer varios estados
      service.setCurrentUser(100);
      service.setUserInteractions([mockInteraction]);
      service.setCurrentGame(200, [mockInteraction]);
      service.cacheGame(mockGame);
      
      // Resetear
      service.reset();
      
      // Verificar que todo está limpio
      expect(service.userInteractions()).toEqual([]);
      expect(service.currentUserId()).toBeNull();
      expect(service.currentGameId()).toBeNull();
      expect(service.currentGameReviews()).toEqual([]);
      expect(service.getGameFromCache(mockGame.id)).toBeNull();
    });
  });
});
