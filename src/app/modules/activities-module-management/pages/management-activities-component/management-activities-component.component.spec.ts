import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementActivitiesComponentComponent } from './management-activities-component.component';

describe('ManagementActivitiesComponentComponent', () => {
  let component: ManagementActivitiesComponentComponent;
  let fixture: ComponentFixture<ManagementActivitiesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementActivitiesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementActivitiesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
