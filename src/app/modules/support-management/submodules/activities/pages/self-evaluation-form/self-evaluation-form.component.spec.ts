import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfEvaluationFormComponent } from './self-evaluation-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('SelfEvaluationFormComponent', () => {
  let component: SelfEvaluationFormComponent;
  let fixture: ComponentFixture<SelfEvaluationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
