import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAcademicCalendarComponent } from './update-academic-calendar.component';

describe('UpdateAcademicCalendarComponent', () => {
  let component: UpdateAcademicCalendarComponent;
  let fixture: ComponentFixture<UpdateAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAcademicCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAcademicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
