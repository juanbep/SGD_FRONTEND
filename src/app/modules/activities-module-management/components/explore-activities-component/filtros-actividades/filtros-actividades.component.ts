import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin, from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CalendarioHelperService } from '../../../../academic-calendar-management/services/calendario/calendario-helper.service';
import { TiposActividadHelperService } from '../../../services/tiposActividades/tipos-actividad-helper.service';
import { UsuariosConActividadesHelperService } from '../../../../sgd-users-management/services';
import { EstadoCalendario } from '../../../../academic-calendar-management/models';
import { ActividadFilters } from '../../../models';
import { UsuariosConActividadesFilters } from '../../../../sgd-users-management/models';
import {
  ESTADOS_ACTIVIDAD_FILTRO,
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
} from '../../../utils/actividad-utils';

@Component({
  selector: 'app-filtros-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-actividades.component.html',
  styleUrl: './filtros-actividades.component.css',
})
export class FiltrosActividadesComponent implements OnInit {
  @Input() oidDepartamento?: number;
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onAplicarFiltros = new EventEmitter<ActividadFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private calendarioHelper = inject(CalendarioHelperService);
  private tiposActividadHelper = inject(TiposActividadHelperService);
  private usuariosConActividadesHelper = inject(
    UsuariosConActividadesHelperService
  );
  private toastr = inject(ToastrService);

  // Dropdowns
  calendariosDropdown: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];
  tiposActividadDropdown: {
    value: number | string;
    label: string;
    especial?: boolean;
  }[] = [];
  usuariosDropdown: { value: number | string; label: string }[] = [];

  // Loading states
  loadingCalendarios = false;
  loadingTiposActividad = false;
  loadingUsuarios = false;

  // Estados para el dropdown
  readonly estadosDropdown = ESTADOS_ACTIVIDAD_FILTRO;

  // Filtros locales
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

  filtroResponsable: string = '';

  ngOnInit(): void {
    this.filters.oidDepartamento = this.oidDepartamento;
    this.cargarFiltrosIniciales();
  }

  /**
   * Carga calendarios, tipos y usuarios en paralelo
   */
  private cargarFiltrosIniciales(): void {
    const cargaCalendarios$ = from(this.loadCalendarios());
    const cargaTipos$ = from(this.loadTiposActividad());

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

        // Emitir filtros automáticamente si hay calendario seleccionado
        if (this.filters.oidCalendario) {
          console.log('Emitiendo filtros iniciales automáticamente');
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

  async loadTiposActividad(): Promise<void> {
    try {
      this.loadingTiposActividad = true;
      const tiposCompletos =
        await this.tiposActividadHelper.getAllForDropdown();

      // Filtrar según el modo
      const tiposFiltrados = tiposCompletos
        .filter((tipo) => {
          // En modo gestionar, excluir el tipo 9
          if (this.modo === 'gestionar' && tipo.value === 9) {
            return false;
          }
          return true;
        })
        .map((tipo) => ({
          value: tipo.value,
          label: tipo.label,
          especial: tipo.value === 9,
        }));

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
        filtro: 'NO_DOCENCIA',
      };

      const usuariosDepartamento =
        await this.usuariosConActividadesHelper.getAll(filtros);

      const usuariosMapeados = usuariosDepartamento.map((ud) => ({
        value: ud.usuario.oidUsuario,
        label: `${ud.usuario.nombres} ${ud.usuario.apellidos}`.trim(),
      }));

      this.usuariosDropdown = [
        { value: '', label: 'TODOS' },
        ...usuariosMapeados,
      ];
    } catch (error) {
      console.error('Error al cargar usuarios del departamento:', error);
      this.toastr.error('Error al cargar la lista de usuarios responsables');
      this.usuariosDropdown = [];
    } finally {
      this.loadingUsuarios = false;
    }
  }

  aplicarFiltros(): void {
    const filtrosCompletos = {
      ...this.filters,
      ...(this.filtroResponsable
        ? { oidUsuarioResponsable: this.filtroResponsable }
        : {}),
    };
    this.onAplicarFiltros.emit(filtrosCompletos);
  }

  limpiarFiltros(): void {
    this.filters = {
      page: 0,
      size: this.filters.size,
      oidCalendario: '',
      oidTipoActividad: '',
      oidEstadoActividad: '',
      fechaCreacionDesde: '',
      searchTerm: '',
      oidDepartamento: this.oidDepartamento,
    };

    this.filtroResponsable = '';
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendariosDropdown
    );

    this.onLimpiarFiltros.emit();
  }

  recargarFiltros(): void {
    this.cargarFiltrosIniciales();
  }
}
