import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcademicCalendarsComponent } from './list-academic-calendars.component';

describe('ListAcademicCalendarsComponent', () => {
  let component: ListAcademicCalendarsComponent;
  let fixture: ComponentFixture<ListAcademicCalendarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAcademicCalendarsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAcademicCalendarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
