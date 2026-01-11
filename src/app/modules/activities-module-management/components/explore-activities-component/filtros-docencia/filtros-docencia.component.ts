import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
} from '../../../utils/actividad-utils';
import { ActividadDocenciaFilters } from '../../../models';
import { CalendarioHelperService } from '../../../../academic-calendar-management/services';
import { ToastrService } from 'ngx-toastr';
import { EstadoCalendario } from '../../../../academic-calendar-management/models';
import { forkJoin, from } from 'rxjs';

@Component({
  selector: 'app-filtros-docencia',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-docencia.component.html',
  styleUrl: './filtros-docencia.component.css',
})
export class FiltrosDocenciaComponent implements OnInit {
  @Input() oidDepartamento?: number;
  @Output() onAplicarFiltros = new EventEmitter<ActividadDocenciaFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private toastr = inject(ToastrService);

  // Dropdowns
  calendariosDropdown: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];

  tiposContratacionDropdown = [
    { value: '', label: 'TODOS' },
    { value: 'PLANTA', label: 'PLANTA' },
    { value: 'OCASIONAL', label: 'OCASIONAL' },
    { value: 'CATEDRA', label: 'CÁTEDRA' },
  ];

  semestresDropdown = [
    { value: '', label: 'TODOS' },
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

  // Loading states
  loadingCalendarios = false;

  // Filtros locales
  filters: ActividadDocenciaFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidDepartamento: undefined,
    tipoContratacion: '',
    semestre: '',
  };

  ngOnInit(): void {
    this.filters.oidDepartamento = this.oidDepartamento;
    this.cargarFiltrosIniciales();
  }

  /**
   * Carga calendarios
   */
  private cargarFiltrosIniciales(): void {
    const cargaCalendarios$ = from(this.loadCalendarios());

    forkJoin({
      calendarios: cargaCalendarios$,
    }).subscribe({
      next: () => {
        // Emitir filtros automáticamente si hay calendario seleccionado
        if (this.filters.oidCalendario) {
          this.aplicarFiltros();
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

  async loadCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      const calendariosCompletos =
        await this.calendarioHelper.getAllForDropdown();

      const calendariosFiltrados = calendariosCompletos.filter(
        (calendario) => calendario.estado !== 'DESHABILITADO'
      );

      this.calendariosDropdown =
        ordenarCalendariosPorAnio(calendariosFiltrados);
      this.filters.oidCalendario = seleccionarCalendarioAutomatico(
        this.calendariosDropdown
      );
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar la lista de calendarios');
      this.calendariosDropdown = [];
    } finally {
      this.loadingCalendarios = false;
    }
  }

  aplicarFiltros(): void {
    if (!this.filters.oidCalendario) {
      this.toastr.warning(
        'Debe seleccionar un calendario',
        'Filtros incompletos'
      );
      return;
    }

    // Limpiar filtros vacíos
    const filtrosLimpios: ActividadDocenciaFilters = {
      page: this.filters.page,
      size: this.filters.size,
      oidCalendario: this.filters.oidCalendario,
      oidDepartamento: this.filters.oidDepartamento,
    };

    // Solo agregar si tienen valor
    if (this.filters.tipoContratacion && this.filters.tipoContratacion !== '') {
      filtrosLimpios.tipoContratacion = this.filters.tipoContratacion;
    }

    if (this.filters.semestre && this.filters.semestre !== '') {
      filtrosLimpios.semestre = this.filters.semestre;
    }

    this.onAplicarFiltros.emit(filtrosLimpios);
  }

  limpiarFiltros(): void {
    this.filters = {
      page: 0,
      size: this.filters.size,
      oidCalendario: '',
      oidDepartamento: this.oidDepartamento,
      tipoContratacion: '',
      semestre: '',
    };

    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendariosDropdown
    );

    this.onLimpiarFiltros.emit();
  }

  recargarFiltros(): void {
    this.cargarFiltrosIniciales();
  }
}
