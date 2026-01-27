import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfEvaluationFormComponent } from './self-evaluation-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('SelfEvaluationFormComponent', () => {
  let component: SelfEvaluationFormComponent;
  let fixture: ComponentFixture<SelfEvaluationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        SelfEvaluationFormComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
