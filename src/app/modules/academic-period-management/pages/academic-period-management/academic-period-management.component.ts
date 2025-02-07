import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { ModalCreateAcademicPeriodComponent } from '../../components/modal-create-academic-period/modal-create-academic-period.component';
import { ModalEditAcademicPeriodComponent } from '../../components/modal-edit-academic-period/modal-edit-academic-period.component';
import { AcademicPeriod, AcademicPeriodResponse } from '../../../../core/models/academicPeriods';
import { AcademicPeriodManagementService } from '../../services/academic-period-management-service.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";

const ACTIVE_PERIOD_STATUS_ID = 1;

@Component({
  selector: 'app-academic-period-management',
  standalone: true,
  imports: [
    ModalCreateAcademicPeriodComponent,
    ModalEditAcademicPeriodComponent,
    CommonModule,
    PaginatorComponent
  ],
  templateUrl: './academic-period-management.component.html',
  styleUrl: './academic-period-management.component.css'
})
export class AcademicPeriodManagementComponent implements OnInit {
  
  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  
  public academicPeriodResponse: AcademicPeriodResponse | null = null;
  public academicPeriods: AcademicPeriod[] = [];
  public currentAcademicPeriod: AcademicPeriod | null = null;
  public currentPage: number = 1;
  public size: number = 10;
  
  @ViewChild(ModalCreateAcademicPeriodComponent)
  modalCreateAcademicPeriod!: ModalCreateAcademicPeriodComponent;
  
  @ViewChild(ModalEditAcademicPeriodComponent)
  modalEditAcademicPeriod!: ModalEditAcademicPeriodComponent;
  
  constructor() {
    effect(() => {
      this.academicPeriodResponse = this.academicPeriodManagementService.getDatAcademicPeriods();
      this.academicPeriods = this.academicPeriodResponse?.content || [];
      this.setCurrentAcademicPeriod();
    });
  }

  ngOnInit(): void {
    this.recoverAcademicPeriods(this.currentPage, this.size);
  }

  openModalCreateAcademicPeriod(): void {
    this.modalCreateAcademicPeriod.open();
  }

  openModalEditAcademicPeriod(academicPeriod: AcademicPeriod): void {
    this.modalEditAcademicPeriod.open(academicPeriod);
  }

  recoverAcademicPeriods(page: number, size: number): void {
    this.academicPeriodManagementService.getAllAcademicPeriods(page - 1, size).subscribe({
      next: (response) => {
        this.academicPeriodManagementService.setAcademicPeriods(response);
        this.academicPeriodResponse = this.academicPeriodManagementService.getDatAcademicPeriods();
        this.academicPeriods = response.content;
        this.setCurrentAcademicPeriod();
      },
      error: (err) => {
        console.error('Error fetching academic periods', err);
        // Handle error appropriately
      }
    });
  }

  setCurrentAcademicPeriod(): void {
    this.currentAcademicPeriod = this.academicPeriods.find((ap) => ap.estadoPeriodoAcademico.oidEstadoPeriodoAcademico === ACTIVE_PERIOD_STATUS_ID) || null;
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.recoverAcademicPeriods(this.currentPage, this.size);
  }
}
