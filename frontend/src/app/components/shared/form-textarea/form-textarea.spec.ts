import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTextarea } from './form-textarea';

describe('FormTextarea', () => {
  let component: FormTextarea;
  let fixture: ComponentFixture<FormTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    component.label = 'Descripción';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-textarea__label')?.textContent).toContain('Descripción');
  });

  it('should show required indicator when required', () => {
    component.label = 'Test';
    component.required = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-textarea__required')).toBeTruthy();
  });

  it('should emit valueChange on input', () => {
    const spy = spyOn(component.valueChange, 'emit');
    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'Test content';
    textarea.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith('Test content');
  });

  it('should show error message when provided', () => {
    component.errorMessage = 'Este campo es obligatorio';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-textarea__error')?.textContent).toContain('Este campo es obligatorio');
  });

  it('should show character counter when maxLength is set', () => {
    component.maxLength = 100;
    component.value = 'Test';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-textarea__counter')?.textContent).toContain('4/100');
  });

  it('should apply no-resize class when resizable is false', () => {
    component.resizable = false;
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea.classList.contains('form-textarea__field--no-resize')).toBeTruthy();
  });
});
