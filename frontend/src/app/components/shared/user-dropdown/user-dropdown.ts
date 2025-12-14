import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/**
 * Componente UserDropdown
 * 
 * Dropdown de usuario que se muestra al hacer hover sobre el nombre de usuario.
 * Se integra visualmente como extensión del botón que lo despliega.
 * 
 * @example
 * ```html
 * <app-user-dropdown
 *   [userName]="user.nombre"
 *   (navigateHome)="onNavigateHome()"
 *   (navigateProfile)="onNavigateProfile()"
 *   (navigateSettings)="onNavigateSettings()"
 *   (logout)="onLogout()">
 * </app-user-dropdown>
 * ```
 */
@Component({
  selector: 'app-user-dropdown',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.scss',
})
export class UserDropdown {
  private router = inject(Router);

  /** Nombre del usuario a mostrar en el botón */
  @Input({ required: true }) userName: string = '';

  /** Evento emitido al navegar al inicio */
  @Output() navigateHome = new EventEmitter<void>();

  /** Evento emitido al navegar al perfil */
  @Output() navigateProfile = new EventEmitter<void>();

  /** Evento emitido al navegar a ajustes */
  @Output() navigateSettings = new EventEmitter<void>();

  /** Evento emitido al cerrar sesión */
  @Output() logoutClick = new EventEmitter<void>();

  /**
   * Maneja el clic en "Inicio"
   */
  onHomeClick(): void {
    this.navigateHome.emit();
  }

  /**
   * Maneja el clic en "Perfil"
   */
  onProfileClick(): void {
    this.navigateProfile.emit();
  }

  /**
   * Maneja el clic en "Ajustes"
   */
  onSettingsClick(): void {
    this.navigateSettings.emit();
  }

  /**
   * Maneja el clic en "Cerrar sesión"
   */
  onLogoutClick(): void {
    this.logoutClick.emit();
  }
}
