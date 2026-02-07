import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  ESTADOS_NECESIDAD_DISPONIBLES,
  filtrarCalendariosDeshabilitados,
  getBadgeClass,
  GRUPOS_DISPONIBLES,
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
  SEMESTRES_DISPONIBLES,
} from '../../utils/necesidades.utils';
import { NecesidadFilters } from '../../models';
import { EstadoCalendario } from '../../../gestion-calendarios/models';
import { ToastrService } from 'ngx-toastr';
import {
  DepartamentoHelperService,
  ProgramaHelperService,
} from '../../../gestion-planes/services';
import { CalendarioHelperService } from '../../../gestion-calendarios/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-filtros-necesidades-secretario',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-necesidades-secretario.component.html',
  styleUrl: './filtros-necesidades-secretario.component.css',
})
export class FiltrosNecesidadesSecretarioComponent implements OnInit {
  @Output() onAplicarFiltros = new EventEmitter<NecesidadFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private programaHelper = inject(ProgramaHelperService);
  private departamentoHelper = inject(DepartamentoHelperService);
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
  }[] = [];

  departamentos: {
    value: number;
    label: string;
  }[] = [];

  // Usar constantes importadas
  readonly semestresDisponibles = SEMESTRES_DISPONIBLES;
  readonly gruposDisponibles = GRUPOS_DISPONIBLES;
  readonly estadosDisponibles = ESTADOS_NECESIDAD_DISPONIBLES;

  getBadgeClass = getBadgeClass;

  // ===== LOADING STATES =====
  loadingCalendarios = false;
  loadingProgramas = false;
  loadingDepartamentos = false;

  // ===== FILTROS LOCALES =====
  filters: NecesidadFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidPrograma: '',
  };

  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | string = 'TODOS';
  filtroGrupo: string = 'TODOS';
  filtroCupo: number | null = null;
  filtroEstado: string = 'TODOS';
  filtroDepartamento: number | string = 'TODOS';

  ngOnInit(): void {
    this.cargarCalendarios();
    this.cargarProgramas();
    this.cargarDatosIniciales();
    //this.cargarDepartamentos();
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
      const programasData = await this.programaHelper.getAllForDropdown();

      this.programas = programasData.map((p) => ({
        value: p.value,
        label: p.label,
      }));

      // SELECCIONAR AUTOMÁTICAMENTE EL PRIMER PROGRAMA
      if (this.programas.length > 0) {
        this.filters.oidPrograma = this.programas[0].value;
      }
    } catch (error) {
      console.error('Error al cargar programas:', error);
      this.toastr.error('Error al cargar la lista de programas');
      this.programas = [];
    } finally {
      this.loadingProgramas = false;
    }
  }

  // ===== CARGAR DEPARTAMENTOS =====
  // async cargarDepartamentos(): Promise<void> {
  //   try {
  //     this.loadingDepartamentos = true;
  //     const departamentosData =
  //       await this.departamentoHelper.getAllForDropdown();

  //     this.departamentos = departamentosData.map((d) => ({
  //       value: d.value,
  //       label: d.label,
  //     }));
  //   } catch (error) {
  //     console.error('Error al cargar departamentos:', error);
  //     this.toastr.error('Error al cargar la lista de departamentos');
  //     this.departamentos = [];
  //   } finally {
  //     this.loadingDepartamentos = false;
  //   }
  // }

  async cargarDatosIniciales(): Promise<void> {
    // Cargar en paralelo
    await Promise.all([this.cargarCalendarios(), this.cargarProgramas()]);

    // Una vez que ambos estén cargados, si hay calendario y programa, aplicar filtros automáticamente
    if (this.filters.oidCalendario && this.filters.oidPrograma) {
      this.aplicarFiltros();
    }
  }

  // ===== APLICAR FILTROS =====
  aplicarFiltros(): void {
    // Validaciones
    if (!this.filters.oidCalendario) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.filters.oidPrograma || this.filters.oidPrograma === '') {
      this.toastr.warning('Debe seleccionar un programa');
      return;
    }

    const filtrosCompletos: NecesidadFilters = {
      page: this.filters.page,
      size: this.filters.size,
      oidCalendario: this.filters.oidCalendario,
      oidPrograma: this.filters.oidPrograma,
    };

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

    if (
      this.filtroDepartamento &&
      this.filtroDepartamento !== 'TODOS' &&
      this.filtroDepartamento !== ''
    ) {
      filtrosCompletos.oidDepartamento = this.filtroDepartamento;
    }

    this.onAplicarFiltros.emit(filtrosCompletos);
  }

  // ===== LIMPIAR FILTROS =====
  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = 'TODOS';
    this.filtroGrupo = 'TODOS';
    this.filtroCupo = null;
    this.filtroEstado = 'TODOS';
    this.filtroDepartamento = 'TODOS';

    // Re-seleccionar el calendario activo usando utilidad
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendarios
    );

    // IMPORTANTE: No limpiar el programa seleccionado
    // El secretario debe mantener el programa seleccionado
    // this.filters.oidPrograma = '';

    this.onLimpiarFiltros.emit();
  }

  // ===== VALIDAR SI HAY FILTROS ACTIVOS =====
  hasFiltrosActivos(): boolean {
    return (
      this.filtroOid !== '' ||
      this.filtroCodigo !== '' ||
      this.filtroNombre !== '' ||
      this.filtroSemestre !== 'TODOS' ||
      this.filtroGrupo !== 'TODOS' ||
      this.filtroCupo !== null ||
      this.filtroEstado !== 'TODOS' ||
      this.filtroDepartamento !== 'TODOS'
    );
  }
}
