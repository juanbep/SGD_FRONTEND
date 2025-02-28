import { Component, inject, Inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { CpdServicesService } from '../../services/cpd-services.service';
import { UserInfo } from '../../../../../../core/models/auth.interface';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { UserFilterComponent } from "../../components/user-filter/user-filter.component";
import { EmailComponent } from '../../../../../../shared/components/email/email.component';
import { RouterModule } from '@angular/router';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { CpdWordGeneratorService } from '../../services/cpd-word-generator.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { DetalleUsuarioConsolidadoResponse } from '../../../../../../core/models/response/detalle-usuario-cosolidado-response.model';

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
  ],
  templateUrl: './cpd.component.html',
  styleUrl: './cpd.component.css'
})
export class CpdComponent implements OnInit {

  @ViewChild(EmailComponent) emailComponent: EmailComponent | null = null;

  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  private authServiceService = inject(AuthServiceService);
  private cpdServiceServices = inject(CpdServicesService);
  private messagesInfoService = inject(MessagesInfoService);
  private cpdWordGeneratorService = inject(CpdWordGeneratorService);

  public academicPeriodActive: PeriodoAcademicoResponse | null = null;
  public currentPage: number = 1;
  public currentUser: UserInfo | null = null;
  public emailMessage: string = '';
  public filterParams: { nameUser: string | null, identification: string | null, category: string | null } = { nameUser: null, identification: null, category: null };
  public teacherByDepartment: PagedResponse<UsuarioResponse> | null = null;


  ngOnInit(): void {
    this.currentUser = this.authServiceService.currentUserValue;
    this.academicPeriodActive = this.academicPeriodManagementService.currentAcademicPeriodValue;
    if (this.currentUser) {
      this.recoverTeachers(this.currentPage, TOTAL_PAGE, this.currentUser.usuarioDetalle.departamento, null, null, null, ID_ROL);
    }
  }

  recoverTeachers(page: number, totalPage: number, department: string, userId: string | null, userName: string | null, category: string | null, rol: string) {
    this.cpdServiceServices.getTeachersByDepartment(page - 1, totalPage, department, userId, userName, category, rol).subscribe(
      (response) => {
        this.teacherByDepartment = response.data
      }
    )
  }

  pageChanged(page: number) {
    this.currentPage = page;
    if (this.currentUser) {
      this.recoverTeachers(this.currentPage, TOTAL_PAGE, this.currentUser.usuarioDetalle.departamento, this.filterParams.nameUser, this.filterParams.identification, this.filterParams.category, ID_ROL);
    }
  }

  filterAction(event: { nameUser: string | null, identification: string | null, category: string | null }) {
    if (this.currentUser) {
      this.filterParams = event;
      this.currentPage = 1;
      this.recoverTeachers(this.currentPage, TOTAL_PAGE, this.currentUser.usuarioDetalle.departamento, this.filterParams.identification, this.filterParams.nameUser, this.filterParams.category, ID_ROL);
    }
  }

  openEmailModal() {
    if (this.emailComponent) {
      this.emailComponent.open(this.emailMessage);
    }
  }

  downloadFiles() {
    if (this.academicPeriodActive && this.currentUser) {
      this.cpdServiceServices.downloadFiles(this.academicPeriodActive.idPeriodo, this.currentUser.usuarioDetalle.departamento, null, null, null).subscribe(
        {
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
            this.messagesInfoService.showErrorMessage('Error al descargar los archivos', 'Error');
          }
        }
      );
    }
  }

  wordGenerator(teacherId: number, teacherInfo: UsuarioResponse) {
    let infoTeacherConsolidated: DetalleUsuarioConsolidadoResponse | null = null;
    this.cpdServiceServices.getInformationTeacherConsolidatedResponse(teacherId).subscribe(
      {
        next: (response) => {
          infoTeacherConsolidated = response.data;
          if(this.academicPeriodActive) this.cpdWordGeneratorService.generateWordDocument(infoTeacherConsolidated, teacherInfo, this.academicPeriodActive);
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage('Error al obtener la información del docente', 'Error');
        }
      }
    );

  }

}
