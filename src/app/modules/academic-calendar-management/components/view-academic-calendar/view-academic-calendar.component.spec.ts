import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicCalendarComponent } from './view-academic-calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ViewAcademicCalendarComponent', () => {
  let component: ViewAcademicCalendarComponent;
  let fixture: ComponentFixture<ViewAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ViewAcademicCalendarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAcademicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
