import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { EventBusService } from './event-bus.service';
import { AuthHttpService } from './auth-http.service';
import { AuthResponse, UsuarioDTO } from '../models';
import { STORAGE_KEYS } from '../core/constants';

/**
 * Usuario autenticado
 */
export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  avatar: string | null;
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
 * @description Servicio de autenticación que conecta con el backend real.
 * Gestiona tokens JWT y sesiones de usuario.
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
  private authHttpService = inject(AuthHttpService);

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

  constructor() {
    this.loadStoredAuth();
  }

  // ========================================
  // MÉTODOS DE AUTENTICACIÓN
  // ========================================

  /**
   * Inicia sesión con email y contraseña
   * Conecta con el backend real
   */
  login(email: string, password: string): Observable<AuthUser> {
    this.setLoading(true);

    return this.authHttpService.login({ email, contrasenia: password }).pipe(
      tap(response => {
        const user = this.mapUsuarioToAuthUser(response.usuario);
        this.setAuthState({
          isAuthenticated: true,
          user,
          token: response.token,
          loading: false
        });
        this.saveToStorage(user, response.token);
      }),
      map(response => this.mapUsuarioToAuthUser(response.usuario)),
      catchError(error => {
        this.setLoading(false);
        return throwError(() => error);
      })
    );
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
   * Conecta con el backend real
   */
  register(email: string, nombre: string, password: string): Observable<boolean> {
    this.setLoading(true);

    return this.authHttpService.registro({ email, nombre, contrasenia: password }).pipe(
      tap(response => {
        const user = this.mapUsuarioToAuthUser(response.usuario);
        this.setAuthState({
          isAuthenticated: true,
          user,
          token: response.token,
          loading: false
        });
        this.saveToStorage(user, response.token);
      }),
      map(() => true),
      catchError(error => {
        this.setLoading(false);
        return throwError(() => error);
      })
    );
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

    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

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
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Limpia el almacenamiento
   */
  private clearStorage(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // ========================================
  // UTILIDADES PRIVADAS
  // ========================================

  /**
   * Convierte UsuarioDTO a AuthUser
   */
  private mapUsuarioToAuthUser(usuario: UsuarioDTO): AuthUser {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      avatar: usuario.avatar,
      rol: usuario.rol as 'USER' | 'ADMIN'
    };
  }

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
