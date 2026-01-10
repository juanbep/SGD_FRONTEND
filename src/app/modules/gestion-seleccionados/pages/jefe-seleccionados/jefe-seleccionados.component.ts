import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FiltrosSeleccionadosJefeComponent } from '../../components/filtros-seleccionados-jefe/filtros-seleccionados-jefe.component';
import { SeleccionadosService } from '../../services/seleccionado.service';
import { SeleccionadoHelperService } from '../../services/seleccionado-helper.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  CreateSeleccionadoDTO,
  SeleccionadoFilters,
  SeleccionadoResponse,
  UpdateSeleccionadoDTO,
} from '../../models';
import {
  buildSortString,
  getPaginationInfo,
  getSortIcon,
  getTotalPages,
  getVisiblePages,
  SortDirection,
  toggleSort,
  trackByOid,
} from '../../../gestion-necesidades/shared/table.utils';
import { getUserDepartmentId } from '../../../auth/utils/user-storage.utils';
import { ModalCrearSeleccionadoComponent } from '../../components/modal-crear-seleccionado/modal-crear-seleccionado.component';
import { ModalEliminarSeleccionadoComponent } from '../../components/modal-eliminar-seleccionado/modal-eliminar-seleccionado.component';

@Component({
  selector: 'app-jefe-seleccionados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    FiltrosSeleccionadosJefeComponent,
    ModalCrearSeleccionadoComponent,
    ModalEliminarSeleccionadoComponent,
  ],
  templateUrl: './jefe-seleccionados.component.html',
  styleUrl: './jefe-seleccionados.component.css',
})
export class JefeSeleccionadosComponent implements OnInit, OnChanges {
  // ===== SERVICIOS =====
  private seleccionadosService = inject(SeleccionadosService);
  private seleccionadosHelper = inject(SeleccionadoHelperService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  @Input() isActive: boolean = false;

  // ===== CONFIGURACIÓN DE TABLA =====
  pageSizeOptions = [5, 10, 25, 50];

  // ===== FILTROS Y PAGINACIÓN =====
  filtrosActuales: SeleccionadoFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidDepartamento: '',
  };

  sortField: string = 'oidSeleccionado';
  sortDirection: SortDirection = 'desc';

  // ===== DATOS =====
  seleccionados: SeleccionadoResponse[] = [];
  totalElements = 0;
  loading = false;
  error: string | null = null;

  // ===== MODALES =====
  mostrarModalCrear = false;
  mostrarModalEliminar = false;

  seleccionadoAEliminar: SeleccionadoResponse | null = null;

  creando = false;
  eliminando = false;

  Math = Math;

  oidDepartamentoUsuario: number = 0;

  ngOnInit(): void {
    this.oidDepartamentoUsuario = getUserDepartmentId();

    if (!this.oidDepartamentoUsuario || this.oidDepartamentoUsuario === 0) {
      console.error('No se pudo obtener el departamento del usuario logueado');
      this.toastr.error(
        'No se pudo obtener el departamento del usuario',
        'Error de autenticación'
      );
      return;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive'] && changes['isActive'].currentValue === true) {
      if (this.filtrosActuales.oidCalendario) {
        this.cargarSeleccionados();
      }
    }
  }

  // ===== MANEJADORES DE EVENTOS DEL COMPONENTE DE FILTROS =====
  onFiltrosAplicados(filtros: SeleccionadoFilters): void {
    this.filtrosActuales = {
      ...filtros,
      page: 0,
      size: this.filtrosActuales.size,
      sort: buildSortString(this.sortField, this.sortDirection),
    };

    this.cargarSeleccionados();
  }

  onFiltrosLimpiados(): void {
    this.filtrosActuales = {
      ...this.filtrosActuales,
      page: 0,
    };

    this.cargarSeleccionados();
  }

