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
    component.releaseDate = '09-11-2010';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-card__date')?.textContent).toContain('09-11-2010');
  });

  it('should display developer when provided', () => {
    component.developer = 'Treyarch';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Treyarch');
  });

  it('should display developer as link when developerLink is provided', () => {
    component.developer = 'Treyarch';
    component.developerLink = '/developers/treyarch';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-card__developer-link')).toBeTruthy();
  });

  it('should display description when provided', () => {
    component.description = 'Test description';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-card__description')?.textContent).toContain('Test description');
  });

  it('should display platforms when provided', () => {
    const platforms: GamePlatform[] = [
      { name: 'PlayStation' },
      { name: 'Xbox' },
      { name: 'PC' },
    ];
    component.platforms = platforms;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('PlayStation');
    expect(compiled.textContent).toContain('Xbox');
    expect(compiled.textContent).toContain('PC');
  });

  it('should not display platforms section when empty', () => {
    component.platforms = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-card__platforms')).toBeFalsy();
  });
});
