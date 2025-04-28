import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorTableComponent } from './activities-pending-definition-evaluator-table.component';

describe('ActivitiesPendingDefinitionEvaluatorTableComponent', () => {
  let component: ActivitiesPendingDefinitionEvaluatorTableComponent;
  let fixture: ComponentFixture<ActivitiesPendingDefinitionEvaluatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesPendingDefinitionEvaluatorTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesPendingDefinitionEvaluatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
