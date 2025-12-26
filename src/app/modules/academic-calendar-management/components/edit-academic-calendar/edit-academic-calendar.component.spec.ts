import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcademicCalendarComponent } from './edit-academic-calendar.component';

describe('EditAcademicCalendarComponent', () => {
  let component: EditAcademicCalendarComponent;
  let fixture: ComponentFixture<EditAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAcademicCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAcademicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
