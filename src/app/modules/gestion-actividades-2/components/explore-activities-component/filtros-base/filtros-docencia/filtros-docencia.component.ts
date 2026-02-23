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
import { FiltrosBaseComponent } from '../filtros-base.component';
import { ActividadDocenciaFilters } from '../../../../models';
import { forkJoin, from } from 'rxjs';
import { seleccionarCalendarioAutomatico } from '../../../../utils/actividad-utils';
import {
  SEMESTRES_DROPDOWN,
  TIPOS_CONTRATACION_DROPDOWN,
} from '../../../../utils/filtros-actividades.utils';

@Component({
  selector: 'app-filtros-docencia',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filtros-docencia.component.html',
  styleUrl: './filtros-docencia.component.css',
})
export class FiltrosDocenciaComponent extends FiltrosBaseComponent {
  @Output() onAplicarFiltros = new EventEmitter<ActividadDocenciaFilters>();
  @Output() onLimpiarFiltros = new EventEmitter<void>();

  readonly tiposContratacionDropdown = TIPOS_CONTRATACION_DROPDOWN;
  readonly semestresDropdown = SEMESTRES_DROPDOWN;

  filters: ActividadDocenciaFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidDepartamento: undefined,
    tipoContratacion: '',
    semestre: '',
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
    const observables: any = { calendarios: from(this.loadCalendarios()) };
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

  aplicarFiltros(): void {
    if (!this.filters.oidCalendario) {
      this.toastr.warning(
        'Debe seleccionar un calendario',
        'Filtros incompletos',
      );
      return;
    }
    const filtrosLimpios: ActividadDocenciaFilters = {
      page: this.filters.page,
      size: this.filters.size,
      oidCalendario: this.filters.oidCalendario,
      oidDepartamento: this.filters.oidDepartamento,
    };
    if (this.filters.tipoContratacion)
      filtrosLimpios.tipoContratacion = this.filters.tipoContratacion;
    if (this.filters.semestre) filtrosLimpios.semestre = this.filters.semestre;

    const responsable = this.esDocente
      ? this.oidUsuarioDocente
      : this.filtroResponsable || null;
    if (responsable) filtrosLimpios.oidUsuario = responsable;

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
    this.filtroResponsable = '';
    this.filters.oidCalendario = seleccionarCalendarioAutomatico(
      this.calendariosDropdown,
    );
    if (!this.esDocente && this.filters.oidDepartamento) this.loadUsuarios();
    this.onLimpiarFiltros.emit();
  }
}
