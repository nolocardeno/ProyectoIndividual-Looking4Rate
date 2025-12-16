/**
 * @fileoverview Tests para InteraccionesService
 * 
 * Suite de pruebas unitarias para el servicio de interacciones.
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { InteraccionesService } from './interacciones.service';
import { InteraccionDTO, InteraccionCreacionDTO } from '../models';

describe('InteraccionesService', () => {
  let service: InteraccionesService;
  let httpMock: HttpTestingController;

  // Mock de interacción para pruebas
  const mockInteraccion: InteraccionDTO = {
    id: 1,
    usuarioId: 1,
    nombreUsuario: 'TestUser',
    avatarUsuario: 'avatar.jpg',
    juegoId: 1,
    nombreJuego: 'Test Game',
    imagenJuego: 'portada.jpg',
    puntuacion: 8,
    review: 'Un gran juego',
    estadoJugado: true,
    fechaInteraccion: '2024-01-15'
  };

  const mockInteraccion2: InteraccionDTO = {
    id: 2,
    usuarioId: 2,
    nombreUsuario: 'AnotherUser',
    avatarUsuario: 'avatar2.jpg',
    juegoId: 1,
    nombreJuego: 'Test Game',
    imagenJuego: 'portada.jpg',
    puntuacion: 7,
    review: 'Buen juego',
    estadoJugado: true,
    fechaInteraccion: '2024-01-20'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InteraccionesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(InteraccionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getAll', () => {
    it('debería obtener todas las interacciones', () => {
      const mockInteracciones = [mockInteraccion, mockInteraccion2];

      service.getAll().subscribe(interacciones => {
        expect(interacciones.length).toBe(2);
        expect(interacciones).toEqual(mockInteracciones);
      });

      const req = httpMock.expectOne('/api/interacciones');
      expect(req.request.method).toBe('GET');
      req.flush(mockInteracciones);
    });
  });

  describe('getById', () => {
    it('debería obtener una interacción por ID', () => {
      service.getById(1).subscribe(interaccion => {
        expect(interaccion).toEqual(mockInteraccion);
        expect(interaccion.id).toBe(1);
      });

      const req = httpMock.expectOne('/api/interacciones/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockInteraccion);
    });

    it('debería manejar interacción no encontrada', () => {
      service.getById(999).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/interacciones/999');
      req.flush({ message: 'Interacción no encontrada' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getByUsuario', () => {
    it('debería obtener las interacciones de un usuario', () => {
      service.getByUsuario(1).subscribe(interacciones => {
        expect(interacciones.length).toBeGreaterThan(0);
        expect(interacciones[0].usuarioId).toBe(1);
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1');
      expect(req.request.method).toBe('GET');
      req.flush([mockInteraccion]);
    });

    it('debería retornar lista vacía si el usuario no tiene interacciones', () => {
      service.getByUsuario(99).subscribe(interacciones => {
        expect(interacciones).toEqual([]);
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/99');
      req.flush([]);
    });
  });

  describe('getByJuego', () => {
    it('debería obtener las interacciones de un juego', () => {
      const interaccionesJuego = [mockInteraccion, mockInteraccion2];

      service.getByJuego(1).subscribe(interacciones => {
        expect(interacciones.length).toBe(2);
        interacciones.forEach(i => expect(i.juegoId).toBe(1));
      });

      const req = httpMock.expectOne('/api/interacciones/juego/1');
      expect(req.request.method).toBe('GET');
      req.flush(interaccionesJuego);
    });
  });

  describe('getByUsuarioYJuego', () => {
    it('debería obtener la interacción específica usuario-juego', () => {
      service.getByUsuarioYJuego(1, 1).subscribe(interaccion => {
        expect(interaccion).toEqual(mockInteraccion);
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1/juego/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockInteraccion);
    });

    it('debería retornar null si no existe la interacción', () => {
      service.getByUsuarioYJuego(1, 99).subscribe(interaccion => {
        expect(interaccion).toBeNull();
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1/juego/99');
      req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('crear', () => {
    it('debería crear una nueva interacción', () => {
      const nuevaInteraccion: InteraccionCreacionDTO = {
        juegoId: 2,
        puntuacion: 9,
        review: 'Excelente juego',
        estadoJugado: true
      };

      const interaccionCreada: InteraccionDTO = {
        id: 3,
        usuarioId: 1,
        nombreUsuario: 'TestUser',
        avatarUsuario: 'avatar.jpg',
        juegoId: 2,
        nombreJuego: 'Otro Juego',
        imagenJuego: 'portada2.jpg',
        puntuacion: 9,
        review: 'Excelente juego',
        estadoJugado: true,
        fechaInteraccion: '2024-12-15'
      };

      service.crear(1, nuevaInteraccion).subscribe(interaccion => {
        expect(interaccion.id).toBe(3);
        expect(interaccion.puntuacion).toBe(9);
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevaInteraccion);
      req.flush(interaccionCreada);
    });

    it('debería crear una interacción solo con puntuación', () => {
      const soloRating: InteraccionCreacionDTO = {
        juegoId: 2,
        puntuacion: 7,
        estadoJugado: true
      };

      service.crear(1, soloRating).subscribe(interaccion => {
        expect(interaccion.puntuacion).toBe(7);
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1');
      req.flush({ ...mockInteraccion, puntuacion: 7, review: null });
    });
  });

  describe('actualizar', () => {
    it('debería actualizar una interacción existente', () => {
      const datosActualizados: InteraccionCreacionDTO = {
        juegoId: 1,
        puntuacion: 9,
        review: 'Actualizada mi opinión',
        estadoJugado: true
      };

      const interaccionActualizada: InteraccionDTO = {
        ...mockInteraccion,
        puntuacion: 9,
        review: 'Actualizada mi opinión'
      };

      service.actualizar(1, 1, datosActualizados).subscribe(interaccion => {
        expect(interaccion.puntuacion).toBe(9);
        expect(interaccion.review).toBe('Actualizada mi opinión');
      });

      const req = httpMock.expectOne('/api/interacciones/1/usuario/1');
      expect(req.request.method).toBe('PUT');
      req.flush(interaccionActualizada);
    });
  });

  describe('eliminar', () => {
    it('debería eliminar una interacción', () => {
      service.eliminar(1, 1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/interacciones/1/usuario/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('getJuegosJugados', () => {
    it('debería obtener los juegos jugados por un usuario', () => {
      service.getJuegosJugados(1).subscribe(juegos => {
        expect(juegos).toBeDefined();
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1/jugados');
      expect(req.request.method).toBe('GET');
      req.flush([{ id: 1, nombre: 'Test Game' }]);
    });
  });

  describe('Métodos de estadísticas', () => {
    it('debería calcular estadísticas de juego', () => {
      const interacciones = [mockInteraccion, mockInteraccion2];
      
      service.getByJuego(1).subscribe(ints => {
        const puntuaciones = ints.map(i => i.puntuacion).filter((p): p is number => p !== null);
        const media = puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length;
        expect(media).toBe(7.5);
      });

      const req = httpMock.expectOne('/api/interacciones/juego/1');
      req.flush(interacciones);
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar error de servidor', () => {
      service.getAll().subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/interacciones');
      req.flush('Error interno', { status: 500, statusText: 'Internal Server Error' });
    });

    it('debería manejar error de validación', () => {
      const datosInvalidos: InteraccionCreacionDTO = {
        juegoId: 1,
        puntuacion: 15, // Fuera de rango
        estadoJugado: true
      };

      service.crear(1, datosInvalidos).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/interacciones/usuario/1');
      req.flush(
        { message: 'Puntuación debe estar entre 1 y 10' }, 
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });
});
