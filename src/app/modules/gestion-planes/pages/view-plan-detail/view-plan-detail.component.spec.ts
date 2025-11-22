import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlanDetailComponent } from './view-plan-detail.component';

describe('ViewPlanDetailComponent', () => {
  let component: ViewPlanDetailComponent;
  let fixture: ComponentFixture<ViewPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPlanDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
