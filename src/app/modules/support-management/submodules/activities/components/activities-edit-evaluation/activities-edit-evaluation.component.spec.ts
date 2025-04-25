import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesEditEvaluationComponent } from './activities-edit-evaluation.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesEditEvaluationComponent', () => {
  let component: ActivitiesEditEvaluationComponent;
  let fixture: ComponentFixture<ActivitiesEditEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), ActivitiesEditEvaluationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesEditEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});