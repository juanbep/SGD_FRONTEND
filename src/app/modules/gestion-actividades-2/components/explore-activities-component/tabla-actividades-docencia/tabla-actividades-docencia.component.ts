import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActividadesService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import {
  ActividadDocenciaFilters,
  ActividadResponse,
  DEFAULT_PAGINATION_CONFIG,
  PaginationConfig,
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';
import {
  actualizarPaginacion,
  getEstadoBadgeClass,
  getEstadoNombre,
  getInfoPaginacion,
  getPaginasVisibles,
  trackByOidActividad,
} from '../../../utils/actividad-utils';
import {
  getUserData,
  getUserDepartmentId,
  getUserRoles,
  isUserDataAvailable,
} from '../../../../auth/utils/user-storage.utils';
import { UserData } from '../../../../auth/models';
import { ModalUsuariosComponent } from '../modal-usuarios/modal-usuarios.component';
import { ModalDetalleActividadComponent } from '../modal-detalle-actividad/modal-detalle-actividad.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ActividadDocenciaResponse } from '../../../models/actividad-docencia-response.model';
import { FiltrosDocenciaComponent } from '../filtros-base/filtros-docencia/filtros-docencia.component';

@Component({
  selector: 'app-tabla-actividades-docencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ModalDetalleActividadComponent,
    FiltrosDocenciaComponent,
    NgbPopoverModule,
  ],
  templateUrl: './tabla-actividades-docencia.component.html',
  styleUrl: './tabla-actividades-docencia.component.css',
})
export class TablaActividadesDocenciaComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<ActividadResponse>();
  @Output() onEliminar = new EventEmitter<ActividadResponse>();

  private actividadesService = inject(ActividadesService);
  private toastr = inject(ToastrService);

  usuario: UserData | null = null;
  rolEspecial: boolean = false;

  actividades: ActividadDocenciaResponse[] = [];
  loading: boolean = false;
  error: string = '';
  pagination: PaginationConfig = { ...DEFAULT_PAGINATION_CONFIG };

  // ========== CONTROL DE MODALES ==========
  actividadSeleccionada: ActividadDocenciaResponse | null = null;
  mostrarModalDetalles: boolean = false;
  mostrarModalUsuarios: boolean = false;
  usuariosSeleccionados: UsuarioActividadAsignacion[] = [];

  usuariosAsignaciones: UsuarioActividadAsignacion[] = [];
  usuariosCompletos: UsuarioEnActividad[] = [];

  oidActividadParaUsuarios: number | null = null;
  oidCalendarioParaUsuarios: number | null = null;

  // ========== FILTROS ESPECÍFICOS DE DOCENCIA ==========
  filters: ActividadDocenciaFilters = {
    page: 0,
    size: 5,
    oidCalendario: '',
    oidDepartamento: undefined,
    tipoContratacion: '',
    semestre: '',
  };

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  // ========== CARGA LOS DATOS DEL USUARIO DESDE LOCALSTORAGE ==========
  cargarDatosUsuario(): void {
    if (!isUserDataAvailable()) {
      this.toastr.error(
        'No se encontró información del usuario. Por favor, inicie sesión nuevamente.',
      );
      return;
    }

    // Verificar si tiene roles especiales
    this.rolEspecial = this.verificarRolesEspeciales();

    const oidDepartamento = getUserDepartmentId();

    if (oidDepartamento) {
      this.filters.oidDepartamento =
        typeof oidDepartamento === 'string'
          ? parseInt(oidDepartamento, 10)
          : oidDepartamento;

      this.usuario = getUserData();
    } else if (!this.rolEspecial) {
      // Solo mostrar warning si NO es un rol especial
      // this.toastr.warning('No se pudo obtener el departamento del usuario');
    }

    this.usuario = getUserData();
  }

  private verificarRolesEspeciales(): boolean {
    if (!isUserDataAvailable()) {
      return false;
    }

    const roles = getUserRoles();
    const rolesEspeciales = [
      'SECRETARIA/O FACULTAD',
      'SECRETARIO',
      'SECRETARIA',
      'DECANO',
    ];

    return roles.some((rol) => rolesEspeciales.includes(rol));
  }

  // ========== CARGAR ACTIVIDADES DE DOCENCIA ==========
  loadActividades(): void {
    if (!this.filters.oidCalendario) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.rolEspecial && !this.filters.oidDepartamento) {
      this.toastr.error('No se pudo obtener el departamento del usuario');
      return;
    }

    this.loading = true;
    this.error = '';

    this.actividadesService.getActividadesDocencia(this.filters).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.actividades = response.data.content;
          this.pagination = actualizarPaginacion(
            this.pagination,
            response.data,
          );

          // Validar si no se encontraron actividades
          if (this.actividades.length === 0) {
            this.toastr.info('No se encontraron actividades de docencia');
          }

          if (this.filters.page === 0) {
            // this.toastr.success(
            //   response.mensaje ||
            //     'Actividades de docencia cargadas correctamente',
            // );
          }
        } else {
          this.error = response.mensaje || 'Respuesta inesperada del servidor';
          this.toastr.warning(this.error);
        }
        this.loading = false;
      },
      error: (error) => {
        const mensajeBackend =
          error.error?.mensaje ||
          error.message ||
          'Error al cargar actividades de docencia';
        this.error = mensajeBackend;
        this.toastr.error(mensajeBackend);
        this.loading = false;
        this.actividades = [];
      },
    });
  }

  // ========== FILTROS ==========
  aplicarFiltros(filtros: ActividadDocenciaFilters): void {
    this.filters = { ...filtros, page: 0, size: this.filters.size };
    this.loadActividades();
  }

  limpiarFiltros(): void {
    this.actividades = [];
  }

  // ========== MODALES ==========
  abrirModalDetalles(actividad: ActividadDocenciaResponse): void {
    this.actividadSeleccionada = actividad;
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.actividadSeleccionada = null;
  }

  // ========== PAGINACIÓN ==========
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

  // ========== MÉTODOS TEMPLATE ==========
  getPaginasVisibles(): number[] {
    return getPaginasVisibles(
      this.pagination.currentPage,
      this.pagination.totalPages,
    );
  }

  getInfoPaginacion(): string {
    return getInfoPaginacion(this.pagination);
  }

  trackByOid(index: number, item: ActividadDocenciaResponse): number {
    return item?.actividad?.oidActividad ?? index;
  }

  getEstadoNombre(oidEstado: number): string {
    return getEstadoNombre(oidEstado);
  }

  getEstadoBadgeClass(oidEstado: number): string {
    return getEstadoBadgeClass(oidEstado);
  }

  // ===== MÉTODOS PARA DOCENTE ASIGNADO =====

  /**
   * Obtiene el nombre del docente asignado
   */
  getNombreDocente(actividadData: ActividadDocenciaResponse): string {
    return actividadData.asignacion?.nombreDocente || 'Sin asignar';
  }

  /**
   * Verifica si hay docente asignado
   */
  tieneDocenteAsignado(actividadData: ActividadDocenciaResponse): boolean {
    return !!actividadData.asignacion?.nombreDocente;
  }

  /**
   * Calcula el total de horas docencia
   */
  getTotalHorasDocencia(actividadData: ActividadDocenciaResponse): number {
    const horas = actividadData.asignacion?.horasDocencia || 0;
    const semanas = actividadData.asignacion?.semanasDocencia || 0;
    return horas * semanas;
  }

  /**
   * Calcula el total de horas preparación
   */
  getTotalHorasPreparacion(actividadData: ActividadDocenciaResponse): number {
    const horas = actividadData.asignacion?.horasPreparacion || 0;
    const semanas = actividadData.asignacion?.semanasPreparacion || 0;
    return horas * semanas;
  }

  /**
   * Calcula el total de horas (docencia + preparación)
   */
  getTotalHoras(actividadData: ActividadDocenciaResponse): number {
    return (
      this.getTotalHorasDocencia(actividadData) +
      this.getTotalHorasPreparacion(actividadData)
    );
  }
}
