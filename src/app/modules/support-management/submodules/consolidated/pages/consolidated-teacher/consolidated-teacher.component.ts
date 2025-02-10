import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConsolidatedTeacherFilterComponent } from "../../components/consolidated-teacher-filter/consolidated-teacher-filter.component";
import { ConsolidatedTeacherTableComponent } from "../../components/consolidated-teacher-table/consolidated-teacher-table.component";
import { ApproveConsolidatedConfirmDialogComponent } from '../../components/approve-consolidated-confirm-dialog/approve-consolidated-confirm-dialog.component';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { ConsolidatedActivitiesResponse, TeacherInformationResponse } from '../../../../../../core/models/consolidated.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ActivatedRoute } from '@angular/router';
import { UserInfo } from '../../../../../../core/models/auth.interface';

const SIZE_PAGE = 10

@Component({
  selector: 'app-consolidated-teacher',
  standalone: true,
  imports: [ConsolidatedTeacherFilterComponent, ConsolidatedTeacherTableComponent, ApproveConsolidatedConfirmDialogComponent],
  templateUrl: './consolidated-teacher.component.html',
  styleUrl: './consolidated-teacher.component.css'
})


export class ConsolidatedTeacherComponent implements OnInit {
  
  @ViewChild(ApproveConsolidatedConfirmDialogComponent)
  approveConsolidatedConfirmDialog!: ApproveConsolidatedConfirmDialogComponent;


  public infoCurrentUser: UserInfo | null = null;
  public infoDataTeacher: TeacherInformationResponse | null = null;
  public idUser: number = 0;
  public currentPage: number = 1;

  responseConsolidatedConfirmDialog: string = '';

  consolidatedTeacher: ConsolidatedActivitiesResponse | null = null;

  consolidatedServicesService = inject(ConsolidatedServicesService);

  private route = inject(ActivatedRoute);

  toastr = inject(MessagesInfoService);
  
  ngOnInit(): void {
    this.infoCurrentUser = this.route.snapshot.data['teacher'];
    this.idUser = this.route.snapshot.params['id'];
    this.recoverConsolidatedTeacher();
    this.recoverInfoTeacher();

  }

  recoverInfoTeacher(): void {
    if (this.idUser) {
      this.consolidatedServicesService.getInfoTeacher(this.idUser).subscribe({
        next: data => {
          this.infoDataTeacher = data;
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
    }
  }

  recoverConsolidatedTeacher(){
    if(this.idUser){
      this.consolidatedServicesService.getConsolidatedByTeacher(this.idUser, this.currentPage-1, SIZE_PAGE).subscribe({
        next: data => {
          this.consolidatedTeacher = data;
          this.consolidatedServicesService.setDataConsolidatedTeacher(data);
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
    }
  }

  responseApproveConsolidated(response: string | void): void {
    if (response === 'Si' && this.idUser && this.infoCurrentUser) {
      this.consolidatedServicesService.saveConsolidated(this.idUser, this.infoCurrentUser.oidUsuario, '').subscribe({
        next: () => {
          this.toastr.showSuccessMessage('Consolidado aprobado  y generado correctamente', 'Éxito');
          this.closeApproveConsolidatedDialog();
        },
        error: (error:any) => {
          this.toastr.showErrorMessage('Error al aprobar el consolidado', 'Error');
        }
      });
    } else {
      this.closeApproveConsolidatedDialog();
    }
  }
  
  createConsolidated(): void {
    this.approveConsolidatedConfirmDialog.open();
  }

  closeApproveConsolidatedDialog(): void {
    this.approveConsolidatedConfirmDialog.closeModal();
  }
}
