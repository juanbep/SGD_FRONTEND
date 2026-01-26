import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorFilterComponent } from './activities-pending-definition-evaluator-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesPendingDefinitionEvaluatorFilterComponent', () => {
  let component: ActivitiesPendingDefinitionEvaluatorFilterComponent;
  let fixture: ComponentFixture<ActivitiesPendingDefinitionEvaluatorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ActivitiesPendingDefinitionEvaluatorFilterComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ActivitiesPendingDefinitionEvaluatorFilterComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
