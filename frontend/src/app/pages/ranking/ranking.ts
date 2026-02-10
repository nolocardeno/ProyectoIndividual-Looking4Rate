import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { SpinnerInline } from '../../components/shared/spinner-inline/spinner-inline';
import { Alert } from '../../components/shared/alert/alert';
import { RankingItem } from '../../components/shared/ranking-item/ranking-item';

import { RankingService } from '../../services';
import { JuegoRankingDTO } from '../../models';

@Component({
  selector: 'app-ranking',
  imports: [SpinnerInline, Alert, RankingItem],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Ranking implements OnInit, OnDestroy {
  private rankingService = inject(RankingService);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  ranking = signal<JuegoRankingDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarRanking();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarRanking(): void {
    this.loading.set(true);
    this.error.set(null);

    this.rankingService.getRanking(10).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: JuegoRankingDTO[]) => {
        this.ranking.set(data);
        this.loading.set(false);
      },
      error: (err: { userMessage?: string }) => {
        this.error.set(err.userMessage || 'Error al cargar el ranking');
        this.loading.set(false);
      }
    });
  }
}
