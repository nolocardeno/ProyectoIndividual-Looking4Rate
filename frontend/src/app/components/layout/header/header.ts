import { Component, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchBox } from '../../shared/search-box/search-box';
import { Button } from '../../shared/button/button';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, SearchBox, Button, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  /** Referencia al menú móvil para manipulación del DOM */
  @ViewChild('mobileMenu') mobileMenu!: ElementRef<HTMLElement>;
  
  /** Referencia al botón hamburguesa */
  @ViewChild('hamburgerBtn') hamburgerBtn!: ElementRef<HTMLButtonElement>;
  
  /** Referencia al contenedor del header */
  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLElement>;

  searchQuery = '';
  isMenuOpen = false;
  private isBrowser: boolean;

  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
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
    if (!this.isMenuOpen || !this.isBrowser) return;

    const target = event.target as HTMLElement;
    
    // Verificar si el click fue dentro del menú móvil o el botón hamburguesa
    const clickedInsideMenu = this.mobileMenu?.nativeElement?.contains(target);
    const clickedHamburger = this.hamburgerBtn?.nativeElement?.contains(target);
    
    if (!clickedInsideMenu && !clickedHamburger) {
      this.closeMenu();
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
   * Maneja la búsqueda
   */
  onSearch(query: string): void {
    if (query.trim()) {
      // TODO: Implementar navegación a búsqueda
      console.log('Buscar:', query);
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
}
