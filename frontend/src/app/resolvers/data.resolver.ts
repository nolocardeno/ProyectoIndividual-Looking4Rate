import { Injectable, inject } from '@angular/core';
import { 
  Resolve, 
  ResolveFn,
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of, catchError, delay, tap } from 'rxjs';
import { LoadingService } from '../services';

/**
 * Interfaz para datos de juego (resolver)
 */
export interface GameData {
  id: number;
  nombre: string;
  descripcion: string;
  imagenPortada: string;
  fechaSalida: string;
  plataformas: string[];
  desarrolladoras: string[];
  generos: string[];
  puntuacionMedia: number;
  totalReviews: number;
}

/**
 * Interfaz para datos de usuario (resolver)
 */
export interface UserData {
  id: number;
  nombre: string;
  email: string;
  avatar: string;
  fechaRegistro: string;
  biografia?: string;
  stats: {
    juegosJugados: number;
    reviews: number;
    seguidores: number;
  };
}

/**
 * @resolver GameResolver
 * @description Resolver para precargar datos de un juego antes de activar la ruta.
 * Muestra un estado de carga mientras se obtienen los datos.
 * 
 * @example
 * // En configuración de rutas:
 * {
 *   path: 'juego/:id',
 *   loadComponent: () => import('./pages/game-detail/game-detail'),
 *   resolve: { game: gameResolver }
 * }
 * 
 * // En el componente:
 * ngOnInit() {
 *   this.route.data.subscribe(data => {
 *     this.game = data['game'];
 *   });
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class GameResolver implements Resolve<GameData | null> {
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  /** Datos de juego simulados */
  private mockGame: GameData = {
    id: 1,
    nombre: 'Elden Ring',
    descripcion: 'Un épico juego de rol de acción en un mundo de fantasía oscura.',
    imagenPortada: 'assets/img/games/elden-ring.jpg',
    fechaSalida: '2022-02-25',
    plataformas: ['PC', 'PlayStation', 'Xbox'],
    desarrolladoras: ['FromSoftware'],
    generos: ['Acción', 'RPG', 'Mundo Abierto'],
    puntuacionMedia: 9.5,
    totalReviews: 1250
  };

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GameData | null> {
    const gameId = parseInt(route.params['id'], 10);
    const loaderId = 'game-resolver';
    
    // Mostrar loading
    this.loadingService.show(loaderId, 'Cargando juego...');

    // Simulación de llamada HTTP
    return of(this.mockGame).pipe(
      delay(800),
      tap(() => this.loadingService.hide(loaderId)),
      catchError(error => {
        console.error('Error loading game:', error);
        this.loadingService.hide(loaderId);
        this.router.navigate(['/404']);
        return of(null);
      })
    );
  }
}

/**
 * Resolver funcional para juegos (forma moderna Angular 14+)
 */
export const gameResolver: ResolveFn<GameData | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  const loaderId = 'game-resolver';
  
  const gameId = parseInt(route.params['id'], 10);
  
  // Validar ID
  if (isNaN(gameId) || gameId <= 0) {
    router.navigate(['/404']);
    return of(null);
  }

  loadingService.show(loaderId, 'Cargando juego...');

  // Datos simulados
  const mockGame: GameData = {
    id: gameId,
    nombre: 'Elden Ring',
    descripcion: 'Un épico juego de rol de acción en un mundo de fantasía oscura.',
    imagenPortada: 'assets/img/games/elden-ring.jpg',
    fechaSalida: '2022-02-25',
    plataformas: ['PC', 'PlayStation', 'Xbox'],
    desarrolladoras: ['FromSoftware'],
    generos: ['Acción', 'RPG', 'Mundo Abierto'],
    puntuacionMedia: 9.5,
    totalReviews: 1250
  };

  return of(mockGame).pipe(
    delay(600),
    tap(() => loadingService.hide(loaderId)),
    catchError(error => {
      loadingService.hide(loaderId);
      router.navigate(['/404']);
      return of(null);
    })
  );
};

/**
 * @resolver UserResolver
 * @description Resolver para precargar datos de usuario antes de activar la ruta.
 */
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserData | null> {
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  /** Datos de usuario simulados */
  private mockUser: UserData = {
    id: 1,
    nombre: 'NOLORUBIO23',
    email: 'nolorubio@email.com',
    avatar: 'assets/img/avatars/user1.jpg',
    fechaRegistro: '2023-01-15',
    biografia: 'Amante de los videojuegos desde pequeño.',
    stats: {
      juegosJugados: 123,
      reviews: 8,
      seguidores: 210
    }
  };

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserData | null> {
    const userId = parseInt(route.params['id'], 10);
    const loaderId = 'user-resolver';
    
    this.loadingService.show(loaderId, 'Cargando perfil...');

    return of({ ...this.mockUser, id: userId }).pipe(
      delay(500),
      tap(() => this.loadingService.hide(loaderId)),
      catchError(error => {
        this.loadingService.hide(loaderId);
        this.router.navigate(['/404']);
        return of(null);
      })
    );
  }
}

/**
 * Resolver funcional para usuarios
 */
export const userResolver: ResolveFn<UserData | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  const loaderId = 'user-resolver';
  
  const userId = parseInt(route.params['id'], 10);
  
  if (isNaN(userId) || userId <= 0) {
    router.navigate(['/404']);
    return of(null);
  }

  loadingService.show(loaderId, 'Cargando perfil...');

  const mockUser: UserData = {
    id: userId,
    nombre: 'NOLORUBIO23',
    email: 'nolorubio@email.com',
    avatar: 'assets/img/avatars/user1.jpg',
    fechaRegistro: '2023-01-15',
    biografia: 'Amante de los videojuegos desde pequeño.',
    stats: {
      juegosJugados: 123,
      reviews: 8,
      seguidores: 210
    }
  };

  return of(mockUser).pipe(
    delay(400),
    tap(() => loadingService.hide(loaderId)),
    catchError(error => {
      loadingService.hide(loaderId);
      router.navigate(['/404']);
      return of(null);
    })
  );
};

/**
 * Resolver para búsqueda inicial
 */
export const searchResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const query = route.queryParams['q'] || '';
  return of(query);
};
