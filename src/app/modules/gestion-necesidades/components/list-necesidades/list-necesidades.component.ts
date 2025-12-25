import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NecesidadesService } from '../../services';
import { Materia, NecesidadFilters, NecesidadResponse } from '../../models';
import { getBadgeClassEstado } from '../../utils/necesidades.utils';
import { FiltrosNecesidadesComponent } from '../filtros-necesidades/filtros-necesidades.component';
import {
  buildSortString,
  getPaginationInfo,
  getSortIcon,
  getTotalPages,
  getVisiblePages,
  SortDirection,
  toggleSort,
  trackByOid,
} from '../../shared/table.utils';

@Component({
  selector: 'app-list-necesidades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    FiltrosNecesidadesComponent,
  ],
  templateUrl: './list-necesidades.component.html',
  styleUrl: './list-necesidades.component.css',
})
export class ListNecesidadesComponent implements OnInit {
  // ===== SERVICIOS =====
  private necesidadesService = inject(NecesidadesService);
  private toastr = inject(ToastrService);

  // ===== REFERENCIA AL INPUT FILE =====
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ===== CONFIGURACIÓN DE TABLA =====
  pageSizeOptions = [5, 10, 25, 50];

  // ===== FILTROS Y PAGINACIÓN =====
  filtrosActuales: NecesidadFilters = {
    page: 0,
    size: 10,
    oidCalendario: '',
    oidPrograma: '',
  };

  sortField: string = 'oidNecesidad';
  sortDirection: SortDirection = 'desc';

  // ===== DATOS =====
  necesidades: NecesidadResponse[] = [];
  totalElements = 0;
  loading = false;
  error: string | null = null;

  // ===== ESTADOS PARA DESCARGA/CARGA =====
  descargando = false;
  cargandoArchivo = false;
  archivoSeleccionado: File | null = null;

  // ===== MODALES =====
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalCorrequisitos = false;
  necesidadSeleccionada: NecesidadResponse | null = null;
  mostrarModalDetalleMateria = false;
  materiaSeleccionada: Materia | null = null;

  Math = Math;

  ngOnInit(): void {
    // Los filtros se cargan automáticamente desde el componente hijo
  }

  // ===== MANEJADORES DE EVENTOS DEL COMPONENTE DE FILTROS =====
  onFiltrosAplicados(filtros: NecesidadFilters): void {
    console.log('Filtros aplicados:', filtros);

    this.filtrosActuales = {
      ...filtros,
      page: 0,
      size: this.filtrosActuales.size,
      sort: buildSortString(this.sortField, this.sortDirection),
    };

    this.cargarNecesidades();
  }

  onFiltrosLimpiados(): void {
    console.log('Filtros limpiados');

    this.filtrosActuales = {
      ...this.filtrosActuales,
      page: 0,
    };

    this.cargarNecesidades();
  }

  // ===== CARGAR NECESIDADES =====
  cargarNecesidades(mostrarToast: boolean = false): void {
    if (!this.filtrosActuales.oidCalendario) {
      this.necesidades = [];
      this.totalElements = 0;
      return;
    }

    if (!this.filtrosActuales.oidPrograma) {
      console.error('No se ha especificado el programa');
      this.necesidades = [];
      this.totalElements = 0;
      return;
    }

    this.loading = true;
    this.error = null;

    const filtrosConOrdenamiento = {
      ...this.filtrosActuales,
      sort: buildSortString(this.sortField, this.sortDirection),
    };

    this.necesidadesService.getNecesidades(filtrosConOrdenamiento).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.necesidades = response.data.content;
          this.totalElements = response.data.totalElements;

          if (mostrarToast) {
            if (this.totalElements > 0) {
              this.toastr.success(
                'Lista de necesidades actualizada correctamente'
              );
            } else {
              this.toastr.info(
                'No se encontraron necesidades para este calendario'
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
        this.handleError(error, 'cargar necesidades');
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
    this.cargarNecesidades();
  }

  getSortIcon(campo: string): string {
    return getSortIcon(campo, this.sortField, this.sortDirection);
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

  onPageSizeChange(): void {
    this.filtrosActuales.page = 0;
    this.cargarNecesidades();
  }

  irAPagina(nuevaPagina: number): void {
    this.filtrosActuales.page = nuevaPagina;
    this.cargarNecesidades();
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

  trackByNecesidad(index: number, item: NecesidadResponse): any {
    return trackByOid(index, item);
  }

  // ===== UTILIDADES PARA TEMPLATE =====
  getBadgeClassEstado = getBadgeClassEstado;

  // ===== ACCIONES =====
  crearNuevaNecesidad(): void {
    this.toastr.info('Crear necesidad - pendiente de implementar');
  }

  modificarNecesidad(necesidad: NecesidadResponse): void {
    this.necesidadSeleccionada = necesidad;
    this.toastr.info('Modificar necesidad - pendiente de implementar');
  }

  eliminarNecesidad(necesidad: NecesidadResponse): void {
    this.necesidadSeleccionada = necesidad;
    this.toastr.info('Eliminar necesidad - pendiente de implementar');
  }

  gestionarCorrequisitos(necesidad: NecesidadResponse): void {
    this.necesidadSeleccionada = necesidad;
    this.toastr.info('Gestionar correquisitos - pendiente de implementar');
  }

  // ===== DESCARGAR/CARGAR PLANILLA =====
  descargarPlanilla(): void {
    this.toastr.info('Descargar planilla - pendiente de implementar');
  }

  cargarPlanilla(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.toastr.info('Cargar planilla - pendiente de implementar');
    input.value = '';
  }

  // ===== MODALES =====

  verDetallesMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.mostrarModalDetalleMateria = true;
    console.log('Detalles de materia:', materia);
  }

  cerrarModalDetalleMateria(): void {
    this.mostrarModalDetalleMateria = false;
    this.materiaSeleccionada = null;
  }

  // ===== UTILIDADES =====
  reintentar(): void {
    this.cargarNecesidades(true);
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
}
