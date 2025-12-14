import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';
import { LoginForm } from './components/shared/login-form/login-form';
import { RegisterForm } from './components/shared/register-form/register-form';
import { Notification } from './components/shared/notification/notification';
import { SpinnerComponent } from './components/shared/spinner/spinner';
import Breadcrumbs from './components/shared/breadcrumbs/breadcrumbs';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { configureFontAwesome } from './fontawesome.config';
import { EventBusService, StateService, LoadingService } from './services';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    Header, 
    Main, 
    Footer, 
    LoginForm, 
    RegisterForm,
    Notification,
    SpinnerComponent,
    Breadcrumbs
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  showLoginModal = false;
  showRegisterModal = false;

  /** Suscripciones a eventos */
  private subscriptions: Subscription[] = [];

  constructor(
    library: FaIconLibrary,
    private eventBus: EventBusService,
    private stateService: StateService,
    private loadingService: LoadingService
  ) {
    configureFontAwesome(library);
  }

  ngOnInit(): void {
    // Suscribirse a eventos de modales via EventBus
    this.subscriptions.push(
      this.eventBus.on<void>('openLoginModal').subscribe(() => {
        this.openLoginModal();
      }),
      this.eventBus.on<void>('openRegisterModal').subscribe(() => {
        this.openRegisterModal();
      }),
      this.eventBus.on<void>('closeAllModals').subscribe(() => {
        this.closeLoginModal();
        this.closeRegisterModal();
      })
    );

    // El StateService ya carga el estado persistido automáticamente en su constructor
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openLoginModal(): void {
    this.showLoginModal = true;
    // Emitir evento para otros componentes
    this.eventBus.emit('modalOpened', { modal: 'login' });
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    // Emitir evento para otros componentes
    this.eventBus.emit('modalClosed', { modal: 'login' });
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
    // Emitir evento para otros componentes
    this.eventBus.emit('modalOpened', { modal: 'register' });
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
    // Emitir evento para otros componentes
    this.eventBus.emit('modalClosed', { modal: 'register' });
  }

  /**
   * Método para cambiar entre modales
   * Útil cuando el usuario quiere cambiar de login a registro o viceversa
   */
  switchToRegister(): void {
    this.closeLoginModal();
    setTimeout(() => this.openRegisterModal(), 150);
  }

  switchToLogin(): void {
    this.closeRegisterModal();
    setTimeout(() => this.openLoginModal(), 150);
  }
}
