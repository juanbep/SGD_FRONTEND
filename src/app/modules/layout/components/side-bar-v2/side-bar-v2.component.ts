import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  inject,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../auth/service/auth-service.service';
import { UsuarioResponse } from '../../../../core/models/response/usuario-response.model';

interface MenuItem {
  role: string[];
  icon: string;
  label: string;
  url?: string; // solo existe en subitems
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-side-bar-v2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar-v2.component.html',
  styleUrl: './side-bar-v2.component.scss',
})
export class SideBarV2Component implements OnInit {
  private authServicesService: AuthServiceService = inject(AuthServiceService);
  public currentUser: UsuarioResponse | null = null;
  public userRoles: string[] = [];

  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      role: ['SECRETARIA/O FACULTAD'],
      icon: 'assets/icons/sidebar/icon-calendar.svg',
      label: 'Periodo académico',
      isOpen: false,
      children: [
        {
          role: ['SECRETARIA/O FACULTAD'],
          icon: 'fas fa-chart-pie',
          label: 'Gestión periodo académico',
          url: '/app/gestion-periodo-academico',
        },
      ],
    },
    {
      role: ['JEFE DE DEPARTAMENTO', 'SECRETARIA/O FACULTAD', 'DECANO'],
      icon: 'assets/icons/sidebar/icon-user.svg',
      label: 'Gestion usuarios',
      isOpen: false,
      children: [
        {
          role: ['JEFE DE DEPARTAMENTO', 'SECRETARIA/O FACULTAD', 'DECANO'],
          icon: 'fas fa-user',
          label: 'Usuarios',
          url: '/app/gestion-usuarios/usuarios',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'DECANO'],
          icon: 'fas fa-lock',
          label: 'Actividades',
          url: '/app/gestion-usuarios/actividades/usuarios',
        },
        {
          role: ['JEFE DE DEPARTAMENTO'],
          icon: 'fas fa-lock',
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
      icon: 'assets/icons/sidebar/icon-evaluation.svg',
      label: 'Evaluación Docente',
      isOpen: false,
      children: [
        {
          role: ['DOCENTE'],
          icon: 'fas fa-user',
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
          icon: 'fas fa-lock',
          label: 'Mis responsabilidades',
          url: '/app/gestion-soportes/responsabilidades',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR'],
          icon: 'fas fa-lock',
          label: 'Consolidado',
          url: '/app/gestion-soportes/consolidado/lista-docentes',
        },
        {
          role: ['CPD', 'SECRETARIA/O FACULTAD', 'DECANO'],
          icon: 'fas fa-lock',
          label: 'CPD',
          url: '/app/gestion-soportes/cpd/lista-docentes',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR', 'CPD'],
          icon: 'fas fa-lock',
          label: 'Histórico consolidado',
          url: '/app/gestion-soportes/historico-consolidados',
        },
      ],
    },
    {
      role: ['SECRETARIA/O FACULTAD'],
      icon: 'assets/icons/sidebar/icon-calendar-management.svg',
      label: 'Calendario académico',
      isOpen: false,
      children: [
        {
          role: ['SECRETARIA/O FACULTAD'],
          icon: 'fas fa-user',
          label: 'Explorar calendarios',
          url: '#',
        },
        {
          role: ['SECRETARIA/O FACULTAD'],
          icon: 'fas fa-user',
          label: 'Crear calendario',
          url: '#',
        },
        {
          role: ['SECRETARIA/O FACULTAD'],
          icon: 'fas fa-user',
          label: 'Gestiónar calendarios',
          url: '/app/gestion-calendario-academico',
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
      icon: 'assets/icons/sidebar/icon-activities-management.svg',
      label: 'Gestión Actividades',
      isOpen: false,
      children: [
        {
          role: ['DOCENTE'],
          icon: 'fas fa-user',
          label: 'Explorar actividades',
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
          icon: 'fas fa-lock',
          label: 'Crear actividades',
          url: '/app/gestion-soportes/responsabilidades',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR'],
          icon: 'fas fa-lock',
          label: 'Gestionar Actividades',
          url: '/app/gestion-soportes/consolidado/lista-docentes',
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
      icon: 'assets/icons/sidebar/icon-activities-management.svg',
      label: 'Gestión Necesidades',
      isOpen: false,
      children: [
        {
          role: ['DOCENTE'],
          icon: 'fas fa-user',
          label: 'Opción 1',
          url: '#',
        },
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'ESTUDIANTE',
            'COORDINADOR',
            'DECANO',
            'DOCENTE',
          ],
          icon: 'fas fa-lock',
          label: 'Opción 2',
          url: '#',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR'],
          icon: 'fas fa-lock',
          label: 'Opción 3',
          url: '#',
        },
      ],
    },
    {
      role: [
        'JEFE DE DEPARTAMENTO',
        'SECRETARIA/O FACULTAD',
        'DECANO',
        'CPD',
        'COORDINADOR',
      ],
      icon: 'assets/icons/sidebar/icon-statistics.svg',
      label: 'Estadísticas',
      isOpen: false,
      children: [
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'SECRETARIA/O FACULTAD',
            'DECANO',
            'CPD',
            'COORDINADOR',
          ],
          icon: 'fas fa-user',
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

  hasRole(roles: string[]): boolean {
    const roleSet = new Set(roles);
    return this.userRoles.some((role) => roleSet.has(role));
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    if (!this.isSidebarCollapsed && item.children) {
      this.menuItems.forEach((menuItem) => {
        if (menuItem !== item) {
          menuItem.isOpen = false;
        }
      });

      item.isOpen = !item.isOpen;
    }
  }
}
