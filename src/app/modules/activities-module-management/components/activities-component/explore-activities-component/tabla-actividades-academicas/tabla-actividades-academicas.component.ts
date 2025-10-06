import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadesService } from '../../../../services/actividades/actividades.service';
import { ActividadHelperService } from '../../../../services/actividades/actividad-helper.service';
import { CalendarioHelperService } from '../../../../../academic-calendar-management/services/calendario/calendario-helper.service';
import { UsuarioHelperService } from '../../../../../users-roles-management/services/users/usuario-helper.service';
import { TiposActividadHelperService } from '../../../../services/tiposActividades/tipos-actividad-helper.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../../../users-roles-management/models';
import {
  ActividadFilters,
  PaginationConfig,
  DEFAULT_PAGINATION_CONFIG,
  ActividadResponse,
} from '../../../../models';
import { EstadoCalendario } from '../../../../../academic-calendar-management/models';
import { ModalDetalleActividadComponent } from '../modal-detalle-actividad/modal-detalle-actividad.component';
import { ModalUsuariosComponent } from '../modal-usuarios/modal-usuarios.component';

@Component({
  selector: 'app-tabla-actividades-academicas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalDetalleActividadComponent,
    ModalUsuariosComponent,
  ],
  templateUrl: './tabla-actividades-academicas.component.html',
  styleUrl: './tabla-actividades-academicas.component.css',
})
export class TablaActividadesAcademicasComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<ActividadResponse>();
  @Output() onEliminar = new EventEmitter<ActividadResponse>();

  private actividadesService = inject(ActividadesService);
  //private actividadHelper = inject(ActividadHelperService);
  private calendarioHelper = inject(CalendarioHelperService);
  private usuarioHelper = inject(UsuarioHelperService);
  private tiposActividadHelper = inject(TiposActividadHelperService);
  private toastr = inject(ToastrService);

  usuario: Usuario | null = null;

  actividades: ActividadResponse[] = [];
  //actividadData!: ActividadResponse;
  loading: boolean = false;
  error: string = '';
  pagination: PaginationConfig = { ...DEFAULT_PAGINATION_CONFIG };

  // Modales
  actividadSeleccionada: ActividadResponse | null = null;
  mostrarModalDetalles: boolean = false;
  mostrarModalUsuarios: boolean = false;
  usuariosSeleccionados: number[] = [];

  // Lista de calendarios para el dropdown filtro calendarios
  calendariosDropdown: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];
  loadingCalendarios = false;

  // Lista de tipos de actividad para el dropdown
  tiposActividadDropdown: { value: number; label: string }[] = [];
  loadingTiposActividad = false;

  // Filtros y paginación
  filters: ActividadFilters = {
    page: 0,
    size: 10,
    searchTerm: '',
    oidEstadoActividad: '', //validar la asignación
    oidCalendario: 1,
    oidDepartamento: 4, //obtener del token del usuario
    oidTipoActividad: 2,
    fechaCreacionDesde: '',
  };

  // Estados de las actividades
  estados = [
    { oid: 1, nombre: 'ACTIVA', class: 'bg-success' },
    { oid: 2, nombre: 'INACTIVA', class: 'bg-danger' },
    { oid: 3, nombre: 'INCOMPLETA', class: 'bg-warning' },
  ];

  ngOnInit(): void {
    this.loadActividades();
    this.loadCalendarios();
    this.loadTiposActividad();
    //this.getActividadByID(14);
    //this.cargarUsuario(9);
    //this.onSomeAction(2);
  }

  loadActividades(): void {
    this.loading = true;
    this.error = '';

    this.actividadesService.getActividades(this.filters).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.actividades = response.data.content;
          this.updatePagination(response.data);
          if (this.filters.page === 0) {
            this.toastr.success(
              response.mensaje || 'Actividades cargadas correctamente'
            );
          }
        } else {
          this.error = response.mensaje || 'Respuesta inesperada del servidor';
          this.toastr.warning(this.error);
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Error al cargar actividades';
        this.toastr.error('Error al cargar actividades', this.error);
        this.loading = false;
        this.actividades = [];
      },
    });
  }

  // Método para cargar calendarios en el dropdown
  async loadCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      this.calendariosDropdown =
        await this.calendarioHelper.getAllForDropdown();
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar la lista de calendarios');
      this.calendariosDropdown = [];
    } finally {
      this.loadingCalendarios = false;
    }
  }

  // Método para cargar tipos de actividad en el dropdown
  async loadTiposActividad(): Promise<void> {
    try {
      this.loadingTiposActividad = true;
      this.tiposActividadDropdown =
        await this.tiposActividadHelper.getAllForDropdown();
    } catch (error) {
      console.error('Error al cargar tipos de actividad:', error);
      this.toastr.error('Error al cargar la lista de tipos de actividad');
      this.tiposActividadDropdown = [];
    } finally {
      this.loadingTiposActividad = false;
    }
  }

  // FILTROS PARA CARGAR LA LISTA DE ACTIVIDADES

  aplicarFiltros(): void {
    this.filters.page = 0;
    this.loadActividades();
  }

  limpiarFiltros(): void {
    this.filters = {
      page: 0,
      size: this.filters.size,
      oidCalendario: '',
      oidTipoActividad: '',
      oidEstadoActividad: '', //validar la asignación
      fechaCreacionDesde: '',
      searchTerm: '',
    };
    this.loadActividades();
  }

  // MODALES

  // Método par abrir el modal de vista detallada
  abrirModalDetalles(actividad: ActividadResponse): void {
    this.actividadSeleccionada = actividad;
    this.mostrarModalDetalles = true;
  }

  // Método para cerrar el modal de vista detallada
  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.actividadSeleccionada = null;
  }

  // Método para abrir el modal de usuarios
  abrirModalUsuarios(usuarios: any[]): void {
    this.usuariosSeleccionados = usuarios.map((u) => u.oidUsuario);
    this.mostrarModalUsuarios = true;
  }

  // Método para cerrar el modal de usuarios
  cerrarModalUsuarios(): void {
    this.mostrarModalUsuarios = false;
    this.usuariosSeleccionados = [];
  }

  // PAGINACIÓN
  onPageChange(page: number): void {
    if (page >= 0 && page < this.pagination.totalPages) {
      this.filters.page = page;
      this.loadActividades();
    }
  }

  onPageSizeChange(): void {
    this.filters.page = 0;
    this.loadActividades();
  }

  private updatePagination(data: any): void {
    this.pagination = {
      ...this.pagination,
      currentPage: data.number,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      pageSize: data.size,
    };
  }

  getPaginasVisibles(): number[] {
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.currentPage;
    const visiblePages: number[] = [];

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  getInfoPaginacion(): string {
    const start = this.pagination.currentPage * this.pagination.pageSize + 1;
    const end = Math.min(
      (this.pagination.currentPage + 1) * this.pagination.pageSize,
      this.pagination.totalElements
    );
    return `Mostrando ${start} - ${end} de ${this.pagination.totalElements} registros`;
  }

  // UTILIDADES

  trackByOid(index: number, item: ActividadResponse): number {
    return item.actividad.oidActividad;
  }

  // Método para obtener el badge class del estado del calendario
  getCalendarioEstadoBadgeClass(estado: EstadoCalendario): string {
    switch (estado) {
      case 'ACTIVO':
        return 'text-success';
      case 'DESHABILITADO':
        return 'text-danger';
      case 'PENDIENTE':
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  }

  // Método para obetener el estado de una actividad según su ID
  getEstadoNombre(oidEstado: number): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.nombre : 'DESCONOCIDO';
  }

  // Método para aplicar estilos según el estado de una actividad
  getEstadoBadgeClass(oidEstado: number): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.class : 'bg-secondary';
  }

  getUsersTooltip(usuarios: any[]): string {
    if (usuarios.length === 0) return 'Sin usuarios';
    return usuarios.map((u) => `${u.nombres} ${u.apellidos}`).join(', ');
  }
}
