import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SeleccionadoFilters } from '../../models';
import { CalendarioHelperService } from '../../../academic-calendar-management/services';
import { ToastrService } from 'ngx-toastr';
import { EstadoCalendario } from '../../../academic-calendar-management/models';
import {
  filtrarCalendariosDeshabilitados,
  getBadgeClass,
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
} from '../../../gestion-necesidades/utils/necesidades.utils';
import { getUserDepartmentId } from '../../../auth/utils/user-storage.utils';

// Constantes para dropdowns
const TIPOS_CONTRATACION_DISPONIBLES = [
  { value: 'TODOS', label: 'TODOS' },
  { value: 'PLANTA', label: 'PLANTA' },
  { value: 'OCASIONAL', label: 'OCASIONAL' },
  { value: 'CATEDRA', label: 'CATEDRA' },
];

const TIPOS_DEDICACION_DISPONIBLES = [
  { value: 'TODOS', label: 'TODOS' },
  { value: 'TIEMPO COMPLETO', label: 'TIEMPO COMPLETO' },
  { value: 'MEDIO TIEMPO', label: 'MEDIO TIEMPO' },
  { value: 'HORAS CATEDRA', label: 'HORAS CATEDRA' },
];

@Component({
  selector: 'app-filtros-seleccionados-jefe',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-seleccionados-jefe.component.html',
  styleUrl: './filtros-seleccionados-jefe.component.css',
})
export class FiltrosSeleccionadosJefeComponent implements OnInit {
  @Output() onAplicarFiltros = new EventEmitter<SeleccionadoFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private toastr = inject(ToastrService);

  // ===== DROPDOWNS =====
  calendarios: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];

  // Usar constantes
  readonly tiposContratacion = TIPOS_CONTRATACION_DISPONIBLES;
  readonly tiposDedicacion = TIPOS_DEDICACION_DISPONIBLES;

  getBadgeClass = getBadgeClass;

  // ===== LOADING STATES =====
  loadingCalendarios = false;

  // ===== FILTROS LOCALES =====
  filters: SeleccionadoFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidDepartamento: '',
  };

  filtroIdentificacion: string = '';
  filtroNombreCompleto: string = '';
  filtroCorreo: string = '';
  filtroContratacion: string = 'TODOS';
  filtroDedicacion: string = 'TODOS';

  ngOnInit(): void {
    this.inicializarFiltros();
    this.cargarCalendarios();
  }

  // ===== INICIALIZAR FILTROS =====
  private inicializarFiltros(): void {
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

      const calendariosFiltrados =
        filtrarCalendariosDeshabilitados(calendariosCompletos);
      this.calendarios = ordenarCalendariosPorAnio(calendariosFiltrados);
      this.filters.oidCalendario = seleccionarCalendarioAutomatico(
        this.calendarios
      );

      // Emitir filtros automáticamente si hay calendario y departamento
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

    const filtrosCompletos: SeleccionadoFilters = {
      page: this.filters.page,
      size: this.filters.size,
      oidCalendario: this.filters.oidCalendario,
      oidDepartamento: this.filters.oidDepartamento,
    };

    // Agregar filtros opcionales
    if (this.filtroIdentificacion && this.filtroIdentificacion.trim()) {
      filtrosCompletos.identificacion = this.filtroIdentificacion.trim();
    }

    if (this.filtroNombreCompleto && this.filtroNombreCompleto.trim()) {
      filtrosCompletos.nombreCompleto = this.filtroNombreCompleto.trim();
    }

    if (this.filtroCorreo && this.filtroCorreo.trim()) {
      filtrosCompletos.correo = this.filtroCorreo.trim();
    }

    if (this.filtroContratacion && this.filtroContratacion !== 'TODOS') {
      filtrosCompletos.contratacion = this.filtroContratacion;
    }

    if (this.filtroDedicacion && this.filtroDedicacion !== 'TODOS') {
      filtrosCompletos.dedicacion = this.filtroDedicacion;
    }

    this.onAplicarFiltros.emit(filtrosCompletos);
  }

  // ===== LIMPIAR FILTROS =====
  limpiarFiltros(): void {
    this.filtroIdentificacion = '';
    this.filtroNombreCompleto = '';
    this.filtroCorreo = '';
    this.filtroContratacion = 'TODOS';
    this.filtroDedicacion = 'TODOS';

    // Re-seleccionar el calendario activo
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendarios
    );

    this.onLimpiarFiltros.emit();
  }

  // ===== VALIDAR SI HAY FILTROS ACTIVOS =====
  hasFiltrosActivos(): boolean {
    return (
      this.filtroIdentificacion !== '' ||
      this.filtroNombreCompleto !== '' ||
      this.filtroCorreo !== '' ||
      this.filtroContratacion !== 'TODOS' ||
      this.filtroDedicacion !== 'TODOS'
    );
  }
}
