import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Subject, takeUntil, forkJoin, of, catchError } from 'rxjs';

import { Button } from '../../components/shared/button/button';
import { AuthService, UsuariosService, InteraccionesService, GameStateService } from '../../services';
import { UsuarioDTO, UserGameStats } from '../../models';

/**
 * Datos del perfil de usuario
 */
interface ProfileData {
  usuario: UsuarioDTO | null;
  stats: {
    juegosJugados: number;
    reviews: number;
    seguidores: number;
  };
  loading: boolean;
  error: string | null;
}

/**
 * @component ProfilePage
 * @description Página de perfil de usuario.
 * 
 * @example
 * // Ruta: /usuario/1
 */
@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UpperCasePipe, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProfilePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  private interaccionesService = inject(InteraccionesService);
  private gameStateService = inject(GameStateService);
  private destroy$ = new Subject<void>();
  
  /** ID del usuario del perfil */
  userId = signal<number | null>(null);
  
  /** Datos del usuario */
  usuario = signal<UsuarioDTO | null>(null);
  
  /** Estadísticas del usuario */
  stats = signal<{ juegosJugados: number; reviews: number; seguidores: number }>({
    juegosJugados: 0,
    reviews: 0,
    seguidores: 0
  });
  
  /** Estado de carga */
  loading = signal(true);
  
  /** Error al cargar */
  error = signal<string | null>(null);
  
  /** Verifica si es el perfil del usuario actual */
  isOwnProfile = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.userId();
  });
  
  /** URL del avatar con fallback */
  avatarUrl = computed(() => {
    const user = this.usuario();
    return user?.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=512';
  });

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = parseInt(params['id'], 10) || null;
        this.userId.set(id);
        if (id) {
          this.loadProfileData(id);
        }
      });
    
    // Suscribirse a actualizaciones del estado global para refrescar stats
    this.gameStateService.updates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const currentUserId = this.authService.getCurrentUserId();
        // Solo actualizar si es el perfil del usuario actual
        if (this.isOwnProfile() && currentUserId) {
          // Usar las stats calculadas del estado global
          const globalStats = this.gameStateService.userStats();
          this.stats.set({
            juegosJugados: globalStats.totalJuegos,
            reviews: globalStats.juegosRevieweados,
            seguidores: 0
          });
        }
      });
  }
  
  /**
   * Carga los datos del perfil de usuario
   */
  private loadProfileData(userId: number): void {
    this.loading.set(true);
    this.error.set(null);
    
    // Cargar usuario y estadísticas en paralelo
    forkJoin({
      usuario: this.usuariosService.getById(userId).pipe(
        catchError(err => {
          console.error('Error cargando usuario:', err);
          return of(null);
        })
      ),
      interacciones: this.interaccionesService.getUserStats(userId).pipe(
        catchError(err => {
          console.error('Error cargando estadísticas:', err);
          return of(null);
        })
      )
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ usuario, interacciones }) => {
        if (usuario) {
          this.usuario.set(usuario);
          this.stats.set({
            juegosJugados: interacciones?.totalJuegos || 0,
            reviews: interacciones?.juegosRevieweados || 0,
            seguidores: 0 // TODO: Implementar sistema de seguidores
          });
        } else {
          this.error.set('No se pudo cargar el perfil del usuario');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.error.set('Error al cargar el perfil');
        this.loading.set(false);
      }
    });
  }
  
  /**
   * Navega a la página de edición de perfil
   */
  editProfile(): void {
    this.router.navigate(['/ajustes/perfil']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
