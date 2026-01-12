import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Button } from '../../../components/shared/button/button';
import { AuthService, UsuariosService, NotificationService } from '../../../services';

/** Tipos de imagen válidos para avatar */
const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] as const;

/** Tamaño máximo de imagen original en bytes (50MB - permitimos imágenes grandes que serán redimensionadas) */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** Dimensiones máximas del avatar después de redimensionar */
const MAX_AVATAR_DIMENSION = 512;

/** Calidad de compresión JPEG/WebP (0-1) */
const COMPRESSION_QUALITY = 0.85;

/** Ruta del avatar por defecto */
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=512';

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
  private notificationService = inject(NotificationService);
  
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
      this.notificationService.error('Por favor, selecciona una imagen válida (PNG, JPG o WEBP)');
      return;
    }
    
    // Validar tamaño (ahora permitimos hasta 50MB, se redimensionará automáticamente)
    if (file.size > MAX_FILE_SIZE) {
      this.notificationService.error('La imagen no puede superar los 50MB');
      return;
    }
    
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.notificationService.error('Usuario no autenticado');
      return;
    }
    
    this.saving.set(true);
    
    try {
      // Redimensionar y comprimir la imagen automáticamente
      const base64 = await this.processImage(file);
      this.uploadAvatar(userId, base64);
    } catch {
      this.notificationService.error('Error al procesar la imagen');
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
        this.notificationService.success('Avatar actualizado correctamente');
      },
      error: () => {
        this.notificationService.error('Error al guardar el avatar. Inténtalo de nuevo.');
        this.saving.set(false);
      }
    });
  }
  
  /**
   * Procesa la imagen: redimensiona y comprime automáticamente
   * @param file Archivo de imagen original
   * @returns Promesa con la imagen procesada en Base64
   */
  private processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('No se pudo crear el contexto del canvas'));
        return;
      }
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        
        if (width > MAX_AVATAR_DIMENSION || height > MAX_AVATAR_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_AVATAR_DIMENSION) / width);
            width = MAX_AVATAR_DIMENSION;
          } else {
            width = Math.round((width * MAX_AVATAR_DIMENSION) / height);
            height = MAX_AVATAR_DIMENSION;
          }
        }
        
        // Configurar canvas con las nuevas dimensiones
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada con suavizado de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a WebP para mejor compresión, con fallback a JPEG
        let base64 = canvas.toDataURL('image/webp', COMPRESSION_QUALITY);
        
        // Si el navegador no soporta WebP, usar JPEG
        if (base64.startsWith('data:image/png')) {
          base64 = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY);
        }
        
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      
      // Crear URL temporal para cargar la imagen
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Convierte un archivo a Base64
   * @deprecated Usar processImage() que incluye redimensionamiento
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
