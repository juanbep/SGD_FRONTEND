import {
  Component,
  effect,
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
    evaluatedName: string | null;
    evaluatedId: string | null;
    category: string | null;
    department: string | null;
  } = { evaluatedName: null, evaluatedId: null, category: null, department: null };
  public teacherByDepartment: PagedResponse<UsuarioConsolidadoCreadoResponse> | null =
    null;

  public userSelectedToCreateRelution: UsuarioConsolidadoCreadoResponse | null = null;
  public bossDepartment: UsuarioResponse | null = null;

  filterEffect = effect(() => {
    this.filterParams = this.cpdServiceServices.getFilterTeacherParams();
    this.recoverTeachers(
      this.currentPage,
      TOTAL_PAGE,)
  });

  ngOnInit(): void {
    this.currentUser = this.authServiceService.currentUserValue;
    this.academicPeriodActive = this.academicPeriodManagementService.currentAcademicPeriodValue;
  }

  recoverTeachers(
    page: number,
    totalPage: number,
  ) {
    this.cpdServiceServices
      .getUsersWithConsolidatedCreated(
        page - 1,
        totalPage,
        this.filterParams.department,
        this.filterParams.evaluatedId,
        this.filterParams.evaluatedName,
        this.filterParams.category,
        ID_ROL
      )
      .subscribe((response) => {
        response
          ? (this.teacherByDepartment = response.data)
          : (this.teacherByDepartment = null);
      });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.recoverTeachers(
      this.currentPage,   
      TOTAL_PAGE);
    
  }

  recoverBossDepartment(teacherDepartment: string = '') {
    this.userService.getAllUsersByParams(
      0,
      3,
      '',
      '',
      '',
      teacherDepartment,
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

  openEmailModal(teacherDepartment: string) {
    if (this.emailComponent) {
      this.recoverBossDepartment(teacherDepartment);
      this.emailComponent.open(this.emailMessage);
    }
  }

  downloadFiles() {
    if (
      this.academicPeriodActive &&
      this.currentUser
    ) {
      this.cpdServiceServices
        .downloadFiles(
          this.academicPeriodActive.idPeriodo,
          null,
          null,
          null,
          null
        )
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `documentos_soportes_${this.academicPeriodActive?.idPeriodo}.zip`;
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
    if (this.cpdInfoFormComponent) {
      this.userSelectedToCreateRelution = usuarioSelected;
      this.cpdInfoFormComponent.open();
    }
  }

  onOptionFormCpdInfo(event: { resolutionNumber: string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string }) {
    if (this.userSelectedToCreateRelution) {
      this.wordGenerator(this.userSelectedToCreateRelution, event);
    }
  }

  wordGenerator(
    teacherInfo: UsuarioConsolidadoCreadoResponse,
    infoConsolidated: { resolutionNumber: string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string }
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
            'Documento generado correctamente', 'Éxito'
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
