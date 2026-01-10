import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
import { getUserDepartmentJefaturaId } from '../../../auth/utils/user-storage.utils';
import { getBadgeClassEstado } from '../../utils/necesidades.utils';
import { FiltrosNecesidadesJefeComponent } from '../../components/filtros-necesidades-jefe/filtros-necesidades-jefe.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalDetalleMateriaComponent } from '../../components/modales/modal-detalle-materia/modal-detalle-materia.component';
import { ModalEditarNecesidadComponent } from '../../components/modales/modal-editar-necesidad/modal-editar-necesidad.component';
import { ModalEliminarNecesidadComponent } from '../../components/modales/modal-eliminar-necesidad/modal-eliminar-necesidad.component';

@Component({
  selector: 'app-jefe-necesidades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    FiltrosNecesidadesJefeComponent,
    ModalDetalleMateriaComponent,
    ModalConfirmacionComponent,
    ModalEditarNecesidadComponent,
    ModalEliminarNecesidadComponent,
  ],
  templateUrl: './jefe-necesidades.component.html',
  styleUrl: './jefe-necesidades.component.css',
})
export class JefeNecesidadesComponent implements OnInit, OnChanges {
  // ===== SERVICIOS =====
  private necesidadesService = inject(NecesidadesService);
  private transicionService = inject(TransicionEstadosService);
  private necesidadesHelper = inject(NecesidadHelperService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  @Input() isActive: boolean = false;

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

  // CONTEXTO DE LA TRANSICIÓN PENDIENTE
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
    oidDepartamento: '',
  };

  sortField: string = 'oidNecesidad';
  sortDirection: SortDirection = 'desc';

  // ===== DATOS =====
  necesidades: NecesidadResponse[] = [];
  totalElements = 0;
  loading = false;
  error: string | null = null;

  // ===== MODALES =====
  mostrarModalDetalleMateria = false;
  materiaSeleccionada: Materia | null = null;
  // ===== MODALES DE EDICIÓN Y ELIMINACIÓN =====
  mostrarModalEliminar = false;
  mostrarModalEditar = false;
  necesidadAEliminar: NecesidadResponse | null = null;
  necesidadAEditar: NecesidadResponse | null = null;
  eliminando = false;
  editando = false;

  Math = Math;

  oidDepartamentoUsuario: number = 0;

