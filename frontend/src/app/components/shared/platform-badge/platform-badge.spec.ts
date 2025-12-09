import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PlatformBadge } from './platform-badge';

describe('PlatformBadge', () => {
  let component: PlatformBadge;
  let fixture: ComponentFixture<PlatformBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformBadge],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformBadge);
    component = fixture.componentInstance;
    component.name = 'PlayStation';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display platform name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('PlayStation');
  });

  it('should render as span when no routerLink', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span.platform-badge')).toBeTruthy();
  });

  it('should render as link when routerLink is provided', () => {
    component.routerLink = '/platforms/playstation';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.platform-badge')).toBeTruthy();
  });
});
