import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Notification } from './notification';

describe('Notification', () => {
  let component: Notification;
  let fixture: ComponentFixture<Notification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have info type by default', () => {
    expect(component.type).toBe('info');
  });

  it('should have top-right position by default', () => {
    expect(component.position).toBe('top-right');
  });

  it('should be dismissible by default', () => {
    expect(component.dismissible).toBe(true);
  });

  it('should have 5000ms duration by default', () => {
    expect(component.duration).toBe(5000);
  });

  it('should generate correct classes for each type', () => {
    component.type = 'success';
    expect(component.classes['notification--success']).toBe(true);

    component.type = 'error';
    expect(component.classes['notification--error']).toBe(true);

    component.type = 'warning';
    expect(component.classes['notification--warning']).toBe(true);

    component.type = 'info';
    expect(component.classes['notification--info']).toBe(true);
  });

  it('should generate correct classes for positions', () => {
    component.position = 'bottom-left';
    expect(component.classes['notification--bottom-left']).toBe(true);
  });

  it('should set isLeaving to true when close is called', () => {
    component.close();
    expect(component.isLeaving).toBe(true);
  });

  it('should emit closed event after animation delay', fakeAsync(() => {
    spyOn(component.closed, 'emit');
    component.close();
    
    expect(component.closed.emit).not.toHaveBeenCalled();
    
    tick(300); // Esperar la animación
    
    expect(component.visible).toBe(false);
    expect(component.closed.emit).toHaveBeenCalled();
  }));
});