  ngOnInit(): void {
    this.oidDepartamentoUsuario = getUserDepartmentJefaturaId();

    if (!this.oidDepartamentoUsuario || this.oidDepartamentoUsuario === 0) {
      console.error('No se pudo obtener el departamento del usuario logueado');
      this.toastr.error(
        'No se pudo obtener el departamento del usuario',
        'Error de autenticación'
      );
      return;
    }
    // LOS FILTROS SE CARGAN AUTOMÁTICAMENTE DESDE EL COMPONENTE HIJO
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando la tab se activa, recargar datos
    if (changes['isActive'] && changes['isActive'].currentValue === true) {
      // Solo recargar si ya se inicializó
      if (this.filtrosActuales.oidCalendario) {
        this.cargarNecesidades();
      }
    }
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

    if (!this.filtrosActuales.oidDepartamento) {
      console.error('No se ha especificado el departamento');
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
                'No se encontraron necesidades para este calendario y departamento'
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

  // ===== MODAL DE DETALLES DE MATERIA =====
  verDetallesMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.mostrarModalDetalleMateria = true;
  }

  cerrarModalDetalleMateria(): void {
    this.mostrarModalDetalleMateria = false;
    this.materiaSeleccionada = null;
  }

  // ===== EDITAR NECESIDAD - SOLO EN_REVISION_JEFE =====
  modificarNecesidad(necesidad: NecesidadResponse): void {
    if (necesidad.estado !== 'EN_REVISION_JEFE') {
      this.toastr.warning(
        'Solo se pueden modificar necesidades en estado EN REVISIÓN JEFE',
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

  // ===== ELIMINAR NECESIDAD - SOLO EN_REVISION_JEFE =====
  eliminarNecesidad(necesidad: NecesidadResponse): void {
    if (necesidad.estado !== 'EN_REVISION_JEFE') {
      this.toastr.warning(
        'Solo se pueden eliminar necesidades en estado EN REVISIÓN JEFE',
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

  // ===== ACCIONES PARA ASIGNACIONES (PENDIENTES DE IMPLEMENTAR) =====
  asignarDocente(necesidad: NecesidadResponse): void {
    // TODO: Implementar cuando se cree el modal de asignación de docentes
    this.toastr.info(
      `Asignar docente a ${necesidad.nombreMateria} - Grupo ${necesidad.grupo}`,
      'Funcionalidad en desarrollo'
    );
  }

  gestionarAsignaciones(necesidad: NecesidadResponse): void {
    // TODO: Implementar cuando se cree el modal de gestión de asignaciones
    this.toastr.info(
      `Gestionar asignaciones de ${necesidad.nombreMateria} - Grupo ${necesidad.grupo}`,
      'Funcionalidad en desarrollo'
    );
  }

  // ===== MÉTODOS DE SELECCIÓN MÚLTIPLE =====
  toggleSeleccion(necesidad: NecesidadResponse): void {
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
      // SOLO SELECCIONAR LAS QUE ESTÁN EN ESTADO EN_REVISION_JEFE
      this.necesidades.forEach((necesidad) => {
        if (necesidad.estado === 'EN_REVISION_JEFE') {
          this.necesidadesSeleccionadas.add(necesidad.oidNecesidad);
        }
      });
    }
  }

  estaSeleccionada(necesidad: NecesidadResponse): boolean {
    return this.necesidadesSeleccionadas.has(necesidad.oidNecesidad);
  }

  todasSeleccionadas(): boolean {
    if (this.necesidades.length === 0) return false;

    // OBTENER SOLO LAS NECESIDADES EN ESTADO EN_REVISION_JEFE
    const seleccionables = this.necesidades.filter(
      (n) => n.estado === 'EN_REVISION_JEFE'
    );

    if (seleccionables.length === 0) return false;

    return seleccionables.every((necesidad) =>
      this.necesidadesSeleccionadas.has(necesidad.oidNecesidad)
    );
  }

  algunaSeleccionada(): boolean {
    if (this.necesidades.length === 0) return false;
    return this.necesidades.some((necesidad) =>
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

  // ===== UTILIDADES PARA TEMPLATE =====
  getBadgeClassEstado = getBadgeClassEstado;

  // ===== VALIDACIONES PARA CHECKBOXES =====
  checkboxDeshabilitado(necesidad: NecesidadResponse): boolean {
    // JEFE SOLO PUEDE SELECCIONAR NECESIDADES EN ESTADO EN_REVISION_JEFE
    return necesidad.estado !== 'EN_REVISION_JEFE';
  }

  get checkboxSeleccionarTodasDeshabilitado(): boolean {
    // DESHABILITAR SI NO HAY NECESIDADES EN ESTADO EN_REVISION_JEFE
    return !this.necesidades.some((n) => n.estado === 'EN_REVISION_JEFE');
  }

  // ===== TRANSICIONES DE ESTADO - JEFE =====
  /**
   * JEFE: EN_REVISION_JEFE → NO_ASIGNADA
   */
  aprobarNecesidades(): void {
    this.iniciarTransicion(
      'EN_REVISION_JEFE',
      'NO_ASIGNADA',
      'Aprobar Necesidades',
      true // Requiere departamento
    );
  }

  /**
   * JEFE: EN_REVISION_JEFE → EN_REVISION_SECRETARIO
   */
  devolverASecretario(): void {
    this.iniciarTransicion(
      'EN_REVISION_JEFE',
      'EN_REVISION_SECRETARIO',
      'Devolver a Revisión Secretario',
      true // Requiere departamento
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

    // Mensajes personalizados según la acción
    let mensaje = '';
    let mensajeSecundario = '';
    let icono = 'fa-check-square';
    let tipoBoton: 'primary' | 'warning' | 'danger' = 'primary';

    if (estadoDestino === 'NO_ASIGNADA') {
      // APROBAR
      mensaje = `¿Está seguro de aprobar ${
        this.totalSeleccionadas === 1
          ? 'la necesidad seleccionada'
          : `las ${this.totalSeleccionadas} necesidades seleccionadas`
      }?`;
      mensajeSecundario = `${
        this.totalSeleccionadas === 1
          ? 'La necesidad quedará'
          : 'Las necesidades quedarán'
      } disponible${
        this.totalSeleccionadas === 1 ? '' : 's'
      } para asignar docentes.`;
      icono = 'fa-check-circle';
      tipoBoton = 'primary';
    } else if (estadoDestino === 'EN_REVISION_SECRETARIO') {
      // DEVOLVER
      mensaje = `¿Está seguro de devolver ${
        this.totalSeleccionadas === 1
          ? 'la necesidad seleccionada'
          : `las ${this.totalSeleccionadas} necesidades seleccionadas`
      } al Secretario?`;
      mensajeSecundario = `${
        this.totalSeleccionadas === 1
          ? 'La necesidad regresará'
          : 'Las necesidades regresarán'
      } a "EN REVISIÓN SECRETARIO" para correcciones.`;
      icono = 'fa-undo';
      tipoBoton = 'warning';
    }

    // Configurar modal
    this.configModalTransicion = {
      titulo: tituloAccion,
      mensaje: mensaje,
      mensajeSecundario: mensajeSecundario,
      textoBotonConfirmar: 'Sí, cambiar estado',
      textoBotonCancelar: 'Cancelar',
      tipoBotonConfirmar: tipoBoton,
      icono: icono,
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
        undefined, // no se envía oidPrograma
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

  cerrarModalTransicion(): void {
    if (!this.transicionandoEstado) {
      this.mostrarModalTransicion = false;
      this.contextoTransicion = null;
    }
  }

  // ===== HELPER PARA MOSTRAR INFO DE ASIGNACIÓN =====
  getEstadoAsignacion(necesidad: NecesidadResponse): string {
    // TODO: Implementar lógica real cuando tengamos el campo de asignaciones
    // Por ahora retornamos un estado temporal basado en el estado de la necesidad
    if (necesidad.estado === 'ASIGNADA') {
      return 'ASIGNADA';
    } else if (necesidad.estado === 'NO_ASIGNADA') {
      return 'SIN_ASIGNAR';
    }
    return 'N/A';
  }

  getBadgeClassAsignacion(estado: string): string {
    switch (estado) {
      case 'ASIGNADA':
        return 'badge bg-success';
      case 'SIN_ASIGNAR':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  }

  // ===== VALIDACIÓN PARA MOSTRAR BOTONES DE ACCIÓN =====
  puedeAsignarDocente(necesidad: NecesidadResponse): boolean {
    return necesidad.estado === 'NO_ASIGNADA';
  }

  puedeGestionarAsignaciones(necesidad: NecesidadResponse): boolean {
    return necesidad.estado === 'ASIGNADA';
  }
}
