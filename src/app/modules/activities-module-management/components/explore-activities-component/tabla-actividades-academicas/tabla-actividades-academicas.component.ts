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
import { ActividadesService } from '../../../services/actividades/actividades.service';
import { ToastrService } from 'ngx-toastr';
import {
  ActividadFilters,
  PaginationConfig,
  DEFAULT_PAGINATION_CONFIG,
  ActividadResponse,
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';
import { ModalDetalleActividadComponent } from '../modal-detalle-actividad/modal-detalle-actividad.component';
import { ModalUsuariosComponent } from '../modal-usuarios/modal-usuarios.component';
import { UserData } from '../../../../auth/models';
import {
  getUserData,
  getUserDepartmentId,
  isUserDataAvailable,
} from '../../../../auth/utils/user-storage.utils';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  actualizarPaginacion,
  ESTADOS_ACTIVIDAD,
  getEstadoBadgeClass,
  getEstadoNombre,
  getInfoPaginacion,
  getPaginasVisibles,
  trackByOidActividad,
} from '../../../utils/actividad-utils';
import { FiltrosActividadesComponent } from '../filtros-actividades/filtros-actividades.component';

@Component({
  selector: 'app-tabla-actividades-academicas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalDetalleActividadComponent,
    ModalUsuariosComponent,
    NgSelectModule,
    FiltrosActividadesComponent,
  ],
  templateUrl: './tabla-actividades-academicas.component.html',
  styleUrl: './tabla-actividades-academicas.component.css',
})
export class TablaActividadesAcademicasComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<ActividadResponse>();
  @Output() onEliminar = new EventEmitter<ActividadResponse>();

  private actividadesService = inject(ActividadesService);
  private toastr = inject(ToastrService);

  usuario: UserData | null = null;

  actividades: ActividadResponse[] = [];
  loading: boolean = false;
  error: string = '';
  pagination: PaginationConfig = { ...DEFAULT_PAGINATION_CONFIG };

  // Modales
  actividadSeleccionada: ActividadResponse | null = null;
  mostrarModalDetalles: boolean = false;
  mostrarModalUsuarios: boolean = false;
  usuariosSeleccionados: UsuarioActividadAsignacion[] = [];

  usuariosAsignaciones: UsuarioActividadAsignacion[] = [];
  usuariosCompletos: UsuarioEnActividad[] = [];

  oidActividadParaUsuarios: number | null = null;
  oidCalendarioParaUsuarios: number | null = null;

  // Filtros y paginación - oidCalendario y oidDepartamento son obligatorios
  filters: ActividadFilters = {
    page: 0,
    size: 10,
    searchTerm: '',
    oidEstadoActividad: '',
    oidCalendario: '',
    oidDepartamento: undefined,
    oidTipoActividad: '',
    fechaCreacionDesde: '',
  };

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  // Método para cargar datos del usuario desde localStorage
  cargarDatosUsuario(): void {
    if (!isUserDataAvailable()) {
      this.toastr.error(
        'No se encontró información del usuario. Por favor, inicie sesión nuevamente.'
      );
      return;
    }

    const oidDepartamento = getUserDepartmentId();

    if (oidDepartamento) {
      // Asegurar que sea número (normalizar el tipo)
      this.filters.oidDepartamento =
        typeof oidDepartamento === 'string'
          ? parseInt(oidDepartamento, 10)
          : oidDepartamento;

      this.usuario = getUserData();
      console.log('oidDepartamento obtenido:', this.filters.oidDepartamento);
    } else {
      this.toastr.warning('No se pudo obtener el departamento del usuario');
    }
  }

  // ========== CARGAR ACTIVIDADES CON VALIDACIÓN OBLIGATORIA ==========

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

    console.log('Filtros enviados al servicio:', this.filters);

    this.actividadesService.getActividades(this.filters).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.actividades = response.data.content;
          this.pagination = actualizarPaginacion(
            this.pagination,
            response.data
          );
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

  eliminarActividad(actividadData: ActividadResponse): void {
    this.onEliminar.emit(actividadData);
  }

  editarActividad(actividadData: ActividadResponse): void {
    this.onEditar.emit(actividadData);
  }

  // ========== FILTROS PARA CARGAR LA LISTA DE ACTIVIDADES ==========

  aplicarFiltros(filtros: ActividadFilters): void {
    this.filters = { ...filtros, page: 0 };
    this.loadActividades();
  }

  limpiarFiltros(): void {
    this.actividades = [];
  }

  // ========== MODALES ==========

  abrirModalDetalles(actividad: ActividadResponse): void {
    this.actividadSeleccionada = actividad;
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.actividadSeleccionada = null;
  }

  abrirModalUsuarios(actividadData: ActividadResponse): void {
    this.usuariosAsignaciones = actividadData.usuariosActividad;
    this.usuariosCompletos = actividadData.usuarios;
    this.oidActividadParaUsuarios = actividadData.actividad.oidActividad;
    this.oidCalendarioParaUsuarios = actividadData.oidCalendario;
    this.mostrarModalUsuarios = true;
  }

  cerrarModalUsuarios(): void {
    this.mostrarModalUsuarios = false;
    this.usuariosAsignaciones = [];
    this.usuariosCompletos = [];
    this.oidActividadParaUsuarios = null;
    this.oidCalendarioParaUsuarios = null;
  }

  // ========== MANEJA LA DESASIGNACIÓN DE UN USUARIO ==========

  onUsuarioDesasignadoHandler(): void {
    console.log('Usuario desasignado, recargando tabla...');
    this.loadActividades();
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
}
