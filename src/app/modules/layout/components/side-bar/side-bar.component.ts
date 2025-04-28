import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../auth/service/auth-service.service';
import { UsuarioResponse } from '../../../../core/models/response/usuario-response.model';

@Component({
  selector: 'layout-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  private authServicesService: AuthServiceService = inject(AuthServiceService);

  public currentUser: UsuarioResponse | null = null;
  public isSidebarActive: boolean = true;
  public isAcademicPerdiosCollapsed: boolean = true;
  public isUserManagementCollapsed: boolean = true;
  public isEvaluationCollapsed: boolean = true;
  public isStatisticsCollapsed: boolean = true;

  public userRoles: string[] = [];

  public sidebarItems = [
    {
      role: ['JEFE DE DEPARTAMENTO', 'SECRETARIA/O FACULTAD'],
      label: 'Periodo académico',
      icon: 'assets/icons/sidebar/icon-calendar.svg',
      sub: [
        {
          role: ['JEFE DE DEPARTAMENTO', 'SECRETARIA/O FACULTAD'],
          label: 'Gestión periodo académico',
          url: '/app/gestion-periodo-academico',
        },
      ],
    },
    {
      role: ['JEFE DE DEPARTAMENTO'],
      label: 'Gestion usuarios',
      icon: 'assets/icons/sidebar/icon-user.svg',
      sub: [
        {
          role: ['JEFE DE DEPARTAMENTO'],
          label: 'Usuarios',
          url: '/app/gestion-usuarios/usuarios',
        },
        {
          role: ['JEFE DE DEPARTAMENTO'],
          label: 'Actividades',
          url: '/app/gestion-usuarios/actividades/usuarios',
        },
        {
          role: ['JEFE DE DEPARTAMENTO'],
          label: 'Actividades pendiente de asignar evaluador',
          url: '/app/gestion-usuarios/actividades-pendientes-asignar-evaluador',
        },
      ],
    },
    {
      role: [
        'JEFE DE DEPARTAMENTO',
        'COORDINADOR',
        'DOCENTE',
        'ESTUDIANTE',
        'DECANO',
        'SECRETARIA/O FACULTAD',
        'CPD',
      ],
      label: 'Evaluación Docente',
      icon: 'assets/icons/sidebar/icon-evaluation.svg',
      sub: [
        {
          role: ['DOCENTE'],
          label: 'Mis actividades',
          url: '/app/gestion-soportes/actividades',
        },
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'ESTUDIANTE',
            'COORDINADOR',
            'DECANO',
            'DOCENTE',
        
          ],
          label: 'Mis responsabilidades',
          url: '/app/gestion-soportes/responsabilidades',
        },
        {
          role: ['JEFE DE DEPARTAMENTO','COORDINADOR'],
          label: 'Consolidado',
          url: '/app/gestion-soportes/consolidado/lista-docentes',
        },
        {
          role: ['CPD', 'SECRETARIA/O FACULTAD'],
          label: 'CPD',
          url: '/app/gestion-soportes/cpd/lista-docentes',
        },
      ],
    },
    {
      role: ['JEFE DE DEPARTAMENTO', 'SECRETARIA/O FACULTAD'],
      label: 'Estadísticas',
      icon: 'assets/icons/sidebar/icon-statistics.svg',
      sub: [
        {
          role: ['JEFE DE DEPARTAMENTO', 'SECRETARIA/O FACULTAD'],
          label: 'Estadísticas',
          url: '/app/gestion-estadisticas/estadisticas',
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.currentUser = this.authServicesService.currentUserValue;
    this.userRoles = this.currentUser?.roles.map((role) => role.nombre) || [];
  }

  //Resto del código...

  hasRole(roles: string[]): boolean {
    const roleSet = new Set(roles);
    return this.userRoles.some((role) => roleSet.has(role));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  toggleAction(label: string) {
    switch (label) {
      case 'Periodo académico':
        this.isAcademicPerdiosCollapsed = !this.isAcademicPerdiosCollapsed;
        this.isUserManagementCollapsed = true;
        this.isEvaluationCollapsed = true;
        this.isStatisticsCollapsed = true;
        break;
      case 'Gestion usuarios':
        this.isUserManagementCollapsed = !this.isUserManagementCollapsed;
        this.isAcademicPerdiosCollapsed = true;
        this.isEvaluationCollapsed = true;
        this.isStatisticsCollapsed = true;
        break;
      case 'Evaluación Docente':
        this.isEvaluationCollapsed = !this.isEvaluationCollapsed;
        this.isAcademicPerdiosCollapsed = true;
        this.isUserManagementCollapsed = true;
        this.isStatisticsCollapsed = true;
        break;
      case 'Estadísticas':
        this.isStatisticsCollapsed = !this.isStatisticsCollapsed;
        this.isAcademicPerdiosCollapsed = true;
        this.isUserManagementCollapsed = true;
        this.isEvaluationCollapsed = true;

        break;
    }
  }

  isToggle(label: string) {
    switch (label) {
      case 'Periodo académico':
        return this.isAcademicPerdiosCollapsed;
      case 'Gestion usuarios':
        return this.isUserManagementCollapsed;
      case 'Evaluación Docente':
        return this.isEvaluationCollapsed;
      case 'Estadísticas':
        return this.isStatisticsCollapsed;
      default:
        return false;
    }
  }

  private checkScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1280) {
      this.isSidebarActive = false;
    } else {
      this.isSidebarActive = true;
    }
  }
}
