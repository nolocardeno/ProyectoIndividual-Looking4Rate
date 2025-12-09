import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';
import { LoginForm } from './components/shared/login-form/login-form';
import { RegisterForm } from './components/shared/register-form/register-form';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { configureFontAwesome } from './fontawesome.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Main, Footer, LoginForm, RegisterForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showLoginModal = false;
  showRegisterModal = false;

  constructor(library: FaIconLibrary) {
    configureFontAwesome(library);
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }
}
