import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcademicCalendarsComponent } from './list-academic-calendars.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ListAcademicCalendarsComponent', () => {
  let component: ListAcademicCalendarsComponent;
  let fixture: ComponentFixture<ListAcademicCalendarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ListAcademicCalendarsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAcademicCalendarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
