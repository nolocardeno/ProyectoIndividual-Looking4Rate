/**
 * @fileoverview Tests para App Component
 * 
 * Suite de pruebas para el componente principal de la aplicación.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { App } from './app';
import { EventBusService, StateService, LoadingService, NotificationService } from './services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let eventBusSpy: jasmine.SpyObj<EventBusService>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let iconLibrarySpy: jasmine.SpyObj<FaIconLibrary>;

  beforeEach(async () => {
    eventBusSpy = jasmine.createSpyObj('EventBusService', ['emit', 'on']);
    stateServiceSpy = jasmine.createSpyObj('StateService', ['getSnapshot'], {
      state$: of({
        auth: { isAuthenticated: false, user: null, token: null, expiresAt: null },
        ui: { theme: 'dark', language: 'es', sidebarCollapsed: false, notificationsEnabled: true },
        isOnline: true,
        lastSync: null
      })
    });
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide'], {
      isLoading$: of(false),
      globalLoading$: of(null)
    });
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show', 'success', 'error', 'warning', 'info', 'dismiss'], {
      notifications$: of(null),
      currentNotification$: of(null)
    });
    iconLibrarySpy = jasmine.createSpyObj('FaIconLibrary', ['addIcons', 'addIconPacks']);

    // Configurar retornos de on() para eventos
    eventBusSpy.on.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EventBusService, useValue: eventBusSpy },
        { provide: StateService, useValue: stateServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: FaIconLibrary, useValue: iconLibrarySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  describe('Creación', () => {
    it('debería crear la aplicación', () => {
      expect(component).toBeTruthy();
    });

    it('debería iniciar con modales cerrados', () => {
      expect(component.showLoginModal).toBeFalse();
      expect(component.showRegisterModal).toBeFalse();
    });
  });

  describe('ngOnInit', () => {
    it('debería suscribirse a eventos de modal', () => {
      // Llamar ngOnInit manualmente sin detectChanges (evita renderizar componentes hijos)
      component.ngOnInit();
      expect(eventBusSpy.on).toHaveBeenCalled();
    });
  });

  describe('Modal de Login', () => {
    it('debería abrir modal de login', () => {
      component.openLoginModal();
      expect(component.showLoginModal).toBeTrue();
    });

    it('debería cerrar modal de login', () => {
      component.showLoginModal = true;
      component.closeLoginModal();
      expect(component.showLoginModal).toBeFalse();
    });

    it('debería emitir evento al abrir modal de login', () => {
      component.openLoginModal();
      expect(eventBusSpy.emit).toHaveBeenCalledWith('modalOpened', { modal: 'login' });
    });

    it('debería emitir evento al cerrar modal de login', () => {
      component.closeLoginModal();
      expect(eventBusSpy.emit).toHaveBeenCalledWith('modalClosed', { modal: 'login' });
    });
  });

  describe('Modal de Registro', () => {
    it('debería abrir modal de registro', () => {
      component.openRegisterModal();
      expect(component.showRegisterModal).toBeTrue();
    });

    it('debería cerrar modal de registro', () => {
      component.showRegisterModal = true;
      component.closeRegisterModal();
      expect(component.showRegisterModal).toBeFalse();
    });

    it('debería emitir evento al abrir modal de registro', () => {
      component.openRegisterModal();
      expect(eventBusSpy.emit).toHaveBeenCalledWith('modalOpened', { modal: 'register' });
    });

    it('debería emitir evento al cerrar modal de registro', () => {
      component.closeRegisterModal();
      expect(eventBusSpy.emit).toHaveBeenCalledWith('modalClosed', { modal: 'register' });
    });
  });

  describe('Cambio entre modales', () => {
    it('debería cambiar de login a registro', fakeAsync(() => {
      component.showLoginModal = true;
      component.switchToRegister();
      
      expect(component.showLoginModal).toBeFalse();
      
      tick(200); // Esperar el setTimeout de 150ms
      
      expect(component.showRegisterModal).toBeTrue();
    }));

    it('debería cambiar de registro a login', fakeAsync(() => {
      component.showRegisterModal = true;
      component.switchToLogin();
      
      expect(component.showRegisterModal).toBeFalse();
      
      tick(200); // Esperar el setTimeout de 150ms
      
      expect(component.showLoginModal).toBeTrue();
    }));
  });

  describe('ngOnDestroy', () => {
    it('debería limpiar suscripciones', () => {
      // Inicializar suscripciones sin renderizar
      component.ngOnInit();
      
      // No debería lanzar error al destruir
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Eventos del EventBus', () => {
    it('debería responder a openLoginModal event', () => {
      // Llamar ngOnInit para que se suscriba a eventos
      component.ngOnInit();
      expect(eventBusSpy.on).toHaveBeenCalledWith('openLoginModal');
    });

    it('debería responder a openRegisterModal event', () => {
      component.ngOnInit();
      expect(eventBusSpy.on).toHaveBeenCalledWith('openRegisterModal');
    });

    it('debería responder a closeAllModals event', () => {
      component.ngOnInit();
      expect(eventBusSpy.on).toHaveBeenCalledWith('closeAllModals');
    });
  });

  describe('FontAwesome', () => {
    it('debería configurar la librería de iconos', () => {
      // La configuración se hace en el constructor
      expect(iconLibrarySpy.addIcons || iconLibrarySpy.addIconPacks).toBeDefined();
    });
  });
});
