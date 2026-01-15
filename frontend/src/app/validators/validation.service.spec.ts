/**
 * @fileoverview Tests para ValidationService
 * 
 * Suite de pruebas para el servicio de validación con backend.
 * Utiliza HttpTestingController para mockear las peticiones HTTP.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ValidationService, AvailabilityResponse } from './validation.service';
import { API_URL } from '../core/constants';

describe('ValidationService', () => {
  let service: ValidationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ValidationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.clearCache();
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
      // No hay request HTTP para email vacío
    });

    it('debería retornar respuesta de disponibilidad para email válido', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      service.checkEmailAvailability('nuevo@email.com').subscribe(response => {
        expect(response).toBeDefined();
        expect(response.available).toBeTrue();
        expect(response.message).toBe('Email disponible');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=nuevo@email.com`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debería cachear resultados', (done) => {
      const email = 'test@example.com';
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      // Primera llamada - hace HTTP
      service.checkEmailAvailability(email).subscribe(() => {
        // Segunda llamada - usa caché
        service.checkEmailAvailability(email).subscribe(response => {
          expect(response.available).toBeTrue();
          done();
        });
        // No debería haber segunda petición HTTP
      });

      // Solo una petición HTTP
      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=${email}`
      );
      req.flush(mockResponse);
    });

    it('debería normalizar email a minúsculas para caché', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      service.checkEmailAvailability('TEST@Email.com').subscribe(() => {
        // Debería usar el mismo caché
        service.checkEmailAvailability('test@email.com').subscribe(response => {
          expect(response.available).toBeDefined();
          done();
        });
      });

      // Solo una petición
      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=TEST@Email.com`
      );
      req.flush(mockResponse);
    });

    it('debería manejar error HTTP gracefully', (done) => {
      service.checkEmailAvailability('error@test.com').subscribe(response => {
        expect(response.available).toBeTrue();
        expect(response.message).toBe('No se pudo verificar');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=error@test.com`
      );
      req.error(new ProgressEvent('error'));
    });
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

    it('debería verificar disponibilidad para username válido', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Usuario disponible' 
      };

      service.checkUsernameAvailability('nuevouser').subscribe(response => {
        expect(response).toBeDefined();
        expect(response.available).toBeTrue();
        expect(response.message).toBe('Usuario disponible');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=nuevouser`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('debería incluir mensaje apropiado para username no disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: false, 
        message: 'Este nombre de usuario ya está en uso' 
      };

      service.checkUsernameAvailability('admin').subscribe(response => {
        expect(response.available).toBeFalse();
        expect(response.message).toContain('uso');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=admin`
      );
      req.flush(mockResponse);
    });

    it('debería manejar error HTTP gracefully', (done) => {
      service.checkUsernameAvailability('erroruser').subscribe(response => {
        expect(response.available).toBeTrue();
        expect(response.message).toBe('No se pudo verificar');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=erroruser`
      );
      req.error(new ProgressEvent('error'));
    });
  });

  describe('Caché', () => {
    it('debería usar caché para consultas repetidas de email', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      // Primera llamada
      service.checkEmailAvailability('cached@test.com').subscribe(() => {
        // Segunda llamada (debería ser inmediata por caché)
        service.checkEmailAvailability('cached@test.com').subscribe(response => {
          expect(response.available).toBeTrue();
          done();
        });
      });

      // Solo una petición HTTP
      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=cached@test.com`
      );
      req.flush(mockResponse);
    });

    it('debería usar caché para consultas repetidas de username', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Usuario disponible' 
      };

      service.checkUsernameAvailability('cacheduser').subscribe(() => {
        service.checkUsernameAvailability('cacheduser').subscribe(response => {
          expect(response.available).toBeTrue();
          done();
        });
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=cacheduser`
      );
      req.flush(mockResponse);
    });

    it('debería normalizar claves de caché para email', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      service.checkEmailAvailability('Test@Email.COM').subscribe(() => {
        // Debería encontrar en caché con diferente capitalización
        service.checkEmailAvailability('test@email.com').subscribe(response => {
          expect(response.available).toBeTrue();
          done();
        });
      });

      // Solo una petición
      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=Test@Email.COM`
      );
      req.flush(mockResponse);
    });

    it('debería normalizar claves de caché para username', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Usuario disponible' 
      };

      service.checkUsernameAvailability('TestUser').subscribe(() => {
        service.checkUsernameAvailability('testuser').subscribe(response => {
          expect(response.available).toBeTrue();
          done();
        });
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=TestUser`
      );
      req.flush(mockResponse);
    });
  });

  describe('Validación de formato', () => {
    it('debería procesar emails con formato válido', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      service.checkEmailAvailability('simple@example.com').subscribe(response => {
        expect(response).toBeDefined();
        expect(response.available).toBeTrue();
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=simple@example.com`
      );
      req.flush(mockResponse);
    });

    it('debería procesar usernames con caracteres válidos', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Usuario disponible' 
      };

      service.checkUsernameAvailability('user_name_123').subscribe(response => {
        expect(response).toBeDefined();
        expect(response.available).toBeTrue();
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=user_name_123`
      );
      req.flush(mockResponse);
    });
  });

  describe('Mensajes de respuesta', () => {
    it('debería incluir mensaje para email disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      service.checkEmailAvailability('available@test.com').subscribe(response => {
        expect(response.available).toBeTrue();
        expect(response.message).toBe('Email disponible');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=available@test.com`
      );
      req.flush(mockResponse);
    });

    it('debería incluir mensaje para email no disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: false, 
        message: 'Este email ya está registrado' 
      };

      service.checkEmailAvailability('taken@email.com').subscribe(response => {
        expect(response.available).toBeFalse();
        expect(response.message).toBe('Este email ya está registrado');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=taken@email.com`
      );
      req.flush(mockResponse);
    });

    it('debería incluir mensaje para username disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Usuario disponible' 
      };

      service.checkUsernameAvailability('newuser').subscribe(response => {
        expect(response.available).toBeTrue();
        expect(response.message).toBe('Usuario disponible');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=newuser`
      );
      req.flush(mockResponse);
    });

    it('debería incluir mensaje para username no disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: false, 
        message: 'Este nombre de usuario ya está en uso' 
      };

      service.checkUsernameAvailability('takenuser').subscribe(response => {
        expect(response.available).toBeFalse();
        expect(response.message).toBe('Este nombre de usuario ya está en uso');
        done();
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=takenuser`
      );
      req.flush(mockResponse);
    });

    it('debería retornar mensaje correcto desde caché para email no disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: false, 
        message: 'Este email ya está registrado' 
      };

      service.checkEmailAvailability('cached@taken.com').subscribe(() => {
        // Segunda llamada desde caché
        service.checkEmailAvailability('cached@taken.com').subscribe(response => {
          expect(response.available).toBeFalse();
          expect(response.message).toBe('Este email ya está registrado');
          done();
        });
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=cached@taken.com`
      );
      req.flush(mockResponse);
    });

    it('debería retornar mensaje correcto desde caché para username no disponible', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: false, 
        message: 'Este nombre de usuario ya está en uso' 
      };

      service.checkUsernameAvailability('cachedtaken').subscribe(() => {
        // Segunda llamada desde caché
        service.checkUsernameAvailability('cachedtaken').subscribe(response => {
          expect(response.available).toBeFalse();
          expect(response.message).toBe('Este nombre de usuario ya está en uso');
          done();
        });
      });

      const req = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=cachedtaken`
      );
      req.flush(mockResponse);
    });
  });

  describe('Concurrencia', () => {
    it('debería manejar múltiples llamadas simultáneas', (done) => {
      let completedCount = 0;

      const checkComplete = () => {
        completedCount++;
        if (completedCount === 3) {
          expect(completedCount).toBe(3);
          done();
        }
      };

      service.checkEmailAvailability('email1@test.com').subscribe(checkComplete);
      service.checkEmailAvailability('email2@test.com').subscribe(checkComplete);
      service.checkEmailAvailability('email3@test.com').subscribe(checkComplete);

      // Responder a las 3 peticiones individualmente
      const req1 = httpMock.expectOne(`${API_URL}/auth/check-email?email=email1@test.com`);
      const req2 = httpMock.expectOne(`${API_URL}/auth/check-email?email=email2@test.com`);
      const req3 = httpMock.expectOne(`${API_URL}/auth/check-email?email=email3@test.com`);
      
      req1.flush({ available: true, message: 'Email disponible' });
      req2.flush({ available: true, message: 'Email disponible' });
      req3.flush({ available: true, message: 'Email disponible' });
    });

    it('debería manejar llamadas intercaladas email/username', (done) => {
      const results: { type: string; response: AvailabilityResponse }[] = [];

      service.checkEmailAvailability('test@test.com').subscribe(r => {
        results.push({ type: 'email', response: r });
        if (results.length === 2) {
          expect(results.some(r => r.type === 'email')).toBeTrue();
          expect(results.some(r => r.type === 'username')).toBeTrue();
          done();
        }
      });
      service.checkUsernameAvailability('testuser').subscribe(r => {
        results.push({ type: 'username', response: r });
        if (results.length === 2) {
          expect(results.some(r => r.type === 'email')).toBeTrue();
          expect(results.some(r => r.type === 'username')).toBeTrue();
          done();
        }
      });

      const emailReq = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=test@test.com`
      );
      const usernameReq = httpMock.expectOne(
        `${API_URL}/auth/check-username?username=testuser`
      );

      emailReq.flush({ available: true, message: 'Email disponible' });
      usernameReq.flush({ available: true, message: 'Usuario disponible' });
    });
  });

  describe('Limpiar caché', () => {
    it('debería permitir limpiar caché', (done) => {
      const mockResponse: AvailabilityResponse = { 
        available: true, 
        message: 'Email disponible' 
      };

      service.checkEmailAvailability('toclear@test.com').subscribe(() => {
        // Limpiar caché
        service.clearCache();
        
        // Debería hacer nueva petición
        service.checkEmailAvailability('toclear@test.com').subscribe(response => {
          expect(response.available).toBeTrue();
          done();
        });

        // Segunda petición después de limpiar caché
        const req2 = httpMock.expectOne(
          `${API_URL}/auth/check-email?email=toclear@test.com`
        );
        req2.flush(mockResponse);
      });

      // Primera petición
      const req1 = httpMock.expectOne(
        `${API_URL}/auth/check-email?email=toclear@test.com`
      );
      req1.flush(mockResponse);
    });
  });
});
