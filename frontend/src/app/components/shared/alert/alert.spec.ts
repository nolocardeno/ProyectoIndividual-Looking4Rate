import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alert } from './alert';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have info type by default', () => {
    expect(component.type).toBe('info');
  });

  it('should not be dismissible by default', () => {
    expect(component.dismissible).toBe(false);
  });

  it('should be visible by default', () => {
    expect(component.visible).toBe(true);
  });

  it('should generate correct classes for each type', () => {
    component.type = 'success';
    expect(component.classes['alert--success']).toBe(true);

    component.type = 'error';
    expect(component.classes['alert--error']).toBe(true);

    component.type = 'warning';
    expect(component.classes['alert--warning']).toBe(true);

    component.type = 'info';
    expect(component.classes['alert--info']).toBe(true);
  });

  it('should emit closed event and hide when close is called', () => {
    spyOn(component.closed, 'emit');
    component.close();
    
    expect(component.visible).toBe(false);
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
