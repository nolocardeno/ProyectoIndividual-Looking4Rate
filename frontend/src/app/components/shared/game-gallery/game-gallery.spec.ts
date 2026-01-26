import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameGallery } from './game-gallery';
import { ImagenJuegoDTO } from '../../../models';

describe('GameGallery', () => {
  let component: GameGallery;
  let fixture: ComponentFixture<GameGallery>;

  const mockImagenes: ImagenJuegoDTO[] = [
    { id: 1, url: 'https://example.com/img1.jpg', alt: 'Imagen 1', caption: 'Caption 1' },
    { id: 2, url: 'https://example.com/img2.jpg', alt: 'Imagen 2', caption: null },
    { id: 3, url: 'https://example.com/img3.jpg', alt: 'Imagen 3', caption: 'Caption 3' },
    { id: 4, url: 'https://example.com/img4.jpg', alt: 'Imagen 4', caption: 'Caption 4' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(GameGallery);
    component = fixture.componentInstance;
    component.imagenes = mockImagenes;
    component.gameTitle = 'Test Game';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display gallery when images are provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-gallery')).toBeTruthy();
  });

  it('should not display gallery when no images', () => {
    component.imagenes = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-gallery')).toBeFalsy();
  });

  it('should display correct number of images', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('.game-gallery__image');
    expect(images.length).toBe(4);
  });

  it('should limit images to maxImages', () => {
    component.maxImages = 2;
    fixture.detectChanges();
    
    expect(component.displayImages.length).toBe(2);
  });

  it('should use lazy loading on images', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('.game-gallery__image');
    
    images.forEach(img => {
      expect(img.getAttribute('loading')).toBe('lazy');
    });
  });

  it('should have proper alt text for accessibility', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstImage = compiled.querySelector('.game-gallery__image') as HTMLImageElement;
    
    expect(firstImage.alt).toBe('Imagen 1');
  });

  it('should display caption when provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const captions = compiled.querySelectorAll('.game-gallery__caption');
    
    // Solo 3 imágenes tienen caption (la segunda tiene null)
    expect(captions.length).toBe(3);
  });

  it('should have aria-label with game title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('.game-gallery');
    
    expect(section?.getAttribute('aria-label')).toContain('Test Game');
  });

  it('should return true for hasImages when images exist', () => {
    expect(component.hasImages).toBe(true);
  });

  it('should return false for hasImages when no images', () => {
    component.imagenes = [];
    expect(component.hasImages).toBe(false);
  });
});
