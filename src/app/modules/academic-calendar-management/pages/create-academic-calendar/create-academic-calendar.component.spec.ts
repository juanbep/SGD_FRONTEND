import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcademicCalendarComponent } from './create-academic-calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CreateAcademicCalendarComponent', () => {
  let component: CreateAcademicCalendarComponent;
  let fixture: ComponentFixture<CreateAcademicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        CreateAcademicCalendarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAcademicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
