import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NecesidadFilters } from '../../models';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../../academic-calendar-management/services';
import { EstadoCalendario } from '../../../academic-calendar-management/models';
import { getUserProgramaId } from '../../../auth/utils/user-storage.utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ESTADOS_NECESIDAD_DISPONIBLES,
  filtrarCalendariosDeshabilitados,
  GRUPOS_DISPONIBLES,
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
  SEMESTRES_DISPONIBLES,
} from '../../utils/necesidades.utils';

@Component({
  selector: 'app-filtros-necesidades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-necesidades.component.html',
  styleUrl: './filtros-necesidades.component.css',
})
export class FiltrosNecesidadesComponent implements OnInit {
  @Output() onAplicarFiltros = new EventEmitter<NecesidadFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private toastr = inject(ToastrService);

  // ===== DROPDOWNS =====
  calendarios: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];

  // Usar constantes importadas
  readonly semestresDisponibles = SEMESTRES_DISPONIBLES;
  readonly gruposDisponibles = GRUPOS_DISPONIBLES;
  readonly estadosDisponibles = ESTADOS_NECESIDAD_DISPONIBLES;

  // ===== LOADING STATES =====
  loadingCalendarios = false;

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

  ngOnInit(): void {
    this.inicializarFiltros();
    this.cargarCalendarios();
  }

  // ===== INICIALIZAR FILTROS =====
  private inicializarFiltros(): void {
    // Obtener oidPrograma del usuario logueado
    const oidPrograma = getUserProgramaId();

    if (!oidPrograma || oidPrograma === 0) {
      console.error('No se pudo obtener el programa del usuario logueado');
      this.toastr.error(
        'No se pudo obtener el programa del usuario',
        'Error de autenticación'
      );
      return;
    }

    this.filters.oidPrograma = oidPrograma;
    console.log('OID Programa del usuario logueado:', oidPrograma);
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

      // Emitir filtros automáticamente si hay calendario y programa seleccionados
      if (this.filters.oidCalendario && this.filters.oidPrograma) {
        console.log('Emitiendo filtros iniciales automáticamente');
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

  // ===== APLICAR FILTROS =====
  aplicarFiltros(): void {
    // Validaciones
    if (!this.filters.oidCalendario) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.filters.oidPrograma || this.filters.oidPrograma === 0) {
      this.toastr.error('No se ha identificado el programa del usuario');
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

    console.log('Filtros a aplicar:', filtrosCompletos);
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

    // Re-seleccionar el calendario activo usando utilidad
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendarios
    );

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
      this.filtroEstado !== 'TODOS'
    );
  }
}
