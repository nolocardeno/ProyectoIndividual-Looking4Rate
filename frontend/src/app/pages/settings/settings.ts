import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/**
 * @component SettingsPage
 * @description Página de ajustes de cuenta del usuario.
 * Contiene tabs para editar perfil, contraseña y avatar.
 * 
 * @example
 * // Ruta: /ajustes
 */
@Component({
  selector: 'app-settings',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export default class SettingsPage {}
