import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicCalendarsComponent } from './view-academic-calendars.component';

describe('ViewAcademicCalendarComponent', () => {
  let component: ViewAcademicCalendarsComponent;
  let fixture: ComponentFixture<ViewAcademicCalendarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAcademicCalendarsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAcademicCalendarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
