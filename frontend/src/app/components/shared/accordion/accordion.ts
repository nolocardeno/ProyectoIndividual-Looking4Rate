import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef, 
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';

/**
 * Interfaz para los items del acordeón
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isExpanded?: boolean;
  disabled?: boolean;
}

/**
 * Componente Accordion
 * 
 * Implementa un acordeón accesible con las siguientes características:
 * - Expandir/colapsar secciones con animación
 * - Navegación con teclado (Enter, Space, flechas)
 * - Soporte para múltiples paneles abiertos o modo exclusivo
 * - Uso de ViewChild y ElementRef para manipulación del DOM
 * - Eventos de cambio de estado
 */
@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Accordion implements AfterViewInit {
  /** Change detector para OnPush */
  private cdr = inject(ChangeDetectorRef);

  /** Items del acordeón */
  @Input() items: AccordionItem[] = [];
  
  /** Si es true, solo un panel puede estar abierto a la vez */
  @Input() exclusive = false;
  
  /** Si es true, todos los paneles inician expandidos */
  @Input() expandAll = false;

  /** Evento emitido cuando cambia el estado de un panel */
  @Output() panelToggle = new EventEmitter<{ id: string; isExpanded: boolean }>();
  
  /** Evento emitido cuando todos los paneles cambian */
  @Output() stateChange = new EventEmitter<AccordionItem[]>();

  /** Referencia al contenedor del acordeón para manipulación del DOM */
  @ViewChild('accordionContainer') accordionContainer!: ElementRef<HTMLElement>;

  /** Índice del panel actualmente enfocado para navegación con teclado */
  private focusedIndex = 0;

  ngAfterViewInit(): void {
    // Inicializar estados expandidos si expandAll es true
    if (this.expandAll) {
      this.items = this.items.map(item => ({ ...item, isExpanded: true }));
    }
    
    // Configurar atributos ARIA usando ElementRef
    this.updateAriaAttributes();
  }

  /**
   * Alterna el estado de expansión de un panel
   */
  togglePanel(item: AccordionItem, event?: Event): void {
    if (item.disabled) return;
    
    if (event) {
      event.preventDefault();
    }

    const newState = !item.isExpanded;

    if (this.exclusive && newState) {
      // En modo exclusivo, cerrar todos los demás paneles
      this.items = this.items.map(i => ({
        ...i,
        isExpanded: i.id === item.id ? newState : false
      }));
    } else {
      // Actualizar solo el panel actual
      item.isExpanded = newState;
    }

    // Emitir eventos
    this.panelToggle.emit({ id: item.id, isExpanded: newState });
    this.stateChange.emit([...this.items]);
    
    // Marcar para re-render
    this.cdr.markForCheck();
    
    // Actualizar atributos ARIA
    this.updateAriaAttributes();
    
    // Animar la altura del contenido
    this.animatePanelContent(item.id, newState);
  }

  /**
   * Track function para ngFor optimizado
   */
  trackByItemId(index: number, item: AccordionItem): string {
    return item.id;
  }

  /**
   * Maneja eventos de teclado para navegación accesible
   */
  onKeyDown(event: KeyboardEvent, item: AccordionItem, index: number): void {
    const enabledItems = this.items.filter(i => !i.disabled);
    const currentEnabledIndex = enabledItems.findIndex(i => i.id === item.id);

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.togglePanel(item);
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextPanel(currentEnabledIndex, enabledItems);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousPanel(currentEnabledIndex, enabledItems);
        break;
        
      case 'Home':
        event.preventDefault();
        this.focusFirstPanel(enabledItems);
        break;
        
      case 'End':
        event.preventDefault();
        this.focusLastPanel(enabledItems);
        break;
    }
  }

  /**
   * Enfoca el siguiente panel habilitado
   */
  private focusNextPanel(currentIndex: number, enabledItems: AccordionItem[]): void {
    const nextIndex = (currentIndex + 1) % enabledItems.length;
    this.focusPanelByItem(enabledItems[nextIndex]);
  }

  /**
   * Enfoca el panel anterior habilitado
   */
  private focusPreviousPanel(currentIndex: number, enabledItems: AccordionItem[]): void {
    const prevIndex = currentIndex === 0 ? enabledItems.length - 1 : currentIndex - 1;
    this.focusPanelByItem(enabledItems[prevIndex]);
  }

  /**
   * Enfoca el primer panel habilitado
   */
  private focusFirstPanel(enabledItems: AccordionItem[]): void {
    if (enabledItems.length > 0) {
      this.focusPanelByItem(enabledItems[0]);
    }
  }

  /**
   * Enfoca el último panel habilitado
   */
  private focusLastPanel(enabledItems: AccordionItem[]): void {
    if (enabledItems.length > 0) {
      this.focusPanelByItem(enabledItems[enabledItems.length - 1]);
    }
  }

  /**
   * Enfoca un panel específico por su item
   */
  private focusPanelByItem(item: AccordionItem): void {
    if (!this.accordionContainer?.nativeElement) return;
    
    const button = this.accordionContainer.nativeElement.querySelector(
      `[data-accordion-id="${item.id}"]`
    ) as HTMLButtonElement;
    
    if (button) {
      button.focus();
    }
  }

  /**
   * Actualiza los atributos ARIA de todos los paneles
   */
  private updateAriaAttributes(): void {
    if (!this.accordionContainer?.nativeElement) return;

    this.items.forEach(item => {
      const button = this.accordionContainer.nativeElement.querySelector(
        `[data-accordion-id="${item.id}"]`
      ) as HTMLElement;
      
      const panel = this.accordionContainer.nativeElement.querySelector(
        `#accordion-panel-${item.id}`
      ) as HTMLElement;

      if (button) {
        button.setAttribute('aria-expanded', String(item.isExpanded || false));
      }
      
      if (panel) {
        panel.setAttribute('aria-hidden', String(!item.isExpanded));
      }
    });
  }

  /**
   * Anima la altura del contenido del panel usando manipulación del DOM
   */
  private animatePanelContent(itemId: string, isExpanding: boolean): void {
    if (!this.accordionContainer?.nativeElement) return;

    const panel = this.accordionContainer.nativeElement.querySelector(
      `#accordion-panel-${itemId}`
    ) as HTMLElement;

    if (!panel) return;

    const content = panel.querySelector('.accordion__panel-content') as HTMLElement;
    if (!content) return;

    if (isExpanding) {
      // Obtener la altura real del contenido
      const height = content.scrollHeight;
      panel.style.maxHeight = `${height}px`;
      
      // Después de la animación, remover la restricción de altura
      setTimeout(() => {
        panel.style.maxHeight = 'none';
      }, 300);
    } else {
      // Establecer la altura actual antes de animar a 0
      panel.style.maxHeight = `${content.scrollHeight}px`;
      
      // Forzar reflow
      panel.offsetHeight;
      
      // Animar a 0
      panel.style.maxHeight = '0';
    }
  }

  /**
   * Expande todos los paneles
   */
  expandAllPanels(): void {
    this.items = this.items.map(item => ({
      ...item,
      isExpanded: !item.disabled
    }));
    this.stateChange.emit([...this.items]);
    this.updateAriaAttributes();
  }

  /**
   * Colapsa todos los paneles
   */
  collapseAllPanels(): void {
    this.items = this.items.map(item => ({
      ...item,
      isExpanded: false
    }));
    this.stateChange.emit([...this.items]);
    this.updateAriaAttributes();
  }

  /**
   * Genera el ID único para el botón del header
   */
  getHeaderId(itemId: string): string {
    return `accordion-header-${itemId}`;
  }

  /**
   * Genera el ID único para el panel de contenido
   */
  getPanelId(itemId: string): string {
    return `accordion-panel-${itemId}`;
  }
}
