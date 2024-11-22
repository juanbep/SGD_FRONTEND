import { Component } from '@angular/core';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivitiesFilterComponent } from "../../components/activities-filter/activities-filter.component";
import { ActivitiesUploadSelfAssessmentComponent } from "../../components/activities-upload-self-assessment/activities-upload-self-assessment.component";

@Component({
  selector: 'support-management-activities',
  standalone: true,
  imports: [ActivitiesTableComponent, ActivitiesFilterComponent, ActivitiesUploadSelfAssessmentComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {

}
