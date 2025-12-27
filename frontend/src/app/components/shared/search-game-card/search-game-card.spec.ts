import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchGameCard } from './search-game-card';

describe('SearchGameCard', () => {
  let component: SearchGameCard;
  let fixture: ComponentFixture<SearchGameCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchGameCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchGameCard);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.coverSrc = '/assets/img/test-game.jpg';
    component.title = 'Test Game';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the game title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.search-game-card__title');
    expect(title?.textContent).toContain('Test Game');
  });

  it('should display the release year when provided', () => {
    component.releaseYear = '2025';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const year = compiled.querySelector('.search-game-card__year');
    expect(year?.textContent).toContain('2025');
  });

  it('should display developer when provided', () => {
    component.developer = { name: 'Test Developer' };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const developer = compiled.querySelector('.search-game-card__developer');
    expect(developer).toBeTruthy();
    expect(developer?.textContent).toContain('Test Developer');
  });

  it('should display developer as link when routerLink is provided', () => {
    component.developer = { name: 'Test Developer', routerLink: '/developer/1' };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const developerLink = compiled.querySelector('.search-game-card__developer .search-game-card__badge--link');
    expect(developerLink).toBeTruthy();
  });

  it('should display platforms when provided', () => {
    component.platforms = [
      { name: 'PlayStation' },
      { name: 'Xbox' },
      { name: 'PC' }
    ];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const platforms = compiled.querySelectorAll('.search-game-card__platforms-list .search-game-card__badge');
    expect(platforms.length).toBe(3);
  });

  it('should not display developer section when not provided', () => {
    component.developer = null;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const developer = compiled.querySelector('.search-game-card__developer');
    expect(developer).toBeFalsy();
  });

  it('should not display platforms section when empty array', () => {
    component.platforms = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const platforms = compiled.querySelector('.search-game-card__platforms');
    expect(platforms).toBeFalsy();
  });

  it('should make title clickable when gameLink is provided', () => {
    component.gameLink = '/juego/1';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const titleLink = compiled.querySelector('.search-game-card__title-link');
    expect(titleLink).toBeTruthy();
  });
});
