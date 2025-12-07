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
import { CalendarioHelperService } from '../../../../academic-calendar-management/services/calendario/calendario-helper.service';
import { TiposActividadHelperService } from '../../../services/tiposActividades/tipos-actividad-helper.service';
import { ToastrService } from 'ngx-toastr';
import {
  ActividadFilters,
  PaginationConfig,
  DEFAULT_PAGINATION_CONFIG,
  ActividadResponse,
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';
import { EstadoCalendario } from '../../../../academic-calendar-management/models';
import { ModalDetalleActividadComponent } from '../modal-detalle-actividad/modal-detalle-actividad.component';
import { ModalUsuariosComponent } from '../modal-usuarios/modal-usuarios.component';
import { UserData } from '../../../../auth/models';
import {
  getUserData,
  getUserDepartmentId,
  isUserDataAvailable,
} from '../../../../auth/utils/user-storage.utils';
import { UsuariosConActividadesHelperService } from '../../../../sgd-users-management/services';
import { UsuariosConActividadesFilters } from '../../../../sgd-users-management/models';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  actualizarPaginacion,
  ESTADOS_ACTIVIDAD,
  ESTADOS_ACTIVIDAD_FILTRO,
  getEstadoBadgeClass,
  getEstadoNombre,
  getInfoPaginacion,
  getPaginasVisibles,
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
  trackByOidActividad,
} from '../../../utils/actividad-utils';
import { forkJoin, from } from 'rxjs';

