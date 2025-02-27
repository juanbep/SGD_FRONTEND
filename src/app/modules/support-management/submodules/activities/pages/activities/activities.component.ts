import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivitiesFilterComponent } from "../../components/activities-filter/activities-filter.component";
import { ActivitiesUploadSelfAssessmentComponent } from "../../components/activities-upload-self-assessment/activities-upload-self-assessment.component";
import { CommonModule } from '@angular/common';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { ActivitiesEditEvaluationComponent } from '../../components/activities-edit-evaluation/activities-edit-evaluation.component';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';

@Component({
  selector: 'support-management-activities',
  standalone: true,
  imports: [ActivitiesTableComponent, ActivitiesFilterComponent, ActivitiesUploadSelfAssessmentComponent, CommonModule, ActivitiesEditEvaluationComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit{

  private authServiceService = inject(AuthServiceService);


  @ViewChild(ActivitiesUploadSelfAssessmentComponent)
  uploadSelfAssessmentComponent!: ActivitiesUploadSelfAssessmentComponent;

  @ViewChild(ActivitiesEditEvaluationComponent)
  editSelfAssessmentComponent!: ActivitiesEditEvaluationComponent;

  public activityResponse: PagedResponse<ActividadResponse> | null = null;

  public checkActivitiesDiliegenciadoVar: boolean = false;

  public openModalOptionSelected: boolean = false;


  public currentUser = this.authServiceService.currentUser;

  constructor(private activitiesServices: ActivitiesServicesService) { 
    effect(() => {
      this.activityResponse = this.activitiesServices.getDataActivities();
      this.checkActivitiesDiliegenciadoVar=this.checkActivitiesComplete();
   });
  }
  
  ngOnInit(): void {
  }

  private checkActivitiesComplete(){
    if (this.activityResponse?.content) {
      return this.activityResponse.content.some(activity =>
        activity.fuentes?.some(fuente => fuente.estadoFuente === 'DILIGENCIADO')
      );
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
