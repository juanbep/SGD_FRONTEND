import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorTableComponent } from './activities-pending-definition-evaluator-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(
      ActivitiesPendingDefinitionEvaluatorTableComponent,
    );
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
