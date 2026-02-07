import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicCalendarManagementComponent } from './gestion-calendarios.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AcademicCalendarManagementComponent', () => {
  let component: AcademicCalendarManagementComponent;
  let fixture: ComponentFixture<AcademicCalendarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
