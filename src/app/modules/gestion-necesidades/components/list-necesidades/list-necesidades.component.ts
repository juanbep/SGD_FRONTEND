import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NecesidadesService } from '../../services';
import { NecesidadFilters, NecesidadResponse } from '../../models';
import { getUserProgramaId } from '../../../auth/utils/user-storage.utils';
import { CalendarioHelperService } from '../../../academic-calendar-management/services';
import { EstadoCalendario } from '../../../academic-calendar-management/models';

@Component({
  selector: 'app-list-necesidades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './list-necesidades.component.html',
  styleUrl: './list-necesidades.component.css',
})
export class ListNecesidadesComponent implements OnInit {
  // ===== SERVICIOS =====
  private necesidadesService = inject(NecesidadesService);
  private calendarioHelper = inject(CalendarioHelperService);
  private toastr = inject(ToastrService);

  // ===== REFERENCIA AL INPUT FILE =====
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ===== OPCIONES DE FILTROS =====
  readonly semestresDisponibles: { value: number | string; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'NO_APLICA', label: 'No aplica' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
  ];

  readonly gruposDisponibles: { value: string; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
  ];

  readonly estadosDisponibles: { value: string; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'BORRADOR', label: 'BORRADOR' },
    { value: 'EN_REVISION_SECRETARIO', label: 'EN REVISIÓN SECRETARIO' },
    { value: 'EN_REVISION_JEFE', label: 'EN REVISIÓN JEFE' },
    { value: 'NO_ASIGNADA', label: 'NO ASIGNADA' },
    { value: 'ASIGNADA', label: 'ASIGNADA' },
  ];

  pageSizeOptions = [5, 10, 25, 50];

  // ===== CALENDARIOS =====
  calendarios: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];
  loadingCalendarios = false;

  // ===== FILTROS =====
  filtroCalendario: number | string = ''; // Cambiado a string para validación
  filtroOidPrograma: number = getUserProgramaId(); // TODO: Temporal - reemplazar con datos del usuario logueado
  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | string = 'TODOS';
  filtroGrupo: string = 'TODOS';
  filtroCupo: number | null = null;
  filtroEstado: string = 'TODOS';

  // ===== PAGINACIÓN Y ORDENAMIENTO =====
  page = 0;
  size = 10;
  totalElements = 0;
  sortField: string = 'oidNecesidad';
  sortDirection: 'asc' | 'desc' = 'desc';

  // ===== DATOS =====
  necesidades: NecesidadResponse[] = [];
  loading = false;
  error: string | null = null;

  // ===== ESTADOS PARA DESCARGA/CARGA =====
  descargando = false;
  cargandoArchivo = false;
  archivoSeleccionado: File | null = null;

  // ===== MODALES =====
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalCorrequisitos = false;
  necesidadSeleccionada: NecesidadResponse | null = null;

  Math = Math;

  ngOnInit(): void {
    this.cargarCalendarios();
  }

  // ===== CARGAR CALENDARIOS =====
  async cargarCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      const calendariosCompletos =
        await this.calendarioHelper.getAllForDropdown();

      // Filtrar calendarios deshabilitados
      const calendariosFiltrados = calendariosCompletos.filter(
        (calendario) => calendario.estado !== 'DESHABILITADO'
      );

      this.calendarios = this.ordenarCalendariosPorAnio(calendariosFiltrados);

      // Seleccionar automáticamente el calendario ACTIVO más reciente
      this.filtroCalendario = this.seleccionarCalendarioAutomatico(
        this.calendarios
      );

      // Cargar necesidades si hay calendario seleccionado
      if (this.filtroCalendario) {
        this.cargarNecesidades();
      }
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar la lista de calendarios');
      this.calendarios = [];
    } finally {
      this.loadingCalendarios = false;
    }
  }

  /**
   * Ordena calendarios por año (más reciente primero)
   */
  private ordenarCalendariosPorAnio(
    calendarios: {
      value: number;
      label: string;
      estado: EstadoCalendario;
    }[]
  ): { value: number; label: string; estado: EstadoCalendario }[] {
    return [...calendarios].sort((a, b) => {
      const anioA = parseInt(a.label.split('-')[0]);
      const anioB = parseInt(b.label.split('-')[0]);
      return anioB - anioA; // Orden descendente
    });
  }

  /**
   * Selecciona automáticamente el calendario ACTIVO más reciente
   */
  private seleccionarCalendarioAutomatico(
    calendarios: { value: number; label: string; estado: EstadoCalendario }[]
  ): number | string {
    if (calendarios.length === 0) {
      console.warn('No hay calendarios disponibles para seleccionar');
      return '';
    }

    // Buscar el primer calendario ACTIVO
    const calendarioActivo = calendarios.find(
      (calendario) => calendario.estado === 'ACTIVO'
    );

    if (calendarioActivo) {
      console.log('Calendario ACTIVO seleccionado:', calendarioActivo.label);
      return calendarioActivo.value;
    }

    // Si no hay ACTIVO, seleccionar el primero (más reciente)
    console.log('Calendario más reciente seleccionado:', calendarios[0].label);
    return calendarios[0].value;
  }

  onCalendarioChange(): void {
    this.page = 0;
    this.cargarNecesidades();
  }

  // ===== CARGAR NECESIDADES =====
  cargarNecesidades(mostrarToast: boolean = false): void {
    // Validar que hay calendario seleccionado
    if (!this.filtroCalendario) {
      this.toastr.warning('Debe seleccionar un calendario');
      this.necesidades = [];
      this.totalElements = 0;
      return;
    }

    this.loading = true;
    this.error = null;

    const filtros: NecesidadFilters = {
      page: this.page,
      size: this.size,
      oidCalendario: this.filtroCalendario,
      oidPrograma: this.filtroOidPrograma, // TODO: Temporal
      sort: `${this.sortField},${this.sortDirection}`,
    };

    // Filtros opcionales
    if (this.filtroEstado && this.filtroEstado !== 'TODOS') {
      filtros.estado = this.filtroEstado;
    }

    if (this.filtroSemestre && this.filtroSemestre !== 'TODOS') {
      filtros.semestreMateria = this.filtroSemestre;
    }

    if (this.filtroCodigo && this.filtroCodigo.trim()) {
      filtros.codigoMateria = this.filtroCodigo.trim();
    }

    if (this.filtroNombre && this.filtroNombre.trim()) {
      filtros.nombreMateria = this.filtroNombre.trim();
    }

    if (this.filtroOid && this.filtroOid.trim()) {
      filtros.idMateria = this.filtroOid.trim();
    }

    this.necesidadesService.getNecesidades(filtros).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.necesidades = response.data.content;
          this.totalElements = response.data.totalElements;

          if (mostrarToast) {
            if (this.totalElements > 0) {
              this.toastr.success(
                'Lista de necesidades actualizada correctamente'
              );
            } else {
              this.toastr.info(
                'No se encontraron necesidades para este calendario'
              );
            }
          }
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error, 'cargar necesidades');
        this.loading = false;
      },
    });
  }

  // ===== FILTROS =====
  buscarConFiltros(): void {
    this.page = 0;
    this.cargarNecesidades();
  }

  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = 'TODOS';
    this.filtroGrupo = 'TODOS';
    this.filtroCupo = null;
    this.filtroEstado = 'TODOS';
    this.page = 0;

    // Re-seleccionar el calendario activo
    this.filtroCalendario = this.seleccionarCalendarioAutomatico(
      this.calendarios
    );

    this.cargarNecesidades();
  }

  hasFiltrosActivos(): boolean {
    return (
      this.filtroOid !== '' ||
      this.filtroCodigo !== '' ||
      this.filtroNombre !== '' ||
      this.filtroSemestre !== 'TODOS' ||
      this.filtroGrupo !== 'TODOS' ||
      this.filtroCupo !== null ||
      this.filtroEstado !== 'TODOS'
    );
  }

  // ===== ORDENAMIENTO =====
  onSort(campo: string): void {
    if (this.sortField === campo) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = campo;
      this.sortDirection = 'asc';
    }
    this.page = 0;
    this.cargarNecesidades();
  }

  getSortIcon(campo: string): string {
    if (this.sortField !== campo) {
      return 'fas fa-sort text-muted';
    }
    return this.sortDirection === 'asc'
      ? 'fas fa-sort-up text-primary'
      : 'fas fa-sort-down text-primary';
  }

  // ===== PAGINACIÓN =====
  onPageSizeChange(): void {
    this.page = 0;
    this.cargarNecesidades();
  }

  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarNecesidades();
  }

  getTotalPaginas(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  getPaginasVisibles(): number[] {
    const totalPaginas = this.getTotalPaginas();
    if (totalPaginas <= 1) return [];

    const paginas: number[] = [];
    const inicio = Math.max(0, this.page - 2);
    const fin = Math.min(totalPaginas - 1, this.page + 2);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  getInfoPaginacion(): string {
    if (this.totalElements === 0) return '0 registros';

    const inicio = this.page * this.size + 1;
    const fin = Math.min((this.page + 1) * this.size, this.totalElements);

    return `${inicio} - ${fin} de ${this.totalElements} registros`;
  }

  trackByNecesidad(index: number, item: NecesidadResponse): any {
    return item.oidNecesidad || index;
  }

  // ===== ACCIONES =====
  crearNuevaNecesidad(): void {
    this.toastr.info('Crear necesidad - pendiente de implementar');
  }

  modificarNecesidad(necesidad: NecesidadResponse): void {
    this.toastr.info('Modificar necesidad - pendiente de implementar');
  }

  eliminarNecesidad(necesidad: NecesidadResponse): void {
    this.toastr.info('Eliminar necesidad - pendiente de implementar');
  }

  gestionarCorrequisitos(necesidad: NecesidadResponse): void {
    this.toastr.info('Gestionar correquisitos - pendiente de implementar');
  }

  // ===== DESCARGAR/CARGAR PLANILLA =====
  descargarPlanilla(): void {
    this.toastr.info('Descargar planilla - pendiente de implementar');
  }

  cargarPlanilla(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.toastr.info('Cargar planilla - pendiente de implementar');
    input.value = '';
  }

  // ===== UTILIDADES =====
  getBadgeClassEstado(estado: string): string {
    const clases: Record<string, string> = {
      BORRADOR: 'bg-secondary',
      EN_REVISION_SECRETARIO: 'bg-warning',
      EN_REVISION_JEFE: 'bg-info',
      NO_ASIGNADA: 'bg-primary',
      ASIGNADA: 'bg-success',
    };
    return clases[estado] || 'bg-secondary';
  }

  reintentar(): void {
    this.cargarNecesidades(true);
  }

  private handleError(error: any, operacion: string): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      `Error al ${operacion}. Intenta de nuevo.`;

    this.error = `Status Code: ${codigoBackend} - ${mensajeBackend}`;

    this.toastr.error(
      `Status Code: ${codigoBackend} - ${mensajeBackend}`,
      'Error'
    );
  }
}
