import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { StateService } from '../../../services/state.service';
import { EventBusService } from '../../../services/event-bus.service';

/** Valores posibles del tema */
type ThemePreference = 'dark' | 'light' | 'system';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher implements OnInit, AfterViewInit, OnDestroy {
  /** Servicios inyectados */
  private stateService = inject(StateService);
  private eventBus = inject(EventBusService);

  /** Referencia al botón del toggle usando ViewChild */
  @ViewChild('toggleButton', { static: false }) toggleButton!: ElementRef<HTMLButtonElement>;
  
  /** Estado actual del tema (true = oscuro, false = claro) */
  isDarkMode = true;
  
  /** Indica si estamos en el navegador */
  private isBrowser: boolean;
  
  /** MediaQueryList para detectar preferencia del sistema */
  private prefersDarkScheme: MediaQueryList | null = null;

  /** Suscripción al estado del tema */
  private themeSubscription: Subscription | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeTheme();
      this.setupSystemPreferenceListener();
      this.subscribeToStateService();
    }
  }

  ngAfterViewInit(): void {
    // Demostración de manipulación del DOM con ViewChild y ElementRef
    if (this.toggleButton?.nativeElement) {
      this.updateButtonAccessibility();
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  /**
   * Se suscribe al StateService para sincronizar el tema
   */
  private subscribeToStateService(): void {
    this.themeSubscription = this.stateService.theme$.subscribe(theme => {
      const shouldBeDark = theme === 'dark';
      if (this.isDarkMode !== shouldBeDark) {
        this.isDarkMode = shouldBeDark;
        this.applyTheme(theme === 'dark' ? 'dark' : 'light');
        this.updateButtonAccessibility();
      }
    });
  }

  /**
   * Inicializa el tema basándose en:
   * 1. Preferencia del StateService (que carga de localStorage)
   * 2. Preferencia del sistema (prefers-color-scheme)
   * 3. Modo oscuro por defecto
   */
  private initializeTheme(): void {
    const stateTheme = this.stateService.getState().ui.theme;
    
    if (stateTheme === 'light') {
      this.isDarkMode = false;
      this.applyTheme('light');
    } else if (stateTheme === 'dark') {
      this.isDarkMode = true;
      this.applyTheme('dark');
    } else {
      // Detectar preferencia del sistema
      this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDarkMode = this.prefersDarkScheme.matches;
      this.applyTheme(this.isDarkMode ? 'dark' : 'light');
    }
  }

  /**
   * Configura un listener para detectar cambios en la preferencia del sistema
   */
  private setupSystemPreferenceListener(): void {
    if (!this.prefersDarkScheme) {
      this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    }
    
    // Escuchar cambios en la preferencia del sistema
    this.prefersDarkScheme.addEventListener('change', (e: MediaQueryListEvent) => {
      // Solo aplicar si el tema está en 'system'
      const stateTheme = this.stateService.getState().ui.theme;
      if (stateTheme === 'system') {
        this.isDarkMode = e.matches;
        this.applyTheme(this.isDarkMode ? 'dark' : 'light');
        this.updateButtonAccessibility();
      }
    });
  }

  /**
   * Alterna entre tema claro y oscuro
   * Maneja eventos de teclado (Enter, Space) y click
   */
  toggleTheme(event?: Event): void {
    // Prevenir comportamiento por defecto si es necesario
    if (event) {
      event.preventDefault();
    }
    
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    
    this.applyTheme(theme);
    
    // Sincronizar con StateService (esto también persiste en localStorage)
    this.stateService.setTheme(theme);
    
    this.updateButtonAccessibility();
    
    // Emitir evento via EventBus para otros componentes
    this.eventBus.emit('theme:changed', { theme, isDarkMode: this.isDarkMode });
    
    // Mantener evento CustomEvent para compatibilidad
    if (this.isBrowser) {
      window.dispatchEvent(new CustomEvent('themeChange', { 
        detail: { theme, isDarkMode: this.isDarkMode } 
      }));
    }
  }

  /**
   * Maneja eventos de teclado para accesibilidad
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTheme();
    }
  }

  /**
   * Aplica el tema al documento modificando el atributo data-theme
   */
  private applyTheme(theme: 'dark' | 'light'): void {
    if (!this.isBrowser) return;
    
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Modificar meta theme-color para dispositivos móviles
    this.updateMetaThemeColor(theme);
  }

  /**
   * Actualiza el meta tag theme-color para la barra de navegación móvil
   */
  private updateMetaThemeColor(theme: 'dark' | 'light'): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#0D0E11' : '#2A2F2F';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      // Crear el elemento si no existe (demostración de creación de elementos DOM)
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  /**
   * Actualiza los atributos de accesibilidad del botón usando ElementRef
   */
  private updateButtonAccessibility(): void {
    if (this.toggleButton?.nativeElement) {
      const button = this.toggleButton.nativeElement;
      // Manipulación directa del DOM usando ElementRef
      button.setAttribute('aria-pressed', String(!this.isDarkMode));
      button.setAttribute('aria-label', 
        this.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }
  }
}
