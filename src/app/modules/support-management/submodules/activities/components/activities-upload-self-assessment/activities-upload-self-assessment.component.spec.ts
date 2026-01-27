import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesUploadSelfAssessmentComponent } from './activities-upload-self-assessment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesUploadSelfAssessmentComponent', () => {
  let component: ActivitiesUploadSelfAssessmentComponent;
  let fixture: ComponentFixture<ActivitiesUploadSelfAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ActivitiesUploadSelfAssessmentComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesUploadSelfAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
