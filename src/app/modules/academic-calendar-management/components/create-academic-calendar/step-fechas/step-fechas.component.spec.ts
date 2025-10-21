import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFechasComponent } from './step-fechas.component';

describe('StepFechasComponent', () => {
  let component: StepFechasComponent;
  let fixture: ComponentFixture<StepFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
