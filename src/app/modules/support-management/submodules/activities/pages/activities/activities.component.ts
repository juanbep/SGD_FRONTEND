import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivitiesFilterComponent } from "../../components/activities-filter/activities-filter.component";
import { ActivitiesUploadSelfAssessmentComponent } from "../../components/activities-upload-self-assessment/activities-upload-self-assessment.component";
import { CommonModule } from '@angular/common';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { ActivitiesEditEvaluationComponent } from '../../components/activities-edit-evaluation/activities-edit-evaluation.component';
import { ActivityResponse } from '../../../../../../core/models/activities.interface';

@Component({
  selector: 'support-management-activities',
  standalone: true,
  imports: [ActivitiesTableComponent, ActivitiesFilterComponent, ActivitiesUploadSelfAssessmentComponent, CommonModule, ActivitiesEditEvaluationComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit{


  @ViewChild(ActivitiesUploadSelfAssessmentComponent)
  uploadSelfAssessmentComponent!: ActivitiesUploadSelfAssessmentComponent;

  @ViewChild(ActivitiesEditEvaluationComponent)
  editSelfAssessmentComponent!: ActivitiesEditEvaluationComponent;

  public activityResponse: ActivityResponse | null = null;

  public checkActivitiesPendingVar: boolean = false;

  public openModalOptionSelected: boolean = false;

  constructor(private activitiesServices: ActivitiesServicesService) { 
    effect(() => {
      this.activityResponse = this.activitiesServices.getDataActivities();
      this.checkActivitiesPendingVar=this.checkActivitiesPending();
   });
  }
  
  ngOnInit(): void {
   
  }

  private checkActivitiesPending(){
    if (this.activityResponse?.content) {
      for (let i = 0; i < this.activityResponse.content.length; i++) {
        if (this.activityResponse.content[i].fuentes[0].estadoFuente === "Pendiente") {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  uploadSelfAssessment() {
    this.uploadSelfAssessmentComponent.openModal();
  }

  editSelfAssessment() {
    this.editSelfAssessmentComponent.openModal();
  }


}
