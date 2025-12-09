import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormInput } from '../form-input/form-input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login-form',
  imports: [FormInput, FontAwesomeModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<{ username: string; password: string }>();

  username = '';
  password = '';
  usernameTouched = false;
  passwordTouched = false;

  get usernameError(): string {
    if (!this.usernameTouched) return '';
    if (!this.username.trim()) return 'El nombre de usuario es obligatorio';
    if (this.username.trim().length < 3) return 'Mínimo 3 caracteres';
    return '';
  }

  get passwordError(): string {
    if (!this.passwordTouched) return '';
    if (!this.password) return 'La contraseña es obligatoria';
    if (this.password.length < 6) return 'Mínimo 6 caracteres';
    return '';
  }

  get isFormValid(): boolean {
    return this.username.trim().length >= 3 && this.password.length >= 6;
  }

  onUsernameBlur(): void {
    this.usernameTouched = true;
  }

  onPasswordBlur(): void {
    this.passwordTouched = true;
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
  }

  onSubmit(): void {
    if (this.isFormValid) {
      this.loginSubmit.emit({ username: this.username, password: this.password });
      this.closeModal();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('login-modal__overlay')) {
      this.closeModal();
    }
  }

  private resetForm(): void {
    this.username = '';
    this.password = '';
    this.usernameTouched = false;
    this.passwordTouched = false;
  }
}
