import { Component, Input, ChangeDetectionStrategy, signal, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { ImagenJuegoDTO } from '../../../models';

/**
 * @component GameGallery
 * @description Galería de imágenes del juego con lazy loading, accesibilidad y lightbox.
 * Muestra de 4 a 6 imágenes en un grid compacto usando HTML semántico.
 * Al hacer clic en una imagen, se muestra en pantalla completa.
 * Soporta navegación con teclado (flechas y Escape).
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
  private readonly cdr = inject(ChangeDetectorRef);

  /** Lista de imágenes a mostrar */
  @Input({ required: true }) imagenes: ImagenJuegoDTO[] = [];

  /** Título del juego (para contexto en alt text) */
  @Input() gameTitle: string = '';

  /** Número máximo de imágenes a mostrar */
  @Input() maxImages: number = 6;

  /** Imagen actualmente seleccionada en el lightbox */
  selectedImage = signal<ImagenJuegoDTO | null>(null);

  /** Índice de la imagen actualmente seleccionada */
  private currentIndex = 0;

  /** Imágenes limitadas para mostrar */
  get displayImages(): ImagenJuegoDTO[] {
    return this.imagenes.slice(0, this.maxImages);
  }

  /** Verifica si hay imágenes para mostrar */
  get hasImages(): boolean {
    return this.imagenes && this.imagenes.length > 0;
  }

  /** Escucha eventos de teclado para navegación en el lightbox */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.selectedImage()) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.nextImage();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.previousImage();
        event.preventDefault();
        break;
    }
  }

  /** Abre el lightbox con la imagen seleccionada */
  openLightbox(imagen: ImagenJuegoDTO): void {
    const index = this.displayImages.findIndex(img => img.id === imagen.id);
    this.currentIndex = index >= 0 ? index : 0;
    this.selectedImage.set(imagen);
  }

  /** Cierra el lightbox */
  closeLightbox(): void {
    this.selectedImage.set(null);
    this.cdr.detectChanges();
  }

  /** Navega a la siguiente imagen */
  nextImage(): void {
    const images = this.displayImages;
    if (images.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % images.length;
    this.selectedImage.set(images[this.currentIndex]);
    this.cdr.detectChanges();
  }

  /** Navega a la imagen anterior */
  previousImage(): void {
    const images = this.displayImages;
    if (images.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + images.length) % images.length;
    this.selectedImage.set(images[this.currentIndex]);
    this.cdr.detectChanges();
  }

  /** Maneja el clic en el overlay para cerrar */
  onOverlayClick(event: MouseEvent): void {
    // Solo cierra si se hace clic directamente en el overlay, no en la imagen
    if (event.target === event.currentTarget) {
      this.closeLightbox();
    }
  }
}
