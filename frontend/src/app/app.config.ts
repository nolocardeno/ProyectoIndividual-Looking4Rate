import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { 
  provideRouter, 
  withInMemoryScrolling, 
  withPreloading,
  withComponentInputBinding,
  withRouterConfig,
  PreloadAllModules
} from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { httpInterceptors } from './core/interceptors';

/**
 * Configuración principal de la aplicación Angular
 * 
 * Incluye:
 * - Router con lazy loading y precarga de módulos
 * - Scroll automático con anclas y restauración de posición
 * - Input binding para parámetros de ruta
 * - Hydration del cliente para SSR
 * - HttpClient con interceptores para comunicación API
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // ========================================
    // ROUTER
    // ========================================
    provideRouter(
      routes,
      // Estrategia de precarga: carga todos los módulos después de la carga inicial
      withPreloading(PreloadAllModules),
      // Scroll automático a anclas y restauración de posición
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      // Permite binding de parámetros de ruta a inputs de componentes
      withComponentInputBinding(),
      // Configuración adicional del router
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always'
      })
    ),
    
    // ========================================
    // HTTP CLIENT
    // ========================================
    provideHttpClient(
      // Usar Fetch API para mejor rendimiento en SSR
      withFetch(),
      // Interceptores en orden: logging -> loading -> auth -> error
      withInterceptors(httpInterceptors)
    ),
    
    // ========================================
    // HYDRATION (SSR)
    // ========================================
    provideClientHydration(withEventReplay())
  ]
};
