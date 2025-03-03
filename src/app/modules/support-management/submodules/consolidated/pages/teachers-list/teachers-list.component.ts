import { Component, inject, OnInit } from '@angular/core';
import { TeachersListFilterComponent } from "../../components/teachers-list-filter/teachers-list-filter.component";
import { TeacherListTableComponent } from "../../components/teachers-list-table/teachers-list-table.component";
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { TitleCasePipe } from '@angular/common';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';

@Component({
  selector: 'support-management-consolidated',
  standalone: true,
  imports: [TeachersListFilterComponent, TeacherListTableComponent, TitleCasePipe],
  templateUrl: './teachers-list.component.html',
  styleUrl: './teachers-list.component.css'
})
export class TeachersListComponent implements OnInit {

  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private authService = inject(AuthServiceService);
  private academicPeriodMangementService = inject(AcademicPeriodManagementService);

  public currentUser: UsuarioResponse | null = null;
  public activeAcademicPeriod: PeriodoAcademicoResponse | null = null;
  
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.activeAcademicPeriod = this.academicPeriodMangementService.currentAcademicPeriodValue;
  }
  

  downloadAllSuppotFiles(){
    if(this.activeAcademicPeriod && this.currentUser){
      this.consolidatedServicesService.downloadAllSupportFiles(this.activeAcademicPeriod.idPeriodo, this.currentUser?.usuarioDetalle.departamento || '', '', null, null).subscribe
      (
        {
          next: (response: any) => {
            const blob = new Blob([response], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `documentos_${this.activeAcademicPeriod?.idPeriodo}_${this.currentUser?.usuarioDetalle.departamento}.zip`;
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
 
}