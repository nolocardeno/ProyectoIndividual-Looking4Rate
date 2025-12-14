import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventBusService } from './event-bus.service';

/**
 * Usuario autenticado
 */
export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  avatar: string;
  rol: 'USER' | 'ADMIN';
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

/**
 * @service AuthService
 * @description Servicio de autenticación simulado.
 * En producción, este servicio se conectaría con el backend para
 * gestionar tokens JWT y sesiones de usuario.
 * 
 * @example
 * private authService = inject(AuthService);
 * 
 * // Verificar autenticación
 * if (this.authService.isAuthenticated()) {
 *   console.log('Usuario autenticado');
 * }
 * 
 * // Obtener usuario actual
 * const user = this.authService.getCurrentUser();
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private eventBus = inject(EventBusService);

  /** Estado inicial */
  private readonly initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  };

  /** Estado de autenticación reactivo */
  private authStateSubject = new BehaviorSubject<AuthState>(this.initialState);
  public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

  /** URL para redirección post-login */
  private redirectUrl: string | null = null;

  /** Usuario de prueba para simulación */
  private mockUser: AuthUser = {
    id: 1,
    nombre: 'NOLORUBIO23',
    email: 'nolorubio@email.com',
    avatar: 'assets/img/avatars/user1.jpg',
    rol: 'USER'
  };

  constructor() {
    this.loadStoredAuth();
  }

  // ========================================
  // MÉTODOS DE AUTENTICACIÓN
  // ========================================

  /**
   * Inicia sesión con email y contraseña
   * SIMULADO - En producción se conectaría con el backend
   */
  login(username: string, password: string): Observable<AuthUser> {
    this.setLoading(true);

    // Simulación de login
    return new Observable<AuthUser>(observer => {
      setTimeout(() => {
        // Simular validación
        if (username && password.length >= 6) {
          // Usar el username como nombre del usuario
          const user: AuthUser = {
            ...this.mockUser,
            nombre: username,
            email: username.includes('@') ? username : `${username}@email.com`
          };
          const token = 'mock-jwt-token-' + Date.now();
          
          this.setAuthState({
            isAuthenticated: true,
            user,
            token,
            loading: false
          });

          // Guardar en localStorage
          this.saveToStorage(user, token);
          
          observer.next(user);
          observer.complete();
        } else {
          this.setLoading(false);
          observer.error(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authStateSubject.next(this.initialState);
    this.clearStorage();
    this.eventBus.emit('userLoggedOut', null);
  }

  /**
   * Registra un nuevo usuario
   * SIMULADO - En producción se conectaría con el backend
   */
  register(email: string, nombre: string, password: string): Observable<boolean> {
    this.setLoading(true);

    return new Observable<boolean>(observer => {
      setTimeout(() => {
        const user: AuthUser = {
          id: Date.now(),
          nombre,
          email,
          avatar: 'assets/img/avatars/default.jpg',
          rol: 'USER'
        };
        const token = 'mock-jwt-token-' + Date.now();

        this.setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false
        });

        this.saveToStorage(user, token);
        observer.next(true);
        observer.complete();
      }, 1500);
    });
  }

  // ========================================
  // MÉTODOS DE ESTADO
  // ========================================

  /**
   * Comprueba si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.getValue().isAuthenticated;
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): AuthUser | null {
    return this.authStateSubject.getValue().user;
  }

  /**
   * Obtiene el ID del usuario actual
   */
  getCurrentUserId(): number | null {
    return this.getCurrentUser()?.id || null;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.authStateSubject.getValue().token;
  }

  /**
   * Comprueba si el usuario es administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'ADMIN';
  }

  /**
   * Comprueba si el usuario es el propietario de un recurso
   */
  isOwner(userId: number): boolean {
    return this.getCurrentUserId() === userId;
  }

  // ========================================
  // REDIRECCIÓN
  // ========================================

  /**
   * Guarda la URL para redirección post-login
   */
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  /**
   * Obtiene la URL de redirección sin limpiarla
   */
  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  /**
   * Limpia la URL de redirección
   */
  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }

  /**
   * Solicita abrir el modal de login
   */
  requestLogin(): void {
    this.eventBus.emit('openLoginModal', null);
  }

  // ========================================
  // ALMACENAMIENTO
  // ========================================

  /**
   * Carga la autenticación almacenada
   */
  private loadStoredAuth(): void {
    if (typeof localStorage === 'undefined') return;

    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser) as AuthUser;
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token: storedToken,
          loading: false
        });
      } catch {
        this.clearStorage();
      }
    }
  }

  /**
   * Guarda la autenticación en localStorage
   */
  private saveToStorage(user: AuthUser, token: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
  }

  /**
   * Limpia el almacenamiento
   */
  private clearStorage(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  // ========================================
  // UTILIDADES PRIVADAS
  // ========================================

  /**
   * Actualiza el estado de autenticación
   */
  private setAuthState(state: AuthState): void {
    this.authStateSubject.next(state);
  }

  /**
   * Establece el estado de carga
   */
  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.getValue();
    this.authStateSubject.next({ ...currentState, loading });
  }
}
