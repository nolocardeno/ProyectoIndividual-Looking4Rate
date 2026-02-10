import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ranking',
  imports: [RouterLink],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ranking {
  
}
