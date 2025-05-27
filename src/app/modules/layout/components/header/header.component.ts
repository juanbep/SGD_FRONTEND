import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../auth/service/auth-service.service';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../../../core/models/response/usuario-response.model';
import { Rol } from '../../../../core/models/base/rol.model';
import { AcademicPeriodManagementService } from '../../../academic-period-management/services/academic-period-management-service.service';
import { PeriodoAcademicoResponse } from '../../../../core/models/response/periodo-academico-response.model';

@Component({
  selector: 'layout-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private router: Router = inject(Router);
  private authServiceService = inject(AuthServiceService);
  private academicPeriodService = inject(AcademicPeriodManagementService)

  public currentUser: UsuarioResponse | null = null;
  public currentAcademicPeriod: PeriodoAcademicoResponse | null = null;
  
  currentAcademicPeriodEffect = effect(() => {
    this.currentAcademicPeriod = this.academicPeriodService.currentAcademicPeriodValue;
    if (!this.currentAcademicPeriod) {
      this.currentAcademicPeriod = null;
    }
  });
  
  ngOnInit(): void {
    this.currentUser = this.authServiceService.currentUserValue;
    this.currentPeriodAcademic();
  }

  currentPeriodAcademic() {
    this.academicPeriodService.getActiveAcademicPeriod().subscribe({
      next: (periodo: PeriodoAcademicoResponse) => {
        this.currentAcademicPeriod = this.academicPeriodService.currentAcademicPeriodValue;
      },
      error: (error) => {
        this.currentAcademicPeriod = null;
      }
    });
  }

  logOut() {
    this.authServiceService.logout();
  }

  returnAllRoles(roles: Rol[]) {
    let rolesString = '';
    roles.forEach((role: Rol) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }
}
