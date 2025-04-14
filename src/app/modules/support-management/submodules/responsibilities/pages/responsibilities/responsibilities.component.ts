import { Component, inject, OnInit } from '@angular/core';
import { ResponsibilitiesTableComponent } from "../../components/responsibilities-table/responsibilities-table.component";
import { ResponsibilitiesFilterComponent } from "../../components/responsibilities-filter/responsibilities-filter.component";
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';

@Component({
  selector: 'support-management-responsibilities',
  standalone: true,
  imports: [ResponsibilitiesTableComponent, ResponsibilitiesFilterComponent],
  templateUrl: './responsibilities.component.html',
  styleUrl: './responsibilities.component.css'
})
export class ResponsibilitiesComponent implements OnInit{


  private authServiceService = inject(AuthServiceService);
  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  
  public academicPeriod: PeriodoAcademicoResponse | null = null;
  public currentUser = this.authServiceService.currentUser;

  ngOnInit(): void {
    this.academicPeriod = this.academicPeriodManagementService.currentAcademicPeriodValue;
  }


}
