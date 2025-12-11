import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameCover } from '../../components/shared/game-cover/game-cover';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';
import { GameCard, GamePlatform } from '../../components/shared/game-card/game-card';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { Alert } from '../../components/shared/alert/alert';
import { Button } from '../../components/shared/button/button';
import { Notification } from '../../components/shared/notification/notification';
import { SpinnerComponent } from '../../components/shared/spinner/spinner';
import { SpinnerInline } from '../../components/shared/spinner-inline/spinner-inline';
import { Accordion, AccordionItem } from '../../components/shared/accordion/accordion';
import { Tabs, TabItem } from '../../components/shared/tabs/tabs';
import { Tooltip } from '../../components/shared/tooltip/tooltip';
import { ThemeToggle } from '../../components/shared/theme-toggle/theme-toggle';
import { SearchBox } from '../../components/shared/search-box/search-box';
import { NotificationService, LoadingService, EventBusService } from '../../services';
import { Pagination } from '../../components/shared/pagination/pagination';

/** Interfaz para datos de juego en carátulas */
interface GameCoverData {
  src: string;
  alt: string;
  link: string;
}

/** Tipos de alerta disponibles */
type AlertType = 'success' | 'error' | 'warning' | 'info';

/** Tipos de notificación disponibles */
type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-home',
  imports: [
    GameCover, FeaturedSection, GameCard, FormTextarea, FormSelect,
    Alert, Button, Notification, SpinnerComponent, SpinnerInline, Accordion, Tabs, Tooltip,
    ThemeToggle, SearchBox, Pagination
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home implements OnInit, OnDestroy {
  // Servicios
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private eventBus = inject(EventBusService);
  
  // Suscripciones
  private subscriptions: Subscription[] = [];

  // ============================================
  // DATOS PARA EJEMPLOS INTERACTIVOS
  // ============================================

  // Accordion data (Phase 1)
  accordionItems: AccordionItem[] = [
    {
      id: 'requisitos',
      title: '📋 Requisitos del Sistema',
      content: `<strong>Mínimos:</strong><br>
        • SO: Windows 10<br>
        • Procesador: Intel Core i5-8400<br>
        • Memoria: 12 GB RAM<br>
        • Gráficos: NVIDIA GTX 1060 6GB<br>
        • Almacenamiento: 60 GB`
    },
    {
      id: 'caracteristicas',
      title: '🎮 Características del Juego',
      content: `• Mundo abierto extenso<br>
        • Sistema de combate dinámico<br>
        • Multijugador cooperativo<br>
        • Personalización de personajes<br>
        • Historia no lineal con múltiples finales`
    },
    {
      id: 'dlc',
      title: '🎁 DLCs Disponibles',
      content: `<strong>Shadow of the Erdtree</strong> - La expansión más grande<br>
        <strong>Contenido adicional:</strong> Nuevas armas, armaduras y jefes`
    }
  ];

  // Tabs data (Phase 1)
  tabItems: TabItem[] = [
    { id: 'descripcion', label: '📖 Descripción', content: 'Este es un juego de rol de acción ambientado en un mundo de fantasía oscura. Los jugadores exploran vastos territorios mientras enfrentan desafiantes enemigos y jefes épicos.' },
    { id: 'jugabilidad', label: '🎯 Jugabilidad', content: 'Sistema de combate basado en la paciencia y la estrategia. Cada arma tiene un moveset único y el jugador puede personalizar su estilo de juego.' },
    { id: 'historia', label: '📜 Historia', content: 'Un mundo fragmentado por la guerra y la ambición. El jugador asume el rol de un Sin Luz buscando restaurar el Círculo de Elden.' },
    { id: 'opiniones', label: '⭐ Opiniones', content: '★★★★★ (9.5/10) - "Una obra maestra del género" - IGN\n★★★★★ (10/10) - "El mejor juego de la década" - GameSpot' }
  ];

  // Estado para demos interactivos
  eventLog: string[] = [];
  loadingProgress = 0;
  isLoadingDemo = false;
  isSimpleLoadingDemo = false;
  isCustomLoadingDemo = false;
  searchQuery = '';
  searchResults: string[] = [];
  
  // Contador para demo de StateService
  demoCounter = 0;

  ngOnInit(): void {
    // Suscribirse a eventos del EventBus para demo
    this.subscriptions.push(
      this.eventBus.on<{ message: string }>('demo:custom-event').subscribe(payload => {
        if (payload?.message) {
          this.eventLog.push(`[${new Date().toLocaleTimeString()}] ${payload.message}`);
          // Mantener solo los últimos 5 eventos
          if (this.eventLog.length > 5) {
            this.eventLog.shift();
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ============================================
  // MÉTODOS PARA DEMOS DE PHASE 1
  // ============================================

  /** Demo de SearchBox */
  onSearchDemo(query: string): void {
    this.searchQuery = query;
    const mockGames = ['Elden Ring', 'Dark Souls III', 'Bloodborne', 'Sekiro', 'Demon\'s Souls', 'Armored Core VI'];
    this.searchResults = query 
      ? mockGames.filter(game => game.toLowerCase().includes(query.toLowerCase()))
      : [];
  }

  /** Demo de Tooltip - contador */
  incrementCounter(): void {
    this.demoCounter++;
    this.eventBus.emit('demo:counter-updated', { value: this.demoCounter });
  }

  // ============================================
  // MÉTODOS PARA DEMOS DE PHASE 2
  // ============================================

  /** Demo de Loading con resultado visual */
  async runLoadingDemo(): Promise<void> {
    this.isLoadingDemo = true;
    this.loadingProgress = 0;
    this.loadingService.showGlobal('Cargando datos del juego...');
    
    // Simular progreso
    const interval = setInterval(() => {
      this.loadingProgress += 20;
      // Usar el nuevo método que auto-cierra al 100%
      this.loadingService.updateGlobalProgress(this.loadingProgress, `Cargando... ${this.loadingProgress}%`, true);
      
      if (this.loadingProgress >= 100) {
        clearInterval(interval);
        this.isLoadingDemo = false;
        // El servicio se cierra automáticamente, solo mostrar notificación
        setTimeout(() => {
          this.notificationService.success('Datos cargados correctamente', '¡Completado!');
        }, 400);
      }
    }, 400);
  }

  /** Demo de Spinner simple sin barra de progreso */
  runSimpleSpinnerDemo(): void {
    this.isSimpleLoadingDemo = true;
    this.loadingService.showGlobal('Procesando solicitud...');
    
    // Simular carga de 2 segundos sin progreso
    setTimeout(() => {
      this.loadingService.hideGlobal();
      this.isSimpleLoadingDemo = false;
      this.notificationService.info('Proceso completado sin barra de progreso', 'Spinner Simple');
    }, 2000);
  }

  /** Demo de Spinner con mensajes personalizados que cambian */
  runCustomMessageDemo(): void {
    this.isCustomLoadingDemo = true;
    const messages = [
      '🔍 Buscando servidores...',
      '🔗 Conectando a la base de datos...',
      '📦 Descargando recursos...',
      '⚙️ Configurando entorno...',
      '✅ Finalizando...'
    ];
    let index = 0;
    
    this.loadingService.showGlobal(messages[0]);
    
    const interval = setInterval(() => {
      index++;
      if (index < messages.length) {
        this.loadingService.updateGlobalMessage(messages[index]);
      } else {
        clearInterval(interval);
        this.loadingService.hideGlobal();
        this.isCustomLoadingDemo = false;
        this.notificationService.success('Proceso con múltiples mensajes completado', '🎉 Custom Messages');
      }
    }, 800);
  }

  /** Demo de EventBus con log visual */
  emitEventDemo(): void {
    const messages = [
      'Usuario conectado',
      'Juego añadido a favoritos',
      'Reseña publicada',
      'Logro desbloqueado',
      'Amigo agregado'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    this.eventBus.emit('demo:custom-event', { 
      message: randomMessage,
      timestamp: new Date().toISOString()
    });
    
    this.notificationService.info(randomMessage, '📣 Evento emitido');
  }

  /** Demo de StateService */
  updateStateDemo(): void {
    this.demoCounter++;
    // Solo mostrar notificación como demo
    this.notificationService.info(
      `Contador incrementado a: ${this.demoCounter}`,
      '🔄 Estado actualizado'
    );
  }
  // Datos de ejemplo para las carátulas
  games = [
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',
      alt: 'Elden Ring',
      link: '/games/elden-ring'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg',
      alt: 'Red Dead Redemption II',
      link: '/games/red-dead-redemption'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/library_600x900.jpg',
      alt: 'The Last of Us Part I',
      link: '/games/the-last-of-us'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg',
      alt: 'Cyberpunk 2077',
      link: '/games/cyberpunk-2077'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/379720/library_600x900.jpg',
      alt: 'DOOM',
      link: '/games/doom'
    }
  ];

  novedades = [
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',
      alt: 'Elden Ring',
      link: '/games/elden-ring'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/library_600x900.jpg',
      alt: 'Lies of P',
      link: '/games/lies-of-p'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/108710/library_600x900.jpg',
      alt: 'Alan Wake 2',
      link: '/games/alan-wake-2'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg',
      alt: "Baldur's Gate 3",
      link: '/games/baldurs-gate-3'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/library_600x900.jpg',
      alt: 'Starfield',
      link: '/games/starfield'
    }
  ];

  masValorados = [
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg',
      alt: 'The Witcher 3',
      link: '/games/witcher-3'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg',
      alt: 'Red Dead Redemption II',
      link: '/games/red-dead-redemption-2'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_600x900.jpg',
      alt: 'Sekiro: Shadows Die Twice',
      link: '/games/sekiro'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg',
      alt: 'Hades',
      link: '/games/hades'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1382330/library_600x900.jpg',
      alt: 'Persona 5 Royal',
      link: '/games/persona-5-royal'
    }
  ];

  proximamente = [
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2054970/library_600x900.jpg',
      alt: 'Fable',
      link: '/games/fable'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/251570/library_600x900.jpg',
      alt: '7 Days to Die',
      link: '/games/7-days-to-die'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2511300/library_600x900.jpg',
      alt: 'ARK 2',
      link: '/games/ark-2'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg',
      alt: 'Hollow Knight: Silksong',
      link: '/games/hollow-knight-silksong'
    },
    {
      src: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg',
      alt: "Baldur's Gate 3",
      link: '/games/baldurs-gate-3'
    }
  ];

  // Ejemplo del nuevo componente GameCard
  exampleGame = {
    coverSrc: 'https://upload.wikimedia.org/wikipedia/en/0/02/CoD_Black_Ops_cover.png',
    title: 'CALL OF DUTY: BLACK OPS',
    releaseDate: '09-11-2010',
    developer: 'Treyarch',
    developerLink: '/developers/treyarch',
    description: 'La volátil Guerra Fría como telón de fondo y un puñado de soldados pertenecientes al SOG (un brazo fuertemente militarizado de la CIA), protagonizan este Call of Duty: Black Ops, entrega del afamado juego FPS bélico cuyo desarrollo corre en esta ocasión a cargo de Treyarch y que es considerado uno de los mejores Call of Duty de la franquicia por su campaña y brillante multijugador.',
    platforms: [
      { name: 'PlayStation', routerLink: '/platforms/playstation' },
      { name: 'Xbox', routerLink: '/platforms/xbox' },
      { name: 'PC', routerLink: '/platforms/pc' }
    ] as GamePlatform[],
    gameLink: '/games/call-of-duty-black-ops'
  };

  // Ejemplos de FormTextarea y FormSelect
  textareaValue = '';
  selectedPlatform = '';

  platformOptions: SelectOption[] = [
    { value: 'ps5', label: 'PlayStation 5' },
    { value: 'ps4', label: 'PlayStation 4' },
    { value: 'xbox-series', label: 'Xbox Series X|S' },
    { value: 'xbox-one', label: 'Xbox One' },
    { value: 'pc', label: 'PC' },
    { value: 'switch', label: 'Nintendo Switch' }
  ];

  // Estado de las alertas de ejemplo
  showSuccessAlert = false;
  showErrorAlert = false;
  showWarningAlert = false;
  showInfoAlert = false;

  // Método genérico para mostrar alertas
  toggleAlert(type: AlertType): void {
    const alertMap: Record<AlertType, keyof Pick<Home, 'showSuccessAlert' | 'showErrorAlert' | 'showWarningAlert' | 'showInfoAlert'>> = {
      success: 'showSuccessAlert',
      error: 'showErrorAlert',
      warning: 'showWarningAlert',
      info: 'showInfoAlert'
    };
    this[alertMap[type]] = true;
  }

  // Método genérico para mostrar notificaciones
  showNotification(type: NotificationType): void {
    const notificationData: Record<NotificationType, { message: string; title: string }> = {
      success: { message: 'El juego se ha añadido a tu lista de favoritos.', title: '¡Éxito!' },
      error: { message: 'No se pudo guardar la reseña. Inténtalo de nuevo.', title: 'Error' },
      warning: { message: 'Tu sesión expirará pronto. Guarda tus cambios.', title: 'Atención' },
      info: { message: 'Hay nuevos juegos disponibles en el catálogo.', title: 'Nueva actualización' }
    };
    
    const { message, title } = notificationData[type];
    this.notificationService[type](message, title);
  }

  // Paginación de ejemplo
  currentPage = 1;
  totalPages = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
