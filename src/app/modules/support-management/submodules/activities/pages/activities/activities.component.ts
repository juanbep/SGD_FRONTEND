import { Component, effect, inject, ViewChild } from '@angular/core';
import { ActivitiesTableComponent } from '../../components/activities-table/activities-table.component';
import { ActivitiesFilterComponent } from '../../components/activities-filter/activities-filter.component';
import { ActivitiesUploadSelfAssessmentComponent } from '../../components/activities-upload-self-assessment/activities-upload-self-assessment.component';
import { CommonModule } from '@angular/common';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { ActivitiesEditEvaluationComponent } from '../../components/activities-edit-evaluation/activities-edit-evaluation.component';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';

@Component({
  selector: 'support-management-activities',
  standalone: true,
  imports: [
    ActivitiesEditEvaluationComponent,
    ActivitiesFilterComponent,
    ActivitiesTableComponent,
    ActivitiesUploadSelfAssessmentComponent,
    CommonModule,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent {
  @ViewChild(ActivitiesUploadSelfAssessmentComponent)
  uploadSelfAssessmentComponent!: ActivitiesUploadSelfAssessmentComponent;

  @ViewChild(ActivitiesEditEvaluationComponent)
  editSelfAssessmentComponent!: ActivitiesEditEvaluationComponent;

  private authServiceService = inject(AuthServiceService);
  private activitiesServices = inject(ActivitiesServicesService);

  public activityResponse: PagedResponse<ActividadResponse> | null = null;
  public checkActivitiesDiliegenciadoVar: boolean = false;
  public currentUser = this.authServiceService.currentUser;
  public openModalOptionSelected: boolean = false;

  activitiesEffect = effect(() => {
    this.activityResponse = this.activitiesServices.getDataActivities();
    this.checkActivitiesDiliegenciadoVar = this.checkActivitiesComplete();
  });

  private checkActivitiesComplete() {
    if (this.activityResponse?.content) {
      return this.activityResponse.content.some((activity) =>
        activity.fuentes.some(
          (fuente) =>
            fuente.estadoFuente === 'DILIGENCIADO' && fuente.tipoFuente === '1'
        )
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
