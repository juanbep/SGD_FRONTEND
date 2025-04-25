import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesUploadEvaluationComponent } from './responsibilities-upload-evaluation.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesUploadEvaluationComponent', () => {
  let component: ResponsibilitiesUploadEvaluationComponent;
  let fixture: ComponentFixture<ResponsibilitiesUploadEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
