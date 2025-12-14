import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * @component SearchPage
 * @description Página de resultados de búsqueda de juegos.
 * 
 * @example
 * // Ruta: /buscar?q=call+of+duty
 */
@Component({
  selector: 'app-search',
  imports: [RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export default class SearchPage implements OnInit {
  private route = inject(ActivatedRoute);
  
  searchQuery = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
    });
  }
}
