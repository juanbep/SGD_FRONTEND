import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivitiesComponentComponent } from './create-activities-component.component';

describe('CreateActivitiesComponentComponent', () => {
  let component: CreateActivitiesComponentComponent;
  let fixture: ComponentFixture<CreateActivitiesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateActivitiesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateActivitiesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
