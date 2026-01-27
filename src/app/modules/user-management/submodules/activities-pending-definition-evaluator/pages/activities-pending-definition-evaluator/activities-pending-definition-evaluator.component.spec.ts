import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorComponent } from './activities-pending-definition-evaluator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesPendingDefinitionEvaluatorComponent', () => {
  let component: ActivitiesPendingDefinitionEvaluatorComponent;
  let fixture: ComponentFixture<ActivitiesPendingDefinitionEvaluatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ActivitiesPendingDefinitionEvaluatorComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ActivitiesPendingDefinitionEvaluatorComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
