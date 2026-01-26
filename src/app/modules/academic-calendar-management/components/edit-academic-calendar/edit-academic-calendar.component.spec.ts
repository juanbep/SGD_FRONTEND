import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcademicCalendarComponent } from './edit-academic-calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('EditAcademicCalendarComponent', () => {
  let component: EditAcademicCalendarComponent;
  let fixture: ComponentFixture<EditAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
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
