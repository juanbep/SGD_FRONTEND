import { Component, effect, inject, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { RouterLink } from '@angular/router';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { CommonModule } from '@angular/common';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { UsuarioConsolidadoResponse } from '../../../../../../core/models/response/usuario-consolidado-response.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'consolidated-teachers-list-table',
  standalone: true,
  imports: [PaginatorComponent, RouterLink, CommonModule],
  templateUrl: './teachers-list-table.component.html',
  styleUrl: './teachers-list-table.component.css',
})
export class TeacherListTableComponent implements OnInit {
  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private toastr = inject(MessagesInfoService);
  private authService = inject(AuthServiceService);

  public currentPage: number = 1;
  public teacherServiceResponse: PagedResponse<UsuarioConsolidadoResponse> | null =
    null;
  public teacherList: UsuarioConsolidadoResponse[] = [];
  public currentUser: UsuarioResponse | null = null;
  public filterParams: {
    teacherType: string | null;
    contractType: string | null;
  } | null = null;


  filterEffect = effect(() => {
    this.filterParams = this.consolidatedServicesService.getFilterTeacherParams();
    if (this.filterParams) {
      this.recoverTeachers(this.currentPage, PAGE_SIZE);
    }
  });

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.recoverTeachers(this.currentPage, PAGE_SIZE);
  }

  recoverTeachers(page: number, size: number): void {
    this.consolidatedServicesService
      .getTeachers(
        page - 1,
        size,
        this.currentUser?.usuarioDetalle.departamento || ''
      )
      .subscribe({
        next: (response) => {
          this.teacherServiceResponse = response.data;
          this.teacherList = response.data.content;
        },
        error: (error) => {
          this.toastr.showErrorMessage(error.error.mensaje, 'Error');
        },
      });
  }

  pageChanged(event: number) {
    this.currentPage = event;
    this.recoverTeachers(this.currentPage, PAGE_SIZE);
  }
}
