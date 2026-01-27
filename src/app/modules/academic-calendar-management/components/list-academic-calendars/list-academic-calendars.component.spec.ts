import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcademicCalendarsComponent } from './list-academic-calendars.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ListAcademicCalendarsComponent', () => {
  let component: ListAcademicCalendarsComponent;
  let fixture: ComponentFixture<ListAcademicCalendarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
