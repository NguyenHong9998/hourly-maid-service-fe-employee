import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetExperenceComponent } from './set-experence.component';

describe('SetExperenceComponent', () => {
  let component: SetExperenceComponent;
  let fixture: ComponentFixture<SetExperenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetExperenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetExperenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
