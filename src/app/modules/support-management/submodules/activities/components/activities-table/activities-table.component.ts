import { Component, effect, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesViewEvaluationComponent } from '../activities-view-evaluation/activities-view-evaluation.component';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { Router } from '@angular/router';
import { SelfEvaluationFormComponent } from '../../pages/self-evaluation-form/self-evaluation-form.component';
import { SelfEvaluationReviewModalComponent } from '../self-evaluation-review-modal/self-evaluation-review-modal.component';

const PAGE_SIZE = 10;

@Component({
  selector: 'activities-table',
  standalone: true,
  imports: [
    CommonModule,
    ActivitiesViewEvaluationComponent,
    PaginatorComponent,
    SelfEvaluationReviewModalComponent
  ],
  templateUrl: './activities-table.component.html',
  styleUrl: './activities-table.component.css',
})
export class ActivitiesTableComponent {
  @Input()
  currentUser: UsuarioResponse | null = null;

  @ViewChild(SelfEvaluationReviewModalComponent)
  selfEvaluationReviewModalComponent : SelfEvaluationReviewModalComponent | null = null;

  public currentPage: number = 1;
  public activities: PagedResponse<ActividadResponse> | null = null;
  public activitiesByType!: ActividadesPorTipoActividad[];
  public headDataTable = ['Actividades', 'Autoevaluación', 'Fuente 2'];
  public subHeadDataTable = [
    'Nombre actividad',
    'Estado',
    'Acciones',
    'Evaluador',
    'Rol Evaluador',
    'Estado',
    'Acciones',
  ];
  public openModalViewSelected: boolean = false;
  public activitySelected: ActividadResponse | undefined;
  public sourceSelected: 1 | 2 | undefined;
  public sourceOne: Fuente | null = null;
  public sourceTwo: Fuente | null = null;

  public filterParams: {
    activityName: string | null;
    activityType: string | null;
    evaluatorName: string | null;
    evaluatorRole: string | null;
  } | null = null;

  private activitiesServices = inject(ActivitiesServicesService);

  private router = inject(Router);

  activitiesEffect = effect(() => {
    this.filterParams =
      this.activitiesServices.getParamsActivitiesFilterSignal();
    this.currentPage = 1;
    this.recoverActivities(this.currentPage, PAGE_SIZE);
  });

  pageChanged(event: any) {
    this.currentPage = event;
    this.recoverActivities(this.currentPage, PAGE_SIZE);
  }

  recoverActivities(page: number, totalPage: number) {
    const { activityName, activityType, evaluatorName, evaluatorRole } = this
      .filterParams || {
      activityName: null,
      activityType: null,
      evaluatorName: null,
      evaluatorRole: null,
    };
    if (this.currentUser) {
      this.activitiesServices
        .getActivities(
          this.currentUser.oidUsuario,
          activityName,
          activityType,
          evaluatorName,
          evaluatorRole,
          page - 1,
          totalPage
        )
        .subscribe({
          next: (response) => {
            this.activities = response.data;
            this.activitiesServices.setDataActivities(response.data);
            this.reloadActivities();
          },
          error: (error) => {
            console.error(error.error.mensaje, error);
          },
        });
    }
  }

  public openModalView(activity: ActividadResponse, source: 1 | 2) {
    this.openModalViewSelected = !this.openModalViewSelected;
    this.sourceSelected = source;
    this.activitySelected = activity;
  }

  public closeModalView(event: boolean) {
    this.openModalViewSelected = !event;
  }

  public openFormEvaluation(responsabiltyId: number){
    this.router.navigate(['/app/gestion-soportes/actividades/formulario-autoevaluacion', responsabiltyId]);
  }

  public openEditFormEvaluation(responsabiltyId: number){
    this.router.navigate(['/app/gestion-soportes/actividades/formulario-editar-autoevaluacion', responsabiltyId]);
  }
  

  public reloadActivities() {
    if (this.activities && this.activities.content) {
      this.activitiesByType = Object.values(
        this.activities.content.reduce((acc, activity) => {
          const tipoNombre = activity.tipoActividad.nombre;

          // Si el tipo de actividad no existe como clave, la inicializamos
          if (!acc[tipoNombre]) {
            acc[tipoNombre] = {
              nombreType: tipoNombre,
              activities: [],
            };
          }

          // Añadimos la actividad al grupo correspondiente
          acc[tipoNombre].activities.push(activity);
          return acc;
        }, {} as { [key: string]: ActividadesPorTipoActividad })
      );
    }
  }

  public openSelfEvaluationReviewForm(idSource: number) {
    if (this.selfEvaluationReviewModalComponent) {
      this.selfEvaluationReviewModalComponent.openModal(idSource);
    }
  }

}

interface ActividadesPorTipoActividad {
  nombreType: string;
  activities: ActividadResponse[];
}
