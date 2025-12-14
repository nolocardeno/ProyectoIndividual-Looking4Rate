/**
 * @fileoverview Guards Index - Exportación centralizada de guards
 * 
 * Los guards se utilizan para proteger rutas basándose en condiciones
 * como autenticación, permisos o cambios sin guardar.
 * 
 * @example
 * import { authGuard, canDeactivateGuard } from './guards';
 */

// ============================================
// Guards de autenticación
// ============================================

export {
  AuthGuard,
  authGuard,
  guestGuard,
  ownerGuard,
  adminGuard
} from './auth.guard';

// ============================================
// Guards de navegación
// ============================================

export {
  CanDeactivateGuard,
  canDeactivateGuard,
  createFormDeactivateGuard,
  type CanComponentDeactivate
} from './can-deactivate.guard';
