import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * Estado de autenticación del usuario
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  expiresAt: Date | null;
}

/**
 * Información del usuario autenticado
 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

/**
 * Preferencias de UI del usuario
 */
export interface UIPreferences {
  theme: 'dark' | 'light' | 'system';
  language: string;
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
}

/**
 * Estado global de la aplicación
 */
export interface AppState {
  auth: AuthState;
  ui: UIPreferences;
  isOnline: boolean;
  lastSync: Date | null;
}

/** Estado inicial de la aplicación */
const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    expiresAt: null
  },
  ui: {
    theme: 'dark',
    language: 'es',
    sidebarCollapsed: false,
    notificationsEnabled: true
  },
  isOnline: true,
  lastSync: null
};

/** Claves para persistencia en localStorage */
const STORAGE_KEYS = {
  AUTH: 'l4r-auth-state',
  UI: 'l4r-ui-preferences'
};

/**
 * StateService
 * 
 * Servicio de estado global de la aplicación usando el patrón BehaviorSubject.
 * Proporciona un almacén centralizado para datos compartidos entre componentes.
 * 
 * Características:
 * - Estado inmutable (se devuelven copias)
 * - Selectores para partes específicas del estado
 * - Persistencia automática en localStorage
 * - Métodos específicos para cada dominio (auth, ui)
 * 
 * @example
 * // Obtener estado completo
 * state.state$.subscribe(state => console.log(state));
 * 
 * // Selector específico
 * state.select(s => s.auth.isAuthenticated).subscribe(isAuth => ...);
 * 
 * // Actualizar estado
 * state.setUser({ id: '1', username: 'user', ... });
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  /** BehaviorSubject con el estado completo */
  private stateSubject: BehaviorSubject<AppState>;
  
  /** Observable público del estado */
  public state$: Observable<AppState>;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Cargar estado inicial (desde localStorage si existe)
    const loadedState = this.loadState();
    this.stateSubject = new BehaviorSubject<AppState>(loadedState);
    this.state$ = this.stateSubject.asObservable();

    // Escuchar cambios de conectividad
    if (this.isBrowser) {
      window.addEventListener('online', () => this.setOnlineStatus(true));
      window.addEventListener('offline', () => this.setOnlineStatus(false));
    }
  }

  // ===========================================================================
  // MÉTODOS GENERALES
  // ===========================================================================

  /**
   * Obtiene el estado actual (snapshot)
   */
  getState(): AppState {
    return { ...this.stateSubject.value };
  }

  /**
   * Selector para obtener una parte específica del estado
   * @param selector - Función que extrae la parte deseada del estado
   * @returns Observable que emite solo cuando esa parte cambia
   */
  select<T>(selector: (state: AppState) => T): Observable<T> {
    return this.state$.pipe(
      map(selector),
      distinctUntilChanged()
    );
  }

  /**
   * Actualiza el estado de forma parcial
   * @param partial - Objeto parcial con los cambios
   */
  private updateState(partial: Partial<AppState>): void {
    const newState = { ...this.stateSubject.value, ...partial };
    this.stateSubject.next(newState);
  }

  // ===========================================================================
  // AUTENTICACIÓN
  // ===========================================================================

  /** Observable del estado de autenticación */
  get isAuthenticated$(): Observable<boolean> {
    return this.select(state => state.auth.isAuthenticated);
  }

  /** Observable del usuario actual */
  get currentUser$(): Observable<UserInfo | null> {
    return this.select(state => state.auth.user);
  }

  /**
   * Establece el usuario autenticado
   */
  setUser(user: UserInfo, token: string, expiresIn: number = 3600): void {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    const authState: AuthState = {
      isAuthenticated: true,
      user,
      token,
      expiresAt
    };

    this.updateState({ auth: authState, lastSync: new Date() });
    this.persistAuth(authState);
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    const authState: AuthState = {
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null
    };

    this.updateState({ auth: authState });
    this.clearPersistedAuth();
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(): boolean {
    const { expiresAt } = this.stateSubject.value.auth;
    if (!expiresAt) return true;
    return new Date() > expiresAt;
  }

  // ===========================================================================
  // UI / PREFERENCIAS
  // ===========================================================================

  /** Observable del tema actual */
  get theme$(): Observable<'dark' | 'light' | 'system'> {
    return this.select(state => state.ui.theme);
  }

  /**
   * Cambia el tema de la aplicación
   */
  setTheme(theme: 'dark' | 'light' | 'system'): void {
    const ui = { ...this.stateSubject.value.ui, theme };
    this.updateState({ ui });
    this.persistUI(ui);
  }

  /**
   * Actualiza las preferencias de UI
   */
  updateUIPreferences(preferences: Partial<UIPreferences>): void {
    const ui = { ...this.stateSubject.value.ui, ...preferences };
    this.updateState({ ui });
    this.persistUI(ui);
  }

  /**
   * Alterna el estado del sidebar
   */
  toggleSidebar(): void {
    const current = this.stateSubject.value.ui.sidebarCollapsed;
    this.updateUIPreferences({ sidebarCollapsed: !current });
  }

  // ===========================================================================
  // CONECTIVIDAD
  // ===========================================================================

  /** Observable del estado de conexión */
  get isOnline$(): Observable<boolean> {
    return this.select(state => state.isOnline);
  }

  /**
   * Actualiza el estado de conexión
   */
  private setOnlineStatus(isOnline: boolean): void {
    this.updateState({ isOnline });
  }

  // ===========================================================================
  // PERSISTENCIA
  // ===========================================================================

  /**
   * Carga el estado desde localStorage
   */
  private loadState(): AppState {
    if (!this.isBrowser) return initialState;

    try {
      const authJson = localStorage.getItem(STORAGE_KEYS.AUTH);
      const uiJson = localStorage.getItem(STORAGE_KEYS.UI);

      let auth = initialState.auth;
      let ui = initialState.ui;

      if (authJson) {
        const parsed = JSON.parse(authJson);
        // Verificar si el token no ha expirado
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          auth = {
            ...parsed,
            expiresAt: new Date(parsed.expiresAt)
          };
        }
      }

      if (uiJson) {
        ui = { ...initialState.ui, ...JSON.parse(uiJson) };
      }

      return { ...initialState, auth, ui };
    } catch {
      return initialState;
    }
  }

  /**
   * Persiste el estado de autenticación
   */
  private persistAuth(auth: AuthState): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    } catch {
      // localStorage no disponible
    }
  }

  /**
   * Elimina el estado de autenticación persistido
   */
  private clearPersistedAuth(): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      // localStorage no disponible
    }
  }

  /**
   * Persiste las preferencias de UI
   */
  private persistUI(ui: UIPreferences): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.UI, JSON.stringify(ui));
    } catch {
      // localStorage no disponible
    }
  }

  /**
   * Resetea el estado a los valores iniciales
   */
  resetState(): void {
    this.stateSubject.next(initialState);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.UI);
    }
  }
}
