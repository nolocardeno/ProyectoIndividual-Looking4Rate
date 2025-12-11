/**
 * @fileoverview Componente Spinner - Loading spinner global
 * 
 * Este componente muestra un indicador de carga global que se activa
 * automáticamente cuando LoadingService tiene estados de carga activos.
 * 
 * Características:
 * - Se suscribe automáticamente a LoadingService
 * - Muestra overlay con spinner animado
 * - Soporte para barra de progreso
 * - Mensaje personalizable
 * - Animaciones de entrada/salida
 * - Bloquea scroll del body cuando está activo
 * - Accesible con role="alert" y aria-busy
 * 
 * @example
 * // En app.html (agregar al final del template)
 * <app-spinner></app-spinner>
 * 
 * // En cualquier componente
 * constructor(private loadingService: LoadingService) {}
 * 
 * async loadData() {
 *   this.loadingService.startLoading('global', 'Cargando datos...');
 *   try {
 *     await this.fetchData();
 *   } finally {
 *     this.loadingService.stopLoading('global');
 *   }
 * }
 * 
 * @author Looking4Rate Team
 * @version 2.0.0
 */

import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService, LoadingState } from '../../../services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent implements OnInit, OnDestroy {
  /** Servicio de carga inyectado */
  private loadingService = inject(LoadingService);
  
  /** Detector de cambios para OnPush */
  private cdr = inject(ChangeDetectorRef);
  
  /** Renderer para manipulación del DOM */
  private renderer = inject(Renderer2);

  /** Estado actual de carga global */
  loadingState: LoadingState | null = null;

  /** Indica si el spinner está visible */
  isVisible = false;

  /** Indica si está en animación de salida */
  isLeaving = false;

  /** Suscripción al estado de carga */
  private subscription: Subscription | null = null;

  /** Timer para animación de salida */
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // Suscribirse al estado de carga global
    this.subscription = this.loadingService.globalLoading$.subscribe(state => {
      this.handleLoadingStateChange(state);
    });
  }

  ngOnDestroy(): void {
    // Limpiar suscripción
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Limpiar timer
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    // Restaurar scroll del body
    this.enableBodyScroll();
  }

  /**
   * Maneja los cambios en el estado de carga
   * @param state - Nuevo estado de carga
   */
  private handleLoadingStateChange(state: LoadingState | null): void {
    // Limpiar timer pendiente
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    if (state) {
      // Mostrar spinner
      this.loadingState = state;
      this.isVisible = true;
      this.isLeaving = false;
      this.disableBodyScroll();
    } else if (this.isVisible) {
      // Iniciar animación de salida
      this.isLeaving = true;
      
      // Ocultar después de la animación
      this.hideTimer = setTimeout(() => {
        this.isVisible = false;
        this.isLeaving = false;
        this.loadingState = null;
        this.enableBodyScroll();
        this.cdr.markForCheck();
      }, 300);
    }

    this.cdr.markForCheck();
  }

  /**
   * Deshabilita el scroll del body cuando el spinner está activo
   */
  private disableBodyScroll(): void {
    this.renderer.addClass(document.body, 'spinner-active');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * Habilita el scroll del body
   */
  private enableBodyScroll(): void {
    this.renderer.removeClass(document.body, 'spinner-active');
    this.renderer.removeStyle(document.body, 'overflow');
  }

  /**
   * Obtiene el porcentaje de progreso para la barra
   */
  get progressPercentage(): number {
    return this.loadingState?.progress ?? 0;
  }

  /**
   * Indica si hay progreso definido para mostrar la barra
   */
  get hasProgress(): boolean {
    return this.loadingState?.progress !== undefined && this.loadingState.progress >= 0;
  }

  /**
   * Obtiene el mensaje de carga
   */
  get message(): string {
    return this.loadingState?.message || 'Cargando...';
  }

  /**
   * Obtiene las clases CSS del contenedor
   */
  get containerClasses(): Record<string, boolean> {
    return {
      'spinner': true,
      'spinner--visible': this.isVisible,
      'spinner--leaving': this.isLeaving
    };
  }
}
