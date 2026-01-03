import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  NecesidadesService,
  NecesidadHelperService,
  TransicionEstadosService,
} from '../../services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  ModalConfirmacionConfig,
  ModalConfirmacionComponent,
} from '../../components/modales/modal-confirmacion/modal-confirmacion.component';
import {
  Materia,
  NecesidadFilters,
  NecesidadResponse,
  UpdateNecesidadDTO,
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
} from '../../shared/table.utils';
import { getBadgeClassEstado } from '../../utils/necesidades.utils';
import { ModalEditarDepartamentoComponent } from '../../components/modales/modal-editar-departamento/modal-editar-departamento.component';
import { ModalDetalleMateriaComponent } from '../../components/modales/modal-detalle-materia/modal-detalle-materia.component';
import { ModalEliminarNecesidadComponent } from '../../components/modales/modal-eliminar-necesidad/modal-eliminar-necesidad.component';
import { ModalEditarNecesidadComponent } from '../../components/modales/modal-editar-necesidad/modal-editar-necesidad.component';
import { ModalSeleccionarPlanComponent } from '../../components/modales/modal-seleccionar-plan/modal-seleccionar-plan.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FiltrosNecesidadesSecretarioComponent } from '../../components/filtros-necesidades-secretario/filtros-necesidades-secretario.component';

