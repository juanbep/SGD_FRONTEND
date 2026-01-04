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
import { FiltrosNecesidadesJefeComponent } from '../../components/filtros-necesidades-jefe/filtros-necesidades-jefe.component';
import { ModalDetalleMateriaComponent } from '../../components/modales/modal-detalle-materia/modal-detalle-materia.component';
import {
  ModalConfirmacionComponent,
  ModalConfirmacionConfig,
} from '../../components/modales/modal-confirmacion/modal-confirmacion.component';
import { ToastrService } from 'ngx-toastr';
import { NecesidadesService, TransicionEstadosService } from '../../services';
import { Materia, NecesidadFilters, NecesidadResponse } from '../../models';
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
import { getUserDepartmentId } from '../../../auth/utils/user-storage.utils';
import { getBadgeClassEstado } from '../../utils/necesidades.utils';

@Component({
  selector: 'app-jefe-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    FiltrosNecesidadesJefeComponent,
    ModalDetalleMateriaComponent,
    ModalConfirmacionComponent,
  ],
  templateUrl: './jefe-asignaciones.component.html',
  styleUrl: './jefe-asignaciones.component.css',
})
export class JefeAsignacionesComponent implements OnInit, OnChanges {
  // ===== SERVICIOS =====
  private necesidadesService = inject(NecesidadesService);
  private transicionService = inject(TransicionEstadosService);
  private toastr = inject(ToastrService);

  // ===== SELECCIÓN MÚLTIPLE =====
  necesidadesSeleccionadas: Set<number> = new Set();

  @Input() isActive: boolean = false;

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
    estado: 'NO_ASIGNADA', // Filtro por defecto
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
                'Lista de asignaciones actualizada correctamente'
              );
            } else {
              this.toastr.info('No se encontraron necesidades para asignar');
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

  // ===== ACCIONES PARA ASIGNACIONES =====
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
      // SOLO SELECCIONAR LAS QUE ESTÁN EN ESTADO NO_ASIGNADA
      this.necesidades.forEach((necesidad) => {
        if (necesidad.estado === 'NO_ASIGNADA') {
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

    // OBTENER SOLO LAS NECESIDADES EN ESTADO NO_ASIGNADA
    const seleccionables = this.necesidades.filter(
      (n) => n.estado === 'NO_ASIGNADA'
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

  // ===== VALIDACIONES PARA CHECKBOXES =====
  checkboxDeshabilitado(necesidad: NecesidadResponse): boolean {
    // SOLO SE PUEDEN SELECCIONAR NECESIDADES EN ESTADO NO_ASIGNADA
    return necesidad.estado !== 'NO_ASIGNADA';
  }

  get checkboxSeleccionarTodasDeshabilitado(): boolean {
    // DESHABILITAR SI NO HAY NECESIDADES EN ESTADO NO_ASIGNADA
    return !this.necesidades.some((n) => n.estado === 'NO_ASIGNADA');
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

  // ===== TRANSICIÓN DE ESTADO - DEVOLVER A REVISIÓN JEFE =====
  /**
   * JEFE: NO_ASIGNADA → EN_REVISION_JEFE
   */
  devolverARevisionJefe(): void {
    this.iniciarTransicion(
      'NO_ASIGNADA',
      'EN_REVISION_JEFE',
      'Devolver a Revisión Jefe',
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

    // Mensajes
    const mensaje = `¿Está seguro de devolver ${
      this.totalSeleccionadas === 1
        ? 'la necesidad seleccionada'
        : `las ${this.totalSeleccionadas} necesidades seleccionadas`
    } a revisión?`;

    const mensajeSecundario = `${
      this.totalSeleccionadas === 1
        ? 'La necesidad regresará'
        : 'Las necesidades regresarán'
    } a "EN REVISIÓN JEFE" para correcciones.`;

    // Configurar modal
    this.configModalTransicion = {
      titulo: tituloAccion,
      mensaje: mensaje,
      mensajeSecundario: mensajeSecundario,
      textoBotonConfirmar: 'Sí, devolver',
      textoBotonCancelar: 'Cancelar',
      tipoBotonConfirmar: 'warning',
      icono: 'fa-undo',
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
        this.filtrosActuales.oidPrograma
          ? Number(this.filtrosActuales.oidPrograma)
          : 0, //validar y ajustar esta parte, no se le puede pasar 0 por defecto ///////////////////////////////////////////
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

  // ===== HELPER PARA MOSTRAR INFO DE ASIGNACIÓN =====
  getEstadoAsignacion(necesidad: NecesidadResponse): string {
    // TODO: Implementar lógica real cuando tengamos el campo de asignaciones
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
