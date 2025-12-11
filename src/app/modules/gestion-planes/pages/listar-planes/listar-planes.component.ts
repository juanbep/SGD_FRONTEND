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

@Component({
  selector: 'app-listar-planes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CrearPlanModalComponent,
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
  readonly estadosDisponibles: EstadoPlan[] = ['ACTIVO', 'INACTIVO'];

  // ===== FILTROS =====
  filtroNumero: string = '';
  filtroEstado: EstadoPlan | '' = '';
  filtroFechaAprobacion: string = '';
  filtroFechaCreacion: string = '';

  // ===== PAGINACIÓN =====
  page = 0;
  size = 10;
  totalElements = 0;

  // ===== DATOS =====
  planes: Plan[] = [];
  loading = false;
  error: string | null = null;

  mostrarModalCrear = false;
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
    };

    // Agregar filtros opcionales
    if (this.filtroNumero?.trim()) {
      filtros.numero = this.filtroNumero.trim();
    }

    if (this.filtroEstado) {
      filtros.estado = this.filtroEstado;
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

  // ===== MANEJADORES DE FILTROS =====
  onFiltroChange(): void {
    this.page = 0;
    this.cargarPlanes();
  }

  limpiarFiltros(): void {
    this.filtroNumero = '';
    this.filtroEstado = '';
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
  crearNuevoPlan(): void {
    this.mostrarModalCrear = true;
  }

  onPlanCreado(planCreado: Plan): void {
    this.mostrarModalCrear = false;
    this.cargarPlanes(); // Recargar lista
  }

  onCancelarCreacion(): void {
    this.mostrarModalCrear = false;
  }

  verDetallesPlan(plan: Plan): void {
    this.onVerDetalles.emit(plan);
  }

  modificarPlan(plan: Plan): void {
    this.onModificar.emit(plan);
  }

  cambiarEstadoPlan(plan: Plan): void {
    this.onCambiarEstado.emit(plan);
  }

  //validar si esto es necesario
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
