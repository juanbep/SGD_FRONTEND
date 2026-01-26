import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicCalendarManagementComponent } from './academic-calendar-management.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('AcademicCalendarManagementComponent', () => {
  let component: AcademicCalendarManagementComponent;
  let fixture: ComponentFixture<AcademicCalendarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        AcademicCalendarManagementComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicCalendarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
