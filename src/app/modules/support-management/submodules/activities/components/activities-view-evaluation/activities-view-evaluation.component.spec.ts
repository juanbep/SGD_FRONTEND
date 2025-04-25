import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesViewEvaluationComponent } from './activities-view-evaluation.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesViewEvaluationComponent', () => {
  let component: ActivitiesViewEvaluationComponent;
  let fixture: ComponentFixture<ActivitiesViewEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), ActivitiesViewEvaluationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesViewEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});