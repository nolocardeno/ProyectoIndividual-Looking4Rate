import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faFacebook, 
  faInstagram, 
  faXTwitter, 
  faYoutube, 
  faDiscord 
} from '@fortawesome/free-brands-svg-icons';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer, RouterTestingModule, FontAwesomeModule],
    }).compileComponents();

    // Configurar iconos de FontAwesome
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faFacebook, faInstagram, faXTwitter, faYoutube, faDiscord);

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });
});
