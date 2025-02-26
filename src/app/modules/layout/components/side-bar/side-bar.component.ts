import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserInfo } from '../../../../core/models/auth.interface';
import { AuthServiceService } from '../../../auth/service/auth-service.service';

@Component({
  selector: 'layout-side-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {

  private authServicesService: AuthServiceService = inject(AuthServiceService);

  public currentUser: UserInfo | null = null;
  public isSidebarActive: boolean = true;
  public isAcademicPerdiosCollapsed: boolean = true;
  public isUserManagementCollapsed: boolean = true;
  public isEvaluationCollapsed: boolean = true;


  public userRoles: string[] = [];

  public sidebarItems = [
    {
      role:['JEFE DE DEPARTAMENTO'],
      label: 'Periodo académico',
      icon: 'assets/icons/sidebar/icon-calendar.svg',
      sub:[
        {
          role: ['JEFE DE DEPARTAMENTO'],
          label: 'Gestión periodo académico',
          url: '/app/gestion-periodo-academico'
        }
      ]
    },
    {
      role:['JEFE DE DEPARTAMENTO'],
      label: 'Gestion usuarios',
      icon: 'assets/icons/sidebar/icon-user.svg',
      sub: [
        {
          role: ['JEFE DE DEPARTAMENTO'],
          label: 'Usuarios',
          url: '/app/gestion-usuarios/usuarios'
        },
        {
          role: ['JEFE DE DEPARTAMENTO'],
          label: 'Actividades',
          url: '/app/gestion-usuarios/actividades/usuarios'
        }
      ]
    },
    {
      
      role:['JEFE DE DEPARTAMENTO', 'COORDINADOR','DOCENTE', 'ESTUDIANTE'],
      label: 'Evaluación Docente', 
      icon: 'assets/icons/sidebar/icon-evaluation.svg', 
      sub: [
        {
          role:['DOCENTE'],
          label:'Mis actividades',
          url: '/app/gestion-soportes/actividades'
        },
        {
          role:['JEFE DE DEPARTAMENTO','ESTUDIANTE','COORDINADOR'],
          label:'Mis responsabilidades',
          url: '/app/gestion-soportes/responsabilidades'
        },
        {
          role:['JEFE DE DEPARTAMENTO'],
          label:'Consolidado',
          url:'/app/gestion-soportes/consolidado/lista-docentes'
        },
        {
          role:['CPD'],
          label:'CPD',
          url:'/app/gestion-soportes/cpd/lista-docentes'
        },
      ]
    },
  ]

  ngOnInit(): void {
    this.currentUser = this.authServicesService.currentUserValue;
    this.userRoles = this.currentUser?.roles.map(role => role.nombre) || [];
  }

  hasRole(roles: string[]): boolean {
    const roleSet = new Set(roles);
    return this.userRoles.some(role => roleSet.has(role));
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
        break;
      case 'Gestion usuarios':
        this.isUserManagementCollapsed = !this.isUserManagementCollapsed;
        this.isAcademicPerdiosCollapsed = true;
        this.isEvaluationCollapsed = true;
        break;
      case 'Evaluación Docente':
        this.isEvaluationCollapsed = !this.isEvaluationCollapsed;
        this.isAcademicPerdiosCollapsed = true;
        this.isUserManagementCollapsed = true;
        break;
    }
  }

  isToggle(label:string){
    switch (label) {
      case 'Periodo académico':
        return this.isAcademicPerdiosCollapsed;
      case 'Gestion usuarios':
        return this.isUserManagementCollapsed;
      case 'Evaluación Docente':
        return this.isEvaluationCollapsed;
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
