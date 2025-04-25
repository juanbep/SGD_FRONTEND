import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcademicPeriodManagementComponent } from './academic-period-management.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AcademicPeriodManagementComponent', () => {
  let component: AcademicPeriodManagementComponent;
  let fixture: ComponentFixture<AcademicPeriodManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,ToastrModule.forRoot(), AcademicPeriodManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicPeriodManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});