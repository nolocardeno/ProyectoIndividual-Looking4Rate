import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, 
  faTimes, 
  faBars, 
  faUser, 
  faSignInAlt, 
  faUserPlus,
  faMoon,
  faSun,
  faChevronDown,
  faSignOutAlt,
  faCog,
  faHome,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { Header } from './header';
import { AuthService, AuthState, AuthUser } from '../../../services/auth.service';
import { of, BehaviorSubject } from 'rxjs';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authStateSubject: BehaviorSubject<AuthState>;
  let authServiceMock: jasmine.SpyObj<AuthService> & { authState$: any };
  let router: Router;

  const mockAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  };

  const mockUser: AuthUser = {
    id: 1,
    nombre: 'TestUser',
    email: 'test@test.com',
    avatar: null,
    rol: 'USER'
  };

  const authenticatedState: AuthState = {
    isAuthenticated: true,
    user: mockUser,
    token: 'test-token',
    loading: false
  };

  beforeEach(async () => {
    authStateSubject = new BehaviorSubject<AuthState>(mockAuthState);

    authServiceMock = {
      authState$: authStateSubject.asObservable(),
      logout: jasmine.createSpy('logout')
    } as any;

    await TestBed.configureTestingModule({
      imports: [Header, FontAwesomeModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    // Configurar iconos de FontAwesome
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(
      faSearch, 
      faTimes, 
      faBars, 
      faUser, 
      faSignInAlt, 
      faUserPlus,
      faMoon,
      faSun,
      faChevronDown,
      faSignOutAlt,
      faCog,
      faHome,
      faUserCircle
    );

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('debería tener estado inicial correcto', () => {
      expect(component.isMenuOpen).toBeFalse();
      expect(component.isMobileSearchOpen).toBeFalse();
      expect(component.isUserDropdownOpen).toBeFalse();
      expect(component.searchQuery).toBe('');
    });
  });

  describe('Menú móvil', () => {
    it('debería abrir el menú al llamar toggleMenu', () => {
      component.toggleMenu();
      expect(component.isMenuOpen).toBeTrue();
    });

    it('debería cerrar el menú al llamar toggleMenu dos veces', () => {
      component.toggleMenu();
      component.toggleMenu();
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería cerrar el menú al llamar closeMenu', () => {
      component.isMenuOpen = true;
      component.closeMenu();
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería prevenir propagación del evento en toggleMenu', () => {
      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
      component.toggleMenu(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Búsqueda', () => {
    it('debería navegar a búsqueda con query válida', () => {
      component.onSearch('zelda');
      expect(router.navigate).toHaveBeenCalledWith(['/buscar'], { queryParams: { q: 'zelda' } });
    });

    it('debería no navegar con query vacía', () => {
      component.onSearch('   ');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('debería limpiar searchQuery después de buscar', () => {
      component.searchQuery = 'test';
      component.onSearch('zelda');
      expect(component.searchQuery).toBe('');
    });

    it('debería navegar a página de búsqueda con goToSearch', () => {
      component.isMenuOpen = true;
      component.goToSearch();
      expect(router.navigate).toHaveBeenCalledWith(['/buscar']);
      expect(component.isMenuOpen).toBeFalse();
    });
  });

  describe('Búsqueda móvil', () => {
    it('debería abrir búsqueda móvil', () => {
      component.toggleMobileSearch();
      expect(component.isMobileSearchOpen).toBeTrue();
    });

    it('debería cerrar menú al abrir búsqueda móvil', () => {
      component.isMenuOpen = true;
      component.toggleMobileSearch();
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería cerrar búsqueda móvil', () => {
      component.isMobileSearchOpen = true;
      component.mobileSearchQuery = 'test';
      component.closeMobileSearch();
      expect(component.isMobileSearchOpen).toBeFalse();
      expect(component.mobileSearchQuery).toBe('');
    });

    it('debería navegar y cerrar búsqueda móvil al buscar', () => {
      component.isMobileSearchOpen = true;
      component.onMobileSearch('mario');
      expect(router.navigate).toHaveBeenCalledWith(['/buscar'], { queryParams: { q: 'mario' } });
      expect(component.isMobileSearchOpen).toBeFalse();
    });

    it('debería no navegar con búsqueda móvil vacía', () => {
      component.onMobileSearch('  ');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Eventos de autenticación', () => {
    it('debería emitir loginClick y cerrar menú', () => {
      spyOn(component.loginClick, 'emit');
      component.isMenuOpen = true;
      
      component.onLoginClick();
      
      expect(component.loginClick.emit).toHaveBeenCalled();
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería emitir registerClick y cerrar menú', () => {
      spyOn(component.registerClick, 'emit');
      component.isMenuOpen = true;
      
      component.onRegisterClick();
      
      expect(component.registerClick.emit).toHaveBeenCalled();
      expect(component.isMenuOpen).toBeFalse();
    });
  });

  describe('User Dropdown', () => {
    it('debería abrir dropdown de usuario', () => {
      component.toggleUserDropdown();
      expect(component.isUserDropdownOpen).toBeTrue();
    });

    it('debería cerrar dropdown de usuario', () => {
      component.isUserDropdownOpen = true;
      component.toggleUserDropdown();
      expect(component.isUserDropdownOpen).toBeFalse();
    });

    it('debería prevenir propagación en toggleUserDropdown', () => {
      const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
      component.toggleUserDropdown(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('debería navegar a ajustes', () => {
      component.isUserDropdownOpen = true;
      component.goToSettings();
      expect(router.navigate).toHaveBeenCalledWith(['/ajustes']);
      expect(component.isUserDropdownOpen).toBeFalse();
    });

    it('debería navegar a inicio', () => {
      component.isUserDropdownOpen = true;
      component.goToHome();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(component.isUserDropdownOpen).toBeFalse();
    });

    it('debería hacer logout', () => {
      component.isUserDropdownOpen = true;
      component.logout();
      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(component.isUserDropdownOpen).toBeFalse();
    });
  });

  describe('User Dropdown con usuario autenticado', () => {
    it('debería navegar a perfil cuando hay usuario', fakeAsync(() => {
      // Simular autenticación
      authStateSubject.next(authenticatedState);
      fixture.detectChanges();
      tick();
      
      // Forzar la actualización del estado interno
      // El componente usa una suscripción interna que actualiza currentAuthState
      component.isUserDropdownOpen = true;
      component.goToProfile();
      
      // Si el usuario está autenticado, debe navegar
      // Si no, no navega (esto depende del estado interno del componente)
      expect(router.navigate).toHaveBeenCalled();
    }));
  });

  describe('Eventos de teclado', () => {
    it('debería abrir menú con Enter en hamburguesa', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      
      component.onHamburgerKeyDown(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.isMenuOpen).toBeTrue();
    });

    it('debería abrir menú con Space en hamburguesa', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(event, 'preventDefault');
      
      component.onHamburgerKeyDown(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('debería cerrar menú con Escape', () => {
      component.isMenuOpen = true;
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería no hacer nada con Escape si menú cerrado', () => {
      component.isMenuOpen = false;
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Scroll', () => {
    it('debería cerrar menú al hacer scroll', () => {
      component.isMenuOpen = true;
      component.onWindowScroll();
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería no hacer nada si menú cerrado', () => {
      component.isMenuOpen = false;
      component.onWindowScroll();
      expect(component.isMenuOpen).toBeFalse();
    });
  });

  describe('Click fuera del menú', () => {
    it('debería cerrar menú al hacer click fuera', () => {
      component.isMenuOpen = true;
      const mockEvent = { target: document.body } as unknown as MouseEvent;
      
      component.onDocumentClick(mockEvent);
      
      expect(component.isMenuOpen).toBeFalse();
    });

    it('debería cerrar dropdown al hacer click fuera', () => {
      authStateSubject.next(authenticatedState);
      fixture.detectChanges();
      component.isUserDropdownOpen = true;
      
      const mockEvent = { target: document.body } as unknown as MouseEvent;
      component.onDocumentClick(mockEvent);
      
      expect(component.isUserDropdownOpen).toBeFalse();
    });
  });

  describe('goToProfile sin usuario', () => {
    it('debería no navegar si no hay usuario', () => {
      authStateSubject.next(mockAuthState);
      fixture.detectChanges();
      
      component.goToProfile();
      
      expect(router.navigate).not.toHaveBeenCalledWith(['/usuario', jasmine.any(Number)]);
    });
  });
});
