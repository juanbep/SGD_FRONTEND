import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicCalendarsComponent } from './view-academic-calendars.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ViewAcademicCalendarComponent', () => {
  let component: ViewAcademicCalendarsComponent;
  let fixture: ComponentFixture<ViewAcademicCalendarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
