import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { ConsolidatedTeacherFilterComponent } from "../../components/consolidated-teacher-filter/consolidated-teacher-filter.component";
import { ConsolidatedTeacherTableComponent } from "../../components/consolidated-teacher-table/consolidated-teacher-table.component";
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from '../../../../../../core/models/auth.interface';
import { ConfirmDialogComponent } from "../../../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { ActividadConsolidadoResponse } from '../../../../../../core/models/response/actividad-consolidado-response.mode';
import { DetalleUsuarioConsolidadoResponse } from '../../../../../../core/models/response/detalle-usuario-cosolidado-response.model';

const SIZE_PAGE = 10
const TITTLE_MESSAGE = 'Aprobar consolidado';
const CONFIRM_MESSAGE = '¿Está seguro que desea aprobar el consolidado?';

@Component({
  selector: 'app-consolidated-teacher',
  standalone: true,
  imports: [ConsolidatedTeacherFilterComponent, ConsolidatedTeacherTableComponent, ConfirmDialogComponent],
  templateUrl: './consolidated-teacher.component.html',
  styleUrl: './consolidated-teacher.component.css'
})


export class ConsolidatedTeacherComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent)
  confirmDialog: ConfirmDialogComponent | null = null;

  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private activateRoute = inject(ActivatedRoute);
  private toastr = inject(MessagesInfoService);
  private router = inject(Router);
  private authService = inject(AuthServiceService);

  public consolidatedTeacher: ActividadConsolidadoResponse | null = null;
  public currentPage: number = 1;
  public idUserTeacher: number = 0;
  public infoCurrentUser: UserInfo | null = null;
  public infoDataTeacher: DetalleUsuarioConsolidadoResponse | null = null;
  public responseConsolidatedConfirmDialog: string = '';
  public tittleMessage: string = TITTLE_MESSAGE;
  public confirmMessage: string = CONFIRM_MESSAGE;
  public filterParmas: {activityType: string | null, activityName: string | null} | null = null;
  

  userEffec = effect(() => {
    this.consolidatedServicesService.getFilterParams();
    this.currentPage = 1;
    this.recoverConsolidatedTeacher(this.currentPage);
  });

  ngOnInit(): void {
    this.infoCurrentUser = this.authService.currentUserValue;
    this.idUserTeacher = this.activateRoute.snapshot.params['id'];
    this.recoverInfoTeacher();
  }

  recoverInfoTeacher(): void {
    if (this.idUserTeacher) {
      this.consolidatedServicesService.getInfoTeacher(this.idUserTeacher).subscribe({
        next: response => {
          this.infoDataTeacher = response.data;
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
    }
  }

  recoverConsolidatedTeacher(page: number){
    const paramsFilter = this.consolidatedServicesService.getFilterParams();
    if (this.idUserTeacher) {
      this.consolidatedServicesService.getConsolidatedActitiesTeacherByParams(this.idUserTeacher, page-1, SIZE_PAGE, paramsFilter.activityType || '', paramsFilter.activityName || '', paramsFilter.sourceType || '', paramsFilter.sourceState || '').subscribe({
        next: response => {
          this.consolidatedTeacher = response.data;
          this.consolidatedServicesService.setDataConsolidatedTeacher(response.data);
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
    }
  }

  responseApproveConsolidated(response: boolean): void {
    if (response && this.idUserTeacher && this.infoCurrentUser) {
      this.consolidatedServicesService.saveConsolidated(this.idUserTeacher, this.infoCurrentUser.oidUsuario, '').subscribe({
        next: () => {
          this.toastr.showSuccessMessage('Consolidado aprobado  y generado correctamente', 'Éxito');
        },
        error: (error: any) => {
          this.toastr.showErrorMessage('Error al aprobar el consolidado', 'Error');
        }
      });
    } else {
    }
  }

  pageChange(page: number): void {
    this.currentPage = page;
    this.recoverConsolidatedTeacher(page);
  }

  createConsolidated(): void {
    if(this.confirmDialog) this.confirmDialog.open();
  }

  goBack(){
    this.router.navigate(['./app/gestion-soportes/consolidado/lista-docentes']);
  }

  downloadAllSuppotFiles(){
    this.consolidatedServicesService.downloadAllSupportFiles(this.infoDataTeacher?.periodoAcademico || '', this.infoDataTeacher?.departamento || '', this.infoDataTeacher?.tipoContratacion || '', this.idUserTeacher || 0, null).subscribe
    (
      {
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `documentos_${this.infoDataTeacher?.nombreDocente}_${this.infoDataTeacher?.periodoAcademico}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    );
  }


}
