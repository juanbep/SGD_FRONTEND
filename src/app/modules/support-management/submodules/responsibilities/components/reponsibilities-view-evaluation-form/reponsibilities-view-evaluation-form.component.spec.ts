import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReponsibilitiesViewEvaluationFormComponent } from './reponsibilities-view-evaluation-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ReponsibilitiesViewEvaluationFormComponent', () => {
  let component: ReponsibilitiesViewEvaluationFormComponent;
  let fixture: ComponentFixture<ReponsibilitiesViewEvaluationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ReponsibilitiesViewEvaluationFormComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ReponsibilitiesViewEvaluationFormComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
