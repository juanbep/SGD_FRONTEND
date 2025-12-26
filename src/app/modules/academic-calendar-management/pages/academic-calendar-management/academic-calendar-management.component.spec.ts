import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicCalendarManagementComponent } from './academic-calendar-management.component';

describe('AcademicCalendarManagementComponent', () => {
  let component: AcademicCalendarManagementComponent;
  let fixture: ComponentFixture<AcademicCalendarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicCalendarManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicCalendarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
