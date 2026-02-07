import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicCalendarsComponent } from './view-academic-calendars.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ViewAcademicCalendarComponent', () => {
  let component: ViewAcademicCalendarsComponent;
  let fixture: ComponentFixture<ViewAcademicCalendarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ViewAcademicCalendarsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAcademicCalendarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
