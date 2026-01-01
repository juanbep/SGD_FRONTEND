import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { getUserData } from '../../../auth/utils/user-storage.utils';
import { UserData } from '../../../auth/models';
import { RoleRoutingService } from '../../../gestion-necesidades/services/role-routing.service';

interface MenuItem {
  role: string[];
  icon: string;
  label: string;
  url?: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-side-bar-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, UserProfileModalComponent],
  templateUrl: './side-bar-v2.component.html',
  styleUrl: './side-bar-v2.component.scss',
})
export class SideBarV2Component implements OnInit, OnChanges {
  public currentUser: UserData | null = null;
  public userRoles: string[] = [];
  public isUserModalOpen = false;

  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  private roleRoutingService = inject(RoleRoutingService);

  menuItems: MenuItem[] = [
    // {
    //   role: ['SECRETARIA/O FACULTAD'],
    //   icon: 'assets/icons/sidebar/icon-calendar.svg',
    //   label: 'Periodo académico',
    //   isOpen: false,
    //   children: [
    //     {
    //       role: ['SECRETARIA/O FACULTAD'],
    //       icon: 'fas fa-chart-pie',
    //       label: 'Gestión periodo académico',
    //       url: '/app/gestion-periodo-academico',
    //     },
    //   ],
    // },
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
        // {
        //   role: ['JEFE DE DEPARTAMENTO', 'DECANO'],
        //   icon: 'fas fa-lock',
        //   label: 'Actividades',
        //   url: '/app/gestion-usuarios/actividades/usuarios',
        // },
        // {
        //   role: ['JEFE DE DEPARTAMENTO'],
        //   icon: 'fas fa-lock',
        //   label: 'Actividades pendiente de asignar evaluador',
        //   url: '/app/gestion-usuarios/actividades-pendientes-asignar-evaluador',
        // },
      ],
    },
    // {
    //   role: [
    //     'JEFE DE DEPARTAMENTO',
    //     'COORDINADOR',
    //     'DOCENTE',
    //     'ESTUDIANTE',
    //     'DECANO',
    //     'SECRETARIA/O FACULTAD',
    //     'CPD',
    //   ],
    //   icon: 'assets/icons/sidebar/icon-evaluation.svg',
    //   label: 'Evaluación Docente',
    //   isOpen: false,
    //   children: [
    //     {
    //       role: ['DOCENTE'],
    //       icon: 'fas fa-user',
    //       label: 'Mis actividades',
    //       url: '/app/gestion-soportes/actividades',
    //     },
    //     {
    //       role: [
    //         'JEFE DE DEPARTAMENTO',
    //         'ESTUDIANTE',
    //         'COORDINADOR',
    //         'DECANO',
    //         'DOCENTE',
    //       ],
    //       icon: 'fas fa-lock',
    //       label: 'Mis responsabilidades',
    //       url: '/app/gestion-soportes/responsabilidades',
    //     },
    //     {
    //       role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR'],
    //       icon: 'fas fa-lock',
    //       label: 'Consolidado',
    //       url: '/app/gestion-soportes/consolidado/lista-docentes',
    //     },
    //     {
    //       role: ['CPD', 'SECRETARIA/O FACULTAD', 'DECANO'],
    //       icon: 'fas fa-lock',
    //       label: 'CPD',
    //       url: '/app/gestion-soportes/cpd/lista-docentes',
    //     },
    //     {
    //       role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR', 'CPD'],
    //       icon: 'fas fa-lock',
    //       label: 'Histórico consolidado',
    //       url: '/app/gestion-soportes/historico-consolidados',
    //     },
    //   ],
    // },
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
      icon: 'assets/icons/sidebar/icon-calendar-management.svg',
      label: 'Calendario académico',
      isOpen: false,
      children: [
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
          icon: 'fas fa-search',
          label: 'Explorar calendarios',
          url: '/app/gestion-calendario-academico/listar',
        },
        {
          role: ['SECRETARIA/O FACULTAD'],
          icon: 'fas fa-plus',
          label: 'Crear calendario',
          url: '/app/gestion-calendario-academico/crear',
        },
        {
          role: ['SECRETARIA/O FACULTAD'],
          icon: 'fas fa-sliders-h',
          label: 'Gestionar calendarios',
          url: '/app/gestion-calendario-academico/gestionar',
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
          icon: 'fas fa-compass',
          label: 'Explorar actividades',
          url: '/app/gestion-actividades-docente/list',
        },
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'ESTUDIANTE',
            'COORDINADOR',
            'DECANO',
            'DOCENTE',
          ],
          icon: 'fas fa-folder-plus',
          label: 'Crear actividades',
          url: '/app/gestion-actividades-docente/create',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR'],
          icon: 'fas fa-clipboard-list',
          label: 'Gestionar Actividades',
          url: '/app/gestion-actividades-docente/management',
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
      icon: 'assets/icons/sidebar/icon-necesidades-management.svg',
      label: 'Gestión Necesidades',
      isOpen: false,
      children: [
        {
          role: ['DOCENTE'],
          icon: 'fas fa-folder-open',
          label: 'Gestionar Planes',
          url: '/app/gestion-planes/management',
        },
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'ESTUDIANTE',
            'COORDINADOR',
            'DECANO',
            'DOCENTE',
          ],
          icon: 'fas fa-tasks',
          label: 'Gestionar Necesidades',
          url: '/app/gestion-necesidades/management',
        },
        {
          role: ['JEFE DE DEPARTAMENTO', 'COORDINADOR'],
          icon: 'fas fa-eye',
          label: 'Ver Necesidades',
          url: '/app/gestion-necesidades/view',
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
          icon: 'fas fa-chart-bar',
          label: 'Estadísticas',
          url: '/app/gestion-estadisticas/estadisticas',
        },
      ],
    },
  ];

  ngOnInit(): void {
    // Obtener datos del usuario
    this.currentUser = getUserData();
    this.userRoles =
      this.currentUser?.roles.map((role: { nombre: any }) => role.nombre) || [];

    this.actualizarURLsSegunRol();
  }

  private actualizarURLsSegunRol(): void {
    this.menuItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          // Actualizar URL de "Gestionar Necesidades"
          if (child.label === 'Gestionar Necesidades') {
            child.url = this.roleRoutingService.getRutaNecesidades(
              this.userRoles
            );
          }
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSidebarCollapsed']) {
      if (this.isUserModalOpen) {
        this.isUserModalOpen = false;
      }

      if (this.isSidebarCollapsed) {
        this.menuItems.forEach((item) => {
          if (item.isOpen) {
            item.isOpen = false;
          }
        });
      }
    }
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

  toggleUserModal() {
    this.isUserModalOpen = !this.isUserModalOpen;
  }

  closeUserModal() {
    this.isUserModalOpen = false;
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const nombres = this.currentUser.nombres?.charAt(0) || '';
    const apellidos = this.currentUser.apellidos?.charAt(0) || '';
    return `${nombres}${apellidos}`.toUpperCase();
  }
}
