import { Component, effect, inject, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { RouterLink } from '@angular/router';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { ConsolidatedTeachersResponse, Teacher } from '../../../../../../core/models/consolidated.interface';
import { CommonModule } from '@angular/common';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'consolidated-teachers-list-table',
  standalone: true,
  imports: [
    PaginatorComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './teachers-list-table.component.html',
  styleUrl: './teachers-list-table.component.css'
})
export class TeacherListTableComponent implements OnInit {

  public currentPage: number = 1;

  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private toastr = inject(MessagesInfoService);

  //TODO Declarar variables
  teacherServiceResponse: ConsolidatedTeachersResponse | null = null;
  teacherList: Teacher[] = [];

  ngOnInit(): void {
    this.recoverTeachers(this.currentPage, 10);
  }



  recoverTeachers(page: number, size: number): void {
    this.consolidatedServicesService.getTeachers(page-1, size).subscribe({
      next: data => {
        this.teacherServiceResponse = data;
        this.teacherList = data.content;
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }
}
