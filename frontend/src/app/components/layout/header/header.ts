import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchBox } from '../../shared/search-box/search-box';
import { Button } from '../../shared/button/button';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, SearchBox, Button, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchQuery = '';
  isMenuOpen = false;

  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onLoginClick(): void {
    this.closeMenu();
    this.loginClick.emit();
  }

  onRegisterClick(): void {
    this.closeMenu();
    this.registerClick.emit();
  }

  onSearch(query: string): void {
    if (query.trim()) {
      // TODO: Implementar navegación a búsqueda
      console.log('Buscar:', query);
    }
  }
}
