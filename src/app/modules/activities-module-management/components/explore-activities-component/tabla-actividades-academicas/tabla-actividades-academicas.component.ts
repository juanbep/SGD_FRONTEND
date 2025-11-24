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
import { UsuarioHelperService } from '../../../../sgd-users-management//services/users/usuario-helper.service';
import { TiposActividadHelperService } from '../../../services/tiposActividades/tipos-actividad-helper.service';
import { ToastrService } from 'ngx-toastr';
import {
  ActividadFilters,
  PaginationConfig,
  DEFAULT_PAGINATION_CONFIG,
  ActividadResponse,
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
  usuariosSeleccionados: number[] = [];

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

  // Estados de las actividades
  estados = [
    { oid: 1, nombre: 'ACTIVA', class: 'bg-success' },
    { oid: 2, nombre: 'INACTIVA', class: 'bg-danger' },
    { oid: 3, nombre: 'INCOMPLETA', class: 'bg-warning' },
  ];

  // Dropdown de estados para ng-select
  estadosDropdown: { value: number | string; label: string }[] = [
    { value: '', label: 'TODOS' },
    { value: 1, label: 'ACTIVA' },
    { value: 2, label: 'INACTIVA' },
    { value: 3, label: 'INCOMPLETA' },
  ];

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.loadCalendarios();
    this.loadTiposActividad();

    // Cargar usuarios solo si se obtuvo el departamento
    if (this.filters.oidDepartamento) {
      this.loadUsuarios();
    }
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
      const calendariosCompletos =
        await this.calendarioHelper.getAllForDropdown();

      // Filtrar para excluir calendarios con estado DESHABILITADO
      const calendariosFiltrados = calendariosCompletos.filter(
        (calendario) => calendario.estado !== 'DESHABILITADO'
      );

      // Ordenar calendarios por año (de mayor a menor)
      this.calendariosDropdown =
        this.ordenarCalendariosPorAnio(calendariosFiltrados);

      // Seleccionar automáticamente el calendario más reciente
      if (this.calendariosDropdown.length > 0) {
        this.filters.oidCalendario = this.calendariosDropdown[0].value;
        console.log(
          'Calendario seleccionado automáticamente:',
          this.calendariosDropdown[0].label
        );

        // Cargar actividades automáticamente si ya tenemos departamento
        if (this.filters.oidDepartamento) {
          this.loadActividades();
        }
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
        filtro: 'DOCENCIA',
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

  /**
   * Función para ordenar calendarios por año (de mayor a menor)
   * Extrae el año del label y ordena descendentemente
   * @param calendarios - Array de calendarios a ordenar
   * @returns Array ordenado por año descendente
   */
  private ordenarCalendariosPorAnio(
    calendarios: { value: number; label: string; estado: EstadoCalendario }[]
  ): { value: number; label: string; estado: EstadoCalendario }[] {
    return calendarios.sort((a, b) => {
      // Extraer el año del label (asume formato como "Calendario 2025", "2025-A", etc.)
      const anioA = this.extraerAnioDeLabel(a.label);
      const anioB = this.extraerAnioDeLabel(b.label);

      // Ordenar de mayor a menor (descendente)
      return anioB - anioA;
    });
  }

  /**
   * Función auxiliar para extraer el año de un string
   * Busca el primer número de 4 dígitos en el label
   * @param label - String del que extraer el año
   * @returns Año encontrado o 0 si no se encuentra
   */
  private extraerAnioDeLabel(label: string): number {
    // Buscar un número de 4 dígitos (patrón de año)
    const match = label.match(/\b(20\d{2}|19\d{2})\b/);
    return match ? parseInt(match[0], 10) : 0;
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

  // FILTROS PARA CARGAR LA LISTA DE ACTIVIDADES

  aplicarFiltros(): void {
    this.filters.page = 0;
    this.loadActividades();
  }

  // limpiarFiltros modificado para mantener oidDepartamento
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

    this.actividades = [];
    this.toastr.info(
      'Filtros limpiados. Seleccione un calendario para buscar.'
    );
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

  abrirModalUsuarios(usuarios: any[]): void {
    this.usuariosSeleccionados = usuarios.map((u) => u.oidUsuario);
    this.mostrarModalUsuarios = true;
  }

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

  getEstadoNombre(oidEstado: number): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.nombre : 'DESCONOCIDO';
  }

  getEstadoBadgeClass(oidEstado: number): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.class : 'bg-secondary';
  }

  getUsersTooltip(usuarios: any[]): string {
    if (usuarios.length === 0) return 'Sin usuarios';
    return usuarios.map((u) => `${u.nombres} ${u.apellidos}`).join(', ');
  }
}
