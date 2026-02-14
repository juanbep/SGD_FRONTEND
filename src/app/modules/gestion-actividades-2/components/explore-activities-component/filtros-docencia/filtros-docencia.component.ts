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
import { CalendarioHelperService } from '../../../../gestion-calendarios/services';
import { ToastrService } from 'ngx-toastr';
import { EstadoCalendario } from '../../../../gestion-calendarios/models';
import { forkJoin, from } from 'rxjs';
import { DepartamentoHelperService } from '../../../../gestion-planes/services';
import {
  getUserRoles,
  isUserDataAvailable,
} from '../../../../auth/utils/user-storage.utils';

@Component({
  selector: 'app-filtros-docencia',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-docencia.component.html',
  styleUrl: './filtros-docencia.component.css',
})
export class FiltrosDocenciaComponent implements OnInit {
  @Input() oidDepartamento?: number;
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onAplicarFiltros = new EventEmitter<ActividadDocenciaFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private departamentoHelper = inject(DepartamentoHelperService);
  private toastr = inject(ToastrService);

  // Dropdowns
  calendariosDropdown: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];

  departamentosDropdown: { value: number; label: string }[] = [];

  tiposContratacionDropdown = [
    { value: '', label: 'TODOS' },
    { value: 'PLANTA', label: 'PLANTA' },
    { value: 'OCASIONAL', label: 'OCASIONAL' },
    { value: 'CATEDRA', label: 'CÁTEDRA' },
    { value: 'BECARIOS_Y_PRACTICANTES', label: 'BECARIOS Y PRACTICANTES' },
    { value: 'BECARIOS_POSTGRADO', label: 'BECARIO POSTGRADO' },
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
  loadingDepartamentos = false;

  // Filtros locales
  filters: ActividadDocenciaFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidDepartamento: undefined,
    tipoContratacion: '',
    semestre: '',
  };

  filtroDepartamento: boolean = false;

  ngOnInit(): void {
    this.verFiltroDepartamentos();
    this.filters.oidDepartamento = this.oidDepartamento;
    this.cargarFiltrosIniciales();
  }

  private verFiltroDepartamentos(): void {
    if (isUserDataAvailable()) {
      const roles = getUserRoles();
      const filtroDepartamento = [
        'SECRETARIA/O FACULTAD',
        'SECRETARIO',
        'SECRETARIA',
        'DECANO',
      ];
      this.filtroDepartamento = roles.some((rol) =>
        filtroDepartamento.includes(rol),
      );
    }
  }

  /**
   * Carga calendarios y departamentos (si es secretario)
   */
  private cargarFiltrosIniciales(): void {
    const cargaCalendarios$ = from(this.loadCalendarios());

    // Si es secretario en modo visualizar, cargar departamentos
    const observables: any = {
      calendarios: cargaCalendarios$,
    };

    if (this.filtroDepartamento && this.modo === 'visualizar') {
      observables.departamentos = from(this.loadDepartamentos());
    }

    forkJoin(observables).subscribe({
      next: () => {
        // Emitir filtros automáticamente si hay calendario seleccionado
        if (this.filters.oidCalendario) {
          this.aplicarFiltros();
        }
      },
      error: (error) => {
        console.error('Error cargando filtros iniciales:', error);
        this.toastr.error(
          'Error al cargar los filtros. Intente recargar la página.',
        );
      },
    });
  }

  async loadDepartamentos(): Promise<void> {
    try {
      this.loadingDepartamentos = true;
      const departamentosCompletos =
        await this.departamentoHelper.getAllForDropdown();

      this.departamentosDropdown = departamentosCompletos.map((dept) => ({
        value: dept.value,
        label: dept.label,
      }));

      // Si no hay departamento seleccionado, seleccionar el primero automáticamente
      if (
        !this.filters.oidDepartamento &&
        this.departamentosDropdown.length > 0
      ) {
        this.filters.oidDepartamento = this.departamentosDropdown[0].value;
      }
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
      this.toastr.error('Error al cargar la lista de departamentos');
      this.departamentosDropdown = [];
    } finally {
      this.loadingDepartamentos = false;
    }
  }

  async loadCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      const calendariosCompletos =
        await this.calendarioHelper.getAllForDropdown();

      const calendariosFiltrados = calendariosCompletos.filter(
        (calendario) => calendario.estado !== 'DESHABILITADO',
      );

      this.calendariosDropdown =
        ordenarCalendariosPorAnio(calendariosFiltrados);
      this.filters.oidCalendario = seleccionarCalendarioAutomatico(
        this.calendariosDropdown,
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
        'Filtros incompletos',
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

    // Agregar tipoContratacion con comillas dobles para el backend
    if (this.filters.tipoContratacion && this.filters.tipoContratacion !== '') {
      filtrosLimpios.tipoContratacion = `${this.filters.tipoContratacion}`;
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
      this.calendariosDropdown,
    );

    this.onLimpiarFiltros.emit();
  }

  recargarFiltros(): void {
    this.cargarFiltrosIniciales();
  }
}
