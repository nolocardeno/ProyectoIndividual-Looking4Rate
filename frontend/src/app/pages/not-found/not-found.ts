import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * @component NotFoundPage
 * @description Página 404 - No encontrado.
 * 
 * @example
 * // Ruta: /404 o cualquier ruta no existente
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export default class NotFoundPage {}
