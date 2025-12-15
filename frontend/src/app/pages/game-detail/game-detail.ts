import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

/**
 * @component GameDetailPage
 * @description Página de detalle de un juego específico.
 * 
 * @example
 * // Ruta: /juego/1
 */
@Component({
  selector: 'app-game-detail',
  imports: [RouterLink],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export default class GameDetailPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  gameId: number | null = null;

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.gameId = parseInt(params['id'], 10) || null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
