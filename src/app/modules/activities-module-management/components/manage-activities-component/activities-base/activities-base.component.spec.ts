import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesBaseComponent } from './activities-base.component';

describe('ActivitiesBaseComponent', () => {
  let component: ActivitiesBaseComponent;
  let fixture: ComponentFixture<ActivitiesBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
