import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReponsibilitiesEditStudentFormComponent } from './reponsibilities-edit-student-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('ReponsibilitiesEditFormComponent', () => {
  let component: ReponsibilitiesEditStudentFormComponent;
  let fixture: ComponentFixture<ReponsibilitiesEditStudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ReponsibilitiesEditStudentFormComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReponsibilitiesEditStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
