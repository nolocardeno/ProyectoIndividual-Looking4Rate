import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { JuegosService, GameStateService } from '../../services';
import { JuegoDTO } from '../../models';
import { SearchGameCard, SearchGamePlatform, SearchGameDeveloper } from '../../components/shared/search-game-card/search-game-card';
import { Button } from '../../components/shared/button/button';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state';
import { SpinnerComponent } from '../../components/shared/spinner/spinner';
import { SpinnerInline } from '../../components/shared/spinner-inline/spinner-inline';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';

/** Número de resultados por página */
const RESULTS_PER_PAGE = 5;

/**
 * @component SearchPage
 * @description Página de resultados de búsqueda de juegos.
 *
 * @example
 * // Ruta: /buscar?q=call+of+duty
 */
@Component({
  selector: 'app-search',
  imports: [SearchGameCard, Button, EmptyStateComponent, SpinnerComponent, SpinnerInline, FeaturedSection],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SearchPage implements OnInit, OnDestroy, AfterViewInit {
  private route = inject(ActivatedRoute);
  private juegosService = inject(JuegosService);
  private gameStateService = inject(GameStateService);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private destroy$ = new Subject<void>();

  /** Referencia al sentinel para Intersection Observer */
  @ViewChild('loadMoreSentinel') loadMoreSentinel!: ElementRef<HTMLDivElement>;
  
  /** Observer para scroll infinito */
  private intersectionObserver: IntersectionObserver | null = null;

  /** Término de búsqueda actual */
  searchQuery = signal('');

  /** Todos los resultados de la búsqueda */
  allResults = signal<JuegoDTO[]>([]);

  /** Número de resultados visibles */
  visibleCount = signal(RESULTS_PER_PAGE);

  /** Estado de carga inicial */
  isLoading = signal(false);

  /** Estado de carga de más resultados (scroll infinito) */
  isLoadingMore = signal(false);

  /** Si hubo un error en la búsqueda */
  hasError = signal(false);

  /** Resultados visibles (paginados) */
  visibleResults = computed(() => 
    this.allResults().slice(0, this.visibleCount())
  );

  /** Si hay más resultados para mostrar */
  hasMoreResults = computed(() => 
    this.visibleCount() < this.allResults().length
  );

  /** Total de resultados */
  totalResults = computed(() => this.allResults().length);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const query = params['q'] || '';
        this.searchQuery.set(query);
        this.visibleCount.set(RESULTS_PER_PAGE);
        
        if (query.trim()) {
          this.performSearch(query);
        } else {
          this.allResults.set([]);
        }
      });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyIntersectionObserver();
  }

  /**
   * Configura el Intersection Observer para scroll infinito
   */
  private setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.hasMoreResults() && !this.isLoadingMore()) {
            this.ngZone.run(() => {
              this.loadMoreResults();
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );
  }

  /**
   * Observa el elemento sentinel cuando hay resultados
   */
  private observeSentinel(): void {
    if (this.loadMoreSentinel?.nativeElement && this.intersectionObserver) {
      this.intersectionObserver.observe(this.loadMoreSentinel.nativeElement);
    }
  }

  /**
   * Destruye el Intersection Observer
   */
  private destroyIntersectionObserver(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  /**
   * Carga más resultados (scroll infinito)
   */
  private loadMoreResults(): void {
    if (this.isLoadingMore()) return;
    
    this.isLoadingMore.set(true);
    
    // Simular pequeño delay para UX
    setTimeout(() => {
      this.visibleCount.update((count) => count + RESULTS_PER_PAGE);
      this.isLoadingMore.set(false);
    }, 200);
  }

  /**
   * Realiza la búsqueda de juegos
   */
  private performSearch(query: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.juegosService
      .buscar(query)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (results) => {
          // Convertimos JuegoResumenDTO[] a JuegoDTO[] (necesitamos más datos)
          this.loadFullGameDetails(results.map(r => r.id));
        },
        error: () => {
          this.hasError.set(true);
          this.allResults.set([]);
        },
      });
  }

  /**
   * Carga los detalles completos de cada juego
   */
  private loadFullGameDetails(gameIds: number[]): void {
    if (gameIds.length === 0) {
      this.allResults.set([]);
      return;
    }

    // Cargar todos los juegos en paralelo
    const requests = gameIds.map((id) =>
      this.juegosService.getById(id).pipe(takeUntil(this.destroy$))
    );

    Promise.all(requests.map((r) => r.toPromise()))
      .then((results) => {
        const validResults = results.filter((r): r is JuegoDTO => r !== undefined);
        this.allResults.set(validResults);
        
        // Iniciar observación del sentinel después de que se renderice
        setTimeout(() => this.observeSentinel(), 100);
      })
      .catch(() => {
        this.hasError.set(true);
        this.allResults.set([]);
      });
  }

  /**
   * Muestra más resultados (para el botón manual)
   */
  showMoreResults(): void {
    this.loadMoreResults();
  }

  /**
   * Convierte un JuegoDTO al formato del desarrollador
   */
  getDeveloper(game: JuegoDTO): SearchGameDeveloper | null {
    if (game.desarrolladoras && game.desarrolladoras.length > 0) {
      return {
        name: game.desarrolladoras[0],
      };
    }
    return null;
  }

  /**
   * Convierte las plataformas de un juego al formato esperado
   */
  getPlatforms(game: JuegoDTO): SearchGamePlatform[] {
    if (!game.plataformas) return [];
    
    return game.plataformas.map((platform) => ({
      name: platform,
    }));
  }

  /**
   * Extrae el año de la fecha de lanzamiento
   */
  getReleaseYear(fechaSalida: string): string {
    if (!fechaSalida) return '';
    
    try {
      const date = new Date(fechaSalida);
      return date.getFullYear().toString();
    } catch {
      return '';
    }
  }

  /**
   * Genera el enlace al detalle del juego
   */
  getGameLink(gameId: number): string {
    return `/juego/${gameId}`;
  }

  /**
   * TrackBy para optimizar el rendimiento de listas
   */
  trackByGameId(index: number, game: JuegoDTO): number {
    return game.id;
  }
}
