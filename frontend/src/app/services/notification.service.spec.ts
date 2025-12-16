/**
 * @fileoverview Tests para NotificationService
 * 
 * Suite de pruebas unitarias para el servicio de notificaciones.
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService, NotificationConfig, NotificationState } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería iniciar sin notificaciones', (done) => {
      service.notifications$.subscribe(notifications => {
        expect(notifications).toEqual([]);
        done();
      });
    });
  });

  describe('show', () => {
    it('debería mostrar una notificación', (done) => {
      const config: NotificationConfig = {
        type: 'info',
        message: 'Mensaje de prueba'
      };

      service.show(config);

      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Mensaje de prueba');
        expect(notifications[0].type).toBe('info');
        done();
      });
    });

    it('debería retornar un ID único para cada notificación', () => {
      const id1 = service.show({ type: 'info', message: 'Mensaje 1' });
      const id2 = service.show({ type: 'info', message: 'Mensaje 2' });

      expect(id1).not.toBe(id2);
    });

    it('debería aplicar configuración por defecto', (done) => {
      service.show({ type: 'success', message: 'Test' });

      service.notifications$.subscribe(notifications => {
        const notification = notifications[0];
        expect(notification.position).toBe('top-right');
        expect(notification.duration).toBe(5000);
        expect(notification.dismissible).toBeTrue();
        done();
      });
    });

    it('debería permitir configuración personalizada', (done) => {
      service.show({
        type: 'warning',
        message: 'Custom',
        position: 'bottom-center',
        duration: 3000,
        dismissible: false
      });

      service.notifications$.subscribe(notifications => {
        const notification = notifications[0];
        expect(notification.position).toBe('bottom-center');
        expect(notification.duration).toBe(3000);
        expect(notification.dismissible).toBeFalse();
        done();
      });
    });

    it('debería permitir título opcional', (done) => {
      service.show({
        type: 'info',
        title: 'Título',
        message: 'Mensaje'
      });

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].title).toBe('Título');
        done();
      });
    });
  });

  describe('Métodos de conveniencia', () => {
    it('success() debería crear notificación de éxito', (done) => {
      service.success('Operación exitosa');

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].type).toBe('success');
        expect(notifications[0].message).toBe('Operación exitosa');
        done();
      });
    });

    it('error() debería crear notificación de error', (done) => {
      service.error('Error ocurrido');

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].type).toBe('error');
        expect(notifications[0].message).toBe('Error ocurrido');
        done();
      });
    });

    it('warning() debería crear notificación de advertencia', (done) => {
      service.warning('Advertencia');

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].type).toBe('warning');
        expect(notifications[0].message).toBe('Advertencia');
        done();
      });
    });

    it('info() debería crear notificación informativa', (done) => {
      service.info('Información');

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].type).toBe('info');
        expect(notifications[0].message).toBe('Información');
        done();
      });
    });

    it('success() debería aceptar título opcional', (done) => {
      service.success('Mensaje', 'Título');

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].title).toBe('Título');
        done();
      });
    });
  });

  describe('closeById', () => {
    it('debería cerrar una notificación específica', fakeAsync(() => {
      const id = service.show({ type: 'info', message: 'Test' });
      
      tick(100);
      service.closeById(id);
      tick(500); // Tiempo para animación de salida

      service.notifications$.subscribe(notifications => {
        const notification = notifications.find(n => n.id === id);
        expect(notification?.isLeaving || notification === undefined).toBeTruthy();
      });
    }));
  });

  describe('closeAll', () => {
    it('debería cerrar todas las notificaciones', fakeAsync(() => {
      service.show({ type: 'info', message: '1' });
      service.show({ type: 'success', message: '2' });
      service.show({ type: 'warning', message: '3' });

      tick(100);
      service.closeAll();
      tick(500);

      service.notifications$.subscribe(notifications => {
        const visible = notifications.filter(n => n.visible && !n.isLeaving);
        expect(visible.length).toBe(0);
      });
    }));
  });

  describe('Auto-cierre', () => {
    it('debería cerrar automáticamente después de duration', fakeAsync(() => {
      service.show({
        type: 'info',
        message: 'Auto close',
        duration: 1000
      });

      tick(100);
      
      let notificationExists = false;
      service.notifications$.subscribe(n => notificationExists = n.length > 0);
      expect(notificationExists).toBeTrue();

      tick(1500); // Esperar duración + animación

      service.notifications$.subscribe(notifications => {
        const active = notifications.filter(n => n.visible && !n.isLeaving);
        expect(active.length).toBe(0);
      });
    }));

    it('debería pausar timer al hacer hover', fakeAsync(() => {
      const id = service.show({
        type: 'info',
        message: 'Pausable',
        duration: 1000
      });

      tick(500);
      service.pauseAutoClose(id);
      tick(1000); // Pasó el tiempo pero está pausado

      let stillVisible = false;
      service.notifications$.subscribe(n => {
        stillVisible = n.some(notif => notif.id === id && notif.visible);
      });
      expect(stillVisible).toBeTrue();
    }));

    it('debería reanudar timer después de hover', fakeAsync(() => {
      const id = service.show({
        type: 'info',
        message: 'Pausable',
        duration: 1000
      });

      tick(500);
      service.pauseAutoClose(id);
      tick(200);
      service.resumeAutoClose(id);
      tick(1500); // Tiempo restante + extra

      service.notifications$.subscribe(notifications => {
        const notification = notifications.find(n => n.id === id);
        expect(notification?.isLeaving || notification === undefined).toBeTruthy();
      });
    }));
  });

  describe('Límite de notificaciones', () => {
    it('debería respetar el límite máximo de notificaciones', fakeAsync(() => {
      // El servicio tiene un límite de 5 notificaciones
      for (let i = 0; i < 7; i++) {
        service.show({ type: 'info', message: `Mensaje ${i}` });
      }

      tick(100);

      service.notifications$.subscribe(notifications => {
        const visibles = notifications.filter(n => n.visible);
        expect(visibles.length).toBeLessThanOrEqual(5);
      });
    }));
  });

  describe('Posiciones', () => {
    it('debería soportar todas las posiciones', () => {
      const positions = [
        'top-right', 
        'top-left', 
        'bottom-right', 
        'bottom-left', 
        'top-center', 
        'bottom-center'
      ] as const;

      positions.forEach((position, index) => {
        const id = service.show({
          type: 'info',
          message: `Posición ${position}`,
          position
        });
        expect(id).toBeGreaterThan(0);
      });
    });
  });

  describe('Estados de notificación', () => {
    it('debería marcar notificación como visible al crear', (done) => {
      service.show({ type: 'info', message: 'Test' });

      service.notifications$.subscribe(notifications => {
        expect(notifications[0].visible).toBeTrue();
        done();
      });
    });

    it('debería marcar isLeaving antes de eliminar', fakeAsync(() => {
      const id = service.show({ type: 'info', message: 'Test' });
      tick(100);
      
      service.closeById(id);
      
      service.notifications$.subscribe(notifications => {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
          expect(notification.isLeaving).toBeTrue();
        }
      });
      
      tick(500);
    }));
  });
});
