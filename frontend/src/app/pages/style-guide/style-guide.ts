import { Component, inject, TemplateRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

// Componentes
import { Button } from '../../components/shared/button/button';
import { Alert } from '../../components/shared/alert/alert';
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { GameCover } from '../../components/shared/game-cover/game-cover';
import { GameCard, GamePlatform } from '../../components/shared/game-card/game-card';
import { PlatformBadge } from '../../components/shared/platform-badge/platform-badge';
import { SearchBox } from '../../components/shared/search-box/search-box';
import { ThemeSwitcher } from '../../components/shared/theme-switcher/theme-switcher';
import { Pagination } from '../../components/shared/pagination/pagination';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';
import { Notification } from '../../components/shared/notification/notification';
import { Tabs, TabItem } from '../../components/shared/tabs/tabs';
import { Accordion, AccordionItem } from '../../components/shared/accordion/accordion';
import { SpinnerInline } from '../../components/shared/spinner-inline/spinner-inline';
import { Tooltip } from '../../components/shared/tooltip/tooltip';
import { NotificationService, LoadingService } from '../../services';

@Component({
  selector: 'app-style-guide',
  imports: [
    RouterLink,
    Button,
    Alert,
    FormInput,
    FormTextarea,
    FormSelect,
    GameCover,
    GameCard,
    PlatformBadge,
    SearchBox,
    ThemeSwitcher,
    Pagination,
    FeaturedSection,
    Notification,
    Tabs,
    Accordion,
    SpinnerInline,
    Tooltip
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export default class StyleGuide implements AfterViewInit {
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private cdr = inject(ChangeDetectorRef);

  // ============================================
  // TABS PRINCIPALES
  // ============================================
  @ViewChild('botonesTab') botonesTab!: TemplateRef<unknown>;
  @ViewChild('formulariosTab') formulariosTab!: TemplateRef<unknown>;
  @ViewChild('navegacionTab') navegacionTab!: TemplateRef<unknown>;
  @ViewChild('feedbackTab') feedbackTab!: TemplateRef<unknown>;
  @ViewChild('cardsTab') cardsTab!: TemplateRef<unknown>;
  @ViewChild('layoutTab') layoutTab!: TemplateRef<unknown>;
  @ViewChild('interactivosTab') interactivosTab!: TemplateRef<unknown>;

  /** Configuración de las tabs principales */
  mainTabs: TabItem[] = [
    { id: 'botones', label: 'Botones', content: '' },
    { id: 'formularios', label: 'Formularios', content: '' },
    { id: 'navegacion', label: 'Navegación', content: '' },
    { id: 'feedback', label: 'Feedback', content: '' },
    { id: 'cards', label: 'Cards', content: '' },
    { id: 'layout', label: 'Layout', content: '' },
    { id: 'interactivos', label: 'Interactivos', content: '' }
  ];

  /** Objeto de templates para las tabs */
  tabTemplates: Record<string, TemplateRef<unknown>> = {};

  ngAfterViewInit(): void {
    // Mapear los templates a sus IDs
    this.tabTemplates = {
      'botones': this.botonesTab,
      'formularios': this.formulariosTab,
      'navegacion': this.navegacionTab,
      'feedback': this.feedbackTab,
      'cards': this.cardsTab,
      'layout': this.layoutTab,
      'interactivos': this.interactivosTab
    };
    this.cdr.detectChanges();
  }

  // ============================================
  // DATOS PARA FORMULARIOS
  // ============================================
  inputNormal = '';
  inputHelp = '';
  inputWithError = '';
  inputDisabled = 'Valor deshabilitado';
  inputPassword = '';
  inputEmail = '';
  textareaValue = '';
  textareaValue2 = '';
  selectedPlatform = '';
  selectedPlatform2 = '';

  platformOptions: SelectOption[] = [
    { value: 'pc', label: 'PC' },
    { value: 'ps5', label: 'PlayStation 5' },
    { value: 'xbox', label: 'Xbox Series X' },
    { value: 'switch', label: 'Nintendo Switch' },
  ];

  // ============================================
  // DATOS PARA ALERTAS
  // ============================================
  showSuccessAlert = true;
  showErrorAlert = true;
  showWarningAlert = true;
  showInfoAlert = true;

  // ============================================
  // DATOS PARA PAGINACIÓN
  // ============================================
  currentPage = 1;
  totalPages = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // ============================================
  // DATOS PARA ACCORDION
  // ============================================
  accordionItems: AccordionItem[] = [
    { 
      id: 'acc-1', 
      title: '¿Qué es Looking4Rate?', 
      content: 'Looking4Rate es una plataforma para descubrir y valorar videojuegos de todas las plataformas.'
    },
    { 
      id: 'acc-2', 
      title: '¿Cómo puedo crear una cuenta?', 
      content: 'Haz clic en el botón "Registrarse" en la esquina superior derecha y sigue los pasos del formulario.'
    },
    { 
      id: 'acc-3', 
      title: '¿Es gratis usar la plataforma?', 
      content: 'Sí, Looking4Rate es completamente gratuito para todos los usuarios.',
      isExpanded: true
    },
    { 
      id: 'acc-4', 
      title: 'Elemento deshabilitado', 
      content: 'Este contenido no se puede ver.',
      disabled: true
    }
  ];

  // ============================================
  // DATOS PARA TABS DE EJEMPLO
  // ============================================
  exampleTabs: TabItem[] = [
    { id: 'tab-1', label: 'General', content: 'Contenido de la pestaña General.' },
    { id: 'tab-2', label: 'Detalles', content: 'Contenido de la pestaña Detalles.' },
    { id: 'tab-3', label: 'Configuración', content: 'Opciones de configuración.' },
    { id: 'tab-4', label: 'Deshabilitada', content: 'No disponible', disabled: true }
  ];

  // ============================================
  // DATOS PARA GAME CARD
  // ============================================
  exampleGame = {
    coverSrc: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',
    title: 'Elden Ring',
    releaseDate: '25-02-2022',
    developer: 'FromSoftware',
    developerLink: '/developers/fromsoftware',
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    platforms: [
      { name: 'PlayStation', routerLink: '/platforms/playstation' },
      { name: 'Xbox', routerLink: '/platforms/xbox' },
      { name: 'PC', routerLink: '/platforms/pc' }
    ] as GamePlatform[],
    gameLink: '/games/elden-ring'
  };

  // ============================================
  // DATOS PARA COVERS (5 juegos de ejemplo)
  // ============================================
  gameCovers = [
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg',
      alt: 'Red Dead Redemption 2',
      link: '/games/red-dead-redemption-2'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',
      alt: 'Elden Ring',
      link: '/games/elden-ring'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg',
      alt: 'Cyberpunk 2077',
      link: '/games/cyberpunk-2077'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg',
      alt: 'The Witcher 3',
      link: '/games/the-witcher-3'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg',
      alt: 'Baldurs Gate 3',
      link: '/games/baldurs-gate-3'
    }
  ];

  // ============================================
  // MÉTODOS PARA NOTIFICACIONES
  // ============================================
  showSuccessNotification(): void {
    this.notificationService.success('Operación completada correctamente.', '¡Éxito!');
  }

  showErrorNotification(): void {
    this.notificationService.error('Ha ocurrido un error inesperado.', 'Error');
  }

  showWarningNotification(): void {
    this.notificationService.warning('Tu sesión expirará pronto.', 'Advertencia');
  }

  showInfoNotification(): void {
    this.notificationService.info('Hay nuevas actualizaciones disponibles.', 'Información');
  }

  // ============================================
  // MÉTODOS PARA SPINNER GLOBAL
  // ============================================
  showGlobalSpinner(): void {
    this.loadingService.showGlobal('Cargando...');
    setTimeout(() => {
      this.loadingService.hideGlobal();
    }, 2000);
  }

  showGlobalSpinnerWithMessage(): void {
    this.loadingService.showGlobal('Procesando datos del servidor...');
    setTimeout(() => {
      this.loadingService.hideGlobal();
    }, 3000);
  }

  showGlobalSpinnerWithProgress(): void {
    this.loadingService.showGlobal('Descargando archivos...');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.loadingService.updateGlobalProgress(progress, `Descargando... ${progress}%`);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================
  onSearch(query: string): void {
    // Búsqueda realizada
  }

  onButtonClick(): void {
    // Botón clickeado
  }
}
