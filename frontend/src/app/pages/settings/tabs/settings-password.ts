import { Component, inject, signal, computed } from '@angular/core';
import { Button } from '../../../components/shared/button/button';
import { AuthService, UsuariosService } from '../../../services';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Longitud mínima requerida para la contraseña */
const MIN_PASSWORD_LENGTH = 6;

/**
 * @component SettingsPasswordTab
 * @description Tab para cambiar la contraseña del usuario
 */
@Component({
  selector: 'app-settings-password',
  imports: [Button],
  templateUrl: './settings-password.html',
  styleUrl: './settings-password.scss'
})
export default class SettingsPasswordTab {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  
  /** Datos del formulario */
  formData = signal<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  /** Estado de guardado */
  saving = signal(false);
  
  /** Mensaje de error para la contraseña actual */
  currentPasswordError = signal<string | null>(null);
  
  /** Mensaje de éxito */
  successMessage = signal<string | null>(null);
  
  /** Valida si el formulario es válido */
  isFormValid = computed(() => {
    const { currentPassword, newPassword, confirmPassword } = this.formData();
    return (
      currentPassword.length > 0 &&
      newPassword.length >= MIN_PASSWORD_LENGTH &&
      newPassword === confirmPassword
    );
  });
  
  /** Valida si las contraseñas nuevas coinciden */
  passwordsMatch = computed(() => {
    const { newPassword, confirmPassword } = this.formData();
    return newPassword === confirmPassword || confirmPassword.length === 0;
  });
  
  /**
   * Actualiza un campo del formulario
   */
  updateField(field: keyof PasswordFormData, { target }: Event): void {
    this.formData.update(data => ({
      ...data,
      [field]: (target as HTMLInputElement).value
    }));
    
    // Limpiar error de contraseña actual cuando el usuario empieza a escribir
    if (field === 'currentPassword') this.currentPasswordError.set(null);
    
    // Limpiar mensaje de éxito
    this.successMessage.set(null);
  }
  
  /**
   * Envía el formulario
   */
  onSubmit(): void {
    // Limpiar mensajes
    this.currentPasswordError.set(null);
    this.successMessage.set(null);
    
    const userId = this.authService.getCurrentUserId();
    if (!this.isFormValid() || this.saving() || !userId) return;
    
    this.saving.set(true);
    const { currentPassword, newPassword } = this.formData();
    
    // Enviar con contraseña actual y nueva
    this.usuariosService.cambiarContrasenia(userId, currentPassword, newPassword).subscribe({
      next: () => {
        // Limpiar formulario
        this.formData.set({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.saving.set(false);
        this.successMessage.set('Contraseña cambiada exitosamente');
      },
      error: (error) => {
        this.saving.set(false);
        
        // El error viene normalizado por HttpBaseService
        // Verificar si el error es por contraseña incorrecta (401 = unauthorized)
        const isWrongPassword = 
          error.statusCode === 401 || 
          error.type === 'unauthorized';
          
        this.currentPasswordError.set(
          isWrongPassword 
            ? 'La contraseña actual no es correcta'
            : 'Error al cambiar la contraseña. Inténtalo de nuevo.'
        );
      }
    });
  }
}
