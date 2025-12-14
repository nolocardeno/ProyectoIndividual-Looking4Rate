import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { gameResolver, userResolver } from './resolvers/data.resolver';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONFIGURACIÓN DE RUTAS - LOOKING4RATE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Este archivo define todas las rutas de la aplicación, implementando:
 * - Lazy Loading para optimizar la carga inicial
 * - Route Guards para protección de rutas
 * - Resolvers para precarga de datos
 * - Rutas hijas anidadas
 * - Breadcrumbs dinámicos
 * - Ruta wildcard para 404
 * 
 * @see README_CLIENTE.md para documentación completa del sistema de rutas
 */

export const routes: Routes = [
  // ========================================
  // RUTA PRINCIPAL - HOME
  // ========================================
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
    title: 'Looking4Rate - Tu plataforma de valoración de videojuegos',
    data: { breadcrumb: 'Inicio' }
  },

  // ========================================
  // BÚSQUEDA DE JUEGOS
  // ========================================
  {
    path: 'buscar',
    loadComponent: () => import('./pages/search/search'),
    title: 'Buscar juegos - Looking4Rate',
    data: { breadcrumb: 'Búsqueda' }
  },

  // ========================================
  // DETALLE DE JUEGO (con Resolver)
  // ========================================
  {
    path: 'juego/:id',
    loadComponent: () => import('./pages/game-detail/game-detail'),
    resolve: { game: gameResolver },
    title: 'Detalle de juego - Looking4Rate',
    data: { breadcrumb: 'Detalle del Juego' }
  },

  // ========================================
  // PERFIL DE USUARIO (con Resolver y Rutas Hijas)
  // ========================================
  {
    path: 'usuario/:id',
    loadComponent: () => import('./pages/profile/profile'),
    resolve: { user: userResolver },
    title: 'Perfil de usuario - Looking4Rate',
    data: { breadcrumb: 'Perfil de Usuario' },
    children: [
      {
        path: '',
        redirectTo: 'juegos',
        pathMatch: 'full'
      },
      {
        path: 'juegos',
        loadComponent: () => import('./pages/profile/tabs/user-games'),
        title: 'Juegos del usuario - Looking4Rate',
        data: { breadcrumb: 'Juegos' }
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/profile/tabs/user-reviews'),
        title: 'Reseñas del usuario - Looking4Rate',
        data: { breadcrumb: 'Reseñas' }
      }
    ]
  },

  // ========================================
  // AJUSTES DE CUENTA (protegida con Guards y Rutas Hijas)
  // ========================================
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/settings/settings'),
    canActivate: [authGuard],
    title: 'Ajustes de cuenta - Looking4Rate',
    data: { breadcrumb: 'Ajustes' },
    children: [
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/settings/tabs/settings-profile'),
        canDeactivate: [canDeactivateGuard],
        title: 'Editar perfil - Looking4Rate',
        data: { breadcrumb: 'Editar Perfil' }
      },
      {
        path: 'password',
        loadComponent: () => import('./pages/settings/tabs/settings-password'),
        title: 'Cambiar contraseña - Looking4Rate',
        data: { breadcrumb: 'Contraseña' }
      },
      {
        path: 'avatar',
        loadComponent: () => import('./pages/settings/tabs/settings-avatar'),
        title: 'Cambiar avatar - Looking4Rate',
        data: { breadcrumb: 'Avatar' }
      }
    ]
  },

  // ========================================
  // GUÍA DE ESTILOS (desarrollo)
  // ========================================
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide'),
    title: 'Guía de estilos - Looking4Rate',
    data: { breadcrumb: 'Guía de Estilo' }
  },

  // ========================================
  // PÁGINA 404 - NOT FOUND
  // ========================================
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found'),
    title: 'Página no encontrada - Looking4Rate',
    data: { breadcrumb: 'Página no encontrada' }
  },

  // ========================================
  // RUTA WILDCARD - Redirige a 404
  // ========================================
  {
    path: '**',
    redirectTo: '404'
  }
];