@Component({
  selector: 'app-secretario-necesidades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ModalDetalleMateriaComponent,
    ModalSeleccionarPlanComponent,
    ModalEliminarNecesidadComponent,
    ModalEditarNecesidadComponent,
    ModalEditarDepartamentoComponent,
    ModalConfirmacionComponent,
    FiltrosNecesidadesSecretarioComponent,
  ],
  templateUrl: './secretario-necesidades.component.html',
  styleUrl: './secretario-necesidades.component.css',
})
export class SecretarioNecesidadesComponent implements OnInit {
  // ===== SERVICIOS =====
  private necesidadesService = inject(NecesidadesService);
  private necesidadesHelper = inject(NecesidadHelperService);
  private transicionService = inject(TransicionEstadosService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // ===== REFERENCIA AL INPUT FILE =====
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ===== SELECCIÓN MÚLTIPLE =====
  necesidadesSeleccionadas: Set<number> = new Set();

  // ===== ESTADO PARA TRANSICIÓN =====
  transicionandoEstado = false;
  mostrarModalTransicion = false;
  configModalTransicion: ModalConfirmacionConfig = {
    titulo: '',
    mensaje: '',
    textoBotonConfirmar: 'Confirmar',
    textoBotonCancelar: 'Cancelar',
    tipoBotonConfirmar: 'primary',
    icono: 'fa-exchange-alt',
  };

  // Contexto de la transición pendiente
  private contextoTransicion: {
    estadoOrigen: string;
    estadoDestino: string;
    tituloAccion: string;
    requiereDepartamento: boolean;
  } | null = null;

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
  mostrarModalEliminar = false;
  mostrarModalEditar = false;
  mostrarModalSeleccionarPlan = false;
  mostrarModalDetalleMateria = false;
  mostrarModalEditarDepartamento = false;
  necesidadParaEditarDepartamento: NecesidadResponse | null = null;
  necesidadSeleccionada: NecesidadResponse | null = null;
  materiaSeleccionada: Materia | null = null;
  necesidadAEliminar: NecesidadResponse | null = null;
  necesidadAEditar: NecesidadResponse | null = null;
  eliminando = false;
  editando = false;

  Math = Math;

  ngOnInit(): void {
    // Los filtros se cargan automáticamente desde el componente hijo
  }

  // ===== MANEJADORES DE EVENTOS DEL COMPONENTE DE FILTROS =====
  onFiltrosAplicados(filtros: NecesidadFilters): void {
    this.filtrosActuales = {
      ...filtros,
      page: 0,
      size: this.filtrosActuales.size,
      sort: buildSortString(this.sortField, this.sortDirection),
    };

    this.cargarNecesidades();
  }

  onFiltrosLimpiados(): void {
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
      this.limpiarSeleccion();
      return;
    }

    if (!this.filtrosActuales.oidPrograma) {
      console.error('No se ha especificado el programa');
      this.necesidades = [];
      this.totalElements = 0;
      this.limpiarSeleccion();
      return;
    }

    this.loading = true;
    this.error = null;
    this.limpiarSeleccion();

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

  // ===== EDITAR DEPARTAMENTO =====
  editarDepartamento(necesidad: NecesidadResponse): void {
    // Secretario puede editar departamento en EN_REVISION_SECRETARIO
    if (necesidad.estado !== 'EN_REVISION_SECRETARIO') {
      this.toastr.warning(
        'Solo se pueden editar departamentos de necesidades en estado EN REVISIÓN SECRETARIO',
        'Operación no permitida'
      );
      return;
    }

    this.necesidadParaEditarDepartamento = necesidad;
    this.mostrarModalEditarDepartamento = true;
  }

  cerrarModalEditarDepartamento(): void {
    this.mostrarModalEditarDepartamento = false;
    this.necesidadParaEditarDepartamento = null;
  }

  onDepartamentoActualizado(): void {
    this.cerrarModalEditarDepartamento();
    this.cargarNecesidades();
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

  // ===== MODAL DE DETALLES DE MATERIA =====
  verDetallesMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.mostrarModalDetalleMateria = true;
  }

  cerrarModalDetalleMateria(): void {
    this.mostrarModalDetalleMateria = false;
    this.materiaSeleccionada = null;
  }

  // ===== ACCIONES CRUD =====
  crearNuevaNecesidad(): void {
    // Validar que haya un programa seleccionado
    if (
      !this.filtrosActuales.oidPrograma ||
      this.filtrosActuales.oidPrograma === ''
    ) {
      this.toastr.warning(
        'Debe seleccionar un programa antes de agregar necesidades'
      );
      return;
    }

    this.mostrarModalSeleccionarPlan = true;
  }

  cerrarModalSeleccionarPlan(): void {
    this.mostrarModalSeleccionarPlan = false;
  }

  onPlanSeleccionado(oidPlan: number): void {
    const oidCalendario = this.filtrosActuales.oidCalendario;

    if (!oidCalendario) {
      this.toastr.error('No se ha seleccionado un calendario', 'Error');
      return;
    }

    // Agregar queryParams con el origen
    this.router.navigate(
      ['/app/gestion-necesidades/crear-desde-plan', oidPlan, oidCalendario],
      { queryParams: { origen: 'secretario' } }
    );
  }

  modificarNecesidad(necesidad: NecesidadResponse): void {
    // Secretario puede editar en EN_REVISION_SECRETARIO
    if (necesidad.estado !== 'EN_REVISION_SECRETARIO') {
      this.toastr.warning(
        'Solo se pueden modificar necesidades en estado EN REVISIÓN SECRETARIO',
        'Operación no permitida'
      );
      return;
    }

    this.necesidadAEditar = necesidad;
    this.mostrarModalEditar = true;
  }

  async confirmarEdicion(dto: UpdateNecesidadDTO): Promise<void> {
    if (!this.necesidadAEditar) return;

    this.editando = true;

    try {
      const resultado = await this.necesidadesHelper.update(dto);

      if (resultado) {
        this.toastr.success(
          `Necesidad "${this.necesidadAEditar.nombreMateria} - Grupo ${dto.grupo}" actualizada correctamente`,
          'Actualización exitosa'
        );
        this.cerrarModalEditar();
        this.cargarNecesidades();
      } else {
        this.toastr.error('No se pudo actualizar la necesidad', 'Error');
      }
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al actualizar la necesidad.';
      this.toastr.error(mensajeError, 'Error al actualizar');
    } finally {
      this.editando = false;
      this.cerrarModalEditar();
    }
  }

  cerrarModalEditar(): void {
    if (!this.editando) {
      this.mostrarModalEditar = false;
      this.necesidadAEditar = null;
    }
  }

  eliminarNecesidad(necesidad: NecesidadResponse): void {
    // Secretario puede eliminar en EN_REVISION_SECRETARIO
    if (necesidad.estado !== 'EN_REVISION_SECRETARIO') {
      this.toastr.warning(
        'Solo se pueden eliminar necesidades en estado EN REVISIÓN SECRETARIO',
        'Operación no permitida'
      );
      return;
    }

    this.necesidadAEliminar = necesidad;
    this.mostrarModalEliminar = true;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.necesidadAEliminar) return;

    this.eliminando = true;

    try {
      const resultado = await this.necesidadesHelper.delete(
        this.necesidadAEliminar.oidNecesidad
      );

      if (resultado) {
        this.toastr.success(
          `Necesidad "${this.necesidadAEliminar.nombreMateria} - Grupo ${this.necesidadAEliminar.grupo}" eliminada exitosamente`,
          'Eliminación exitosa'
        );
        this.cerrarModalEliminar();
        this.cargarNecesidades();
      } else {
        this.toastr.error('No se pudo eliminar la necesidad', 'Error');
      }
    } catch (error: any) {
      console.error('Error al eliminar necesidad:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al eliminar la necesidad.';
      this.toastr.error(mensajeError, 'Error al eliminar');
    } finally {
      this.eliminando = false;
      this.cerrarModalEliminar();
    }
  }

  cerrarModalEliminar(): void {
    if (!this.eliminando) {
      this.mostrarModalEliminar = false;
      this.necesidadAEliminar = null;
    }
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

  // ===== MÉTODOS DE SELECCIÓN MÚLTIPLE =====
  toggleSeleccion(necesidad: NecesidadResponse): void {
    // Validar que solo se puedan seleccionar necesidades en EN_REVISION_SECRETARIO
    if (necesidad.estado !== 'EN_REVISION_SECRETARIO') {
      this.toastr.warning(
        'Solo se pueden seleccionar necesidades en estado EN REVISIÓN SECRETARIO',
        'Selección no permitida'
      );
      return;
    }

    const oid = necesidad.oidNecesidad;

    if (this.necesidadesSeleccionadas.has(oid)) {
      this.necesidadesSeleccionadas.delete(oid);
    } else {
      this.necesidadesSeleccionadas.add(oid);
    }
  }

  toggleTodasSeleccionadas(): void {
    if (this.todasSeleccionadas()) {
      this.limpiarSeleccion();
    } else {
      // Seleccionar solo las necesidades en estado EN_REVISION_SECRETARIO
      const necesidadesSeleccionables = this.getNecesidadesSeleccionables();

      if (necesidadesSeleccionables.length === 0) {
        this.toastr.info(
          'No hay necesidades en estado EN REVISIÓN SECRETARIO para seleccionar',
          'Sin necesidades'
        );
        return;
      }

      necesidadesSeleccionables.forEach((necesidad) => {
        this.necesidadesSeleccionadas.add(necesidad.oidNecesidad);
      });
    }
  }

  estaSeleccionada(necesidad: NecesidadResponse): boolean {
    return this.necesidadesSeleccionadas.has(necesidad.oidNecesidad);
  }

  todasSeleccionadas(): boolean {
    // Verificar solo las necesidades seleccionables
    const necesidadesSeleccionables = this.getNecesidadesSeleccionables();

    if (necesidadesSeleccionables.length === 0) return false;

    return necesidadesSeleccionables.every((necesidad) =>
      this.necesidadesSeleccionadas.has(necesidad.oidNecesidad)
    );
  }

  algunaSeleccionada(): boolean {
    // Verificar solo las necesidades seleccionables
    const necesidadesSeleccionables = this.getNecesidadesSeleccionables();

    if (necesidadesSeleccionables.length === 0) return false;

    return necesidadesSeleccionables.some((necesidad) =>
      this.necesidadesSeleccionadas.has(necesidad.oidNecesidad)
    );
  }

  limpiarSeleccion(): void {
    this.necesidadesSeleccionadas.clear();
  }

  get haySeleccionadas(): boolean {
    return this.necesidadesSeleccionadas.size > 0;
  }

  get totalSeleccionadas(): number {
    return this.necesidadesSeleccionadas.size;
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

  // ===== TRANSICIONES DE ESTADO - SECRETARIO =====
  /**
   * SECRETARIO: EN_REVISION_SECRETARIO → BORRADOR
   */
  devolverABorrador(): void {
    this.iniciarTransicion(
      'EN_REVISION_SECRETARIO',
      'BORRADOR',
      'Devolver a Borrador',
      false
    );
  }

  /**
   * SECRETARIO: EN_REVISION_SECRETARIO → EN_REVISION_JEFE
   */
  enviarARevisionJefe(): void {
    this.iniciarTransicion(
      'EN_REVISION_SECRETARIO',
      'EN_REVISION_JEFE',
      'Enviar a Revisión Jefe',
      false // Requiere departamento
    );
  }

  /**
   * Verifica si hay necesidades en estado EN_REVISION_SECRETARIO en la página actual
   */
  hayNecesidadesEnRevisionSecretario(): boolean {
    return this.necesidades.some(
      (necesidad) => necesidad.estado === 'EN_REVISION_SECRETARIO'
    );
  }

  /**
   * Obtiene solo las necesidades que están en estado EN_REVISION_SECRETARIO
   */
  private getNecesidadesSeleccionables(): NecesidadResponse[] {
    return this.necesidades.filter(
      (necesidad) => necesidad.estado === 'EN_REVISION_SECRETARIO'
    );
  }

  private iniciarTransicion(
    estadoOrigen: string,
    estadoDestino: string,
    tituloAccion: string,
    requiereDepartamento: boolean
  ): void {
    // Validar que haya necesidades seleccionadas
    if (!this.haySeleccionadas) {
      this.toastr.warning(
        'Debe seleccionar al menos una necesidad',
        'Sin selección'
      );
      return;
    }

    // Validaciones
    if (!this.transicionService.validarFiltrosBasicos(this.filtrosActuales)) {
      return;
    }

    if (
      requiereDepartamento &&
      !this.transicionService.validarDepartamento(this.filtrosActuales)
    ) {
      return;
    }

    // Guardar contexto
    this.contextoTransicion = {
      estadoOrigen,
      estadoDestino,
      tituloAccion,
      requiereDepartamento,
    };

    // Mensajes simplificados
    const mensaje = `¿Está seguro de cambiar el estado de ${
      this.totalSeleccionadas === 1
        ? 'la necesidad seleccionada'
        : `las ${this.totalSeleccionadas} necesidades seleccionadas`
    }?`;
    const mensajeSecundario = `${
      this.totalSeleccionadas === 1
        ? 'La necesidad pasará'
        : 'Las necesidades pasarán'
    } de "${estadoOrigen}" a "${estadoDestino}".`;

    // Configurar modal
    this.configModalTransicion = {
      titulo: tituloAccion,
      mensaje: mensaje,
      mensajeSecundario: mensajeSecundario,
      textoBotonConfirmar: 'Sí, cambiar estado',
      textoBotonCancelar: 'Cancelar',
      tipoBotonConfirmar: this.getTipoBotonPorEstado(estadoDestino),
      icono: 'fa-check-square',
    };

    this.mostrarModalTransicion = true;
  }

  async confirmarTransicion(): Promise<void> {
    if (!this.contextoTransicion) return;

    const { estadoOrigen, estadoDestino, tituloAccion, requiereDepartamento } =
      this.contextoTransicion;

    this.transicionandoEstado = true;

    try {
      // Siempre enviar el array de OIDs seleccionados
      const oidNecesidades = Array.from(this.necesidadesSeleccionadas);
      const resultado = await this.transicionService.ejecutarCambioDeEstado(
        estadoOrigen,
        estadoDestino,
        Number(this.filtrosActuales.oidCalendario),
        Number(this.filtrosActuales.oidPrograma),
        requiereDepartamento
          ? Number(this.filtrosActuales.oidDepartamento)
          : undefined,
        oidNecesidades
      );

      this.transicionService.mostrarResultado(resultado, tituloAccion);

      if (resultado.exitoso) {
        this.limpiarSeleccion();
        this.cargarNecesidades();
      }
    } catch (error) {
      console.error('Error en transición:', error);
      this.toastr.error('Error inesperado al cambiar estado', 'Error');
    } finally {
      this.transicionandoEstado = false;
      this.cerrarModalTransicion();
    }
  }

  private getTipoBotonPorEstado(
    estadoDestino: string
  ): 'primary' | 'success' | 'danger' | 'warning' | 'info' {
    switch (estadoDestino) {
      case 'EN_REVISION_JEFE':
        return 'success';
      case 'BORRADOR':
        return 'warning';
      default:
        return 'primary';
    }
  }

  cerrarModalTransicion(): void {
    if (!this.transicionandoEstado) {
      this.mostrarModalTransicion = false;
      this.contextoTransicion = null;
    }
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
