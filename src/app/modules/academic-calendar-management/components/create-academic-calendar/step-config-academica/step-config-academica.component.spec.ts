import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepConfigAcademicaComponent } from './step-config-academica.component';

describe('StepConfigAcademicaComponent', () => {
  let component: StepConfigAcademicaComponent;
  let fixture: ComponentFixture<StepConfigAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepConfigAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepConfigAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
