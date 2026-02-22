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
import { ConfiguracionHelperService } from '../../services/configuracion-helper.service';

export interface MenuItem {
  role: string[];
  icon: string;
  label: string;
  url?: string;
  isOpen?: boolean;
  isExternal?: boolean;
  configKey?: string;
  children?: MenuItem[];
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
  private configuracionHelper = inject(ConfiguracionHelperService);

  menuItems: MenuItem[] = [
    {
      role: [
        'JEFE DE DEPARTAMENTO',
        'COORDINADOR',
        'DOCENTE',
        'ESTUDIANTE',
        'DECANO',
        'SECRETARIA/O FACULTAD',
        'SECRETARIO',
        'CPD',
      ],
      icon: 'assets/icons/sidebar/icon-calendar-management.svg',
      label: 'Calendario Académico',
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
            'SECRETARIO',
            'CPD',
          ],
          icon: 'fas fa-search',
          label: 'Explorar calendarios',
          url: '/app/gestion-calendario-academico/listar',
        },
        {
          role: ['SECRETARIA/O FACULTAD', 'SECRETARIO', 'DECANO'],
          icon: 'fas fa-plus',
          label: 'Crear calendario',
          url: '/app/gestion-calendario-academico/crear',
        },
        {
          role: ['SECRETARIA/O FACULTAD', 'SECRETARIO', 'DECANO'],
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
        'DECANO',
        'SECRETARIO',
        'SECRETARIA/O FACULTAD',
      ],
      icon: 'assets/icons/sidebar/icon-activities-management.svg',
      label: 'Gestión Actividades',
      isOpen: false,
      children: [
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'COORDINADOR',
            'DOCENTE',
            'DECANO',
            'SECRETARIO',
            'SECRETARIA/O FACULTAD',
          ],
          icon: 'fas fa-compass',
          label: 'Explorar actividades',
          url: '/app/gestion-actividades-docente/list',
        },
        {
          role: ['JEFE DE DEPARTAMENTO'],
          icon: 'fas fa-folder-plus',
          label: 'Crear actividades',
          url: '/app/gestion-actividades-docente/create',
        },
        {
          role: ['JEFE DE DEPARTAMENTO'],
          icon: 'fas fa-clipboard-list',
          label: 'Gestionar Actividades',
          url: '/app/gestion-actividades-docente/management',
        },
      ],
    },
    {
      role: [
        'JEFE DE DEPARTAMENTO',
        'SECRETARIO',
        'SECRETARIA/O FACULTAD',
        'COORDINADOR',
      ],
      icon: 'assets/icons/sidebar/icon-necesidades-management.svg',
      label: 'Gestión Necesidades',
      isOpen: false,
      children: [
        {
          role: ['COORDINADOR'],
          icon: 'fas fa-folder-open',
          label: 'Gestionar Planes',
          url: '/app/gestion-planes/management',
        },
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'SECRETARIA/O FACULTAD',
            'SECRETARIO',
            'COORDINADOR',
          ],
          icon: 'fas fa-tasks',
          label: 'Gestionar Necesidades',
          url: '/app/gestion-necesidades/management',
        },
        {
          role: [
            'JEFE DE DEPARTAMENTO',
            'SECRETARIA/O FACULTAD',
            'SECRETARIO',
            'COORDINADOR',
            'DECANO'
          ],
          icon: 'fa-solid fa-download',
          label: 'Descargar Necesidades',
          url: '/app/gestion-necesidades/download',
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
          url: '/app/gestion-estadisticas',
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
      icon: 'assets/icons/sidebar/icon-evaluacion-docente.svg',
      label: 'Evaluación Docente',
      url: '', // Se carga dinámicamente
      isExternal: true,
      configKey: 'sed-url',
    },
  ];

  async ngOnInit(): Promise<void> {
    // Obtener datos del usuario
    this.currentUser = getUserData();
    this.userRoles =
      this.currentUser?.roles.map((role: { nombre: any }) => role.nombre) || [];

    // Cargar URLs desde configuración
    await this.cargarURLsParametrizables();

    // Actualizar URLs según rol
    this.actualizarURLsSegunRol();
  }

  /**
   * Carga las URLs configurables desde la base de datos
   */
  private async cargarURLsParametrizables(): Promise<void> {
    try {
      // Recopilar todas las claves de configuración necesarias
      const configKeys = this.recopilarConfigKeys(this.menuItems);

      if (configKeys.length === 0) return;

      // Obtener los valores de las configuraciones
      const valores =
        await this.configuracionHelper.getMultipleValoresByClaves(configKeys);

      // Crear un mapa clave -> valor
      const configMap = new Map<string, string>();
      configKeys.forEach((key, index) => {
        if (valores[index]) {
          configMap.set(key, valores[index]!);
        }
      });

      // Aplicar las URLs a los items del menú
      this.aplicarURLsConfiguradas(this.menuItems, configMap);
    } catch (error) {
      console.error('Error al cargar URLs parametrizables:', error);
      // Mantener URLs por defecto en caso de error
    }
  }

  /**
   * Recopila todas las claves de configuración de los items del menú
   */
  private recopilarConfigKeys(items: MenuItem[]): string[] {
    const keys: string[] = [];

    items.forEach((item) => {
      if (item.configKey) {
        keys.push(item.configKey);
      }

      if (item.children && item.children.length > 0) {
        keys.push(...this.recopilarConfigKeys(item.children));
      }
    });

    // Eliminar duplicados
    return [...new Set(keys)];
  }

  /**
   * Aplica las URLs configuradas a los items del menú
   */
  private aplicarURLsConfiguradas(
    items: MenuItem[],
    configMap: Map<string, string>,
  ): void {
    items.forEach((item) => {
      if (item.configKey && configMap.has(item.configKey)) {
        item.url = configMap.get(item.configKey)!;
      }

      if (item.children && item.children.length > 0) {
        this.aplicarURLsConfiguradas(item.children, configMap);
      }
    });
  }

  private actualizarURLsSegunRol(): void {
    this.menuItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          // Actualizar URL de "Gestionar Necesidades"
          if (child.label === 'Gestionar Necesidades') {
            child.url = this.roleRoutingService.getRutaNecesidades(
              this.userRoles,
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
