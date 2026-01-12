import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { Button } from '../../../components/shared/button/button';
import { AuthService, UsuariosService } from '../../../services';

interface ProfileFormData {
  nombre: string;
  email: string;
  biografia: string;
}

/**
 * @component SettingsProfileTab
 * @description Tab para editar el perfil del usuario
 */
@Component({
  selector: 'app-settings-profile',
  imports: [Button],
  templateUrl: './settings-profile.html',
  styleUrl: './settings-profile.scss'
})
export default class SettingsProfileTab implements OnInit, CanComponentDeactivate {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  
  /** Datos originales del usuario */
  private originalData = signal<ProfileFormData>({
    nombre: '',
    email: '',
    biografia: ''
  });
  
  /** Datos del formulario */
  formData = signal<ProfileFormData>({
    nombre: '',
    email: '',
    biografia: ''
  });
  
  /** Estado de guardado */
  saving = signal(false);
  
  /** Detecta si hay cambios sin guardar */
  hasChanges = computed(() => {
    const original = this.originalData();
    const current = this.formData();
    return (
      original.nombre !== current.nombre ||
      original.email !== current.email ||
      original.biografia !== current.biografia
    );
  });
  
  ngOnInit(): void {
    this.loadUserData();
  }
  
  /**
   * Carga los datos del usuario actual
   */
  private loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      const data: ProfileFormData = {
        nombre: user.nombre || '',
        email: user.email || '',
        biografia: '' // TODO: Agregar biografía al modelo de usuario cuando esté disponible
      };
      this.originalData.set(data);
      this.formData.set({ ...data });
    }
  }
  
  /**
   * Actualiza un campo del formulario
   */
  updateField(field: keyof ProfileFormData, { target }: Event): void {
    this.formData.update(data => ({
      ...data,
      [field]: (target as HTMLInputElement).value
    }));
  }
  
  /**
   * Envía el formulario
   */
  onSubmit(): void {
    const userId = this.authService.getCurrentUserId();
    if (!this.hasChanges() || this.saving() || !userId) return;
    
    this.saving.set(true);
    const { nombre, email } = this.formData();
    
    this.usuariosService.actualizarPerfil(userId, { nombre, email }).subscribe({
      next: (usuario) => {
        this.authService.updateCurrentUser({
          nombre: usuario.nombre,
          email: usuario.email
        });
        this.originalData.set({ ...this.formData() });
        this.saving.set(false);
        alert('Perfil actualizado correctamente');
      },
      error: () => {
        alert('Error al guardar los cambios. Inténtalo de nuevo.');
        this.saving.set(false);
      }
    });
  }
  
  /**
   * Verifica si se puede abandonar la página
   */
  canDeactivate(): boolean {
    if (this.hasChanges()) {
      return confirm('Tienes cambios sin guardar. ¿Deseas salir de todos modos?');
    }
    return true;
  }
}
