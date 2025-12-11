/**
 * @fileoverview Services Index - Exportación centralizada de servicios
 * 
 * Este archivo proporciona una exportación centralizada de todos los
 * servicios de la aplicación para facilitar las importaciones.
 * 
 * @example
 * // En lugar de:
 * import { EventBusService } from './services/event-bus.service';
 * import { StateService } from './services/state.service';
 * import { LoadingService } from './services/loading.service';
 * 
 * // Puedes usar:
 * import { EventBusService, StateService, LoadingService } from './services';
 * 
 * @author Looking4Rate Team
 * @version 2.0.0
 */

// ============================================
// Servicios de comunicación
// ============================================

export { 
  EventBusService,
  type BusEvent,
  type EventType
} from './event-bus.service';

// ============================================
// Servicios de estado
// ============================================

export { 
  StateService
} from './state.service';

// ============================================
// Servicios de carga
// ============================================

export { 
  LoadingService
} from './loading.service';

// ============================================
// Servicios de notificaciones
// ============================================

export { 
  NotificationService,
  type NotificationConfig,
  type NotificationState,
  type NotificationType,
  type NotificationPosition
} from './notification.service';
