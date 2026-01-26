import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { ImagenJuegoDTO } from '../../../models';

/**
 * @component GameGallery
 * @description Galería de imágenes del juego con lazy loading, accesibilidad y lightbox.
 * Muestra de 4 a 6 imágenes en un grid compacto usando HTML semántico.
 * Al hacer clic en una imagen, se muestra en pantalla completa.
 * 
 * @example
 * <app-game-gallery
 *   [imagenes]="game().imagenes"
 *   [gameTitle]="game().nombre"
 * />
 */
@Component({
  selector: 'app-game-gallery',
  templateUrl: './game-gallery.html',
  styleUrl: './game-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGallery {
  /** Lista de imágenes a mostrar */
  @Input({ required: true }) imagenes: ImagenJuegoDTO[] = [];

  /** Título del juego (para contexto en alt text) */
  @Input() gameTitle: string = '';

  /** Número máximo de imágenes a mostrar */
  @Input() maxImages: number = 6;

  /** Imagen actualmente seleccionada en el lightbox */
  selectedImage = signal<ImagenJuegoDTO | null>(null);

  /** Imágenes limitadas para mostrar */
  get displayImages(): ImagenJuegoDTO[] {
    return this.imagenes.slice(0, this.maxImages);
  }

  /** Verifica si hay imágenes para mostrar */
  get hasImages(): boolean {
    return this.imagenes && this.imagenes.length > 0;
  }

  /** Abre el lightbox con la imagen seleccionada */
  openLightbox(imagen: ImagenJuegoDTO): void {
    this.selectedImage.set(imagen);
  }

  /** Cierra el lightbox */
  closeLightbox(): void {
    this.selectedImage.set(null);
  }

  /** Maneja el clic en el overlay para cerrar */
  onOverlayClick(event: MouseEvent): void {
    // Solo cierra si se hace clic directamente en el overlay, no en la imagen
    if (event.target === event.currentTarget) {
      this.closeLightbox();
    }
  }
}
