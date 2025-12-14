import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Estado de navegación para pasar entre rutas
 */
export interface NavigationState {
  previousUrl?: string;
  data?: Record<string, unknown>;
  fragment?: string;
}

/**
 * Elemento de breadcrumb
 */
export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
}

/**
 * @service NavigationService
 * @description Servicio centralizado para la navegación programática.
 * Proporciona métodos para navegar entre rutas, gestionar query params,
 * fragments y mantener el historial de navegación.
 * 
 * @example
 * // En un componente
 * private navigationService = inject(NavigationService);
 * 
 * // Navegar a detalle de juego
 * this.navigationService.navigateToGameDetail(1);
 * 
 * // Navegar con query params
 * this.navigationService.navigateWithQueryParams('/buscar', { q: 'call of duty', page: 1 });
 * 
 * // Navegar con estado
 * this.navigationService.navigateWithState('/juego/1', { previousUrl: '/buscar' });
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  /** Estado de navegación actual */
  private navigationState: NavigationState = {};

  /** Historial de URLs visitadas */
  private urlHistory: string[] = [];
  private maxHistorySize = 10;

  /** Breadcrumbs actuales */
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbsSubject.asObservable();

  constructor() {
    // Suscribirse a los eventos de navegación
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.addToHistory(event.urlAfterRedirects);
      this.updateBreadcrumbs();
    });
  }

  // ========================================
  // NAVEGACIÓN BÁSICA
  // ========================================

  /**
   * Navega a una ruta específica
   */
  navigate(path: string | string[], extras?: NavigationExtras): Promise<boolean> {
    const commands = Array.isArray(path) ? path : [path];
    return this.router.navigate(commands, extras);
  }

  /**
   * Navega a una URL absoluta
   */
  navigateByUrl(url: string, extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigateByUrl(url, extras);
  }

  /**
   * Vuelve a la página anterior
   */
  goBack(): void {
    if (this.urlHistory.length > 1) {
      // Eliminar la URL actual
      this.urlHistory.pop();
      const previousUrl = this.urlHistory[this.urlHistory.length - 1];
      if (previousUrl) {
        this.router.navigateByUrl(previousUrl);
      }
    } else {
      // Si no hay historial, ir al inicio
      this.router.navigate(['/']);
    }
  }

  // ========================================
  // NAVEGACIÓN CON PARÁMETROS
  // ========================================

  /**
   * Navega con query params
   */
  navigateWithQueryParams(
    path: string,
    queryParams: Record<string, string | number | null | undefined>,
    replaceUrl = true
  ): Promise<boolean> {
    // Limpiar params nulos o undefined
    const cleanParams: Record<string, string | number> = {};
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        cleanParams[key] = value;
      }
    });

    return this.router.navigate([path], {
      queryParams: cleanParams,
      queryParamsHandling: 'merge',
      replaceUrl
    });
  }

  /**
   * Navega con fragment (#section)
   */
  navigateWithFragment(path: string, fragment: string): Promise<boolean> {
    return this.router.navigate([path], { fragment });
  }

  /**
   * Navega con estado adicional (NavigationExtras.state)
   */
  navigateWithState(path: string | string[], state: NavigationState): Promise<boolean> {
    this.navigationState = state;
    const commands = Array.isArray(path) ? path : [path];
    return this.router.navigate(commands, {
      state: state
    });
  }

  // ========================================
  // NAVEGACIÓN A RUTAS ESPECÍFICAS
  // ========================================

  /**
   * Navega a la página de inicio
   */
  navigateToHome(): Promise<boolean> {
    return this.router.navigate(['/']);
  }

  /**
   * Navega a la página de búsqueda
   */
  navigateToSearch(query?: string): Promise<boolean> {
    if (query) {
      return this.router.navigate(['/buscar'], { queryParams: { q: query } });
    }
    return this.router.navigate(['/buscar']);
  }

  /**
   * Navega al detalle de un juego
   */
  navigateToGameDetail(gameId: number, fragment?: string): Promise<boolean> {
    const extras: NavigationExtras = {
      state: { previousUrl: this.router.url }
    };
    if (fragment) {
      extras.fragment = fragment;
    }
    this.navigationState = { previousUrl: this.router.url };
    return this.router.navigate(['/juego', gameId], extras);
  }

  /**
   * Navega al perfil de un usuario
   */
  navigateToUserProfile(userId: number, tab?: 'juegos' | 'reviews'): Promise<boolean> {
    const path = tab ? ['/usuario', userId, tab] : ['/usuario', userId];
    return this.router.navigate(path);
  }

  /**
   * Navega a los ajustes
   */
  navigateToSettings(tab?: 'perfil' | 'contrasenia' | 'avatar'): Promise<boolean> {
    const path = tab ? ['/ajustes', tab] : ['/ajustes'];
    return this.router.navigate(path);
  }

  // ========================================
  // GESTIÓN DE ESTADO
  // ========================================

  /**
   * Obtiene el estado de navegación actual
   */
  getNavigationState(): NavigationState {
    const historyState = history.state as NavigationState;
    return { ...this.navigationState, ...historyState };
  }

  /**
   * Limpia el estado de navegación
   */
  clearNavigationState(): void {
    this.navigationState = {};
  }

  /**
   * Obtiene la URL anterior
   */
  getPreviousUrl(): string | null {
    if (this.urlHistory.length > 1) {
      return this.urlHistory[this.urlHistory.length - 2];
    }
    return null;
  }

  /**
   * Obtiene la URL actual
   */
  getCurrentUrl(): string {
    return this.router.url;
  }

  // ========================================
  // HISTORIAL
  // ========================================

  /**
   * Añade una URL al historial
   */
  private addToHistory(url: string): void {
    // No añadir duplicados consecutivos
    if (this.urlHistory[this.urlHistory.length - 1] !== url) {
      this.urlHistory.push(url);
      
      // Limitar el tamaño del historial
      if (this.urlHistory.length > this.maxHistorySize) {
        this.urlHistory.shift();
      }
    }
  }

  /**
   * Obtiene el historial de navegación
   */
  getHistory(): string[] {
    return [...this.urlHistory];
  }

  /**
   * Limpia el historial
   */
  clearHistory(): void {
    this.urlHistory = [];
  }

  // ========================================
  // BREADCRUMBS
  // ========================================

  /**
   * Actualiza los breadcrumbs basándose en la ruta actual
   */
  private updateBreadcrumbs(): void {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', url: '/', icon: '🏠' }
    ];

    let currentRoute = this.activatedRoute.root;
    let url = '';

    while (currentRoute.children.length > 0) {
      const childRoute = currentRoute.children[0];
      const routeConfig = childRoute.routeConfig;

      if (routeConfig?.path) {
        // Construir la URL
        const pathSegments = routeConfig.path.split('/');
        const snapshot = childRoute.snapshot;

        pathSegments.forEach(segment => {
          if (segment.startsWith(':')) {
            // Reemplazar parámetros con valores reales
            const paramName = segment.substring(1);
            const paramValue = snapshot.params[paramName];
            url += `/${paramValue}`;
          } else if (segment) {
            url += `/${segment}`;
          }
        });

        // Obtener el título del breadcrumb
        const data = routeConfig.data || {};
        if (data['breadcrumb']) {
          let label = data['breadcrumb'];
          
          // Reemplazar placeholders con valores de parámetros
          Object.entries(snapshot.params).forEach(([key, value]) => {
            label = label.replace(`:${key}`, value);
          });

          breadcrumbs.push({
            label,
            url,
            icon: data['breadcrumbIcon']
          });
        }
      }

      currentRoute = childRoute;
    }

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * Obtiene los breadcrumbs actuales
   */
  getBreadcrumbs(): BreadcrumbItem[] {
    return this.breadcrumbsSubject.getValue();
  }

  // ========================================
  // UTILIDADES
  // ========================================

  /**
   * Comprueba si la ruta actual coincide con un patrón
   */
  isCurrentRoute(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  /**
   * Comprueba si es la página de inicio
   */
  isHome(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  /**
   * Extrae los query params de la URL actual
   */
  getQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};
    this.activatedRoute.snapshot.queryParams;
    return params;
  }

  /**
   * Recarga la ruta actual
   */
  reload(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
