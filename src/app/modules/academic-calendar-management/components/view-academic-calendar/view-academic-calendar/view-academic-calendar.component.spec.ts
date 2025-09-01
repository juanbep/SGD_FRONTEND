import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicCalendarComponent } from './view-academic-calendar.component';

describe('ViewAcademicCalendarComponent', () => {
  let component: ViewAcademicCalendarComponent;
  let fixture: ComponentFixture<ViewAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAcademicCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAcademicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
