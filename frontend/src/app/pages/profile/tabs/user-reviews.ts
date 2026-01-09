import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { DatePipe, UpperCasePipe } from '@angular/common';

import { GameCover } from '../../../components/shared/game-cover/game-cover';
import { StarRating } from '../../../components/shared/star-rating/star-rating';
import { Pagination } from '../../../components/shared/pagination/pagination';
import { Button } from '../../../components/shared/button/button';
import { FeaturedSection } from '../../../components/shared/featured-section/featured-section';
import { InteraccionesService } from '../../../services';
import { InteraccionDTO } from '../../../models';

/** Número de reviews por página */
const REVIEWS_PER_PAGE = 5;

/**
 * @component UserReviewsTab
 * @description Tab que muestra las reviews del usuario en su perfil
 */
@Component({
  selector: 'app-user-reviews',
  imports: [RouterLink, GameCover, StarRating, Pagination, Button, FeaturedSection, DatePipe, UpperCasePipe],
  templateUrl: './user-reviews.html',
  styleUrl: './user-reviews.scss'
})
export default class UserReviewsTab implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private interaccionesService = inject(InteraccionesService);
  private destroy$ = new Subject<void>();
  
  /** ID del usuario */
  private userId = signal<number | null>(null);
  
  /** Lista de reviews (interacciones con texto de review) */
  reviews = signal<InteraccionDTO[]>([]);
  
  /** Estado de carga */
  loading = signal(true);
  
  /** Error */
  error = signal<string | null>(null);
  
  /** Página actual */
  currentPage = signal(1);
  
  /** Items para skeleton */
  skeletonItems = Array.from({ length: 5 }, (_, i) => i);
  
  /** Reviews ordenadas por fecha (más recientes primero) */
  sortedReviews = computed(() => {
    const reviewsList = [...this.reviews()];
    return reviewsList.sort((a, b) => 
      new Date(b.fechaInteraccion).getTime() - new Date(a.fechaInteraccion).getTime()
    );
  });
  
  /** Total de páginas */
  totalPages = computed(() => 
    Math.max(1, Math.ceil(this.sortedReviews().length / REVIEWS_PER_PAGE))
  );
  
  /** Reviews de la página actual */
  paginatedReviews = computed(() => {
    const start = (this.currentPage() - 1) * REVIEWS_PER_PAGE;
    const end = start + REVIEWS_PER_PAGE;
    return this.sortedReviews().slice(start, end);
  });

  ngOnInit(): void {
    // Obtener el userId del padre (profile)
    this.route.parent?.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = parseInt(params['id'], 10) || null;
        this.userId.set(id);
        if (id) {
          this.loadReviews();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga las reviews del usuario desde el servicio
   */
  loadReviews(): void {
    const userId = this.userId();
    if (!userId) return;

    this.loading.set(true);
    this.error.set(null);

    this.interaccionesService.getByUsuario(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Error cargando reviews:', err);
          this.error.set('Error al cargar las reviews. Intenta nuevamente.');
          this.loading.set(false);
          return of([]);
        })
      )
      .subscribe(interacciones => {
        // Filtrar solo las que tienen review (texto no vacío)
        const withReviews = interacciones.filter(i => i.review && i.review.trim().length > 0);
        this.reviews.set(withReviews);
        this.loading.set(false);
      });
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll suave al inicio de la sección
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Convierte puntuación de 1-10 a 1-5 estrellas
   */
  convertToStars(puntuacion: number | null): number {
    if (puntuacion === null) return 0;
    return Math.round(puntuacion / 2);
  }

  /**
   * Formatea la fecha de la review
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}
