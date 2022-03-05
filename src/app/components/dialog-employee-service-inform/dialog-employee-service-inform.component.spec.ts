import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmployeeServiceInformComponent } from './dialog-employee-service-inform.component';

describe('DialogEmployeeServiceInformComponent', () => {
  let component: DialogEmployeeServiceInformComponent;
  let fixture: ComponentFixture<DialogEmployeeServiceInformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEmployeeServiceInformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEmployeeServiceInformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
