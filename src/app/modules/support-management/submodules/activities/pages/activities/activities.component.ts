import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivitiesFilterComponent } from "../../components/activities-filter/activities-filter.component";
import { ActivitiesUploadSelfAssessmentComponent } from "../../components/activities-upload-self-assessment/activities-upload-self-assessment.component";
import { Actividad } from '../../../../../../core/models/activities.interface';
import { CommonModule } from '@angular/common';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { ActivitiesEditEvaluationComponent } from '../../components/activities-edit-evaluation/activities-edit-evaluation.component';

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

  public activities: Actividad[] = [];

  public checkActivitiesPendingVar: boolean = false;

  public openModalOptionSelected: boolean = false;

  constructor(private activitiesServices: ActivitiesServicesService) { 
    effect(() => {
      this.activities = this.activitiesServices.getDataActivities();
      this.checkActivitiesPendingVar=this.checkActivitiesPending();
   });
  }
  
  ngOnInit(): void {
    this.activitiesServices.getActivities('6', '', '', '', '').subscribe({
      next: data => {
        this.activities = data;
        this.activitiesServices.setDataActivities(data);
        this.checkActivitiesPendingVar = this.checkActivitiesPending();
      },
      error: error => {
        console.error('Error al consultar la información', error);
      }
    });
  }

  private checkActivitiesPending(){
    if (this.activities) {
      for (let i = 0; i < this.activities.length; i++) {
        if (this.activities[i].fuentes[0].estadoFuente === "Pendiente") {
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
