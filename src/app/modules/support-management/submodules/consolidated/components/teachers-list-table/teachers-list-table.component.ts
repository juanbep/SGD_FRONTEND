import { Component, effect, inject, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { ConsolidatedTeachersResponse, Teacher } from '../../../../../../core/models/consolidated.interface';
import { CommonModule } from '@angular/common';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { UserInfo } from '../../../../../../core/models/auth.interface';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';

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

  
  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private toastr = inject(MessagesInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthServiceService);
  
  public currentPage: number = 1;
  public teacherServiceResponse: ConsolidatedTeachersResponse | null = null;
  public teacherList: Teacher[] = [];
  public currentUser : UserInfo | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.recoverTeachers(this.currentPage, 10);
  }



  recoverTeachers(page: number, size: number): void {
    this.consolidatedServicesService.getTeachers(page-1, size, this.currentUser?.usuarioDetalle.departamento || '').subscribe({
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
