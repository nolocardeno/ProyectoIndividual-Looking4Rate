/**
 * @fileoverview Home Page Component
 * 
 * Página principal de Looking4Rate.
 * Muestra hero section y secciones de juegos del backend.
 */

import { Component, OnInit, OnDestroy, inject, signal, computed, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { GameCover } from '../../components/shared/game-cover/game-cover';
import { FeaturedSection } from '../../components/shared/featured-section/featured-section';
import { Button } from '../../components/shared/button/button';
import { SpinnerInline } from '../../components/shared/spinner-inline/spinner-inline';
import { Alert } from '../../components/shared/alert/alert';

import { JuegosService, EventBusService, AuthService } from '../../services';
import { JuegoResumenDTO } from '../../models';

/**
 * Estado de carga para cada sección
 */
interface SectionState {
  loading: boolean;
  error: string | null;
  data: JuegoResumenDTO[];
}

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    GameCover,
    FeaturedSection,
    Button,
    SpinnerInline,
    Alert
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Home implements OnInit, OnDestroy {
  private juegosService = inject(JuegosService);
  private eventBus = inject(EventBusService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  /** Indica si el usuario está autenticado */
  isAuthenticated = signal(false);

  /** Nombre del usuario autenticado */
  userName = signal('');

  // ============================================
  // ESTADO REACTIVO CON SIGNALS
  // ============================================
  
  /** Estado de la sección Novedades */
  novedades = signal<SectionState>({
    loading: true,
    error: null,
    data: []
  });

  /** Estado de la sección Próximos Lanzamientos */
  proximosLanzamientos = signal<SectionState>({
    loading: true,
    error: null,
    data: []
  });

  // Computed para facilitar acceso en template
  novedadesData = computed(() => this.novedades().data);
  novedadesLoading = computed(() => this.novedades().loading);
  novedadesError = computed(() => this.novedades().error);

  proximosData = computed(() => this.proximosLanzamientos().data);
  proximosLoading = computed(() => this.proximosLanzamientos().loading);
  proximosError = computed(() => this.proximosLanzamientos().error);

  // ============================================
  // LIFECYCLE
  // ============================================

  ngOnInit(): void {
    // Solo cargar datos en el navegador, no en SSR
    if (isPlatformBrowser(this.platformId)) {
      this.cargarNovedades();
      this.cargarProximosLanzamientos();
      
      // Suscribirse a cambios de autenticación
      this.authService.authState$
        .pipe(takeUntil(this.destroy$))
        .subscribe(state => {
          this.isAuthenticated.set(state.isAuthenticated);
          this.userName.set(state.user?.nombre ?? '');
        });
    }
  }

  // ============================================
  // CARGA DE DATOS
  // ============================================

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los juegos novedades del backend
   */
  cargarNovedades(): void {
    this.novedades.update(state => ({ ...state, loading: true, error: null }));

    this.juegosService.getNovedades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (juegos) => {
          this.novedades.set({
            loading: false,
            error: null,
            data: juegos.slice(0, 5) // Limitar a 5 juegos
          });
        },
        error: (error) => {
          this.novedades.set({
            loading: false,
            error: error.userMessage || 'Error al cargar novedades',
            data: []
          });
        }
      });
  }

  /**
   * Carga los próximos lanzamientos del backend
   * Usa getAll() y toma los últimos 5 juegos como "próximos"
   */
  cargarProximosLanzamientos(): void {
    this.proximosLanzamientos.update(state => ({ ...state, loading: true, error: null }));

    this.juegosService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (juegos) => {
          // Tomar los últimos 5 juegos como próximos lanzamientos
          const ultimosJuegos = juegos.slice(-5).reverse();
          this.proximosLanzamientos.set({
            loading: false,
            error: null,
            data: ultimosJuegos
          });
        },
        error: (error) => {
          this.proximosLanzamientos.set({
            loading: false,
            error: error.userMessage || 'Error al cargar próximos lanzamientos',
            data: []
          });
        }
      });
  }

  /**
   * Reintenta cargar una sección
   */
  reintentarNovedades(): void {
    this.cargarNovedades();
  }

  reintentarProximos(): void {
    this.cargarProximosLanzamientos();
  }
  
  /**
   * Abre el modal de registro
   */
  openRegister(): void {
    this.eventBus.emit('openRegisterModal', null);
  }
}
