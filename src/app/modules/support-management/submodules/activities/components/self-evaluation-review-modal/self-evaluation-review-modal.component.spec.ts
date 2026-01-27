import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { SelfEvaluationReviewModalComponent } from './self-evaluation-review-modal.component';

describe('SelfEvaluationReviewModalComponent', () => {
  let component: SelfEvaluationReviewModalComponent;
  let fixture: ComponentFixture<SelfEvaluationReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        SelfEvaluationReviewModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
