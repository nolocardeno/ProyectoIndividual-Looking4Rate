/**
 * @fileoverview Tests para UsuariosService
 * 
 * Suite de pruebas unitarias para el servicio de usuarios.
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UsuariosService } from './usuarios.service';
import { UsuarioDTO, UsuarioRegistroDTO, UsuarioUpdateDTO } from '../models';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let httpMock: HttpTestingController;

  // Mock de usuario para pruebas
  const mockUsuario: UsuarioDTO = {
    id: 1,
    nombre: 'TestUser',
    email: 'test@email.com',
    fechaRegistro: '2024-01-15',
    avatar: 'assets/img/avatars/user1.jpg',
    rol: 'USER'
  };

  const mockUsuario2: UsuarioDTO = {
    id: 2,
    nombre: 'AnotherUser',
    email: 'another@email.com',
    fechaRegistro: '2024-02-20',
    avatar: null,
    rol: 'USER'
  };

  const mockAdmin: UsuarioDTO = {
    id: 3,
    nombre: 'AdminUser',
    email: 'admin@email.com',
    fechaRegistro: '2023-01-01',
    avatar: 'assets/img/avatars/admin.jpg',
    rol: 'ADMIN'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuariosService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UsuariosService);
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
    it('debería obtener todos los usuarios', () => {
      const mockUsuarios = [mockUsuario, mockUsuario2, mockAdmin];

      service.getAll().subscribe(usuarios => {
        expect(usuarios.length).toBe(3);
        expect(usuarios).toEqual(mockUsuarios);
      });

      const req = httpMock.expectOne('/api/usuarios');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuarios);
    });

    it('debería manejar lista vacía', () => {
      service.getAll().subscribe(usuarios => {
        expect(usuarios).toEqual([]);
      });

      const req = httpMock.expectOne('/api/usuarios');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('debería obtener un usuario por ID', () => {
      service.getById(1).subscribe(usuario => {
        expect(usuario).toEqual(mockUsuario);
        expect(usuario.id).toBe(1);
        expect(usuario.nombre).toBe('TestUser');
      });

      const req = httpMock.expectOne('/api/usuarios/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });

    it('debería manejar usuario no encontrado', () => {
      service.getById(999).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/usuarios/999');
      req.flush({ message: 'Usuario no encontrado' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('buscarPorNombre', () => {
    it('debería buscar usuarios por nombre', () => {
      const mockResultados = [mockUsuario];

      service.buscarPorNombre('Test').subscribe(resultados => {
        expect(resultados.length).toBe(1);
        expect(resultados[0].nombre).toContain('Test');
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/api/usuarios/buscar') && 
        request.params.get('nombre') === 'Test'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResultados);
    });

    it('debería retornar lista vacía si no hay coincidencias', () => {
      service.buscarPorNombre('NoExiste').subscribe(resultados => {
        expect(resultados).toEqual([]);
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/api/usuarios/buscar')
      );
      req.flush([]);
    });
  });

  describe('getByEmail', () => {
    it('debería obtener un usuario por email', () => {
      service.getByEmail('test@email.com').subscribe(usuario => {
        expect(usuario.email).toBe('test@email.com');
        expect(usuario).toEqual(mockUsuario);
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/api/usuarios/email/')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });
  });

  describe('registrar', () => {
    it('debería registrar un nuevo usuario', () => {
      const nuevoUsuario: UsuarioRegistroDTO = {
        nombre: 'NuevoUser',
        email: 'nuevo@email.com',
        contrasenia: 'password123'
      };

      const usuarioCreado: UsuarioDTO = {
        id: 4,
        nombre: 'NuevoUser',
        email: 'nuevo@email.com',
        fechaRegistro: '2024-12-15',
        avatar: null,
        rol: 'USER'
      };

      service.registrar(nuevoUsuario).subscribe(usuario => {
        expect(usuario.id).toBe(4);
        expect(usuario.nombre).toBe('NuevoUser');
        expect(usuario.email).toBe('nuevo@email.com');
      });

      const req = httpMock.expectOne('/api/usuarios');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoUsuario);
      req.flush(usuarioCreado);
    });

    it('debería manejar email duplicado', () => {
      const usuarioDuplicado: UsuarioRegistroDTO = {
        nombre: 'Duplicado',
        email: 'test@email.com', // Email ya existente
        contrasenia: 'password123'
      };

      service.registrar(usuarioDuplicado).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/usuarios');
      req.flush(
        { message: 'El email ya está registrado' }, 
        { status: 409, statusText: 'Conflict' }
      );
    });
  });

  // Test de actualizar comentado - método no implementado en servicio
  /*
  describe('actualizar', () => {
    it('debería actualizar un usuario', () => {
      const datosActualizados: UsuarioUpdateDTO = {
        nombre: 'NuevoNombre'
      };

      const usuarioActualizado: UsuarioDTO = {
        ...mockUsuario,
        nombre: 'NuevoNombre'
      };

      service.actualizar(1, datosActualizados).subscribe(usuario => {
        expect(usuario.nombre).toBe('NuevoNombre');
        expect(usuario.id).toBe(1);
      });

      const req = httpMock.expectOne('/api/usuarios/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(datosActualizados);
      req.flush(usuarioActualizado);
    });

    it('debería manejar error de autorización', () => {
      service.actualizar(1, { nombre: 'Test' }).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/usuarios/1');
      req.flush(
        { message: 'No autorizado' }, 
        { status: 403, statusText: 'Forbidden' }
      );
    });
  });
  */

  describe('eliminar', () => {
    it('debería eliminar un usuario', () => {
      service.eliminar(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/usuarios/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('actualizarAvatar', () => {
    it('debería actualizar el avatar del usuario', () => {
      const nuevoAvatar = 'assets/img/avatars/new-avatar.jpg';
      const usuarioConNuevoAvatar: UsuarioDTO = {
        ...mockUsuario,
        avatar: nuevoAvatar
      };

      service.actualizarAvatar(1, nuevoAvatar).subscribe(usuario => {
        expect(usuario.avatar).toBe(nuevoAvatar);
      });

      const req = httpMock.expectOne('/api/usuarios/1/avatar');
      expect(req.request.method).toBe('PUT');
      req.flush(usuarioConNuevoAvatar);
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

      const req = httpMock.expectOne('/api/usuarios');
      req.flush('Error interno', { status: 500, statusText: 'Internal Server Error' });
    });

    it('debería manejar error 401 (no autenticado)', () => {
      service.getAll().subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne('/api/usuarios');
      req.flush(
        { message: 'No autenticado' }, 
        { status: 401, statusText: 'Unauthorized' }
      );
    });
  });
});
