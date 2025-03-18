import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { ModalCreateAcademicPeriodComponent } from '../../components/modal-create-academic-period/modal-create-academic-period.component';
import { ModalEditAcademicPeriodComponent } from '../../components/modal-edit-academic-period/modal-edit-academic-period.component';
import { AcademicPeriodManagementService } from '../../services/academic-period-management-service.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { PagedResponse } from '../../../../core/models/response/paged-response.model';
import { PeriodoAcademicoResponse } from '../../../../core/models/response/periodo-academico-response.model';
import { MessagesInfoService } from '../../../../shared/services/messages-info.service';

const ACTIVE_PERIOD_STATUS_ID = 1;
const PAGE_SIZE = 10;

@Component({
  selector: 'app-academic-period-management',
  standalone: true,
  imports: [
    ModalCreateAcademicPeriodComponent,
    ModalEditAcademicPeriodComponent,
    CommonModule,
    PaginatorComponent,
  ],
  templateUrl: './academic-period-management.component.html',
  styleUrl: './academic-period-management.component.css',
})
export class AcademicPeriodManagementComponent implements OnInit {
  private academicPeriodManagementService = inject(
    AcademicPeriodManagementService
  );
  private messagesInfoService = inject(MessagesInfoService);

  public academicPeriodResponse: PagedResponse<PeriodoAcademicoResponse> | null =
    null;
  public academicPeriods: PeriodoAcademicoResponse[] = [];
  public currentAcademicPeriod: PeriodoAcademicoResponse | null = null;
  public currentPage: number = 1;

  @ViewChild(ModalCreateAcademicPeriodComponent)
  modalCreateAcademicPeriod!: ModalCreateAcademicPeriodComponent;

  @ViewChild(ModalEditAcademicPeriodComponent)
  modalEditAcademicPeriod!: ModalEditAcademicPeriodComponent;

  constructor() {
    effect(() => {
      this.academicPeriodResponse =
        this.academicPeriodManagementService.getDatAcademicPeriods();
      this.academicPeriods = this.academicPeriodResponse?.content || [];
      this.setCurrentAcademicPeriod();
    });
  }

  ngOnInit(): void {
    this.recoverAcademicPeriods(this.currentPage, PAGE_SIZE);
  }

  recoverAcademicPeriods(page: number, size: number): void {
    this.academicPeriodManagementService
      .getAllAcademicPeriods(page - 1, size)
      .subscribe({
        next: (response) => {
          this.academicPeriodManagementService.setAcademicPeriods(
            response.data
          );
          this.academicPeriodResponse =
            this.academicPeriodManagementService.getDatAcademicPeriods();
          this.academicPeriods = response.data.content;
          this.setCurrentAcademicPeriod();
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }

  setCurrentAcademicPeriod(): void {
    this.currentAcademicPeriod =
      this.academicPeriods.find(
        (ap) =>
          ap.estadoPeriodoAcademico.oidEstadoPeriodoAcademico ===
          ACTIVE_PERIOD_STATUS_ID
      ) || null;
  }

  openModalCreateAcademicPeriod(): void {
    this.modalCreateAcademicPeriod.open();
  }

  openModalEditAcademicPeriod(academicPeriod: PeriodoAcademicoResponse): void {
    this.modalEditAcademicPeriod.open(academicPeriod);
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.recoverAcademicPeriods(this.currentPage, PAGE_SIZE);
  }
}
