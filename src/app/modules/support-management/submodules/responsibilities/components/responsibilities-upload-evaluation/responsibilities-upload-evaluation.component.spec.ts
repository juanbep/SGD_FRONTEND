import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesUploadEvaluationComponent } from './responsibilities-upload-evaluation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesUploadEvaluationComponent', () => {
  let component: ResponsibilitiesUploadEvaluationComponent;
  let fixture: ComponentFixture<ResponsibilitiesUploadEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ResponsibilitiesUploadEvaluationComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ResponsibilitiesUploadEvaluationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
