import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { CommonModule } from '@angular/common';
import { ViewDetailsSourceOneComponent } from '../view-details-source-one/view-details-source-one.component';
import { ViewDetailsSourceTwoComponent } from '../view-details-source-two/view-details-source-two.component';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { EmailComponent } from '../../../../../../shared/components/email/email.component';
import { ActivatedRoute } from '@angular/router';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { DetalleUsuarioConsolidadoResponse } from '../../../../../../core/models/response/detalle-usuario-cosolidado-response.model';
import {
  ActividadConsolidadoResponse,
  Actividades,
  InformacionActividad,
} from '../../../../../../core/models/response/actividad-consolidado-response.model';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';

@Component({
  selector: 'consolidated-teacher-table',
  standalone: true,
  imports: [
    CommonModule,
    ViewDetailsSourceOneComponent,
    ViewDetailsSourceTwoComponent,
    PaginatorComponent,
    EmailComponent,
  ],
  templateUrl: './consolidated-teacher-table.component.html',
  styleUrl: './consolidated-teacher-table.component.css',
})
export class ConsolidatedTeacherTableComponent implements OnInit {
  @ViewChild(ViewDetailsSourceOneComponent)
  viewDetailsSourceOneComponent!: ViewDetailsSourceOneComponent;

  @ViewChild(ViewDetailsSourceTwoComponent)
  viewDetailsSourceTwoComponent!: ViewDetailsSourceTwoComponent;

  @ViewChild(EmailComponent)
  emailComponent: EmailComponent | null = null;

  @Output()
  pageChange: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  teacherOfConsolidated: DetalleUsuarioConsolidadoResponse | null = null;

  @Input()
  currentPage: number = 1;

  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private authService = inject(AuthServiceService);
  private router = inject(ActivatedRoute);

  public consolidatedTeacher: ActividadConsolidadoResponse | null = null;
  public messageEmail: string = '';
  public subjectEmail: string = '';
  public currentUser: UsuarioResponse | null = null;
  public teacherId: number = 0;

  constructor() {
    effect(() => {
      this.consolidatedTeacher =
        this.consolidatedServicesService.getDataConsolidatedTeacher();
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.teacherId = this.router.snapshot.params['id'];
    this.consolidatedTeacher =
      this.consolidatedServicesService.getDataConsolidatedTeacher();
    this.consolidatedServicesService.setFilterActivitiesParams({
      activityType: null,
      activityName: null,
      sourceType: null,
      sourceState: null,
    });
  }

  getObjectKeys(obj: Actividades): string[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  }

  public emailNotificationModal(
    activity: InformacionActividad,
    sourceSelected: Fuente
  ) {
    if (this.emailComponent && activity) {
      this.messageEmail = `Evaluado: ${this.teacherOfConsolidated?.nombreDocente}
Actividad: ${activity.nombre}
Estado fuente: ${sourceSelected.estadoFuente}`;
      this.emailComponent.open(this.messageEmail);
    }
  }

  public viewDetailsSourceModal(oidActividad: number) {
    this.viewDetailsSourceOneComponent.open(oidActividad);
  }

  public viewDetailsSourceTwoModal(oidActividad: number) {
    this.viewDetailsSourceTwoComponent.open(oidActividad);
  }

  getActivities(typeActivity: string): InformacionActividad[] {
    switch (typeActivity) {
      case 'DOCENCIA':
        return this.consolidatedTeacher?.actividades['DOCENCIA'] || [];
      case 'TRABAJOS DE INVESTIGACION':
        return (
          this.consolidatedTeacher?.actividades['TRABAJOS DE INVESTIGACION'] ||
          []
        );
      case 'PROYECTOS INVESTIGACIÓN':
        return (
          this.consolidatedTeacher?.actividades['PROYECTOS INVESTIGACIÓN'] ||
          []
        );
      case 'TRABAJO DE DOCENCIA':
        return (
          this.consolidatedTeacher?.actividades['TRABAJO DE DOCENCIA'] || []
        );
      case 'ADMINISTRACIÓN':
        return this.consolidatedTeacher?.actividades['ADMINISTRACIÓN'] || [];
      case 'ASESORÍA':
        return this.consolidatedTeacher?.actividades['ASESORÍA'] || [];
      case 'EXTENSIÓN':
        return this.consolidatedTeacher?.actividades['EXTENSIÓN'] || [];
      case 'CAPACITACIÓN':
        return this.consolidatedTeacher?.actividades['CAPACITACIÓN'] || [];
      case 'OTRO SERVICIO':
        return this.consolidatedTeacher?.actividades['OTRO SERVICIO'] || [];

      default:
        return [];
    }
  }

  pageChanged(event: number) {
    this.currentPage = event;
    this.pageChange.emit(this.currentPage);
  }

  activityToSendEmailSelected(
    activitySelected: InformacionActividad,
    sourceSelected: Fuente
  ) {
    if (activitySelected && sourceSelected) {
      this.emailNotificationModal(activitySelected, sourceSelected);
    }
  }

  recoverUserInfo(idUser: number, userIn: UsuarioResponse | null) {
    this.consolidatedServicesService.getUserInfo(idUser).subscribe({
      next: (response) => {
        userIn = response.data;
      },
      error: (error) => {
        userIn = null;
      },
    });
  }

  downloadAllSuppotFiles() {
    this.consolidatedServicesService
      .downloadAllSupportFiles(
        this.teacherOfConsolidated?.periodoAcademico || '',
        this.teacherOfConsolidated?.departamento || '',
        this.teacherOfConsolidated?.tipoContratacion || '',
        this.teacherId || 0,
        null
      )
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `documentos_${this.teacherOfConsolidated?.nombreDocente}_${this.teacherOfConsolidated?.periodoAcademico}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  findRoleCurrentUserById(rol:string): boolean {
    const role = this.currentUser?.roles.find((role) => role.nombre === rol);
    return !!role;
 }
}
