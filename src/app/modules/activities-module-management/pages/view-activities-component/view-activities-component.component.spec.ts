import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActivitiesComponentComponent } from './view-activities-component.component';

describe('ViewActivitiesComponentComponent', () => {
  let component: ViewActivitiesComponentComponent;
  let fixture: ComponentFixture<ViewActivitiesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewActivitiesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewActivitiesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
