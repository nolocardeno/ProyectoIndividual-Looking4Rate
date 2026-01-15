/**
 * @fileoverview Tests para AuthService
 * 
 * Suite de pruebas unitarias para el servicio de autenticación.
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService, AuthUser, AuthState } from './auth.service';
import { EventBusService } from './event-bus.service';

describe('AuthService', () => {
  let service: AuthService;
  let eventBusSpy: jasmine.SpyObj<EventBusService>;

  // Mock user para pruebas
  const mockUser: AuthUser = {
    id: 1,
    nombre: 'TestUser',
    email: 'test@email.com',
    avatar: 'assets/img/avatars/user1.jpg',
    rol: 'USER'
  };

  const mockAdminUser: AuthUser = {
    id: 2,
    nombre: 'AdminUser',
    email: 'admin@email.com',
    avatar: 'assets/img/avatars/admin.jpg',
    rol: 'ADMIN'
  };

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();

    eventBusSpy = jasmine.createSpyObj('EventBusService', ['emit', 'on']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: EventBusService, useValue: eventBusSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Estado inicial', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar con estado no autenticado', () => {
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.getToken()).toBeNull();
    });

    it('debería exponer authState$ como Observable', (done) => {
      service.authState$.subscribe(state => {
        expect(state).toBeDefined();
        expect(state.isAuthenticated).toBeDefined();
        done();
      });
    });
  });

  describe('Login', () => {
    it('debería autenticar correctamente con credenciales válidas', fakeAsync(() => {
      let result: AuthUser | undefined;
      
      service.login('testuser', 'password123').subscribe({
        next: (user) => result = user,
        error: () => fail('No debería fallar')
      });

      tick(1100); // Esperar simulación de delay

      expect(result).toBeDefined();
      expect(result!.nombre).toBe('testuser');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getToken()).toBeTruthy();
    }));

    it('debería fallar con contraseña corta', fakeAsync(() => {
      let error: Error | undefined;

      service.login('testuser', '123').subscribe({
        next: () => fail('No debería tener éxito'),
        error: (e) => error = e
      });

      tick(1100);

      expect(error).toBeDefined();
      expect(error!.message).toContain('inválidas');
      expect(service.isAuthenticated()).toBeFalse();
    }));

    it('debería guardar en localStorage después del login', fakeAsync(() => {
      service.login('testuser', 'password123').subscribe();
      tick(1100);

      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');

      expect(storedUser).toBeTruthy();
      expect(storedToken).toBeTruthy();
      expect(JSON.parse(storedUser!).nombre).toBe('testuser');
    }));

    it('debería usar el email si el username contiene @', fakeAsync(() => {
      let result: AuthUser | undefined;
      
      service.login('user@example.com', 'password123').subscribe({
        next: (user) => result = user
      });

      tick(1100);

      expect(result!.email).toBe('user@example.com');
    }));
  });

  describe('Logout', () => {
    it('debería limpiar el estado al cerrar sesión', fakeAsync(() => {
      // Primero login
      service.login('testuser', 'password123').subscribe();
      tick(1100);
      expect(service.isAuthenticated()).toBeTrue();

      // Luego logout
      service.logout();

      expect(service.isAuthenticated()).toBeFalse();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.getToken()).toBeNull();
    }));

    it('debería emitir evento userLoggedOut al cerrar sesión', fakeAsync(() => {
      service.login('testuser', 'password123').subscribe();
      tick(1100);

      service.logout();

      expect(eventBusSpy.emit).toHaveBeenCalledWith('userLoggedOut', null);
    }));

    it('debería limpiar localStorage al cerrar sesión', fakeAsync(() => {
      service.login('testuser', 'password123').subscribe();
      tick(1100);
      expect(localStorage.getItem('auth_user')).toBeTruthy();

      service.logout();

      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    }));
  });

  describe('Register', () => {
    it('debería registrar correctamente un usuario', fakeAsync(() => {
      let result: boolean | undefined;

      service.register('new@email.com', 'NewUser', 'password123').subscribe({
        next: (success) => result = success
      });

      tick(1600);

      expect(result).toBeTrue();
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getCurrentUser()!.nombre).toBe('NewUser');
    }));
  });

  describe('Métodos de estado', () => {
    it('getCurrentUserId debería retornar null si no hay usuario', () => {
      expect(service.getCurrentUserId()).toBeNull();
    });

    it('getCurrentUserId debería retornar el ID del usuario autenticado', fakeAsync(() => {
      service.login('testuser', 'password123').subscribe();
      tick(1100);

      expect(service.getCurrentUserId()).toBe(1);
    }));

    it('isAdmin debería retornar false para usuarios normales', fakeAsync(() => {
      service.login('testuser', 'password123').subscribe();
      tick(1100);

      expect(service.isAdmin()).toBeFalse();
    }));

    it('isOwner debería verificar propiedad correctamente', fakeAsync(() => {
      service.login('testuser', 'password123').subscribe();
      tick(1100);

      expect(service.isOwner(1)).toBeTrue();
      expect(service.isOwner(2)).toBeFalse();
    }));
  });

  describe('Redirección', () => {
    it('debería guardar y obtener URL de redirección', () => {
      service.setRedirectUrl('/profile/1');
      expect(service.getRedirectUrl()).toBe('/profile/1');
    });

    it('debería limpiar URL de redirección', () => {
      service.setRedirectUrl('/profile/1');
      service.clearRedirectUrl();
      expect(service.getRedirectUrl()).toBeNull();
    });
  });

  describe('Request Login', () => {
    it('debería emitir evento para abrir modal de login', () => {
      service.requestLogin();
      expect(eventBusSpy.emit).toHaveBeenCalledWith('openLoginModal', null);
    });
  });

  describe('Persistencia', () => {
    it('debería cargar usuario de localStorage al inicializar', () => {
      // Simular datos almacenados
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'stored-token');

      // Recrear el servicio para que cargue del storage
      const newService = new AuthService();
      
      expect(newService.isAuthenticated()).toBeTrue();
      expect(newService.getCurrentUser()).toEqual(mockUser);
      expect(newService.getToken()).toBe('stored-token');
    });

    it('debería manejar JSON inválido en localStorage', () => {
      localStorage.setItem('auth_user', 'invalid-json');
      localStorage.setItem('auth_token', 'token');

      // No debería lanzar error
      expect(() => new AuthService()).not.toThrow();
    });
  });
});