  // ===== CARGAR SELECCIONADOS =====
  cargarSeleccionados(mostrarToast: boolean = false): void {
    if (!this.filtrosActuales.oidCalendario) {
      this.seleccionados = [];
      this.totalElements = 0;
      return;
    }

    if (!this.filtrosActuales.oidDepartamento) {
      console.error('No se ha especificado el departamento');
      this.seleccionados = [];
      this.totalElements = 0;
      return;
    }

    this.loading = true;
    this.error = null;

    const filtrosConOrdenamiento = {
      ...this.filtrosActuales,
      sort: buildSortString(this.sortField, this.sortDirection),
    };

    this.seleccionadosService
      .getSeleccionados(filtrosConOrdenamiento)
      .subscribe({
        next: (response) => {
          if (response.codigo >= 200 && response.codigo < 300) {
            this.seleccionados = response.data.content;
            this.totalElements = response.data.totalElements;

            if (mostrarToast) {
              if (this.totalElements > 0) {
                this.toastr.success(
                  'Lista de seleccionados actualizada correctamente'
                );
              } else {
                this.toastr.info(
                  'No se encontraron seleccionados para este calendario y departamento'
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
          this.handleError(error, 'cargar seleccionados');
          this.loading = false;
        },
      });
  }

  // ===== ORDENAMIENTO =====
  onSort(campo: string): void {
    const newSort = toggleSort(this.sortField, this.sortDirection, campo);
    this.sortField = newSort.field;
    this.sortDirection = newSort.direction;
    this.filtrosActuales.page = 0;
    this.cargarSeleccionados();
  }

  getSortIcon(campo: string): string {
    return getSortIcon(campo, this.sortField, this.sortDirection);
  }

  onPageSizeChange(): void {
    this.filtrosActuales.page = 0;
    this.cargarSeleccionados();
  }

  irAPagina(nuevaPagina: number): void {
    this.filtrosActuales.page = nuevaPagina;
    this.cargarSeleccionados();
  }

  getTotalPaginas(): number {
    return getTotalPages(this.totalElements, this.size);
  }

  getPaginasVisibles(): number[] {
    return getVisiblePages(this.page, this.totalElements, this.size);
  }

  getInfoPaginacion(): string {
    return getPaginationInfo(this.page, this.size, this.totalElements);
  }

  trackBySeleccionado(index: number, item: SeleccionadoResponse): any {
    return item?.oidSeleccionado ?? index;
  }

  // ===== PAGINACIÓN =====
  get page(): number {
    return this.filtrosActuales.page || 0;
  }

  get size(): number {
    return this.filtrosActuales.size || 10;
  }

  set size(value: number) {
    this.filtrosActuales.size = value;
  }

  // ===== CREAR SELECCIONADO =====
  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
  }

  async confirmarCreacion(dto: CreateSeleccionadoDTO): Promise<void> {
    this.creando = true;

    try {
      const resultado = await this.seleccionadosHelper.create(dto);

      if (resultado) {
        this.toastr.success(
          `Seleccionado creado correctamente`,
          'Creación exitosa'
        );
        this.cerrarModalCrear();
        this.cargarSeleccionados();
      } else {
        this.toastr.error('No se pudo crear el seleccionado', 'Error');
      }
    } catch (error: any) {
      console.error('Error al crear:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al crear el seleccionado.';
      this.toastr.error(mensajeError, 'Error al crear');
    } finally {
      this.creando = false;
    }
  }

  cerrarModalCrear(): void {
    if (!this.creando) {
      this.mostrarModalCrear = false;
    }
  }

  // ===== ELIMINAR SELECCIONADO =====
  eliminarSeleccionado(seleccionado: SeleccionadoResponse): void {
    this.seleccionadoAEliminar = seleccionado;
    this.mostrarModalEliminar = true;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.seleccionadoAEliminar) return;

    this.eliminando = true;

    try {
      const resultado = await this.seleccionadosHelper.delete(
        this.seleccionadoAEliminar.oidSeleccionado
      );

      if (resultado) {
        this.toastr.success(
          `Seleccionado eliminado exitosamente`,
          'Eliminación exitosa'
        );
        this.cerrarModalEliminar();
        this.cargarSeleccionados();
      } else {
        this.toastr.error('No se pudo eliminar el seleccionado', 'Error');
      }
    } catch (error: any) {
      console.error('Error al eliminar seleccionado:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al eliminar el seleccionado.';
      this.toastr.error(mensajeError, 'Error al eliminar');
    } finally {
      this.eliminando = false;
    }
  }

  cerrarModalEliminar(): void {
    if (!this.eliminando) {
      this.mostrarModalEliminar = false;
      this.seleccionadoAEliminar = null;
    }
  }

  // ===== UTILIDADES =====
  reintentar(): void {
    this.cargarSeleccionados(true);
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

  // ===== HELPERS DE VISUALIZACIÓN =====
  getNombreCompleto(seleccionado: SeleccionadoResponse): string {
    const usuario = seleccionado.usuario;
    return `${usuario.nombres} ${usuario.apellidos}`;
  }

  getDepartamento(seleccionado: SeleccionadoResponse): string {
    return seleccionado.usuario?.usuarioDetalle?.departamento || 'N/A';
  }

  getContratacion(seleccionado: SeleccionadoResponse): string {
    return seleccionado.usuario?.usuarioDetalle?.contratacion || 'N/A';
  }

  getTipoDisplay(seleccionado: SeleccionadoResponse): string {
    return seleccionado.tipo || 'N/A';
  }

  getDedicacionDisplay(seleccionado: SeleccionadoResponse): string {
    return seleccionado.dedicacion || 'N/A';
  }
}
