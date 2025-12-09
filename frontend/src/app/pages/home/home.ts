import { Component, inject } from '@angular/core';
import { GameCover } from '../../components/shared/game-cover/game-cover';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';
import { GameCard, GamePlatform } from '../../components/shared/game-card/game-card';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { Alert } from '../../components/shared/alert/alert';
import { Button } from '../../components/shared/button/button';
import { NotificationContainer } from '../../components/shared/notification/notification-container';
import { NotificationService } from '../../components/shared/notification/notification.service';
import { Pagination } from '../../components/shared/pagination/pagination';

@Component({
  selector: 'app-home',
  imports: [GameCover, FeaturedSection, GameCard, FormTextarea, FormSelect, Alert, Button, NotificationContainer, Pagination],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home {
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

  // Métodos para mostrar alertas
  toggleSuccessAlert(): void {
    this.showSuccessAlert = true;
  }

  toggleErrorAlert(): void {
    this.showErrorAlert = true;
  }

  toggleWarningAlert(): void {
    this.showWarningAlert = true;
  }

  toggleInfoAlert(): void {
    this.showInfoAlert = true;
  }

  // Servicio de notificaciones
  private notificationService = inject(NotificationService);

  // Métodos para mostrar notificaciones (usan el servicio)
  showNotificationSuccess(): void {
    this.notificationService.success(
      'El juego se ha añadido a tu lista de favoritos.',
      '¡Éxito!'
    );
  }

  showNotificationError(): void {
    this.notificationService.error(
      'No se pudo guardar la reseña. Inténtalo de nuevo.',
      'Error'
    );
  }

  showNotificationWarning(): void {
    this.notificationService.warning(
      'Tu sesión expirará pronto. Guarda tus cambios.',
      'Atención'
    );
  }

  showNotificationInfo(): void {
    this.notificationService.info(
      'Hay nuevos juegos disponibles en el catálogo.',
      'Nueva actualización'
    );
  }

  // Paginación de ejemplo
  currentPage = 1;
  totalPages = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('Página seleccionada:', page);
  }
}
