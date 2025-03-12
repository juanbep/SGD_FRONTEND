import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CpdServicesService } from '../../services/cpd-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { ViewDetailsSourceOneComponent } from '../../components/view-details-source-one/view-details-source-one.component';
import { ViewDetailsSourceTwoComponent } from '../../components/view-details-source-two/view-details-source-two.component';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { DetalleUsuarioConsolidadoResponse } from '../../../../../../core/models/response/detalle-usuario-cosolidado-response.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-cpd-activities-user',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ActivityFilterComponent,
    ViewDetailsSourceOneComponent,
    ViewDetailsSourceTwoComponent,
  ],
  templateUrl: './cpd-activities-user.component.html',
  styleUrl: './cpd-activities-user.component.css',
})
export class CpdActivitiesUserComponent implements OnInit {
  @ViewChild(ViewDetailsSourceOneComponent)
  viewDetailsSourceOneComponent!: ViewDetailsSourceOneComponent;
  @ViewChild(ViewDetailsSourceTwoComponent)
  viewDetailsSourceTwoComponent!: ViewDetailsSourceTwoComponent;

  private academicPeriodManagementService = inject(
    AcademicPeriodManagementService
  );
  private activatedRoute = inject(ActivatedRoute);
  private cpdServicesService = inject(CpdServicesService);
  private messagesInfoService = inject(MessagesInfoService);
  private router = inject(Router);

  public activitiesByType!: ActividadesPorTipoActividad[];
  public currentPage: number = 1;
  public filterParams: {
    activityName: string | null;
    activityType: string | null;
  } = { activityName: null, activityType: null };
  public idUserParam: number | null = null;
  public teacherActivities: PagedResponse<ActividadResponse> | null = null;
  public userTeacherInfo: DetalleUsuarioConsolidadoResponse | null = null;
  public activeAcademicPeriod: PeriodoAcademicoResponse | null = null;

  ngOnInit(): void {
    this.idUserParam = this.activatedRoute.snapshot.params['id'];
    this.activeAcademicPeriod =
      this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.recoverTeacherActivities(
      this.currentPage,
      PAGE_SIZE,
      this.idUserParam,
      null,
      null
    );
    this.recoverTeacherInfo(this.idUserParam);
  }

  public recoverTeacherActivities(
    page: number,
    totalPage: number,
    idUser: number | null,
    activityName: string | null,
    activityType: string | null
  ) {
    if (idUser) {
      this.cpdServicesService
        .getActivities(page - 1, totalPage, idUser, activityName, activityType)
        .subscribe({
          next: (response) => {
            this.teacherActivities = response.data;
            this.reloadActivities();
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage(
              'Error al recuperar las actividades del usuario',
              `Error: ${error.mensaje}`
            );
          },
        });
    }
  }

  public recoverTeacherInfo(idUser: number | null) {
    if (idUser) {
      this.cpdServicesService.getInformationTeacherConsolidatedResponse(idUser).subscribe({
        next: (response) => {
          this.userTeacherInfo = response.data;
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage(
            'Error al recuperar la información del usuario',
            'Error'
          );
        },
      });
    }
  }

  public pageChanged(page: number) {
    this.currentPage = page;
    this.recoverTeacherActivities(
      this.currentPage,
      PAGE_SIZE,
      this.idUserParam,
      this.filterParams.activityName,
      this.filterParams.activityType
    );
  }

  public filterAction(event: {
    activityName: string | null;
    activityType: string | null;
  }) {
    this.filterParams = event;
    this.currentPage = 1;
    this.recoverTeacherActivities(
      this.currentPage,
      PAGE_SIZE,
      this.idUserParam,
      this.filterParams.activityName,
      this.filterParams.activityType
    );
  }

  public downloadFiles() {
    if (this.activeAcademicPeriod && this.userTeacherInfo) {
      this.cpdServicesService
        .downloadFiles(
          this.activeAcademicPeriod.idPeriodo,
          this.userTeacherInfo.departamento
            ? this.userTeacherInfo.departamento
            : '',
          this.userTeacherInfo.tipoContratacion
            ? this.userTeacherInfo.tipoContratacion
            : '',
          this.idUserParam,
          null
        )
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `documentos_${this.userTeacherInfo?.nombreDocente}_${this.activeAcademicPeriod?.idPeriodo}.zip`;
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage(
              'Error al descargar los archivos',
              'Error'
            );
          },
        });
    }
  }

  public downloadConsolidatedFiles() {
    if (this.activeAcademicPeriod && this.userTeacherInfo) {
      this.cpdServicesService
        .downloadFiles(
          this.activeAcademicPeriod.idPeriodo,
          this.userTeacherInfo.departamento
            ? this.userTeacherInfo.departamento
            : '',
          this.userTeacherInfo.tipoContratacion
            ? this.userTeacherInfo.tipoContratacion
            : '',
          this.idUserParam,
          true
        )
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `documentos_${this.userTeacherInfo?.nombreDocente}_${this.activeAcademicPeriod?.idPeriodo}.xlsx`;
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage(
              'Error al descargar los archivos',
              'Error'
            );
          },
        });
    }
  }

  public openSourceOne(activity: ActividadResponse) {
    if (this.viewDetailsSourceOneComponent) {
      this.viewDetailsSourceOneComponent.open(activity);
    }
  }

  public openSourceTwo(activity: ActividadResponse) {
    if (this.viewDetailsSourceTwoComponent) {
      this.viewDetailsSourceTwoComponent.open(activity);
    }
  }

  public goBack() {
    this.router.navigate(['./app/gestion-soportes/cpd/lista-docentes']);
  }

  public reloadActivities() {
    if (this.teacherActivities && this.teacherActivities.content) {
      this.activitiesByType = Object.values(
        this.teacherActivities.content.reduce((acc, activity) => {
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
}

export interface ActividadesPorTipoActividad {
  nombreType: string;
  activities: ActividadResponse[];
}
