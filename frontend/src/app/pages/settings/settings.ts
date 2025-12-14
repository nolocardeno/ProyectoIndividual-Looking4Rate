import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * @component SettingsPage
 * @description Página de ajustes de cuenta del usuario.
 * 
 * @example
 * // Ruta: /ajustes
 */
@Component({
  selector: 'app-settings',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export default class SettingsPage {}
