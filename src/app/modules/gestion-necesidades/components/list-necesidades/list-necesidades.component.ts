import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import {
  NecesidadesService,
  NecesidadHelperService,
  TransicionEstadosService,
} from '../../services';
import {
  Materia,
  NecesidadFilters,
  NecesidadResponse,
  UpdateNecesidadDTO,
} from '../../models';
import { getBadgeClassEstado } from '../../utils/necesidades.utils';
import { FiltrosNecesidadesCoordinadorComponent } from '../filtros-necesidades-coordinador/filtros-necesidades-coordinador.component';
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
import { ModalDetalleMateriaComponent } from '../modales/modal-detalle-materia/modal-detalle-materia.component';
import { ModalEditarDepartamentoComponent } from '../modales/modal-editar-departamento/modal-editar-departamento.component';
import {
  ModalConfirmacionComponent,
  ModalConfirmacionConfig,
} from '../modales/modal-confirmacion/modal-confirmacion.component';
import { ModalSeleccionarPlanComponent } from '../modales/modal-seleccionar-plan/modal-seleccionar-plan.component';
import { ModalEliminarNecesidadComponent } from '../modales/modal-eliminar-necesidad/modal-eliminar-necesidad.component';
import { ModalEditarNecesidadComponent } from '../modales/modal-editar-necesidad/modal-editar-necesidad.component';

