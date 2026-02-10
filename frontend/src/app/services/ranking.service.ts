import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpBaseService, HttpOptions } from './http-base.service';
import { ENDPOINTS } from '../core/constants';
import { JuegoRankingDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class RankingService extends HttpBaseService {

  getRanking(limite: number = 10, options?: HttpOptions): Observable<JuegoRankingDTO[]> {
    return this.get<JuegoRankingDTO[]>(ENDPOINTS.RANKING.BASE, {
      ...options, params: { ...options?.params, limite }
    });
  }
}
