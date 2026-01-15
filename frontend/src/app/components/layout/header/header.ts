import { Component, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchBox } from '../../shared/search-box/search-box';
import { Button } from '../../shared/button/button';
import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';
import { UserDropdown } from '../../shared/user-dropdown/user-dropdown';
import { AuthService, AuthState } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FontAwesomeModule, SearchBox, Button, ThemeSwitcher, UserDropdown, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements AfterViewInit, OnInit, OnDestroy {
  /** Router para navegación */
  private router = inject(Router);
  
  /** Servicio de autenticación */
  private authService = inject(AuthService);
  
  /** Referencia al menú móvil para manipulación del DOM */
  @ViewChild('mobileMenu') mobileMenu!: ElementRef<HTMLElement>;
  
  /** Referencia al botón hamburguesa */
  @ViewChild('hamburgerBtn') hamburgerBtn!: ElementRef<HTMLButtonElement>;
  
  /** Referencia al contenedor del header */
  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLElement>;

  searchQuery = '';
  mobileSearchQuery = '';
  isMenuOpen = false;
  isMobileSearchOpen = false;
  isUserDropdownOpen = false;
  private isBrowser: boolean;
  
  /** 
   * Observable del estado de autenticación para usar con async pipe
   * El async pipe gestiona automáticamente la suscripción/desuscripción
   */
  authState$: Observable<AuthState>;
  
  /**
   * Valor actual del estado de autenticación para usar en métodos del componente
   */
  private currentAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  };

  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Exponer el observable para usar con async pipe en el template
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    // Mantener el valor actual para usarlo en métodos
    this.authState$.subscribe(state => {
      this.currentAuthState = state;
    });
  }

  ngOnDestroy(): void {
    // El async pipe gestiona automáticamente la desuscripción
  }

  ngAfterViewInit(): void {
    // Configurar atributos ARIA iniciales usando ElementRef
    if (this.hamburgerBtn?.nativeElement) {
      this.updateMenuAccessibility();
    }
  }

  /**
   * Maneja el evento de scroll - cierra el menú si está abierto
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Maneja eventos de teclado a nivel de documento
   * Cierra el menú con ESC
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isMenuOpen) {
      event.preventDefault();
      this.closeMenu();
      // Devolver el foco al botón hamburguesa
      this.focusHamburgerButton();
    }
  }

  /**
   * Maneja clicks fuera del menú para cerrarlo
   * Detecta si el click fue fuera del menú y del botón hamburguesa
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Cerrar menú móvil si está abierto y el click fue fuera
    if (this.isMenuOpen && this.isBrowser) {
      const clickedInsideMenu = this.mobileMenu?.nativeElement?.contains(target);
      const clickedHamburger = this.hamburgerBtn?.nativeElement?.contains(target);
      
      if (!clickedInsideMenu && !clickedHamburger) {
        this.closeMenu();
      }
    }
    
    // Cerrar dropdown de usuario si está abierto y el click fue fuera
    if (this.isUserDropdownOpen && this.isBrowser) {
      const clickedInsideDropdown = target.closest('.header__user-dropdown');
      const clickedUserButton = target.closest('.header__user-button');
      
      if (!clickedInsideDropdown && !clickedUserButton) {
        this.isUserDropdownOpen = false;
      }
    }
  }

  /**
   * Alterna la visibilidad del menú móvil con animación
   */
  toggleMenu(event?: Event): void {
    // Prevenir propagación para evitar que el document:click lo cierre inmediatamente
    if (event) {
      event.stopPropagation();
    }
    
    this.isMenuOpen = !this.isMenuOpen;
    this.updateMenuAccessibility();
    
    // Gestionar el foco cuando se abre el menú
    if (this.isMenuOpen) {
      this.trapFocusInMenu();
    }
  }

  /**
   * Cierra el menú móvil
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    this.updateMenuAccessibility();
  }

  /**
   * Actualiza los atributos de accesibilidad del menú usando ElementRef
   */
  private updateMenuAccessibility(): void {
    if (this.hamburgerBtn?.nativeElement) {
      const btn = this.hamburgerBtn.nativeElement;
      btn.setAttribute('aria-expanded', String(this.isMenuOpen));
    }
    
    if (this.mobileMenu?.nativeElement) {
      const menu = this.mobileMenu.nativeElement;
      menu.setAttribute('aria-hidden', String(!this.isMenuOpen));
      
      // Modificar estilos programáticamente para animación
      if (this.isMenuOpen) {
        menu.style.visibility = 'visible';
      }
    }
  }

  /**
   * Atrapa el foco dentro del menú cuando está abierto (accesibilidad)
   */
  private trapFocusInMenu(): void {
    if (!this.isBrowser || !this.mobileMenu?.nativeElement) return;

    // Pequeño delay para que el menú esté visible
    setTimeout(() => {
      const focusableElements = this.mobileMenu.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, 100);
  }

  /**
   * Devuelve el foco al botón hamburguesa
   */
  private focusHamburgerButton(): void {
    if (this.hamburgerBtn?.nativeElement) {
      this.hamburgerBtn.nativeElement.focus();
    }
  }

  /**
   * Maneja el evento de click en login
   */
  onLoginClick(): void {
    this.closeMenu();
    this.loginClick.emit();
  }

  /**
   * Maneja el evento de click en registro
   */
  onRegisterClick(): void {
    this.closeMenu();
    this.registerClick.emit();
  }

  /**
   * Maneja la búsqueda - navega a la página de resultados
   */
  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: query.trim() } });
      this.searchQuery = ''; // Limpiar el input después de buscar
    }
  }

  /**
   * Navega a la página de búsqueda (para botón móvil)
   */
  goToSearch(): void {
    this.closeMenu();
    this.router.navigate(['/buscar']);
  }

  /**
   * Alterna la visibilidad del buscador móvil
   */
  toggleMobileSearch(): void {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
    this.closeMenu();
    
    // Enfocar el input cuando se abre
    if (this.isMobileSearchOpen && this.isBrowser) {
      setTimeout(() => {
        const input = document.querySelector('.header__mobile-search input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }

  /**
   * Cierra el buscador móvil
   */
  closeMobileSearch(): void {
    this.isMobileSearchOpen = false;
    this.mobileSearchQuery = '';
  }

  /**
   * Maneja la búsqueda desde el buscador móvil
   */
  onMobileSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: query.trim() } });
      this.closeMobileSearch();
    }
  }

  /**
   * Maneja eventos de teclado en el botón hamburguesa
   */
  onHamburgerKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMenu();
    }
  }

  /**
   * Alterna el dropdown del usuario
   */
  toggleUserDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  /**
   * Navega al perfil del usuario
   */
  goToProfile(): void {
    this.closeMenu();
    if (this.currentAuthState.user) {
      this.router.navigate(['/usuario', this.currentAuthState.user.id]);
      this.isUserDropdownOpen = false;
    }
  }

  /**
   * Navega a ajustes
   */
  goToSettings(): void {
    this.closeMenu();
    this.router.navigate(['/ajustes']);
    this.isUserDropdownOpen = false;
  }

  /**
   * Navega al inicio
   */
  goToHome(): void {
    this.closeMenu();
    this.router.navigate(['/']);
    this.isUserDropdownOpen = false;
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    this.closeMenu();
    this.authService.logout();
    this.isUserDropdownOpen = false;
    this.router.navigate(['/']);
  }
}
