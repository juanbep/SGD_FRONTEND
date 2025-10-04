import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadesService } from '../../services/actividades/actividades.service';
import {
  ActividadFilters,
  PaginationConfig,
  DEFAULT_PAGINATION_CONFIG,
  ActividadResponse,
} from '../../models';
import { Usuario } from '../../../users-roles-management/models';
import { ToastrService } from 'ngx-toastr';
import { ActividadHelperService } from '../../services/actividades/actividad-helper.service';
import { CalendarioHelperService } from '../../../academic-calendar-management/services/calendario/calendario-helper.service';
import { EstadoCalendario } from '../../../academic-calendar-management/models';
import { TiposActividadHelperService } from '../../services/tiposActividades/tipos-actividad-helper.service';
import { UsuarioHelperService } from '../../../users-roles-management/services/users/usuario-helper.service';
import { UsuarioCarouselComponent } from '../../components/activities-component/explore-activities-component/usuario-carrousel/usuario-carousel/usuario-carousel.component';

@Component({
  selector: 'app-view-activities-component',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuarioCarouselComponent],
  templateUrl: './view-activities-component.component.html',
  styleUrl: './view-activities-component.component.css',
})
export class ViewActivitiesComponentComponent implements OnInit {
  private actividadesService = inject(ActividadesService);
  private actividadHelper = inject(ActividadHelperService);
  private calendarioHelper = inject(CalendarioHelperService);
  private usuarioHelper = inject(UsuarioHelperService);
  private tiposActividadHelper = inject(TiposActividadHelperService);

  private toastr = inject(ToastrService);
  usuario: Usuario | null = null;

  actividades: ActividadResponse[] = [];
  actividadData!: ActividadResponse;
  loading = false;
  error: string = '';
  pagination: PaginationConfig = { ...DEFAULT_PAGINATION_CONFIG };
  actividadSeleccionada: ActividadResponse | null = null;

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

  // Variables para el modal de usuarios
  usuariosSeleccionados: number[] = [];
  mostrarModalUsuarios: boolean = false;

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

  // Estados disponibles
  estados = [
    { oid: 1, nombre: 'ACTIVA', class: 'bg-success' },
    { oid: 2, nombre: 'INACTIVA', class: 'bg-danger' },
    { oid: 3, nombre: 'INCOMPLETA', class: 'bg-warning' },
  ];

  ngOnInit(): void {
    this.loadActividades();
    this.loadCalendarios();
    this.loadTiposActividad();
    this.getActividadByID(14);
    //this.cargarUsuario(9);
    //this.onSomeAction(2);
  }

  getUsuariosIds(usuarios: any[]): number[] {
    return usuarios.map((u) => u.oidUsuario);
  }

  // Método para cargar la información de un Usuario por ID
  async cargarUsuario(usuarioId: number): Promise<void> {
    // Uso básico del getById
    this.usuario = await this.usuarioHelper.getById(usuarioId);

    if (this.usuario) {
      console.log('Usuario cargado:', this.usuario);
    } else {
      console.log('Usuario no encontrado');
    }
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

  getActividadByID(idActividad: number): void {
    this.loading = true;
    this.error = '';

    this.actividadesService.getActividadById(idActividad).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.actividadData = response.data;
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

  trackByOid(index: number, item: ActividadResponse): number {
    return item.actividad.oidActividad;
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

  // Métodos para estados
  getEstadoNombre(oidEstado: number): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.nombre : 'DESCONOCIDO';
  }

  getEstadoBadgeClass(oidEstado: number): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.class : 'bg-secondary';
  }

  // Métodos para paginación visual
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

  // Métodos para detalles
  verDetalles(actividad: ActividadResponse): void {
    this.actividadSeleccionada = actividad;
  }

  cerrarDetalles(): void {
    this.actividadSeleccionada = null;
  }

  getUsersTooltip(usuarios: any[]): string {
    if (usuarios.length === 0) return 'Sin usuarios';
    return usuarios.map((u) => `${u.nombres} ${u.apellidos}`).join(', ');
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

  // Métodos helper
  async onSomeAction(actividadId: number): Promise<void> {
    const actividad = await this.actividadHelper.getById(actividadId);

    if (actividad) {
      console.log(actividad);

      const nombre = await this.actividadHelper.getActividadNombre(actividadId);
      const tipo = await this.actividadHelper.getActividadTipo(actividadId);

      console.log(`${nombre} - ${tipo}`);
    }
  }

  async checkIfExists(id: number): Promise<boolean> {
    return this.actividadHelper.checkActividadExists(id);
  }
}
