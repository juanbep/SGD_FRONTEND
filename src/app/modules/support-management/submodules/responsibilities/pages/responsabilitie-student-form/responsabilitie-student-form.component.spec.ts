import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsabilitieStudentFormComponent } from './responsabilitie-student-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('ResponsabilitieStudentFormComponent', () => {
  let component: ResponsabilitieStudentFormComponent;
  let fixture: ComponentFixture<ResponsabilitieStudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ResponsabilitieStudentFormComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsabilitieStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
