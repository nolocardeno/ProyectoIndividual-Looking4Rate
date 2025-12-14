import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
export default class GameDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  
  gameId: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameId = parseInt(params['id'], 10) || null;
    });
  }
}
