import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GameCard, GamePlatform } from './game-card';

describe('GameCard', () => {
  let component: GameCard;
  let fixture: ComponentFixture<GameCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    component.coverSrc = '/assets/img/test-cover.jpg';
    component.title = 'Test Game';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display game title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-card__title')?.textContent).toContain('Test Game');
  });

  it('should display release date when provided', () => {
    // Crear nuevo componente con releaseDate desde el inicio
    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    component.coverSrc = '/assets/img/test-cover.jpg';
    component.title = 'Test Game';
    component.releaseDate = '09-11-2010';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const dateElement = compiled.querySelector('.game-card__date');
    expect(dateElement?.textContent?.trim()).toBe('09-11-2010');
  });

  it('should display developer when provided', () => {
    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    component.coverSrc = '/assets/img/test-cover.jpg';
    component.title = 'Test Game';
    component.developer = 'Treyarch';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const developerName = compiled.querySelector('.game-card__developer-name');
    expect(developerName?.textContent?.trim()).toBe('Treyarch');
  });

  it('should display developer as link when developerLink is provided', () => {
    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    component.coverSrc = '/assets/img/test-cover.jpg';
    component.title = 'Test Game';
    component.developer = 'Treyarch';
    component.developerLink = '/developers/treyarch';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('.game-card__developer-link');
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe('Treyarch');
  });

  it('should display description when provided', () => {
    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    component.coverSrc = '/assets/img/test-cover.jpg';
    component.title = 'Test Game';
    component.description = 'Test description';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('.game-card__description');
    expect(description?.textContent?.trim()).toBe('Test description');
  });

  it('should display platforms when provided', () => {
    const platforms: GamePlatform[] = [
      { name: 'PlayStation' },
      { name: 'Xbox' },
      { name: 'PC' },
    ];
    
    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    component.coverSrc = '/assets/img/test-cover.jpg';
    component.title = 'Test Game';
    component.platforms = platforms;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const platformsElement = compiled.querySelector('.game-card__platforms');
    expect(platformsElement).toBeTruthy();
  });

  it('should not display platforms section when empty', () => {
    component.platforms = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-card__platforms')).toBeFalsy();
  });
});
