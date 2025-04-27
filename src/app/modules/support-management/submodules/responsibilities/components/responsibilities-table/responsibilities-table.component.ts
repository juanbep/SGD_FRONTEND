import { Component, effect, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsibilitiesUploadEvaluationComponent } from '../responsibilities-upload-evaluation/responsibilities-upload-evaluation.component';
import { ResponsibilitiesViewEvaluationComponent } from '../responsibilities-view-evaluation/responsibilities-view-evaluation.component';
import { ResponsibilitiesEditEvaluationComponent } from '../responsibilities-edit-evaluation/responsibilities-edit-evaluation.component';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { ResponsabilidadResponse } from '../../../../../../core/models/response/responsabilidad-response.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { Router } from '@angular/router';
import { ReponsibilitiesViewEvaluationFormComponent } from '../reponsibilities-view-evaluation-form/reponsibilities-view-evaluation-form.component';

const PAGE_SIZE = 10;

@Component({
  selector: 'responsibilities-table',
  standalone: true,
  imports: [
    CommonModule,
    ResponsibilitiesUploadEvaluationComponent,
    ResponsibilitiesViewEvaluationComponent,
    ResponsibilitiesEditEvaluationComponent,
    PaginatorComponent,
    ReponsibilitiesViewEvaluationFormComponent
],
  templateUrl: './responsibilities-table.component.html',
  styleUrl: './responsibilities-table.component.css',
})
export class ResponsibilitiesTableComponent implements OnInit {
  

  @ViewChild(ReponsibilitiesViewEvaluationFormComponent)
  public viewEvaluationFormComponent: ReponsibilitiesViewEvaluationFormComponent | null = null;

  @Input()
  currentUser: UsuarioResponse | null = null;

  public currentPage: number = 1;
  public headDataTable = ['Actividad', 'Fuente 2', 'Informe'];
  public headDataTableCoodinator = ['Actividad', 'Fuente', 'Informe'];
  public subHeadDataTableCoorinator = [
    'Nombre actividad',
    'Evaluado',
    'Rol evaluado',
    'Estado soporte',
    'Acciones',
    'Acciones',
  ];
  public subHeadDataTableStudents = [
    'Nombre actividad',
    'Evaluado',
    'Rol evaluado',
    'Estado soporte',
    'Acciones',
    'Acciones',
  ];

  private responsabilitiesServices = inject(ResponsibilitiesServicesService);
  private toastr = inject(MessagesInfoService);
  private router = inject(Router);

  public openModalEditSelected: boolean = false;
  public openModalResposabilitySelected: boolean = false;
  public openModalViewSelected: boolean = false;
  public responsabilitieByType: ResponsabilidadesPorTipoActividad[] = [];
  public responsabilities: PagedResponse<ResponsabilidadResponse> | null = null;
  public resposabilitySelected: ResponsabilidadResponse | undefined;

  public filterParams: {
    activityName: string | null;
    activityType: string | null;
    evaluatorName: string | null;
    evaluatorRole: string | null;
  } | null = null;

  activitiesEffect = effect(() => {
    this.filterParams =
      this.responsabilitiesServices.getParamsActivitiesFilterSignal();
    this.currentPage = 1;
    this.recoverResponsabilities(this.currentPage, PAGE_SIZE);
  });

  ngOnInit(): void {
    this.responsabilitiesServices.setParamsActivitiesFilterSignal(
      null,
      null,
      null,
      null
    );

  }

  private recoverResponsabilities(page: number, totalPage: number) {
    const { activityName, activityType, evaluatorName, evaluatorRole } = this
      .filterParams || {
      activityName: null,
      activityType: null,
      evaluatorName: null,
      evaluatorRole: null,
    };
    if (this.currentUser) {
      this.responsabilitiesServices
        .getResponsibilities(
          this.currentUser.oidUsuario.toString(),
          activityName,
          activityType,
          evaluatorName,
          evaluatorRole,
          page - 1,
          totalPage
        )
        .subscribe({
          next: (response) => {
            this.responsabilities = response.data;
            this.responsabilitiesServices.setResponsibilitiesData(
              response.data
            );
            this.reloadActivities();
          },
          error: (error) => {
            this.toastr.showErrorMessage(error.error.mensaje, 'Error');
          },
        });
    }
  }

  public openFormEvaluation(responsabilityId: number) {
    this.router.navigate([
      './app/gestion-soportes/responsabilidades/formulario-evaluacion-docente-estudiante',
      responsabilityId,
    ]);
  }

  public openModalUpload(responsability: ResponsabilidadResponse) {
    this.openModalResposabilitySelected = !this.openModalResposabilitySelected;
    this.resposabilitySelected = responsability;
  }

  public closeModalUpload(event: boolean) {
    this.openModalResposabilitySelected = !event;
  }

  public openModalView(responsability: ResponsabilidadResponse) {
    if(responsability.fuentes[1].tipoCalificacion === 'DOCUMENTO'){
      this.openModalViewSelected = !this.openModalViewSelected;
      this.resposabilitySelected = responsability;
    }else{
      this.viewEvaluationFormComponent? this.viewEvaluationFormComponent.open(responsability.fuentes[1].oidFuente) : null;
    }
  }

  public openModalEdit(responsability: ResponsabilidadResponse) {
    if(responsability.fuentes[1].tipoCalificacion === 'DOCUMENTO'){
      this.openModalEditSelected = !this.openModalEditSelected;
      this.resposabilitySelected = responsability;
    }else{
      this.router.navigate([
        './app/gestion-soportes/responsabilidades/formulario-evaluacion-docente-estudiante-editar', 
        responsability.fuentes[1].oidFuente
      ]);
    }
  }

  public closeModalView(event: boolean) {
    this.openModalViewSelected = !event;
  }

  public closeModalEdit(event: boolean) {
    this.openModalEditSelected = !event;
  }

  public downloadReport(responsability: ResponsabilidadResponse) {
    this.responsabilitiesServices
      .getDownloadReportFile(responsability.fuentes[0].oidFuente, true)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = responsability.fuentes[0].nombreDocumentoInforme
            ? responsability.fuentes[0].nombreDocumentoInforme
            : '';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.toastr.showErrorMessage(
            'Error al consultar la información',
            'Error'
          );
        },
      });
  }

  pageChange(page: number) {
    this.currentPage = page;
    this.recoverResponsabilities(page, PAGE_SIZE);
  }

  public reloadActivities() {
    if (this.responsabilities) {
      this.responsabilitieByType = Object.values(
        this.responsabilities.content.reduce((acc, responsability) => {
          const tipoNombre = responsability.tipoActividad.nombre;

          // Si el tipo de actividad no existe como clave, la inicializamos
          if (!acc[tipoNombre]) {
            acc[tipoNombre] = {
              nombreType: tipoNombre,
              activities: [],
            };
          }

          // Añadimos la actividad al grupo correspondiente
          acc[tipoNombre].activities.push(responsability);

          return acc;
        }, {} as { [key: string]: ResponsabilidadesPorTipoActividad })
      );
    }
  }
}

export interface ResponsabilidadesPorTipoActividad {
  nombreType: string;
  activities: ResponsabilidadResponse[];
}
