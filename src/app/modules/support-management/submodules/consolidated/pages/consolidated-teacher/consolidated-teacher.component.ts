import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConsolidatedTeacherFilterComponent } from "../../components/consolidated-teacher-filter/consolidated-teacher-filter.component";
import { ConsolidatedTeacherTableComponent } from "../../components/consolidated-teacher-table/consolidated-teacher-table.component";
import { ApproveConsolidatedConfirmDialogComponent } from '../../components/approve-consolidated-confirm-dialog/approve-consolidated-confirm-dialog.component';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Consolidated } from '../../../../../../core/models/consolidated.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

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

  responseConsolidatedConfirmDialog: string = '';

  consolidatedTeacher: Consolidated | null = null;

  consolidatedServicesService = inject(ConsolidatedServicesService);
  toastr = inject(MessagesInfoService);
  
  ngOnInit(): void {
    this.recoverConsolidatedTeacher();
  }

  recoverConsolidatedTeacher(){
    this.consolidatedServicesService.getConsolidatedByTeacher(92, 'Sistemas').subscribe({
      next: data => {
        this.consolidatedTeacher = data;
        this.consolidatedServicesService.setDataConsolidatedTeacher(data);
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }

  responseApproveConsolidated(response: string | void): void {
    if (response === 'Si') {
      this.consolidatedServicesService.saveConsolidated(6).subscribe({
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
