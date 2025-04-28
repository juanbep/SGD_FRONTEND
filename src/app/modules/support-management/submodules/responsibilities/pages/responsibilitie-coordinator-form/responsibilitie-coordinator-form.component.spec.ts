import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitieCoordinatorFormComponent } from './responsibilitie-coordinator-form.component';

describe('ResponsibilitieCoordinatorFormComponent', () => {
  let component: ResponsibilitieCoordinatorFormComponent;
  let fixture: ComponentFixture<ResponsibilitieCoordinatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibilitieCoordinatorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsibilitieCoordinatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
