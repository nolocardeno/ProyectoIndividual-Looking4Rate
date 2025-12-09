import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSelect, SelectOption } from './form-select';

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
      imports: [FormSelect],
    }).compileComponents();

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

  it('should render all options', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const options = compiled.querySelectorAll('option');
    // +1 por el placeholder
    expect(options.length).toBe(mockOptions.length + 1);
  });

  it('should emit valueChange on selection', () => {
    const spy = spyOn(component.valueChange, 'emit');
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'ps5';
    select.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith('ps5');
  });

  it('should show error message when provided', () => {
    component.errorMessage = 'Selecciona una plataforma';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-select__error')?.textContent).toContain('Selecciona una plataforma');
  });

  it('should show placeholder as first option', () => {
    component.placeholder = 'Elige una opción';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const firstOption = compiled.querySelector('option');
    expect(firstOption?.textContent).toContain('Elige una opción');
  });

  it('should apply disabled class when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-select--disabled')).toBeTruthy();
  });
});
