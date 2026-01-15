import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSelect, SelectOption } from './form-select';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

describe('FormSelect', () => {
  let component: FormSelect;
  let fixture: ComponentFixture<FormSelect>;

  const mockOptions: SelectOption[] = [
    { value: 'ps5', label: 'PlayStation 5' },
    { value: 'xbox', label: 'Xbox Series X' },
    { value: 'pc', label: 'PC' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelect, FontAwesomeModule],
    }).compileComponents();

    // Configurar iconos de FontAwesome
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faChevronDown, faCheck);

    fixture = TestBed.createComponent(FormSelect);
    component = fixture.componentInstance;
    component.options = mockOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    component.label = 'Plataforma';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-select__label')?.textContent).toContain('Plataforma');
  });

  it('should show required indicator when required', () => {
    component.label = 'Test';
    component.required = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-select__required')).toBeTruthy();
  });

  it('should render trigger button with placeholder', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector('.form-select__trigger');
    expect(trigger).toBeTruthy();
    expect(trigger?.textContent).toContain('Selecciona una opción');
  });

  it('should emit valueChange on selection', () => {
    const spy = spyOn(component.valueChange, 'emit');
    
    // Abrir dropdown
    component.isOpen = true;
    fixture.detectChanges();
    
    // Simular selección directamente
    component.selectOption(mockOptions[0]);
    
    expect(spy).toHaveBeenCalledWith('ps5');
  });

  it('should show error message when provided', () => {
    component.errorMessage = 'Selecciona una plataforma';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-select__error')?.textContent).toContain('Selecciona una plataforma');
  });

  it('should show placeholder text when no value selected', () => {
    component.placeholder = 'Elige una opción';
    component.value = '';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector('.form-select__trigger');
    expect(trigger?.textContent).toContain('Elige una opción');
  });

  it('should apply disabled class when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-select--disabled')).toBeTruthy();
  });

  it('should toggle dropdown on trigger click', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleDropdown();
    expect(component.isOpen).toBeTrue();
    component.toggleDropdown();
    expect(component.isOpen).toBeFalse();
  });

  it('should show selected label when value is set', () => {
    component.value = 'ps5';
    fixture.detectChanges();
    expect(component.selectedLabel).toBe('PlayStation 5');
  });

  it('should render options when dropdown is open', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const options = compiled.querySelectorAll('.form-select__option');
    expect(options.length).toBe(mockOptions.length);
  });
});
