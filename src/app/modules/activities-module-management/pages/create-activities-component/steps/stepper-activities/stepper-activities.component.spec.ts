import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperActivitiesComponent } from './stepper-activities.component';

describe('StepperActivitiesComponent', () => {
  let component: StepperActivitiesComponent;
  let fixture: ComponentFixture<StepperActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
