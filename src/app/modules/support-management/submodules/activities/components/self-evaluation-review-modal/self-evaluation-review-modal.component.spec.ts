import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SelfEvaluationReviewModalComponent } from './self-evaluation-review-modal.component';

describe('SelfEvaluationReviewModalComponent', () => {
  let component: SelfEvaluationReviewModalComponent;
  let fixture: ComponentFixture<SelfEvaluationReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), SelfEvaluationReviewModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});