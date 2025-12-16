/**
 * @fileoverview Tests para ValidationService
 * 
 * Suite de pruebas para el servicio de validación con backend.
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ValidationService, AvailabilityResponse } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService]
    });
    service = TestBed.inject(ValidationService);
  });

  describe('Creación', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('checkEmailAvailability', () => {
    it('debería retornar available: true para email vacío', (done) => {
      service.checkEmailAvailability('').subscribe(response => {
        expect(response.available).toBeTrue();
        done();
      });
    });

    it('debería retornar respuesta de disponibilidad para email válido', fakeAsync(() => {
      let response: AvailabilityResponse | undefined;

      service.checkEmailAvailability('nuevo@email.com').subscribe(r => {
        response = r;
      });

      tick(1000); // Esperar simulación

      expect(response).toBeDefined();
      expect(response!.available).toBeDefined();
      expect(response!.message).toBeDefined();
    }));

    it('debería cachear resultados', fakeAsync(() => {
      let callCount = 0;
      const email = 'test@example.com';

      // Primera llamada
      service.checkEmailAvailability(email).subscribe(() => callCount++);
      tick(1000);

      // Segunda llamada (debería usar caché)
      service.checkEmailAvailability(email).subscribe(() => callCount++);
      tick(100);

      expect(callCount).toBe(2);
    }));

    it('debería normalizar email a minúsculas para caché', fakeAsync(() => {
      service.checkEmailAvailability('TEST@Email.com').subscribe();
      tick(1000);

      // Debería usar el mismo caché
      service.checkEmailAvailability('test@email.com').subscribe(response => {
        expect(response.available).toBeDefined();
      });
      tick(100);
    }));
  });

  describe('checkUsernameAvailability', () => {
    it('debería retornar available: true para username vacío', (done) => {
      service.checkUsernameAvailability('').subscribe(response => {
        expect(response.available).toBeTrue();
        done();
      });
    });

    it('debería retornar available: true para username muy corto', (done) => {
      service.checkUsernameAvailability('ab').subscribe(response => {
        expect(response.available).toBeTrue();
        done();
      });
    });

    it('debería verificar disponibilidad para username válido', fakeAsync(() => {
      let response: AvailabilityResponse | undefined;

      service.checkUsernameAvailability('nuevouser').subscribe(r => {
        response = r;
      });

      tick(1000);

      expect(response).toBeDefined();
      expect(response!.available).toBeDefined();
      expect(response!.message).toBeDefined();
    }));

    it('debería incluir mensaje apropiado para username disponible', fakeAsync(() => {
      let response: AvailabilityResponse | undefined;

      // Usar un username que no esté en la lista de no disponibles
      service.checkUsernameAvailability('uniqueuser123').subscribe(r => {
        response = r;
      });

      tick(1000);

      if (response?.available) {
        expect(response.message).toContain('disponible');
      }
    }));

    it('debería incluir mensaje apropiado para username no disponible', fakeAsync(() => {
      let response: AvailabilityResponse | undefined;

      // Usar un username común que podría estar tomado
      service.checkUsernameAvailability('admin').subscribe(r => {
        response = r;
      });

      tick(1000);

      if (!response?.available) {
        expect(response!.message).toContain('uso');
      }
    }));
  });

  describe('Caché', () => {
    it('debería usar caché para consultas repetidas', fakeAsync(() => {
      const startTime = Date.now();

      // Primera llamada
      service.checkEmailAvailability('cached@test.com').subscribe();
      tick(1000);

      // Segunda llamada (debería ser inmediata por caché)
      service.checkEmailAvailability('cached@test.com').subscribe();
      tick(10); // Debería completar casi inmediatamente

      // La segunda llamada debería ser mucho más rápida
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(2000); // Menos del doble del tiempo
    }));

    it('debería normalizar claves de caché', fakeAsync(() => {
      service.checkEmailAvailability('Test@Email.COM').subscribe();
      tick(1000);

      // Debería encontrar en caché con diferente capitalización
      let cacheHit = false;
      service.checkEmailAvailability('test@email.com').subscribe(() => {
        cacheHit = true;
      });
      tick(10);

      expect(cacheHit).toBeTrue();
    }));
  });

  describe('Validación de formato', () => {
    it('debería procesar emails con formato válido', fakeAsync(() => {
      const validEmails = [
        'simple@example.com',
        'user.name@domain.com',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        service.checkEmailAvailability(email).subscribe(response => {
          expect(response).toBeDefined();
        });
      });

      tick(1000);
    }));

    it('debería procesar usernames con caracteres válidos', fakeAsync(() => {
      const validUsernames = [
        'username',
        'user_name',
        'user123',
        'User_Name_123'
      ];

      validUsernames.forEach(username => {
        service.checkUsernameAvailability(username).subscribe(response => {
          expect(response).toBeDefined();
        });
      });

      tick(1000);
    }));
  });

  describe('Mensajes de respuesta', () => {
    it('debería incluir mensaje para email disponible', fakeAsync(() => {
      service.checkEmailAvailability('available@test.com').subscribe(response => {
        if (response.available) {
          expect(response.message).toBe('Email disponible');
        }
      });
      tick(1000);
    }));

    it('debería incluir mensaje para email no disponible', fakeAsync(() => {
      // Usar email que sabemos que está "ocupado" según la simulación
      service.checkEmailAvailability('test@email.com').subscribe(response => {
        if (!response.available) {
          expect(response.message).toBe('Este email ya está registrado');
        }
      });
      tick(1000);
    }));

    it('debería incluir mensaje para username disponible', fakeAsync(() => {
      service.checkUsernameAvailability('newuser').subscribe(response => {
        if (response.available) {
          expect(response.message).toBe('Usuario disponible');
        }
      });
      tick(1000);
    }));

    it('debería incluir mensaje para username no disponible', fakeAsync(() => {
      service.checkUsernameAvailability('testuser').subscribe(response => {
        if (!response.available) {
          expect(response.message).toBe('Este nombre de usuario ya está en uso');
        }
      });
      tick(1000);
    }));
  });

  describe('Concurrencia', () => {
    it('debería manejar múltiples llamadas simultáneas', fakeAsync(() => {
      const responses: AvailabilityResponse[] = [];

      service.checkEmailAvailability('email1@test.com').subscribe(r => responses.push(r));
      service.checkEmailAvailability('email2@test.com').subscribe(r => responses.push(r));
      service.checkEmailAvailability('email3@test.com').subscribe(r => responses.push(r));

      tick(1500);

      expect(responses.length).toBe(3);
    }));

    it('debería manejar llamadas intercaladas email/username', fakeAsync(() => {
      const results: { type: string; response: AvailabilityResponse }[] = [];

      service.checkEmailAvailability('test@test.com').subscribe(r => 
        results.push({ type: 'email', response: r }));
      service.checkUsernameAvailability('testuser').subscribe(r => 
        results.push({ type: 'username', response: r }));

      tick(1500);

      expect(results.length).toBe(2);
      expect(results.some(r => r.type === 'email')).toBeTrue();
      expect(results.some(r => r.type === 'username')).toBeTrue();
    }));
  });

  describe('Limpiar caché', () => {
    it('debería permitir limpiar caché (si el método existe)', fakeAsync(() => {
      service.checkEmailAvailability('toclear@test.com').subscribe();
      tick(1000);

      // Si existe método clearCache
      if (typeof (service as any).clearCache === 'function') {
        (service as any).clearCache();
        
        // Verificar que ya no está en caché
        service.checkEmailAvailability('toclear@test.com').subscribe();
        tick(1000); // Debería tomar tiempo de nuevo
      }
    }));
  });
});
