import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitiesEditCoordinatorFormComponent } from './responsibilities-edit-coordinator-form.component';

describe('ResponsibilitiesEditCoordinatorFormComponent', () => {
  let component: ResponsibilitiesEditCoordinatorFormComponent;
  let fixture: ComponentFixture<ResponsibilitiesEditCoordinatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibilitiesEditCoordinatorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsibilitiesEditCoordinatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
