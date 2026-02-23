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
import { FiltrosBaseComponent } from '../filtros-base.component';
import { ActividadFilters } from '../../../../models';
import {
  ESTADOS_ACTIVIDAD_FILTRO,
  seleccionarCalendarioAutomatico,
} from '../../../../utils/actividad-utils';
import { TiposActividadHelperService } from '../../../../services';

@Component({
  selector: 'app-filtros-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-actividades.component.html',
  styleUrl: './filtros-actividades.component.css',
})
export class FiltrosActividadesComponent extends FiltrosBaseComponent {
  @Output() onAplicarFiltros = new EventEmitter<ActividadFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  private tiposActividadHelper = inject(TiposActividadHelperService);

  tiposActividadDropdown: {
    value: number | string;
    label: string;
    especial?: boolean;
  }[] = [];
  loadingTiposActividad = false;
  readonly estadosDropdown = ESTADOS_ACTIVIDAD_FILTRO;

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

  protected get oidDepartamentoFilter(): number | undefined {
    return this.filters.oidDepartamento;
  }
  protected set oidDepartamentoFilter(value: number | undefined) {
    this.filters.oidDepartamento = value;
  }

  protected onCalendarioCargado(oidCalendario: number | string): void {
    this.filters.oidCalendario = oidCalendario;
  }

  protected cargarFiltrosIniciales(): void {
    const observables: any = {
      calendarios: from(this.loadCalendarios()),
      tipos: from(this.loadTiposActividad()),
    };
    if (this.filtroDepartamento && this.modo === 'visualizar') {
      observables.departamentos = from(this.loadDepartamentos());
    }
    forkJoin(observables).subscribe({
      next: () => {
        if (!this.esDocente && this.filters.oidDepartamento)
          this.loadUsuarios();
        if (this.filters.oidCalendario) this.aplicarFiltros();
      },
      error: () => this.toastr.error('Error al cargar los filtros.'),
    });
  }

  async loadTiposActividad(): Promise<void> {
    try {
      this.loadingTiposActividad = true;
      const tiposCompletos =
        await this.tiposActividadHelper.getAllForDropdown();

      const tiposFiltrados = tiposCompletos
        .filter((tipo) => {
          // Excluir el tipo 9 en modo gestionar
          if (tipo.value === 9) {
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

  aplicarFiltros(): void {
    const responsable = this.esDocente
      ? this.oidUsuarioDocente
      : this.filtroResponsable || null;
    const filtrosCompletos = {
      ...this.filters,
      ...(responsable ? { oidUsuarioResponsable: responsable } : {}),
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
      this.calendariosDropdown,
    );
    if (!this.esDocente && this.filters.oidDepartamento) this.loadUsuarios();
    this.onLimpiarFiltros.emit();
  }
}
