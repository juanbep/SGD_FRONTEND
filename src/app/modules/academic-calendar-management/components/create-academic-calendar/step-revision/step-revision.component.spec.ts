import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepRevisionComponent } from './step-revision.component';

describe('StepRevisionComponent', () => {
  let component: StepRevisionComponent;
  let fixture: ComponentFixture<StepRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepRevisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
