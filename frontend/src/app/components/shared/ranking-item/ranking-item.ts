import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameCover } from '../game-cover/game-cover';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-ranking-item',
  imports: [RouterLink, GameCover, StarRating],
  templateUrl: './ranking-item.html',
  styleUrl: './ranking-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingItem {

}
