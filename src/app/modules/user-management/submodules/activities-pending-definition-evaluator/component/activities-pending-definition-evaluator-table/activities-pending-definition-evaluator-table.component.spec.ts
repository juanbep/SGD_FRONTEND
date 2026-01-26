import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorTableComponent } from './activities-pending-definition-evaluator-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesPendingDefinitionEvaluatorTableComponent', () => {
  let component: ActivitiesPendingDefinitionEvaluatorTableComponent;
  let fixture: ComponentFixture<ActivitiesPendingDefinitionEvaluatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ActivitiesPendingDefinitionEvaluatorTableComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ActivitiesPendingDefinitionEvaluatorTableComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
