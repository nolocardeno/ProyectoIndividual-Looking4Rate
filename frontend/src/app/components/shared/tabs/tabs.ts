import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef, 
  AfterViewInit,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  TemplateRef
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Interfaz para las pestañas
 */
export interface TabItem {
  id: string;
  label: string;
  content: string;
  disabled?: boolean;
  icon?: string;
}

/**
 * Componente Tabs
 * 
 * Implementa pestañas accesibles con las siguientes características:
 * - Cambiar entre pestañas con animación
 * - Navegación con teclado (flechas, Home, End)
 * - Uso de ViewChild y ElementRef para manipulación del DOM
 * - Soporte para pestañas deshabilitadas
 * - Eventos de cambio de pestaña
 * - Soporte para templates externos por pestaña
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tabs implements OnInit, OnChanges, AfterViewInit {
  /** Change detector para OnPush */
  private cdr = inject(ChangeDetectorRef);
  /** Lista de pestañas */
  @Input() tabs: TabItem[] = [];
  
  /** ID de la pestaña activa inicial */
  @Input() activeTabId: string = '';
  
  /** Orientación de las pestañas */
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** Templates externos para cada pestaña (objeto id -> template) */
  @Input() tabTemplates: Record<string, TemplateRef<unknown>> = {};

  /** Evento emitido cuando cambia la pestaña activa */
  @Output() tabChange = new EventEmitter<{ tabId: string; tab: TabItem }>();

  /** Referencia al contenedor de pestañas */
  @ViewChild('tabList') tabList!: ElementRef<HTMLElement>;
  
  /** Referencia al panel de contenido */
  @ViewChild('tabPanel') tabPanel!: ElementRef<HTMLElement>;

  /** ID de la pestaña actualmente activa */
  currentActiveId: string = '';

  ngOnInit(): void {
    this.initializeActiveTab();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambian los tabs o tabTemplates, re-renderizar
    if (changes['tabs'] || changes['tabTemplates'] || changes['activeTabId']) {
      if (changes['activeTabId'] && !changes['activeTabId'].firstChange) {
        this.currentActiveId = this.activeTabId;
      }
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    // Configurar atributos ARIA iniciales
    this.updateAriaAttributes();
    this.cdr.detectChanges();
  }

  /** Inicializa la pestaña activa */
  private initializeActiveTab(): void {
    if (this.activeTabId) {
      this.currentActiveId = this.activeTabId;
    } else if (this.tabs.length > 0) {
      const firstEnabled = this.tabs.find(tab => !tab.disabled);
      if (firstEnabled) {
        this.currentActiveId = firstEnabled.id;
      }
    }
  }

  /** Flag para evitar animaciones durante la transición */
  private isTransitioning = false;

  /**
   * Selecciona una pestaña
   */
  selectTab(tab: TabItem, event?: Event): void {
    if (tab.disabled || this.isTransitioning || this.currentActiveId === tab.id) return;
    
    if (event) {
      event.preventDefault();
    }

    this.currentActiveId = tab.id;

    // Emitir evento de cambio
    this.tabChange.emit({ tabId: tab.id, tab });
    
    // Actualizar atributos ARIA
    this.updateAriaAttributes();
    
    // Marcar para re-render
    this.cdr.markForCheck();
  }

  /**
   * Maneja eventos de teclado para navegación accesible
   */
  onKeyDown(event: KeyboardEvent, tab: TabItem): void {
    const enabledTabs = this.tabs.filter(t => !t.disabled);
    const currentIndex = enabledTabs.findIndex(t => t.id === tab.id);
    
    let newIndex = currentIndex;
    let shouldPrevent = true;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (currentIndex + 1) % enabledTabs.length;
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = currentIndex === 0 ? enabledTabs.length - 1 : currentIndex - 1;
        break;
        
      case 'Home':
        newIndex = 0;
        break;
        
      case 'End':
        newIndex = enabledTabs.length - 1;
        break;
        
      case 'Enter':
      case ' ':
        this.selectTab(tab);
        break;
        
      default:
        shouldPrevent = false;
    }

    if (shouldPrevent) {
      event.preventDefault();
    }

    if (newIndex !== currentIndex && enabledTabs[newIndex]) {
      this.selectTab(enabledTabs[newIndex]);
      this.focusTab(enabledTabs[newIndex].id);
    }
  }

  /**
   * Enfoca una pestaña específica
   */
  private focusTab(tabId: string): void {
    if (!this.tabList?.nativeElement) return;
    
    const tabButton = this.tabList.nativeElement.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLButtonElement;
    
    if (tabButton) {
      tabButton.focus();
    }
  }

  /**
   * Actualiza los atributos ARIA de las pestañas
   */
  private updateAriaAttributes(): void {
    if (!this.tabList?.nativeElement) return;

    this.tabs.forEach(tab => {
      const button = this.tabList.nativeElement.querySelector(
        `[data-tab-id="${tab.id}"]`
      ) as HTMLElement;
      
      if (button) {
        const isSelected = tab.id === this.currentActiveId;
        button.setAttribute('aria-selected', String(isSelected));
        button.setAttribute('tabindex', isSelected ? '0' : '-1');
      }
    });
  }

  /**
   * Track function para ngFor optimizado
   */
  trackByTabId(index: number, tab: TabItem): string {
    return tab.id;
  }

  /**
   * Obtiene la pestaña activa actual
   */
  get activeTab(): TabItem | undefined {
    return this.tabs.find(tab => tab.id === this.currentActiveId);
  }

  /**
   * Comprueba si una pestaña está activa
   */
  isActive(tabId: string): boolean {
    return this.currentActiveId === tabId;
  }

  /**
   * Genera el ID para el botón de la pestaña
   */
  getTabButtonId(tabId: string): string {
    return `tab-${tabId}`;
  }

  /**
   * Genera el ID para el panel de contenido
   */
  getTabPanelId(tabId: string): string {
    return `tabpanel-${tabId}`;
  }

  /**
   * Maneja el evento de focus en una pestaña
   * Solo enfoca visualmente, no cambia la selección (mejor UX)
   */
  onTabFocus(tab: TabItem): void {
    // No hacer nada - el cambio solo ocurre con click o Enter
    // Esto evita cambios accidentales al navegar con Tab
  }

  /**
   * Obtiene el template para una pestaña específica
   */
  getTabTemplate(tabId: string): TemplateRef<unknown> | null {
    return this.tabTemplates[tabId] ?? null;
  }
}
