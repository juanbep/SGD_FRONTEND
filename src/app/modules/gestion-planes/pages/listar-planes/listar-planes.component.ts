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
import { RouterModule } from '@angular/router';
import { EstadoPlan, Plan, PlanFilters } from '../../models';
import { PlanService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { CrearPlanModalComponent } from '../../components/crear-plan-modal/crear-plan-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { getUserProgramaId } from '../../../auth/utils/user-storage.utils';
import { EditarPlanModalComponentComponent } from '../../components/editar-plan-modal-component/editar-plan-modal.component';
import { EliminarPlanModalComponent } from '../../components/eliminar-plan-modal/eliminar-plan-modal.component';

@Component({
  selector: 'app-listar-planes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CrearPlanModalComponent,
    EditarPlanModalComponentComponent,
    EliminarPlanModalComponent,
    NgSelectModule,
  ],
  templateUrl: './listar-planes.component.html',
  styleUrl: './listar-planes.component.css',
})
export class ListarPlanesComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'gestionar';
  @Output() onNuevoPlan = new EventEmitter<void>();
  @Output() onVerDetalles = new EventEmitter<Plan>();
  @Output() onModificar = new EventEmitter<Plan>();
  @Output() onCambiarEstado = new EventEmitter<Plan>();

  // ===== SERVICIOS =====
  private planService = inject(PlanService);
  private toastr = inject(ToastrService);

  // ===== ESTADOS DISPONIBLES =====
  readonly estadosDisponibles: (EstadoPlan | 'TODOS')[] = [
    'TODOS',
    'ACTIVO',
    'INACTIVO',
  ];

  // ===== FILTROS =====
  filtroNumero: number | null = null;
  filtroEstado: EstadoPlan | 'TODOS' | '' = 'TODOS';
  filtroFechaAprobacion: string = '';
  filtroFechaCreacion: string = '';

  // ===== ORDENAMIENTO =====
  sortField: string = 'numero';
  sortDirection: 'asc' | 'desc' = 'desc';

  // ===== PAGINACIÓN =====
  page = 0;
  size = 10;
  totalElements = 0;

  // ===== DATOS =====
  planes: Plan[] = [];
  loading = false;
  error: string | null = null;

  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  planAEditar: Plan | null = null;
  planAEliminar: Plan | null = null;
  oidProgramaActual = getUserProgramaId();

  // ===== UTILIDADES =====
  Math = Math;

  ngOnInit(): void {
    this.cargarPlanes();
  }

  // ===== CARGAR PLANES =====
  cargarPlanes(): void {
    this.loading = true;
    this.error = null;

    const filtros: PlanFilters = {
      page: this.page,
      size: this.size,
      oidPrograma: this.oidProgramaActual,
      sort: `${this.sortField},${this.sortDirection}`,
    };

    // Agregar filtros opcionales
    if (this.filtroNumero !== null) {
      filtros.numero = this.filtroNumero;
    }

    if (this.filtroEstado && this.filtroEstado !== 'TODOS') {
      filtros.estado = this.filtroEstado as EstadoPlan;
    }

    if (this.filtroFechaAprobacion) {
      filtros.fechaAprobacionDesde = this.filtroFechaAprobacion;
      filtros.fechaAprobacionHasta = this.filtroFechaAprobacion;
    }

    if (this.filtroFechaCreacion) {
      filtros.fechaCreacionDesde = this.filtroFechaCreacion;
      filtros.fechaCreacionHasta = this.filtroFechaCreacion;
    }

    this.planService.getPlanes(filtros).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.planes = response.data.content;
          this.totalElements = response.data.totalElements;
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error, 'cargar planes');
        this.loading = false;
      },
    });
  }

  onSort(campo: string): void {
    if (this.sortField === campo) {
      // Si es el mismo campo, cambiar dirección
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es un campo nuevo, establecer como ascendente por defecto
      this.sortField = campo;
      this.sortDirection = 'asc';
    }
    this.page = 0; // Resetear a primera página
    this.cargarPlanes();
  }

  getSortIcon(campo: string): string {
    if (this.sortField !== campo) {
      return 'fas fa-sort text-muted'; // No ordenado
    }
    return this.sortDirection === 'asc'
      ? 'fas fa-sort-up text-primary'
      : 'fas fa-sort-down text-primary';
  }

  // ===== MANEJADORES DE FILTROS =====
  onFiltroChange(): void {
    this.page = 0;
    this.cargarPlanes();
  }

  limpiarFiltros(): void {
    this.filtroNumero = null;
    this.filtroEstado = 'TODOS';
    this.filtroFechaAprobacion = '';
    this.filtroFechaCreacion = '';
    this.page = 0;
    this.cargarPlanes();
  }

  onPageSizeChange(event: any): void {
    this.size = parseInt(event.target.value);
    this.page = 0;
    this.cargarPlanes();
  }

  // ===== PAGINACIÓN =====
  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarPlanes();
  }

  getTotalPaginas(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  getPaginasVisibles(): number[] {
    const totalPaginas = this.getTotalPaginas();
    if (totalPaginas <= 1) return [];

    const paginas: number[] = [];
    const inicio = Math.max(0, this.page - 2);
    const fin = Math.min(totalPaginas - 1, this.page + 2);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  getInfoPaginacion(): string {
    if (this.totalElements === 0) return '0 registros';

    const inicio = this.page * this.size + 1;
    const fin = Math.min((this.page + 1) * this.size, this.totalElements);

    return `${inicio} - ${fin} de ${this.totalElements} registros`;
  }

  // ===== UTILIDADES =====
  getBadgeClass(estado: EstadoPlan): string {
    const clases: Record<EstadoPlan, string> = {
      ACTIVO: 'bg-success',
      INACTIVO: 'bg-secondary',
    };
    return clases[estado] || 'bg-secondary';
  }

  trackByPlan(index: number, item: Plan): any {
    return item.oidPlan;
  }

  // ===== ACCIONES =====
  eliminarPlan(plan: Plan): void {
    this.planAEliminar = plan;
    this.mostrarModalEliminar = true;
  }

  onPlanEliminado(): void {
    this.mostrarModalEliminar = false;
    this.planAEliminar = null;
    this.cargarPlanes();
  }

  onCancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.planAEliminar = null;
  }

  crearNuevoPlan(): void {
    this.mostrarModalCrear = true;
  }

  onPlanCreado(): void {
    this.mostrarModalCrear = false;
    this.cargarPlanes();
  }

  onCancelarCreacion(): void {
    this.mostrarModalCrear = false;
  }

  verDetallesPlan(plan: Plan): void {
    this.onVerDetalles.emit(plan);
  }

  modificarPlan(plan: Plan): void {
    this.planAEditar = plan;
    this.mostrarModalEditar = true;
  }

  onPlanActualizado(): void {
    this.mostrarModalEditar = false;
    this.planAEditar = null;
    this.cargarPlanes();
  }

  onCancelarEdicion(): void {
    this.mostrarModalEditar = false;
    this.planAEditar = null;
  }

  cambiarEstadoPlan(plan: Plan): void {
    this.onCambiarEstado.emit(plan);
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

  reintentar(): void {
    this.cargarPlanes();
  }
}
