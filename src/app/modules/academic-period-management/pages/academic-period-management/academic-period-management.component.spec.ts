import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcademicPeriodManagementComponent } from './academic-period-management.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AcademicPeriodManagementComponent', () => {
  let component: AcademicPeriodManagementComponent;
  let fixture: ComponentFixture<AcademicPeriodManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        AcademicPeriodManagementComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicPeriodManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
