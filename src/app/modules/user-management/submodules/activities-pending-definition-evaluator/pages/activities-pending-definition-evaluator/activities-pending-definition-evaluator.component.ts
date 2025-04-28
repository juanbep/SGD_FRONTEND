import { Component } from '@angular/core';
import { ActivitiesPendingDefinitionEvaluatorTableComponent } from "../../component/activities-pending-definition-evaluator-table/activities-pending-definition-evaluator-table.component";
import { ActivitiesPendingDefinitionEvaluatorFilterComponent } from "../../component/activities-pending-definition-evaluator-filter/activities-pending-definition-evaluator-filter.component";

@Component({
  selector: 'app-activities-pending-definition-evaluator',
  standalone: true,
  imports: [ActivitiesPendingDefinitionEvaluatorTableComponent, ActivitiesPendingDefinitionEvaluatorFilterComponent],
  templateUrl: './activities-pending-definition-evaluator.component.html',
  styleUrl: './activities-pending-definition-evaluator.component.css'
})
export class ActivitiesPendingDefinitionEvaluatorComponent {
  
}
