/**
 * @fileoverview Tests para StateService
 * 
 * Suite de pruebas unitarias para el servicio de estado global.
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { take } from 'rxjs';
import { StateService, AppState, UIPreferences, UserInfo } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    
    service = TestBed.inject(StateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar con estado por defecto', (done) => {
      service.state$.pipe(take(1)).subscribe(state => {
        expect(state).toBeDefined();
        expect(state.auth.isAuthenticated).toBeFalse();
        expect(state.ui.theme).toBe('dark');
        done();
      });
    });
  });

  describe('Estado de autenticación', () => {
    const mockUser: UserInfo = {
      id: '1',
      username: 'testuser',
      email: 'test@email.com',
      role: 'user',
      createdAt: new Date()
    };

    it('debería establecer usuario con setUser', (done) => {
      service.setUser(mockUser, 'test-token');

      service.select(s => s.auth).pipe(take(1)).subscribe(auth => {
        expect(auth.isAuthenticated).toBeTrue();
        expect(auth.user?.username).toBe('testuser');
        expect(auth.token).toBe('test-token');
        done();
      });
    });

    it('debería limpiar usuario con logout', (done) => {
      service.setUser(mockUser, 'token');
      service.logout();

      service.select(s => s.auth).pipe(take(1)).subscribe(auth => {
        expect(auth.isAuthenticated).toBeFalse();
        expect(auth.user).toBeNull();
        expect(auth.token).toBeNull();
        done();
      });
    });

    it('isAuthenticated$ debería emitir estado correcto', (done) => {
      service.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
        expect(isAuth).toBeFalse();
        done();
      });
    });

    it('isAuthenticated$ debería emitir true después de login', (done) => {
      service.setUser(mockUser, 'token');

      service.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
        expect(isAuth).toBeTrue();
        done();
      });
    });

    it('currentUser$ debería emitir usuario actual', (done) => {
      service.setUser(mockUser, 'token');

      service.currentUser$.pipe(take(1)).subscribe(user => {
        expect(user?.username).toBe('testuser');
        done();
      });
    });
  });

  describe('Preferencias de UI', () => {
    it('debería cambiar tema con setTheme', (done) => {
      service.setTheme('light');

      service.select(s => s.ui.theme).pipe(take(1)).subscribe(theme => {
        expect(theme).toBe('light');
        done();
      });
    });

    it('theme$ debería emitir tema actual', (done) => {
      service.theme$.pipe(take(1)).subscribe(theme => {
        expect(['dark', 'light', 'system']).toContain(theme);
        done();
      });
    });

    it('debería alternar tema correctamente', fakeAsync(() => {
      let currentTheme: string = 'dark';
      
      service.theme$.subscribe(theme => {
        currentTheme = theme;
      });

      service.setTheme('light');
      tick();
      expect(currentTheme).toBe('light');

      service.setTheme('dark');
      tick();
      expect(currentTheme).toBe('dark');
    }));

    it('debería actualizar preferencias de UI', (done) => {
      const newPrefs: Partial<UIPreferences> = {
        language: 'en',
        sidebarCollapsed: true
      };

      service.updateUIPreferences(newPrefs);

      service.select(s => s.ui).pipe(take(1)).subscribe(ui => {
        expect(ui.language).toBe('en');
        expect(ui.sidebarCollapsed).toBeTrue();
        done();
      });
    });

    it('debería manejar tema del sistema', (done) => {
      service.setTheme('system');

      service.theme$.pipe(take(1)).subscribe(theme => {
        expect(theme).toBe('system');
        done();
      });
    });
  });

  describe('Selectores', () => {
    it('select debería crear selector para parte del estado', (done) => {
      service.select(s => s.ui.language).pipe(take(1)).subscribe(lang => {
        expect(lang).toBe('es');
        done();
      });
    });

    it('select debería emitir solo cuando el valor cambia', fakeAsync(() => {
      let emissionCount = 0;

      const sub = service.select(s => s.ui.theme).subscribe(() => {
        emissionCount++;
      });

      tick();
      expect(emissionCount).toBe(1);

      // Mismo valor, no debería emitir
      service.setTheme('dark');
      tick();
      expect(emissionCount).toBe(1);

      // Valor diferente, debería emitir
      service.setTheme('light');
      tick();
      expect(emissionCount).toBe(2);

      sub.unsubscribe();
    }));
  });

  describe('Estado online', () => {
    it('isOnline$ debería emitir estado de conexión', (done) => {
      service.isOnline$.pipe(take(1)).subscribe(isOnline => {
        expect(typeof isOnline).toBe('boolean');
        done();
      });
    });
  });

  describe('Persistencia', () => {
    it('debería persistir estado de UI en localStorage', fakeAsync(() => {
      service.setTheme('light');
      tick(100);

      const stored = localStorage.getItem('l4r-ui-preferences');
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.theme).toBe('light');
      }
    }));

    it('debería persistir estado de auth', fakeAsync(() => {
      const user: UserInfo = {
        id: '1',
        username: 'test',
        email: 'test@email.com',
        role: 'user',
        createdAt: new Date()
      };

      service.setUser(user, 'my-token');
      tick(100);

      const stored = localStorage.getItem('l4r-auth-state');
      expect(stored).toBeTruthy();
    }));
  });

  describe('Token', () => {
    it('isTokenExpired debería retornar true sin token', () => {
      expect(service.isTokenExpired()).toBeTrue();
    });

    it('isTokenExpired debería retornar false con token válido', () => {
      const user: UserInfo = {
        id: '1',
        username: 'test',
        email: 'test@email.com',
        role: 'user',
        createdAt: new Date()
      };

      service.setUser(user, 'token', 3600);

      expect(service.isTokenExpired()).toBeFalse();
    });
  });

  describe('Sidebar toggle', () => {
    it('toggleSidebar debería alternar estado del sidebar', (done) => {
      // Por defecto sidebarCollapsed es false
      service.toggleSidebar();

      service.select(s => s.ui.sidebarCollapsed).pipe(take(1)).subscribe(collapsed => {
        expect(collapsed).toBeTrue();
        done();
      });
    });
  });

  describe('getState', () => {
    it('debería retornar snapshot del estado actual', () => {
      service.setTheme('light');
      
      const state = service.getState();
      expect(state.ui.theme).toBe('light');
    });

    it('snapshot debería ser copia del estado', () => {
      const state1 = service.getState();
      const state2 = service.getState();
      
      expect(state1).not.toBe(state2);
    });
  });

  describe('Integración', () => {
    it('debería manejar flujo completo de autenticación', fakeAsync(() => {
      const user: UserInfo = {
        id: '1',
        username: 'testuser',
        email: 'test@email.com',
        role: 'user',
        createdAt: new Date()
      };

      // Login
      service.setUser(user, 'token-123');
      tick();

      let state = service.getState();
      expect(state.auth.isAuthenticated).toBeTrue();
      expect(state.auth.user?.username).toBe('testuser');

      // Logout
      service.logout();
      tick();

      state = service.getState();
      expect(state.auth.isAuthenticated).toBeFalse();
      expect(state.auth.user).toBeNull();
    }));
  });
});
