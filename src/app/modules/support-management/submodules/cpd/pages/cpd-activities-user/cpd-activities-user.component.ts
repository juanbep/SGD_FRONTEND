import { Component, inject, OnInit } from '@angular/core';
import { ActividadesPorTipoActividad, ActivityResponse } from '../../../../../../core/models/activities.interface';
import { CpdServicesService } from '../../services/cpd-services.service';
import { ActivatedRoute } from '@angular/router';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { User } from '../../../../../../core/models/users.interfaces';
import { ActivityFilterComponent } from "../../components/activity-filter/activity-filter.component";
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { AcademicPeriod } from '../../../../../../core/models/academicPeriods';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-cpd-activities-user',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ActivityFilterComponent
],
  templateUrl: './cpd-activities-user.component.html',
  styleUrl: './cpd-activities-user.component.css'
})
export class CpdActivitiesUserComponent implements OnInit {

  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  private activatedRoute = inject(ActivatedRoute);
  private cpdServicesService = inject(CpdServicesService);
  private messagesInfoService = inject(MessagesInfoService);


  public activitiesByType!: ActividadesPorTipoActividad[];
  public currentPage: number = 1;
  public filterParams: {activityName:string | null, activityType: string | null} = {activityName: null, activityType: null};
  public idUserParam: number | null = null;
  public teacherActivities: ActivityResponse | null = null;
  public userTeacherInfo: User | null = null;
  public activeAcademicPeriod: AcademicPeriod | null = null;



  ngOnInit(): void {
    this.idUserParam = this.activatedRoute.snapshot.params['id'];
    this.activeAcademicPeriod = this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.recoverTeacherActivities(this.currentPage, PAGE_SIZE, this.idUserParam, null, null);
    this.recoverTeacherInfo(this.idUserParam);
  }

  public recoverTeacherActivities(page: number, totalPage: number, idUser: number | null, activityName: string | null, activityType: string | null) {
    if (idUser) {
      this.cpdServicesService.getActivities(page - 1, totalPage, idUser, activityName, activityType).subscribe(
        {
          next: (response) => {
            this.teacherActivities = response;
            this.reloadActivities();
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage('Error al recuperar las actividades del usuario', 'Error');
          }
        }
      )
    }
  }

  recoverTeacherInfo(idUser: number | null) { 
    if(idUser){
      this.cpdServicesService.getTeacherInfo(idUser).subscribe(
        {
          next: (response) => {
            this.userTeacherInfo = response;
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage('Error al recuperar la información del usuario', 'Error');
          }
        }
      )
    }
  }

  public pageChanged(page: number) {
    this.currentPage = page;
    this.recoverTeacherActivities(this.currentPage, PAGE_SIZE, this.idUserParam, this.filterParams.activityName, this.filterParams.activityType); 
  }

  public filterAction(event: {activityName:string | null, activityType: string | null}){
    this.filterParams = event;
    this.currentPage = 1;
    this.recoverTeacherActivities(this.currentPage, PAGE_SIZE, this.idUserParam, this.filterParams.activityName, this.filterParams.activityType);
  }

  public downloadFiles(){
    if(this.activeAcademicPeriod && this.userTeacherInfo){
      this.cpdServicesService.downloadFiles(this.activeAcademicPeriod.idPeriodo, this.userTeacherInfo.usuarioDetalle.departamento,this.userTeacherInfo.usuarioDetalle.contratacion, this.userTeacherInfo.oidUsuario, null).subscribe(
        {
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href  = url;
            a.download = `documentos_${this.userTeacherInfo?.nombres}_${this.userTeacherInfo?.apellidos}_${this.activeAcademicPeriod?.idPeriodo}.zip`;
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage('Error al descargar los archivos', 'Error');
          }
        }
      )
    }
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
              activities: []
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
