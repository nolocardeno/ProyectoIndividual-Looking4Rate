import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormInput } from '../form-input/form-input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-register-form',
  imports: [FormInput, FontAwesomeModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() registerSubmit = new EventEmitter<{ email: string; username: string; password: string }>();

  email = '';
  username = '';
  password = '';
  emailTouched = false;
  usernameTouched = false;
  passwordTouched = false;

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  get emailError(): string {
    if (!this.emailTouched) return '';
    if (!this.email.trim()) return 'El email es obligatorio';
    if (!this.emailRegex.test(this.email)) return 'El email no es válido';
    return '';
  }

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
    return this.emailRegex.test(this.email) && 
           this.username.trim().length >= 3 && 
           this.password.length >= 6;
  }

  onEmailBlur(): void {
    this.emailTouched = true;
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
      this.registerSubmit.emit({ 
        email: this.email, 
        username: this.username, 
        password: this.password 
      });
      this.closeModal();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('register-modal__overlay')) {
      this.closeModal();
    }
  }

  private resetForm(): void {
    this.email = '';
    this.username = '';
    this.password = '';
    this.emailTouched = false;
    this.usernameTouched = false;
    this.passwordTouched = false;
  }
}
