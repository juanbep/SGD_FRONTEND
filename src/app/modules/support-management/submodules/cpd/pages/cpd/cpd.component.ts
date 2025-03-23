import {
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CpdServicesService } from '../../services/cpd-services.service';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';
import { EmailComponent } from '../../../../../../shared/components/email/email.component';
import { RouterModule } from '@angular/router';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { CpdWordGeneratorService } from '../../services/cpd-word-generator.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { DetalleUsuarioConsolidadoResponse } from '../../../../../../core/models/response/detalle-usuario-cosolidado-response.model';
import { UsuarioConsolidadoCreadoResponse } from '../../../../../../core/models/response/usuarios-consolidado-creado-response.model';
import { CpdInfoFormComponent } from '../../components/cpd-info-form/cpd-info-form.component';
import { UsersServiceService } from '../../../../../user-management/submodules/users/services/users-service.service';
import { ROLES } from '../../../../../../core/enums/domain-enums';
const TOTAL_PAGE = 10;
const ID_ROL = '1';

@Component({
  selector: 'app-cpd',
  standalone: true,
  imports: [
    CommonModule,
    EmailComponent,
    PaginatorComponent,
    RouterModule,
    UserFilterComponent,
    CpdInfoFormComponent
],
  templateUrl: './cpd.component.html',
  styleUrl: './cpd.component.css',
})
export class CpdComponent implements OnInit {

  @ViewChild(EmailComponent) emailComponent: EmailComponent | null = null;

  @ViewChild(CpdInfoFormComponent) cpdInfoFormComponent: CpdInfoFormComponent | null = null;

  private academicPeriodManagementService = inject(
    AcademicPeriodManagementService
  );
  private authServiceService = inject(AuthServiceService);
  private cpdServiceServices = inject(CpdServicesService);
  private messagesInfoService = inject(MessagesInfoService);
  private cpdWordGeneratorService = inject(CpdWordGeneratorService);
  private userService = inject(UsersServiceService);

  public academicPeriodActive: PeriodoAcademicoResponse | null = null;
  public currentPage: number = 1;
  public currentUser: UsuarioResponse | null = null;
  public emailMessage: string = '';
  public filterParams: {
    nameUser: string | null;
    identification: string | null;
    category: string | null;
  } = { nameUser: null, identification: null, category: null };
  public teacherByDepartment: PagedResponse<UsuarioConsolidadoCreadoResponse> | null =
    null;

  public userSelectedToCreateRelution: UsuarioConsolidadoCreadoResponse | null = null;
  public bossDepartment: UsuarioResponse | null = null;

  ngOnInit(): void {
    this.currentUser = this.authServiceService.currentUserValue;
    this.recoverBossDepartment();
    this.academicPeriodActive =
      this.academicPeriodManagementService.currentAcademicPeriodValue;
    if (this.currentUser && this.currentUser.usuarioDetalle.departamento) {
      this.recoverTeachers(
        this.currentPage,
        TOTAL_PAGE,
        this.currentUser.usuarioDetalle.departamento,
        null,
        null,
        null,
        ID_ROL
      );
    }
  }

  recoverTeachers(
    page: number,
    totalPage: number,
    department: string,
    userId: string | null,
    userName: string | null,
    category: string | null,
    rol: string
  ) {
    this.cpdServiceServices
      .getUsersWithConsolidatedCreated(
        page - 1,
        totalPage,
        department,
        userId,
        userName,
        category,
        rol
      )
      .subscribe((response) => {
        response
          ? (this.teacherByDepartment = response.data)
          : (this.teacherByDepartment = null);
      });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    if (this.currentUser && this.currentUser.usuarioDetalle.departamento) {
      this.recoverTeachers(
        this.currentPage,
        TOTAL_PAGE,
        this.currentUser.usuarioDetalle.departamento,
        this.filterParams.nameUser,
        this.filterParams.identification,
        this.filterParams.category,
        ID_ROL
      );
    }
  }

  filterAction(event: {
    nameUser: string | null;
    identification: string | null;
    category: string | null;
  }) {
    if (this.currentUser && this.currentUser.usuarioDetalle.departamento) {
      this.filterParams = event;
      this.currentPage = 1;
      this.recoverTeachers(
        this.currentPage,
        TOTAL_PAGE,
        this.currentUser.usuarioDetalle.departamento,
        this.filterParams.identification,
        this.filterParams.nameUser,
        this.filterParams.category,
        ID_ROL
      );
    }
  }

  recoverBossDepartment() {
    this.userService.getAllUsersByParams(
      0,
      3,
      '',
      '',
      '',
      this.currentUser?.usuarioDetalle.departamento || '',
      '',
      '',
      '',
      '',
      ROLES.JEFE_DE_DEPARTAMENTO.toString(),
      '1'
    )
    .subscribe({
      next: (response) => {
        this.bossDepartment = response.data.content[0];
       
      },
      error: (error) => {
        this.bossDepartment = null;
      },
    });
  }

  openEmailModal() {
    if (this.emailComponent) {
      this.emailComponent.open(this.emailMessage);
    }
  }

  downloadFiles() {
    if (
      this.academicPeriodActive &&
      this.currentUser &&
      this.currentUser.usuarioDetalle.departamento
    ) {
      this.cpdServiceServices
        .downloadFiles(
          this.academicPeriodActive.idPeriodo,
          this.currentUser.usuarioDetalle.departamento,
          null,
          null,
          null
        )
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `documentos_${this.currentUser?.usuarioDetalle.departamento}_${this.academicPeriodActive?.idPeriodo}.zip`;
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

  openAprobeConlidatedModalForm(usuarioSelected: UsuarioConsolidadoCreadoResponse) {
    if(this.cpdInfoFormComponent){
      this.userSelectedToCreateRelution = usuarioSelected;
      this.cpdInfoFormComponent.open();
    }
  }

  onOptionFormCpdInfo(event: {resolutionNumber: string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string}){
    if(this.userSelectedToCreateRelution){
      this.wordGenerator(this.userSelectedToCreateRelution, event);
    }
  }

  wordGenerator(
    teacherInfo: UsuarioConsolidadoCreadoResponse,
    infoConsolidated: {resolutionNumber: string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string}
  ) {
    let infoTeacherConsolidated: DetalleUsuarioConsolidadoResponse | null =
      null;
    this.cpdServiceServices
      .getInformationTeacherConsolidatedResponse(teacherInfo.oidUsuario)
      .subscribe({
        next: (response) => {
          infoTeacherConsolidated = response.data;
          this.cpdInfoFormComponent?.close();
          if (this.academicPeriodActive)
            this.cpdWordGeneratorService.generateWordDocument(
              infoTeacherConsolidated,
              teacherInfo,
              this.academicPeriodActive,
              infoConsolidated
            );
            this.messagesInfoService.showSuccessMessage(
              'Documento generado correctamente','Éxito'
            );
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage(
            'Error al obtener la información del docente',
            'Error'
          );
        },
      });
  }
}
