import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesEditEvaluationComponent } from './responsibilities-edit-evaluation.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesEditEvaluationComponent', () => {
  let component: ResponsibilitiesEditEvaluationComponent;
  let fixture: ComponentFixture<ResponsibilitiesEditEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ResponsibilitiesEditEvaluationComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilitiesEditEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
