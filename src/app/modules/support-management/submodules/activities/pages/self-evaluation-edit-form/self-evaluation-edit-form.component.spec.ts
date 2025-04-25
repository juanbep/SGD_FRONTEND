import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfEvaluationEditFormComponent } from './self-evaluation-edit-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('SelfEvaluationEditFormComponent', () => {
  let component: SelfEvaluationEditFormComponent;
  let fixture: ComponentFixture<SelfEvaluationEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        SelfEvaluationEditFormComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
