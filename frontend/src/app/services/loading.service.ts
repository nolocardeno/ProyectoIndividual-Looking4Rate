import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Estado de carga individual
 */
export interface LoadingState {
  id: string;
  isLoading: boolean;
  message?: string;
  progress?: number; // 0-100 para barras de progreso
  autoCloseOnComplete?: boolean; // Cerrar automáticamente al llegar a 100%
}

/**
 * Estado global de carga
 */
export interface GlobalLoadingState {
  /** Indica si hay alguna operación de carga activa */
  isLoading: boolean;
  /** Mensaje a mostrar en el spinner global */
  message: string;
  /** Lista de operaciones de carga activas */
  activeLoaders: LoadingState[];
  /** Contador de operaciones (para múltiples cargas simultáneas) */
  count: number;
}

/** Estado inicial */
const initialState: GlobalLoadingState = {
  isLoading: false,
  message: '',
  activeLoaders: [],
  count: 0
};

/**
 * LoadingService
 * 
 * Servicio centralizado para gestionar estados de carga en la aplicación.
 * Soporta tanto un spinner global como estados de carga locales por componente.
 * 
 * Características:
 * - Spinner global con contador (múltiples cargas simultáneas)
 * - Estados locales identificados por ID único
 * - Soporte para mensajes personalizados
 * - Soporte para barras de progreso
 * - Auto-timeout opcional para evitar spinners eternos
 * 
 * @example
 * // Carga global simple
 * loadingService.showGlobal('Cargando datos...');
 * await fetchData();
 * loadingService.hideGlobal();
 * 
 * // Carga local en un componente
 * loadingService.show('submit-button', 'Enviando...');
 * await submitForm();
 * loadingService.hide('submit-button');
 * 
 * // Con async/await wrapper
 * await loadingService.withLoading('my-operation', async () => {
 *   return await someAsyncOperation();
 * });
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /** Subject con el estado de carga */
  private stateSubject = new BehaviorSubject<GlobalLoadingState>(initialState);
  
  /** Observable del estado completo */
  public state$ = this.stateSubject.asObservable();

  /** Map de timeouts para auto-hide */
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  // ===========================================================================
  // OBSERVABLES DERIVADOS
  // ===========================================================================

  /** Observable del estado de carga global */
  get isLoading$(): Observable<boolean> {
    return this.state$.pipe(map(s => s.isLoading));
  }

  /** Observable del mensaje global */
  get message$(): Observable<string> {
    return this.state$.pipe(map(s => s.message));
  }

  /** Observable del número de operaciones activas */
  get activeCount$(): Observable<number> {
    return this.state$.pipe(map(s => s.count));
  }

  /**
   * Observable para el componente spinner global
   * Emite LoadingState o null cuando no hay carga
   */
  get globalLoading$(): Observable<LoadingState | null> {
    return this.state$.pipe(
      map(s => {
        if (!s.isLoading) return null;
        // Buscar si hay un loader global con progreso
        const globalLoader = s.activeLoaders.find(l => l.id === '__global__');
        return { 
          id: '__global__', 
          isLoading: true, 
          message: s.message,
          progress: globalLoader?.progress
        };
      })
    );
  }

  // ===========================================================================
  // CARGA GLOBAL (SPINNER OVERLAY)
  // ===========================================================================

  /**
   * Muestra el spinner global
   * @param message - Mensaje opcional a mostrar
   * @param timeout - Tiempo máximo en ms antes de ocultar automáticamente
   */
  showGlobal(message: string = 'Cargando...', timeout?: number): void {
    const current = this.stateSubject.value;
    
    this.stateSubject.next({
      ...current,
      isLoading: true,
      message,
      count: current.count + 1
    });

    // Configurar timeout si se especifica
    if (timeout) {
      this.setAutoHide('__global__', timeout);
    }
  }

  /**
   * Oculta el spinner global
   * Decrementa el contador y solo oculta si llega a 0
   */
  hideGlobal(): void {
    const current = this.stateSubject.value;
    const newCount = Math.max(0, current.count - 1);
    
    this.clearTimeout('__global__');
    
    this.stateSubject.next({
      ...current,
      isLoading: newCount > 0,
      message: newCount > 0 ? current.message : '',
      count: newCount
    });
  }

  /**
   * Fuerza la ocultación del spinner global (resetea contador)
   */
  forceHideGlobal(): void {
    this.clearTimeout('__global__');
    
    this.stateSubject.next({
      ...this.stateSubject.value,
      isLoading: false,
      message: '',
      count: 0
    });
  }

  /**
   * Actualiza el mensaje del spinner global
   */
  updateGlobalMessage(message: string): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      message
    });
  }

  /**
   * Actualiza el progreso del spinner global
   * @param progress - Progreso de 0 a 100
   * @param message - Mensaje opcional a mostrar
   * @param autoCloseOnComplete - Si es true, cierra automáticamente al llegar a 100%
   */
  updateGlobalProgress(progress: number, message?: string, autoCloseOnComplete: boolean = true): void {
    const normalizedProgress = Math.min(100, Math.max(0, progress));
    const current = this.stateSubject.value;
    
    // Buscar o crear el loader global
    let activeLoaders = [...current.activeLoaders];
    const globalIndex = activeLoaders.findIndex(l => l.id === '__global__');
    
    if (globalIndex >= 0) {
      activeLoaders[globalIndex] = {
        ...activeLoaders[globalIndex],
        progress: normalizedProgress,
        message: message ?? activeLoaders[globalIndex].message,
        autoCloseOnComplete
      };
    } else {
      activeLoaders.push({
        id: '__global__',
        isLoading: true,
        progress: normalizedProgress,
        message,
        autoCloseOnComplete
      });
    }
    
    this.stateSubject.next({
      ...current,
      activeLoaders,
      message: message ?? current.message
    });
    
    // Auto-cerrar si llegó a 100% y autoCloseOnComplete está activado
    if (normalizedProgress >= 100 && autoCloseOnComplete) {
      // Pequeño delay para que se vea el 100%
      setTimeout(() => {
        this.hideGlobal();
      }, 300);
    }
  }

  // ===========================================================================
  // CARGA LOCAL (POR COMPONENTE/ELEMENTO)
  // ===========================================================================

  /**
   * Inicia la carga para un elemento específico
   * @param id - Identificador único del elemento
   * @param message - Mensaje opcional
   * @param timeout - Auto-hide en ms
   */
  show(id: string, message?: string, timeout?: number): void {
    const current = this.stateSubject.value;
    const existingIndex = current.activeLoaders.findIndex(l => l.id === id);
    
    const newLoader: LoadingState = {
      id,
      isLoading: true,
      message
    };

    let activeLoaders: LoadingState[];
    
    if (existingIndex >= 0) {
      activeLoaders = [...current.activeLoaders];
      activeLoaders[existingIndex] = newLoader;
    } else {
      activeLoaders = [...current.activeLoaders, newLoader];
    }

    this.stateSubject.next({
      ...current,
      activeLoaders
    });

    if (timeout) {
      this.setAutoHide(id, timeout);
    }
  }

  /**
   * Finaliza la carga para un elemento específico
   */
  hide(id: string): void {
    const current = this.stateSubject.value;
    
    this.clearTimeout(id);
    
    this.stateSubject.next({
      ...current,
      activeLoaders: current.activeLoaders.filter(l => l.id !== id)
    });
  }

  /**
   * Actualiza el progreso de una operación
   * @param id - Identificador del elemento
   * @param progress - Progreso de 0 a 100
   */
  updateProgress(id: string, progress: number): void {
    const current = this.stateSubject.value;
    const loaderIndex = current.activeLoaders.findIndex(l => l.id === id);
    
    if (loaderIndex >= 0) {
      const activeLoaders = [...current.activeLoaders];
      activeLoaders[loaderIndex] = {
        ...activeLoaders[loaderIndex],
        progress: Math.min(100, Math.max(0, progress))
      };
      
      this.stateSubject.next({
        ...current,
        activeLoaders
      });
    }
  }

  /**
   * Verifica si un elemento específico está cargando
   */
  isLoadingId(id: string): Observable<boolean> {
    return this.state$.pipe(
      map(s => s.activeLoaders.some(l => l.id === id && l.isLoading))
    );
  }

  /**
   * Obtiene el estado de carga de un elemento específico
   */
  getLoaderState(id: string): Observable<LoadingState | undefined> {
    return this.state$.pipe(
      map(s => s.activeLoaders.find(l => l.id === id))
    );
  }

  // ===========================================================================
  // UTILIDADES
  // ===========================================================================

  /**
   * Wrapper que gestiona automáticamente el estado de carga
   * @param id - Identificador del loader (o '__global__' para global)
   * @param operation - Función asíncrona a ejecutar
   * @param message - Mensaje a mostrar durante la carga
   * @returns El resultado de la operación
   */
  async withLoading<T>(
    id: string,
    operation: () => Promise<T>,
    message?: string
  ): Promise<T> {
    const isGlobal = id === '__global__';
    
    try {
      if (isGlobal) {
        this.showGlobal(message);
      } else {
        this.show(id, message);
      }
      
      return await operation();
    } finally {
      if (isGlobal) {
        this.hideGlobal();
      } else {
        this.hide(id);
      }
    }
  }

  /**
   * Wrapper para múltiples operaciones en paralelo
   */
  async withLoadingAll<T>(
    operations: Array<{ id: string; operation: () => Promise<T>; message?: string }>
  ): Promise<T[]> {
    // Iniciar todos los loaders
    operations.forEach(op => this.show(op.id, op.message));
    
    try {
      // Ejecutar todas las operaciones en paralelo
      const results = await Promise.all(
        operations.map(async op => {
          try {
            return await op.operation();
          } finally {
            this.hide(op.id);
          }
        })
      );
      
      return results;
    } catch (error) {
      // Ocultar todos los loaders en caso de error
      operations.forEach(op => this.hide(op.id));
      throw error;
    }
  }

  /**
   * Configura auto-hide con timeout
   */
  private setAutoHide(id: string, timeout: number): void {
    this.clearTimeout(id);
    
    const timeoutId = setTimeout(() => {
      if (id === '__global__') {
        this.hideGlobal();
      } else {
        this.hide(id);
      }
    }, timeout);
    
    this.timeouts.set(id, timeoutId);
  }

  /**
   * Limpia el timeout de un loader
   */
  private clearTimeout(id: string): void {
    const existingTimeout = this.timeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(id);
    }
  }

  /**
   * Limpia todos los estados de carga
   */
  reset(): void {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts.clear();
    this.stateSubject.next(initialState);
  }
}
