import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesViewEvaluationComponent } from './responsibilities-view-evaluation.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesViewEvaluationComponent', () => {
  let component: ResponsibilitiesViewEvaluationComponent;
  let fixture: ComponentFixture<ResponsibilitiesViewEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ResponsibilitiesViewEvaluationComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilitiesViewEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