@Component({
  selector: 'app-tabla-actividades-academicas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalDetalleActividadComponent,
    ModalUsuariosComponent,
    NgSelectModule,
  ],
  templateUrl: './tabla-actividades-academicas.component.html',
  styleUrl: './tabla-actividades-academicas.component.css',
})
export class TablaActividadesAcademicasComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<ActividadResponse>();
  @Output() onEliminar = new EventEmitter<ActividadResponse>();

  private actividadesService = inject(ActividadesService);
  private calendarioHelper = inject(CalendarioHelperService);
  private tiposActividadHelper = inject(TiposActividadHelperService);
  private usuariosConActividadesHelper = inject(
    UsuariosConActividadesHelperService
  );
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

  // Lista de calendarios para el dropdown filtro calendarios
  calendariosDropdown: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];
  loadingCalendarios = false;

  // Lista de tipos de actividad para el dropdown
  tiposActividadDropdown: { value: number | string; label: string }[] = [];
  loadingTiposActividad = false;

  // Lista de usuarios para el dropdown filtro responsables
  usuariosDropdown: { value: number | string; label: string }[] = [];
  loadingUsuarios = false;

  filtroResponsable: string = '';

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

  readonly estados = ESTADOS_ACTIVIDAD;
  readonly estadosDropdown = ESTADOS_ACTIVIDAD_FILTRO;

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarFiltrosIniciales();
  }

  /**
   * Carga todos los filtros en paralelo para mejorar el rendimiento
   */
  private cargarFiltrosIniciales(): void {
    // Convertir las Promises a Observables
    const cargaCalendarios$ = from(this.loadCalendarios());
    const cargaTipos$ = from(this.loadTiposActividad());

    // Ejecutar en paralelo
    forkJoin({
      calendarios: cargaCalendarios$,
      tipos: cargaTipos$,
    }).subscribe({
      next: () => {
        console.log('Filtros de calendarios y tipos cargados correctamente');

        // Cargar usuarios solo si hay departamento
        if (this.filters.oidDepartamento) {
          this.loadUsuarios();
        }
      },
      error: (error) => {
        console.error('Error cargando filtros iniciales:', error);
        this.toastr.error(
          'Error al cargar los filtros. Intente recargar la página.'
        );
      },
    });
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
      this.filters.oidDepartamento = oidDepartamento;
      this.usuario = getUserData();
      console.log('oidDepartamento obtenido:', oidDepartamento);
    } else {
      this.toastr.warning('No se pudo obtener el departamento del usuario');
    }
  }

  // loadActividades con validación obligatoria
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

    const filtrosCompletos = {
      ...this.filters,
      ...(this.filtroResponsable
        ? { oidUsuarioResponsable: this.filtroResponsable }
        : {}),
    };

    console.log('Filtros enviados al servicio:', filtrosCompletos);

    this.actividadesService.getActividades(filtrosCompletos).subscribe({
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

  // Método para cargar calendarios en el dropdown
  async loadCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      const calendariosCompletos =
        await this.calendarioHelper.getAllForDropdown();

      // Filtrar para excluir calendarios con estado DESHABILITADO
      const calendariosFiltrados = calendariosCompletos.filter(
        (calendario) => calendario.estado !== 'DESHABILITADO'
      );

      // Ordenar calendarios por año (de mayor a menor)
      this.calendariosDropdown =
        ordenarCalendariosPorAnio(calendariosFiltrados);

      // Seleccionar automáticamente el calendario ACTIVO más reciente
      this.filters.oidCalendario = seleccionarCalendarioAutomatico(
        this.calendariosDropdown
      );

      // Cargar actividades automáticamente si ya tenemos departamento
      if (this.filters.oidCalendario && this.filters.oidDepartamento) {
        this.loadActividades();
      }
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar la lista de calendarios');
      this.calendariosDropdown = [];
    } finally {
      this.loadingCalendarios = false;
    }
  }

  /**
   * Carga los usuarios con actividades del departamento para el dropdown
   */
  async loadUsuarios(): Promise<void> {
    try {
      this.loadingUsuarios = true;

      const oidDepartamento = this.filters.oidDepartamento;

      if (!oidDepartamento) {
        console.warn('No se puede cargar usuarios: falta oidDepartamento');
        this.usuariosDropdown = [];
        return;
      }

      const filtros: UsuariosConActividadesFilters = {
        oidDepartamento,
        filtro: 'NO_DOCENCIA', //Ajustar este visaje
      };

      const usuariosDepartamento =
        await this.usuariosConActividadesHelper.getAll(filtros);

      const usuariosMapeados = usuariosDepartamento.map((ud) => ({
        value: ud.usuario.oidUsuario,
        label: `${ud.usuario.nombres} ${ud.usuario.apellidos}`.trim(),
      }));

      // Agregar opción "Todos los responsables" al inicio
      this.usuariosDropdown = [
        { value: '', label: 'TODOS' },
        ...usuariosMapeados,
      ];

      console.log(`Usuarios cargados: ${this.usuariosDropdown.length}`);
    } catch (error) {
      console.error('Error al cargar usuarios del departamento:', error);
      this.toastr.error('Error al cargar la lista de usuarios responsables');
      this.usuariosDropdown = [];
    } finally {
      this.loadingUsuarios = false;
    }
  }

  // Método para cargar tipos de actividad en el dropdown
  async loadTiposActividad(): Promise<void> {
    try {
      this.loadingTiposActividad = true;
      const tiposCompletos =
        await this.tiposActividadHelper.getAllForDropdown();

      // Filtrar para excluir el tipo con oid = 9
      const tiposFiltrados = tiposCompletos.filter((tipo) => tipo.value !== 9);

      // Agregar opción "Todos los tipos" al inicio
      this.tiposActividadDropdown = [
        { value: '', label: 'TODAS' },
        ...tiposFiltrados,
      ];
    } catch (error) {
      console.error('Error al cargar tipos de actividad:', error);
      this.toastr.error('Error al cargar la lista de tipos de actividad');
      this.tiposActividadDropdown = [];
    } finally {
      this.loadingTiposActividad = false;
    }
  }

  eliminarActividad(actividadData: ActividadResponse): void {
    this.onEliminar.emit(actividadData);
  }

  editarActividad(actividadData: ActividadResponse): void {
    this.onEditar.emit(actividadData);
  }

  // FILTROS PARA CARGAR LA LISTA DE ACTIVIDADES

  aplicarFiltros(): void {
    this.filters.page = 0;
    this.loadActividades();
  }

  limpiarFiltros(): void {
    const oidDepartamento = this.filters.oidDepartamento;

    this.filters = {
      page: 0,
      size: this.filters.size,
      oidCalendario: '',
      oidTipoActividad: '',
      oidEstadoActividad: '',
      fechaCreacionDesde: '',
      searchTerm: '',
      oidDepartamento: oidDepartamento,
    };

    // Limpiar filtro local de responsable
    this.filtroResponsable = '';

    // Restablecer el calendario al valor por defecto (ACTIVO más reciente)
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendariosDropdown
    );

    //this.actividades = [];
  }

  // MODALES

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

  /**
   * Maneja la desasignación de un usuario y recarga la tabla
   */
  onUsuarioDesasignadoHandler(): void {
    console.log('Usuario desasignado, recargando tabla...');
    this.loadActividades();
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

  // ========== MÉTODOS PARA TEMPLATE ==========

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
    return getEstadoNombre(oidEstado, this.estados);
  }

  getEstadoBadgeClass(oidEstado: number): string {
    return getEstadoBadgeClass(oidEstado, this.estados);
  }
}
