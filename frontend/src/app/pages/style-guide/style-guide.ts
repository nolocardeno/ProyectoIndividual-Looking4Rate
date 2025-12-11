import { Component, inject } from '@angular/core';
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
import { ThemeToggle } from '../../components/shared/theme-toggle/theme-toggle';
import { Pagination } from '../../components/shared/pagination/pagination';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';
import { Notification } from '../../components/shared/notification/notification';
import { NotificationService } from '../../services';

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
    ThemeToggle,
    Pagination,
    FeaturedSection,
    Notification
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export default class StyleGuide {
  private notificationService = inject(NotificationService);

  // ============================================
  // DATOS PARA FORMULARIOS
  // ============================================
  inputValue = '';
  inputWithError = '';
  inputDisabled = 'Valor deshabilitado';
  textareaValue = '';
  selectedPlatform = '';

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
  // MÉTODOS AUXILIARES
  // ============================================
  onSearch(query: string): void {
    console.log('Búsqueda:', query);
  }

  onButtonClick(): void {
    console.log('Botón clickeado');
  }
}
