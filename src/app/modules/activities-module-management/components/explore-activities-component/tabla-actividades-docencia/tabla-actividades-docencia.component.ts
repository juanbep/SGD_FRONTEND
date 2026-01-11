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
  isUserDataAvailable,
} from '../../../../auth/utils/user-storage.utils';
import { UserData } from '../../../../auth/models';
import { ModalUsuariosComponent } from '../modal-usuarios/modal-usuarios.component';
import { ModalDetalleActividadComponent } from '../modal-detalle-actividad/modal-detalle-actividad.component';
import { FiltrosDocenciaComponent } from '../filtros-docencia/filtros-docencia.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ActividadDocenciaResponse } from '../../../models/actividad-docencia-response.model';

@Component({
  selector: 'app-tabla-actividades-docencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ModalUsuariosComponent,
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
    size: 10,
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
        'No se encontró información del usuario. Por favor, inicie sesión nuevamente.'
      );
      return;
    }

    const oidDepartamento = getUserDepartmentId();

    if (oidDepartamento) {
      // Asegurar que SIEMPRE sea número
      this.filters.oidDepartamento =
        typeof oidDepartamento === 'string'
          ? parseInt(oidDepartamento, 10)
          : oidDepartamento;

      this.usuario = getUserData();
    } else {
      this.toastr.warning('No se pudo obtener el departamento del usuario');
    }
  }

  // ========== CARGAR ACTIVIDADES DE DOCENCIA ==========
  loadActividades(): void {
    if (!this.filters.oidCalendario) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.filters.oidDepartamento) {
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
            response.data
          );
          if (this.filters.page === 0) {
            this.toastr.success(
              response.mensaje ||
                'Actividades de docencia cargadas correctamente'
            );
          }
        } else {
          this.error = response.mensaje || 'Respuesta inesperada del servidor';
          this.toastr.warning(this.error);
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Error al cargar actividades de docencia';
        this.toastr.error(
          'Error al cargar actividades de docencia',
          this.error
        );
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
      this.pagination.totalPages
    );
  }

  getInfoPaginacion(): string {
    return getInfoPaginacion(this.pagination);
  }

  trackByOid(index: number, item: ActividadResponse): number {
    return trackByOidActividad(index, item);
  }

  getEstadoNombre(oidEstado: number): string {
    return getEstadoNombre(oidEstado);
  }

  getEstadoBadgeClass(oidEstado: number): string {
    return getEstadoBadgeClass(oidEstado);
  }

  getNombreDocente(actividadData: ActividadDocenciaResponse): string {
    return actividadData.asignacion?.nombreDocente || 'Sin asignar';
  }

  tieneDocenteAsignado(actividadData: ActividadDocenciaResponse): boolean {
    return !!actividadData.asignacion?.nombreDocente;
  }
}
