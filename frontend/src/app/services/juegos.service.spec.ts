/**
 * @fileoverview Tests para JuegosService
 * 
 * Suite de pruebas unitarias para el servicio de juegos.
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { JuegosService } from './juegos.service';
import { JuegoDTO, JuegoResumenDTO } from '../models';

describe('JuegosService', () => {
  let service: JuegosService;
  let httpMock: HttpTestingController;

  // Mock de juegos para pruebas
  const mockJuegoResumen: JuegoResumenDTO = {
    id: 1,
    nombre: 'Test Game',
    imagenPortada: 'test.jpg',
    fechaSalida: '2024-01-15',
    puntuacionMedia: 8.5
  };

  const mockJuegoResumen2: JuegoResumenDTO = {
    id: 2,
    nombre: 'Another Game',
    imagenPortada: 'another.jpg',
    fechaSalida: '2024-02-20',
    puntuacionMedia: 7.0
  };

  const mockJuegoDetalle: JuegoDTO = {
    id: 1,
    nombre: 'Test Game',
    descripcion: 'Un juego de prueba para testing',
    imagenPortada: 'test.jpg',
    fechaSalida: '2024-01-15',
    plataformas: ['PlayStation 5', 'Xbox Series X', 'PC'],
    desarrolladoras: ['Test Studio'],
    generos: ['Acción', 'Aventura'],
    puntuacionMedia: 8.5,
    totalReviews: 150
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JuegosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(JuegosService);
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
    it('debería obtener todos los juegos', () => {
      const mockJuegos = [mockJuegoResumen, mockJuegoResumen2];

      service.getAll().subscribe(juegos => {
        expect(juegos.length).toBe(2);
        expect(juegos).toEqual(mockJuegos);
      });

      const req = httpMock.expectOne('/api/juegos');
      expect(req.request.method).toBe('GET');
      req.flush(mockJuegos);
    });

    it('debería manejar lista vacía', () => {
      service.getAll().subscribe(juegos => {
        expect(juegos).toEqual([]);
        expect(juegos.length).toBe(0);
      });

      const req = httpMock.expectOne('/api/juegos');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('debería obtener un juego por ID', () => {
      service.getById(1).subscribe(juego => {
        expect(juego).toEqual(mockJuegoDetalle);
        expect(juego.id).toBe(1);
        expect(juego.nombre).toBe('Test Game');
      });

      const req = httpMock.expectOne('/api/juegos/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockJuegoDetalle);
    });

    it('debería manejar juego no encontrado', () => {
      service.getById(999).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/juegos/999');
      req.flush({ message: 'Juego no encontrado' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('buscar', () => {
    it('debería buscar juegos por nombre', () => {
      const mockResultados = [mockJuegoResumen];

      service.buscar('Test').subscribe(resultados => {
        expect(resultados.length).toBe(1);
        expect(resultados[0].nombre).toContain('Test');
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/api/juegos/buscar') && 
        request.params.get('nombre') === 'Test'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResultados);
    });

    it('debería retornar lista vacía si no hay coincidencias', () => {
      service.buscar('NoExiste').subscribe(resultados => {
        expect(resultados).toEqual([]);
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/api/juegos/buscar')
      );
      req.flush([]);
    });
  });

  describe('buscarAvanzado', () => {
    it('debería buscar con múltiples filtros', () => {
      const params = {
        nombre: 'Test',
        generoId: 1,
        plataformaId: 2,
        ordenarPor: 'nombre' as const,
        orden: 'asc' as const
      };

      service.buscarAvanzado(params).subscribe(resultados => {
        expect(resultados).toBeDefined();
      });

      const req = httpMock.expectOne(request => {
        return request.url.includes('/api/juegos/buscar') &&
          request.params.get('nombre') === 'Test' &&
          request.params.get('generoId') === '1' &&
          request.params.get('plataformaId') === '2';
      });
      expect(req.request.method).toBe('GET');
      req.flush([mockJuegoResumen]);
    });
  });

  describe('getNovedades', () => {
    it('debería obtener las novedades', () => {
      const mockNovedades = [mockJuegoResumen, mockJuegoResumen2];

      service.getNovedades().subscribe(juegos => {
        expect(juegos.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/juegos/novedades');
      expect(req.request.method).toBe('GET');
      req.flush(mockNovedades);
    });
  });

  describe('getProximosLanzamientos', () => {
    it('debería obtener próximos lanzamientos', () => {
      service.getProximosLanzamientos().subscribe(juegos => {
        expect(juegos).toBeDefined();
      });

      const req = httpMock.expectOne('/api/juegos/proximos');
      expect(req.request.method).toBe('GET');
      req.flush([mockJuegoResumen]);
    });
  });

  describe('getTopRated', () => {
    it('debería obtener los juegos top', () => {
      service.getTopRated().subscribe(juegos => {
        expect(juegos).toBeDefined();
      });

      const req = httpMock.expectOne((request) => request.url.includes('/api/juegos/top'));
      expect(req.request.method).toBe('GET');
      req.flush([mockJuegoResumen]);
    });
  });

  describe('getPopulares', () => {
    it('debería obtener los juegos populares', () => {
      service.getPopulares().subscribe(juegos => {
        expect(juegos).toBeDefined();
      });

      const req = httpMock.expectOne(req => req.url === '/api/juegos/populares');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('limite')).toBe('10');
      req.flush([mockJuegoResumen]);
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

      const req = httpMock.expectOne('/api/juegos');
      req.flush('Error interno', { status: 500, statusText: 'Internal Server Error' });
    });

    it('debería manejar error de red', () => {
      service.getAll().subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/juegos');
      req.error(new ProgressEvent('Network error'));
    });
  });
});
