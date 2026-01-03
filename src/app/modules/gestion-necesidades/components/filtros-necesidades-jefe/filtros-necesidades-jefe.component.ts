import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NecesidadFilters } from '../../models';
import { CalendarioHelperService } from '../../../academic-calendar-management/services';
import { ProgramaHelperService } from '../../../gestion-planes/services';
import { ToastrService } from 'ngx-toastr';
import { EstadoCalendario } from '../../../academic-calendar-management/models';
import {
  ESTADOS_NECESIDAD_DISPONIBLES,
  filtrarCalendariosDeshabilitados,
  getBadgeClass,
  GRUPOS_DISPONIBLES,
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
  SEMESTRES_DISPONIBLES,
} from '../../utils/necesidades.utils';
import { getUserDepartmentId } from '../../../auth/utils/user-storage.utils';

@Component({
  selector: 'app-filtros-necesidades-jefe',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-necesidades-jefe.component.html',
  styleUrl: './filtros-necesidades-jefe.component.css',
})
export class FiltrosNecesidadesJefeComponent implements OnInit {
  @Output() onAplicarFiltros = new EventEmitter<NecesidadFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private programaHelper = inject(ProgramaHelperService);
  private toastr = inject(ToastrService);

  // ===== DROPDOWNS =====
  calendarios: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];

  programas: {
    value: number;
    label: string;
    nombreCorto: string;
  }[] = [];

  // Usar constantes importadas
  readonly semestresDisponibles = SEMESTRES_DISPONIBLES;
  readonly gruposDisponibles = GRUPOS_DISPONIBLES;
  readonly estadosDisponibles = ESTADOS_NECESIDAD_DISPONIBLES;

  getBadgeClass = getBadgeClass;

  // ===== LOADING STATES =====
  loadingCalendarios = false;
  loadingProgramas = false;

  // ===== FILTROS LOCALES =====
  filters: NecesidadFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidPrograma: 'TODOS',
    oidDepartamento: '',
  };

  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | string = 'TODOS';
  filtroGrupo: string = 'TODOS';
  filtroCupo: number | null = null;
  filtroEstado: string = 'TODOS';

  ngOnInit(): void {
    this.inicializarFiltros();
    this.cargarCalendarios();
    this.cargarProgramas();
  }

  // ===== INICIALIZAR FILTROS =====
  private inicializarFiltros(): void {
    // Obtener oidDepartamento del usuario logueado
    const oidDepartamento = getUserDepartmentId();

    if (!oidDepartamento || oidDepartamento === 0) {
      console.error('No se pudo obtener el departamento del usuario logueado');
      this.toastr.error(
        'No se pudo obtener el departamento del usuario',
        'Error de autenticación'
      );
      return;
    }

    this.filters.oidDepartamento = oidDepartamento;
  }

  // ===== CARGAR CALENDARIOS =====
  async cargarCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      const calendariosCompletos =
        await this.calendarioHelper.getAllForDropdown();

      // Usar utilidades
      const calendariosFiltrados =
        filtrarCalendariosDeshabilitados(calendariosCompletos);
      this.calendarios = ordenarCalendariosPorAnio(calendariosFiltrados);
      this.filters.oidCalendario = seleccionarCalendarioAutomatico(
        this.calendarios
      );

      // Emitir filtros automáticamente si hay calendario y departamento seleccionados
      if (this.filters.oidCalendario && this.filters.oidDepartamento) {
        this.aplicarFiltros();
      }
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar la lista de calendarios');
      this.calendarios = [];
    } finally {
      this.loadingCalendarios = false;
    }
  }

  // ===== CARGAR PROGRAMAS =====
  async cargarProgramas(): Promise<void> {
    try {
      this.loadingProgramas = true;
      this.programas = await this.programaHelper.getAllForDropdown();
    } catch (error) {
      console.error('Error al cargar programas:', error);
      this.toastr.error('Error al cargar la lista de programas');
      this.programas = [];
    } finally {
      this.loadingProgramas = false;
    }
  }

  // ===== APLICAR FILTROS =====
  aplicarFiltros(): void {
    // Validaciones
    if (!this.filters.oidCalendario) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.filters.oidDepartamento || this.filters.oidDepartamento === 0) {
      this.toastr.error('No se ha identificado el departamento del usuario');
      return;
    }

    const filtrosCompletos: NecesidadFilters = {
      page: this.filters.page,
      size: this.filters.size,
      oidCalendario: this.filters.oidCalendario,
      oidDepartamento: this.filters.oidDepartamento,
    };

    // Agregar filtro de programa (omitir si es "TODOS")
    if (
      this.filters.oidPrograma &&
      this.filters.oidPrograma !== 'TODOS' &&
      this.filters.oidPrograma !== ''
    ) {
      filtrosCompletos.oidPrograma = this.filters.oidPrograma;
    }

    // Agregar filtros opcionales
    if (this.filtroEstado && this.filtroEstado !== 'TODOS') {
      filtrosCompletos.estado = this.filtroEstado;
    }

    if (this.filtroSemestre && this.filtroSemestre !== 'TODOS') {
      filtrosCompletos.semestreMateria = this.filtroSemestre;
    }

    if (this.filtroCodigo && this.filtroCodigo.trim()) {
      filtrosCompletos.codigoMateria = this.filtroCodigo.trim();
    }

    if (this.filtroNombre && this.filtroNombre.trim()) {
      filtrosCompletos.nombreMateria = this.filtroNombre.trim();
    }

    if (this.filtroOid && this.filtroOid.trim()) {
      filtrosCompletos.idMateria = this.filtroOid.trim();
    }

    // NOTA: Grupo y Cupo no se envían (pendientes de implementar en backend)

    this.onAplicarFiltros.emit(filtrosCompletos);
  }

  // ===== LIMPIAR FILTROS =====
  limpiarFiltros(): void {
    this.filters.oidPrograma = 'TODOS';
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = 'TODOS';
    this.filtroGrupo = 'TODOS';
    this.filtroCupo = null;
    this.filtroEstado = 'TODOS';

    // Re-seleccionar el calendario activo usando utilidad
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendarios
    );

    this.onLimpiarFiltros.emit();
  }

  // ===== VALIDAR SI HAY FILTROS ACTIVOS =====
  hasFiltrosActivos(): boolean {
    return (
      this.filters.oidPrograma !== 'TODOS' ||
      this.filtroOid !== '' ||
      this.filtroCodigo !== '' ||
      this.filtroNombre !== '' ||
      this.filtroSemestre !== 'TODOS' ||
      this.filtroGrupo !== 'TODOS' ||
      this.filtroCupo !== null ||
      this.filtroEstado !== 'TODOS'
    );
  }
}
