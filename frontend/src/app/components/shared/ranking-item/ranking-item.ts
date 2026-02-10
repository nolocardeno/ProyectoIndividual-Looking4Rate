import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StarRating } from '../star-rating/star-rating';
import { GameCover } from '../game-cover/game-cover';
import { JuegoRankingDTO } from '../../../models';

@Component({
  selector: 'app-ranking-item',
  imports: [RouterLink, DecimalPipe, StarRating, GameCover],
  templateUrl: './ranking-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingItem {
  @Input({ required: true }) juego!: JuegoRankingDTO;
}
