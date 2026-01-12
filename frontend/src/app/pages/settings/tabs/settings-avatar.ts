import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Button } from '../../../components/shared/button/button';
import { AuthService, UsuariosService } from '../../../services';

/** Tipos de imagen válidos para avatar */
const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] as const;

/** Tamaño máximo de imagen en bytes (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Ruta del avatar por defecto */
const DEFAULT_AVATAR = 'assets/img/avatars/default.png';

/**
 * @component SettingsAvatarTab
 * @description Tab para cambiar el avatar del usuario subiendo una imagen
 */
@Component({
  selector: 'app-settings-avatar',
  imports: [Button],
  templateUrl: './settings-avatar.html',
  styleUrl: './settings-avatar.scss'
})
export default class SettingsAvatarTab implements OnInit {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  /** Nombre del usuario */
  userName = signal('Usuario');
  
  /** URL del avatar actual */
  avatarUrl = signal(DEFAULT_AVATAR);
  
  /** Estado de guardado */
  saving = signal(false);
  
  ngOnInit(): void {
    this.loadUserData();
  }
  
  /**
   * Carga los datos del usuario actual
   */
  private loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName.set(user.nombre || 'Usuario');
      this.avatarUrl.set(user.avatar || DEFAULT_AVATAR);
    }
  }
  
  /**
   * Activa el input de archivo
   */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  /**
   * Maneja la selección de archivo
   */
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    // Validar tipo de archivo
    if (!VALID_IMAGE_TYPES.includes(file.type as typeof VALID_IMAGE_TYPES[number])) {
      alert('Por favor, selecciona una imagen válida (PNG, JPG o WEBP)');
      return;
    }
    
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      alert('La imagen no puede superar los 5MB');
      return;
    }
    
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      alert('Usuario no autenticado');
      return;
    }
    
    this.saving.set(true);
    
    try {
      const base64 = await this.fileToBase64(file);
      this.uploadAvatar(userId, base64);
    } catch {
      alert('Error al procesar la imagen');
      this.saving.set(false);
    }
    
    // Limpiar input para permitir seleccionar el mismo archivo
    input.value = '';
  }
  
  /**
   * Sube el avatar al servidor
   */
  private uploadAvatar(userId: number, base64: string): void {
    this.usuariosService.actualizarAvatar(userId, base64).subscribe({
      next: (usuario) => {
        const avatar = usuario.avatar || base64;
        this.avatarUrl.set(avatar);
        this.authService.updateCurrentUser({ avatar });
        this.saving.set(false);
        alert('Avatar actualizado correctamente');
      },
      error: () => {
        alert('Error al guardar el avatar. Inténtalo de nuevo.');
        this.saving.set(false);
      }
    });
  }
  
  /**
   * Convierte un archivo a Base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
