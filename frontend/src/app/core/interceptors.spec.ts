/**
 * @fileoverview Tests para HTTP Interceptors
 * 
 * Suite de pruebas unitarias para los interceptores HTTP.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { authInterceptor, errorInterceptor, loadingInterceptor, loggingInterceptor } from './interceptors';
import { API_URL, STORAGE_KEYS } from './constants';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';
import { EventBusService } from '../services/event-bus.service';

describe('HTTP Interceptors', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingService: LoadingService;
  let notificationService: NotificationService;
  let eventBus: EventBusService;
  let router: Router;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('authInterceptor', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([authInterceptor])),
          provideHttpClientTesting()
        ]
      });

      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
      localStorage.clear();
    });

    it('debería añadir token de autenticación para peticiones al API', () => {
      const testToken = 'test-jwt-token';
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, testToken);

      httpClient.get(`${API_URL}/juegos`).subscribe();

      const req = httpTestingController.expectOne(`${API_URL}/juegos`);
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
    });

    it('no debería añadir token si no hay token en localStorage', () => {
      httpClient.get(`${API_URL}/juegos`).subscribe();

      const req = httpTestingController.expectOne(`${API_URL}/juegos`);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });

    it('no debería añadir token para peticiones externas', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'test-token');

      httpClient.get('https://external-api.com/data').subscribe();

      const req = httpTestingController.expectOne('https://external-api.com/data');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });

    it('debería manejar peticiones sin token', () => {
      httpClient.get(`${API_URL}/public/data`).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpTestingController.expectOne(`${API_URL}/public/data`);
      req.flush({ data: 'test' });
    });
  });

  describe('errorInterceptor', () => {
    let routerNavigateSpy: jasmine.Spy;
    let notificationErrorSpy: jasmine.Spy;
    let notificationWarningSpy: jasmine.Spy;
    let eventBusEmitSpy: jasmine.Spy;

    beforeEach(() => {
      const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
      routerNavigateSpy = mockRouter.navigate;

      const mockNotificationService = jasmine.createSpyObj('NotificationService', ['error', 'warning']);
      notificationErrorSpy = mockNotificationService.error;
      notificationWarningSpy = mockNotificationService.warning;

      const mockEventBus = jasmine.createSpyObj('EventBusService', ['emit']);
      eventBusEmitSpy = mockEventBus.emit;

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([errorInterceptor])),
          provideHttpClientTesting(),
          { provide: Router, useValue: mockRouter },
          { provide: NotificationService, useValue: mockNotificationService },
          { provide: EventBusService, useValue: mockEventBus }
        ]
      });

      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
      localStorage.clear();
    });

    it('debería manejar error 401 limpiando sesión y redirigiendo', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'old-token');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify({ id: 1 }));

      httpClient.get(`${API_URL}/protected`).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpTestingController.expectOne(`${API_URL}/protected`);
      req.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_USER)).toBeNull();
      expect(eventBusEmitSpy).toHaveBeenCalledWith('sessionExpired', null);
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/'], { queryParams: { sessionExpired: true } });
    });

    it('debería manejar error 403 mostrando notificación', () => {
      httpClient.get(`${API_URL}/admin-only`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/admin-only`);
      req.flush({}, { status: 403, statusText: 'Forbidden' });

      expect(notificationErrorSpy).toHaveBeenCalledWith('No tienes permisos para realizar esta acción');
    });

    it('debería manejar error 422 con mensaje de validación', () => {
      httpClient.post(`${API_URL}/users`, {}).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/users`);
      req.flush(
        { validationErrors: [{ field: 'email', message: 'Email inválido' }] },
        { status: 422, statusText: 'Unprocessable Entity' }
      );

      expect(notificationWarningSpy).toHaveBeenCalledWith('Email inválido');
    });

    it('debería manejar error 422 con mensaje general si no hay validationErrors', () => {
      httpClient.post(`${API_URL}/users`, {}).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/users`);
      req.flush(
        { message: 'Datos inválidos' },
        { status: 422, statusText: 'Unprocessable Entity' }
      );

      expect(notificationWarningSpy).toHaveBeenCalledWith('Datos inválidos');
    });

    it('debería manejar error 422 con mensaje por defecto', () => {
      httpClient.post(`${API_URL}/users`, {}).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/users`);
      req.flush({}, { status: 422, statusText: 'Unprocessable Entity' });

      expect(notificationWarningSpy).toHaveBeenCalledWith('Error de validación');
    });

    it('debería manejar error de red (status 0)', () => {
      httpClient.get(`${API_URL}/data`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.error(new ProgressEvent('error'));

      expect(notificationErrorSpy).toHaveBeenCalledWith('Error de conexión. Verifica tu internet.');
    });

    it('debería manejar error 500', () => {
      httpClient.get(`${API_URL}/data`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      expect(notificationErrorSpy).toHaveBeenCalledWith('Error en el servidor. Inténtalo más tarde.');
    });

    it('debería manejar errores 5xx (cualquier error de servidor)', () => {
      httpClient.get(`${API_URL}/data`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({}, { status: 503, statusText: 'Service Unavailable' });

      expect(notificationErrorSpy).toHaveBeenCalledWith('Error en el servidor. Inténtalo más tarde.');
    });

    it('no debería mostrar notificación para error 404', () => {
      httpClient.get(`${API_URL}/nonexistent`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/nonexistent`);
      req.flush({}, { status: 404, statusText: 'Not Found' });

      expect(notificationErrorSpy).not.toHaveBeenCalled();
    });

    it('debería saltar manejo de errores con header X-Skip-Error-Handler', () => {
      httpClient.get(`${API_URL}/data`, {
        headers: { 'X-Skip-Error-Handler': 'true' }
      }).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      // No debería llamar a notificationService ni router
      expect(notificationErrorSpy).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
    });

    it('debería manejar múltiples errores de validación', () => {
      httpClient.post(`${API_URL}/users`, {}).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/users`);
      req.flush(
        { 
          validationErrors: [
            { field: 'email', message: 'Email inválido' },
            { field: 'password', message: 'Contraseña muy corta' }
          ] 
        },
        { status: 422, statusText: 'Unprocessable Entity' }
      );

      expect(notificationWarningSpy).toHaveBeenCalledWith('Email inválido. Contraseña muy corta');
    });
  });

  describe('loadingInterceptor', () => {
    let loadingShowSpy: jasmine.Spy;
    let loadingHideSpy: jasmine.Spy;

    beforeEach(() => {
      const mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
      loadingShowSpy = mockLoadingService.show;
      loadingHideSpy = mockLoadingService.hide;

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([loadingInterceptor])),
          provideHttpClientTesting(),
          { provide: LoadingService, useValue: mockLoadingService }
        ]
      });

      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('debería mostrar loading al iniciar petición', () => {
      httpClient.get(`${API_URL}/data`).subscribe();

      expect(loadingShowSpy).toHaveBeenCalled();

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({});
    });

    it('debería ocultar loading al completar petición', () => {
      httpClient.get(`${API_URL}/data`).subscribe();

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({});

      expect(loadingHideSpy).toHaveBeenCalled();
    });

    it('debería ocultar loading cuando hay error', () => {
      httpClient.get(`${API_URL}/data`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({}, { status: 500, statusText: 'Error' });

      expect(loadingHideSpy).toHaveBeenCalled();
    });

    it('debería saltar loading con header X-Skip-Loading', () => {
      httpClient.get(`${API_URL}/data`, {
        headers: { 'X-Skip-Loading': 'true' }
      }).subscribe();

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({});

      expect(loadingShowSpy).not.toHaveBeenCalled();
      expect(loadingHideSpy).not.toHaveBeenCalled();
    });
  });

  describe('loggingInterceptor', () => {
    let consoleSpy: jasmine.Spy;

    beforeEach(() => {
      consoleSpy = spyOn(console, 'groupCollapsed');
      spyOn(console, 'log');
      spyOn(console, 'groupEnd');
      spyOn(console, 'error');

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([loggingInterceptor])),
          provideHttpClientTesting()
        ]
      });

      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('debería loggear peticiones en desarrollo', () => {
      httpClient.get(`${API_URL}/data`).subscribe();

      expect(consoleSpy).toHaveBeenCalled();

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({});
    });

    it('debería loggear body de peticiones POST', () => {
      httpClient.post(`${API_URL}/data`, { name: 'test' }).subscribe();

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({});

      expect(console.log).toHaveBeenCalled();
    });

    it('debería loggear éxito de respuesta', () => {
      httpClient.get(`${API_URL}/data`).subscribe();

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({ data: 'test' });

      // Should log success message
      expect(console.log).toHaveBeenCalled();
    });

    it('debería loggear error de respuesta', () => {
      httpClient.get(`${API_URL}/data`).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne(`${API_URL}/data`);
      req.flush({}, { status: 500, statusText: 'Error' });

      expect(console.error).toHaveBeenCalled();
    });
  });
});
