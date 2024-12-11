import { Component, ViewChild } from '@angular/core';
import { ConsolidatedTeacherFilterComponent } from "../../components/consolidated-teacher-filter/consolidated-teacher-filter.component";
import { ConsolidatedTeacherTableComponent } from "../../components/consolidated-teacher-table/consolidated-teacher-table.component";
import { ApproveConsolidatedConfirmDialogComponent } from '../../components/approve-consolidated-confirm-dialog/approve-consolidated-confirm-dialog.component';

@Component({
  selector: 'app-consolidated-teacher',
  standalone: true,
  imports: [ConsolidatedTeacherFilterComponent, ConsolidatedTeacherTableComponent, ApproveConsolidatedConfirmDialogComponent],
  templateUrl: './consolidated-teacher.component.html',
  styleUrl: './consolidated-teacher.component.css'
})
export class ConsolidatedTeacherComponent {

  @ViewChild(ApproveConsolidatedConfirmDialogComponent)
  approveConsolidatedConfirmDialog!: ApproveConsolidatedConfirmDialogComponent;


  createConsolidated(): void {
    this.approveConsolidatedConfirmDialog.open();
  }

}