@Component({
  selector: 'app-list-necesidades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    FiltrosNecesidadesCoordinadorComponent,
    ModalDetalleMateriaComponent,
    ModalSeleccionarPlanComponent,
    ModalEliminarNecesidadComponent,
    ModalEditarNecesidadComponent,
    ModalEditarDepartamentoComponent,
    ModalConfirmacionComponent,
  ],
  templateUrl: './list-necesidades.component.html',
  styleUrl: './list-necesidades.component.css',
})
export class ListNecesidadesComponent implements OnInit {
  // ===== SERVICIOS =====
  private necesidadesService = inject(NecesidadesService);
  private necesidadesHelper = inject(NecesidadHelperService);
  private transicionService = inject(TransicionEstadosService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // ===== REFERENCIA AL INPUT FILE =====
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ===== ROL DEL USUARIO =====
  usuarioRol: 'COORDINADOR' | 'SECRETARIO' | 'DECANO' | 'JEFE' = 'COORDINADOR'; // TODO: Obtener del servicio de autenticación

  // ===== SELECCIÓN MÚLTIPLE =====
  necesidadesSeleccionadas: Set<number> = new Set();

  // ===== ESTADOS PARA TRANSICIONES =====
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
  mostrarModalCorrequisitos = false;
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

  editarDepartamento(necesidad: NecesidadResponse): void {
    // Validar que solo se pueda editar si está en BORRADOR
    if (necesidad.estado !== 'BORRADOR') {
      this.toastr.warning(
        'Solo se pueden editar departamentos de necesidades en estado BORRADOR',
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

  // ===== ACCIONES =====
  crearNuevaNecesidad(): void {
    this.mostrarModalSeleccionarPlan = true;
  }

  cerrarModalSeleccionarPlan(): void {
    this.mostrarModalSeleccionarPlan = false;
  }

  onPlanSeleccionado(oidPlan: number): void {
    // Obtener el calendario actual de los filtros
    const oidCalendario = this.filtrosActuales.oidCalendario;

    if (!oidCalendario) {
      this.toastr.error('No se ha seleccionado un calendario', 'Error');
      return;
    }

    // Navegar a la vista de creación con parámetros
    this.router.navigate([
      '/app/gestion-necesidades/crear-desde-plan',
      oidPlan,
      oidCalendario,
    ]);
  }

  modificarNecesidad(necesidad: NecesidadResponse): void {
    // Validar que solo se pueda editar si está en BORRADOR
    if (necesidad.estado !== 'BORRADOR') {
      this.toastr.warning(
        'Solo se pueden modificar necesidades en estado BORRADOR',
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
    // Validar que solo se pueda eliminar si está en BORRADOR
    if (necesidad.estado !== 'BORRADOR') {
      this.toastr.warning(
        'Solo se pueden eliminar necesidades en estado BORRADOR',
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
      // Si todas están seleccionadas, limpiar
      this.limpiarSeleccion();
    } else {
      // Solo seleccionar las que NO están deshabilitadas
      this.necesidades.forEach((necesidad) => {
        if (!this.checkboxDeshabilitado(necesidad)) {
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

    // Obtener solo las necesidades que pueden ser seleccionadas
    const seleccionables = this.necesidades.filter(
      (n) => !this.checkboxDeshabilitado(n)
    );

    // Si no hay ninguna seleccionable, retornar false
    if (seleccionables.length === 0) return false;

    // Verificar si todas las seleccionables están marcadas
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

  // ===== GETTERS DE PERMISOS POR ROL =====

  get puedeCrearNecesidades(): boolean {
    return this.usuarioRol === 'COORDINADOR';
  }

  get puedeModificarBorrador(): boolean {
    return this.usuarioRol === 'COORDINADOR';
  }

  get puedeEnviarARevisionSecretario(): boolean {
    return this.usuarioRol === 'COORDINADOR';
  }

  get puedeEnviarARevisionJefe(): boolean {
    return this.usuarioRol === 'SECRETARIO' || this.usuarioRol === 'DECANO';
  }

  get puedeDevolverASecretario(): boolean {
    return this.usuarioRol === 'DECANO' || this.usuarioRol === 'JEFE';
  }

  get puedeDevolverABorrador(): boolean {
    return this.usuarioRol === 'SECRETARIO' || this.usuarioRol === 'DECANO';
  }

  get puedeLiberarParaAsignacion(): boolean {
    return this.usuarioRol === 'JEFE';
  }

  // Getter para saber si el usuario puede realizar transiciones de estado
  get puedeRealizarTransiciones(): boolean {
    return (
      this.puedeEnviarARevisionSecretario ||
      this.puedeEnviarARevisionJefe ||
      this.puedeDevolverASecretario ||
      this.puedeDevolverABorrador ||
      this.puedeLiberarParaAsignacion
    );
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

  // ===== MÉTODOS DE TRANSICIÓN DE ESTADO (SIMPLIFICADOS) =====

  /**
   * COORDINADOR: BORRADOR → EN_REVISION_SECRETARIO
   */
  enviarARevisionSecretario(): void {
    this.iniciarTransicion(
      'BORRADOR',
      'EN_REVISION_SECRETARIO',
      'Enviar a Revisión Secretario',
      false
    );
  }

  /**
   * SECRETARIO/DECANO: EN_REVISION_SECRETARIO → BORRADOR
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
   * SECRETARIO/DECANO: EN_REVISION_SECRETARIO → EN_REVISION_JEFE
   */
  enviarARevisionJefe(): void {
    this.iniciarTransicion(
      'EN_REVISION_SECRETARIO',
      'EN_REVISION_JEFE',
      'Enviar a Revisión Jefe',
      true
    );
  }

  /**
   * DECANO/JEFE: EN_REVISION_JEFE → EN_REVISION_SECRETARIO
   */
  devolverASecretario(): void {
    this.iniciarTransicion(
      'EN_REVISION_JEFE',
      'EN_REVISION_SECRETARIO',
      'Devolver a Secretario',
      true
    );
  }

  /**
   * JEFE: EN_REVISION_JEFE → NO_ASIGNADA
   */
  liberarParaAsignacion(): void {
    this.iniciarTransicion(
      'EN_REVISION_JEFE',
      'NO_ASIGNADA',
      'Liberar para Asignación',
      true
    );
  }

  private iniciarTransicion(
    estadoOrigen: string,
    estadoDestino: string,
    tituloAccion: string,
    requiereDepartamento: boolean
  ): void {
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

    // Determinar mensajes según si hay selección o no
    const usarSeleccion = this.haySeleccionadas;

    let mensaje: string;
    let mensajeSecundario: string;

    if (usarSeleccion) {
      // HAY SELECCIÓN
      mensaje = `¿Está seguro de cambiar el estado de las ${this.totalSeleccionadas} necesidades SELECCIONADAS?`;
      mensajeSecundario = `Las necesidades seleccionadas pasarán de "${estadoOrigen}" a "${estadoDestino}".`;
    } else {
      // NO HAY SELECCIÓN = TODAS
      mensaje = `⚠️ ¿Está seguro de cambiar el estado de TODAS las ${this.totalElements} necesidades?`;
      mensajeSecundario = `Esta acción afectará a TODAS las necesidades del calendario y programa que estén en estado "${estadoOrigen}".`;
    }

    // Configurar modal
    this.configModalTransicion = {
      titulo: tituloAccion,
      mensaje: mensaje,
      mensajeSecundario: mensajeSecundario,
      textoBotonConfirmar: 'Sí, cambiar estado',
      textoBotonCancelar: 'Cancelar',
      tipoBotonConfirmar: this.getTipoBotonPorEstado(estadoDestino),
      icono: usarSeleccion ? 'fa-check-square' : 'fa-exclamation-triangle',
    };

    this.mostrarModalTransicion = true;
  }

  async confirmarTransicion(): Promise<void> {
    if (!this.contextoTransicion) return;

    const { estadoOrigen, estadoDestino, tituloAccion, requiereDepartamento } =
      this.contextoTransicion;

    this.transicionandoEstado = true;

    try {
      // Decidir qué enviar al backend
      let oidNecesidades: number[] | undefined;

      if (this.haySeleccionadas) {
        // Hay checkboxes marcados: enviar solo esos OIDs
        oidNecesidades = Array.from(this.necesidadesSeleccionadas);
      } else {
        // No hay checkboxes marcados: enviar undefined (backend procesa TODAS)
        oidNecesidades = undefined;
      }

      // Ejecutar transición
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

      // Mostrar resultado
      this.transicionService.mostrarResultado(resultado, tituloAccion);

      // Si fue exitoso, recargar
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

  /**
   * Determina el color del botón según el estado destino
   */
  private getTipoBotonPorEstado(
    estadoDestino: string
  ): 'primary' | 'success' | 'danger' | 'warning' | 'info' {
    switch (estadoDestino) {
      case 'EN_REVISION_SECRETARIO':
        return 'primary';
      case 'EN_REVISION_JEFE':
        return 'success';
      case 'NO_ASIGNADA':
        return 'info';
      case 'BORRADOR':
        return 'warning';
      default:
        return 'primary';
    }
  }

  /**
   * Determina si un checkbox debe estar deshabilitado según el rol y estado
   * COORDINADOR: No puede seleccionar necesidades que ya envió a revisión
   */
  checkboxDeshabilitado(necesidad: NecesidadResponse): boolean {
    if (this.usuarioRol === 'COORDINADOR') {
      // El coordinador solo puede seleccionar necesidades en BORRADOR
      return necesidad.estado !== 'BORRADOR';
    }

    // Otros roles pueden seleccionar cualquier necesidad
    return false;
  }

  /**
   * Determina si el checkbox "Seleccionar todas" debe estar deshabilitado
   */
  get checkboxSeleccionarTodasDeshabilitado(): boolean {
    if (this.usuarioRol === 'COORDINADOR') {
      // Si no hay necesidades en BORRADOR, deshabilitar
      return !this.necesidades.some((n) => n.estado === 'BORRADOR');
    }
    return false;
  }

  /**
   * Cierra el modal de transición
   */
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
