/**
 * @fileoverview Tests para UserDropdown Component
 * 
 * Suite de pruebas unitarias para el componente de dropdown de usuario.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDropdown } from './user-dropdown';
import { Router } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faUser, faCog, faSignOutAlt, faChevronDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';

describe('UserDropdown', () => {
  let component: UserDropdown;
  let fixture: ComponentFixture<UserDropdown>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserDropdown, FontAwesomeModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faHome, faUser, faCog, faSignOutAlt, faChevronDown, faUserCircle);

    fixture = TestBed.createComponent(UserDropdown);
    component = fixture.componentInstance;
    component.userName = 'TestUser';
    fixture.detectChanges();
  });

  describe('Creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería mostrar el nombre de usuario', () => {
      expect(component.userName).toBe('TestUser');
    });
  });

  describe('Eventos de navegación', () => {
    it('debería emitir navigateHome al hacer clic en Inicio', () => {
      spyOn(component.navigateHome, 'emit');
      
      component.onHomeClick();
      
      expect(component.navigateHome.emit).toHaveBeenCalled();
    });

    it('debería emitir navigateProfile al hacer clic en Perfil', () => {
      spyOn(component.navigateProfile, 'emit');
      
      component.onProfileClick();
      
      expect(component.navigateProfile.emit).toHaveBeenCalled();
    });

    it('debería emitir navigateSettings al hacer clic en Ajustes', () => {
      spyOn(component.navigateSettings, 'emit');
      
      component.onSettingsClick();
      
      expect(component.navigateSettings.emit).toHaveBeenCalled();
    });

    it('debería emitir logoutClick al hacer clic en Cerrar sesión', () => {
      spyOn(component.logoutClick, 'emit');
      
      component.onLogoutClick();
      
      expect(component.logoutClick.emit).toHaveBeenCalled();
    });
  });

  describe('Inputs requeridos', () => {
    it('debería aceptar userName vacío', () => {
      component.userName = '';
      fixture.detectChanges();
      expect(component.userName).toBe('');
    });

    it('debería aceptar userName largo', () => {
      component.userName = 'Un nombre de usuario muy largo para testing';
      fixture.detectChanges();
      expect(component.userName).toBe('Un nombre de usuario muy largo para testing');
    });
  });
});
