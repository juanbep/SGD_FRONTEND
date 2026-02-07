import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcademicCalendarComponent } from './edit-academic-calendar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditAcademicCalendarComponent', () => {
  let component: EditAcademicCalendarComponent;
  let fixture: ComponentFixture<EditAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        EditAcademicCalendarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAcademicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
