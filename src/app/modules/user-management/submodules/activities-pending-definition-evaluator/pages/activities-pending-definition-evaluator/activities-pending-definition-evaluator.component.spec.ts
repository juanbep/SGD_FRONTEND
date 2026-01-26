import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorComponent } from './activities-pending-definition-evaluator.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesPendingDefinitionEvaluatorComponent', () => {
  let component: ActivitiesPendingDefinitionEvaluatorComponent;
  let fixture: ComponentFixture<ActivitiesPendingDefinitionEvaluatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
