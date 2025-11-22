import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadoPlan, Plan } from '../../models';

@Component({
  selector: 'app-listar-planes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-planes.component.html',
  styleUrl: './listar-planes.component.css',
})
export class ListarPlanesComponent implements OnInit {
  @Input() modo: 'visualizar' | 'gestionar' = 'gestionar';
  @Output() onNuevoPlan = new EventEmitter<void>();
  @Output() onVerDetalles = new EventEmitter<Plan>();
  @Output() onModificar = new EventEmitter<Plan>();
  @Output() onCambiarEstado = new EventEmitter<Plan>();

  // ===== ESTADOS DISPONIBLES =====
  readonly estadosDisponibles: EstadoPlan[] = [
    'ACTIVO',
    'INACTIVO',
    'EN_REVISION',
    'APROBADO',
  ];

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

  // ===== UTILIDADES =====
  Math = Math;

  ngOnInit(): void {
    this.cargarPlanes();
  }

  // ===== CARGAR DATOS (CON MOCK) =====
  cargarPlanes(): void {
    this.loading = true;
    this.error = null;

    // Simulamos llamada asíncrona con setTimeout
    setTimeout(() => {
      // DATOS MOCK - Reemplazar con servicio real
      const todosMock: Plan[] = [
        {
          oidPlan: 1,
          numero: '001',
          estado: 'ACTIVO',
          fechaAprobacion: '2024-01-15',
          acuerdo: 'ACU-2024-001',
          oidPrograma: 101,
          nombrePrograma: 'Ingeniería de Sistemas',
          fechaCreacion: '2024-01-10',
          fechaActualizacion: '2024-01-15',
          usuarioCreacion: 'admin',
          usuarioActualizacion: 'admin',
        },
        {
          oidPlan: 2,
          numero: '002',
          estado: 'INACTIVO',
          fechaAprobacion: '2023-06-20',
          acuerdo: 'ACU-2023-045',
          oidPrograma: 102,
          nombrePrograma: 'Ingeniería de Sistemas',
          fechaCreacion: '2023-06-15',
          fechaActualizacion: '2024-03-10',
          usuarioCreacion: 'jperez',
          usuarioActualizacion: 'admin',
        },
        {
          oidPlan: 3,
          numero: '001',
          estado: 'APROBADO',
          fechaAprobacion: '2024-02-10',
          acuerdo: 'ACU-2024-012',
          oidPrograma: 103,
          nombrePrograma: 'Ingeniería de Sistemas',
          fechaCreacion: '2024-02-01',
          fechaActualizacion: '2024-02-10',
          usuarioCreacion: 'mlopez',
          usuarioActualizacion: 'mlopez',
        },
        {
          oidPlan: 4,
          numero: '003',
          estado: 'EN_REVISION',
          fechaAprobacion: '2024-03-05',
          acuerdo: 'ACU-2024-023',
          oidPrograma: 101,
          nombrePrograma: 'Ingeniería de Sistemas',
          fechaCreacion: '2024-02-28',
          fechaActualizacion: '2024-03-05',
          usuarioCreacion: 'admin',
          usuarioActualizacion: 'admin',
        },
        {
          oidPlan: 5,
          numero: '002',
          estado: 'ACTIVO',
          fechaAprobacion: '2024-04-12',
          acuerdo: 'ACU-2024-034',
          oidPrograma: 104,
          nombrePrograma: 'Ingeniería de Sistemas',
          fechaCreacion: '2024-04-01',
          fechaActualizacion: '2024-04-12',
          usuarioCreacion: 'lgarcia',
          usuarioActualizacion: 'lgarcia',
        },
        {
          oidPlan: 6,
          numero: '001',
          estado: 'ACTIVO',
          fechaAprobacion: '2024-05-20',
          acuerdo: 'ACU-2024-047',
          oidPrograma: 105,
          nombrePrograma: 'Ingeniería de Sistemas',
          fechaCreacion: '2024-05-10',
          fechaActualizacion: '2024-05-20',
          usuarioCreacion: 'crodriguez',
          usuarioActualizacion: 'crodriguez',
        },
      ];

      // Aplicar filtros
      let planesFiltrados = [...todosMock];

      if (this.filtroNumero) {
        planesFiltrados = planesFiltrados.filter((p) =>
          p.numero.toLowerCase().includes(this.filtroNumero.toLowerCase())
        );
      }

      if (this.filtroEstado) {
        planesFiltrados = planesFiltrados.filter(
          (p) => p.estado === this.filtroEstado
        );
      }

      if (this.filtroFechaAprobacion) {
        planesFiltrados = planesFiltrados.filter(
          (p) => p.fechaAprobacion === this.filtroFechaAprobacion
        );
      }

      if (this.filtroFechaCreacion) {
        planesFiltrados = planesFiltrados.filter(
          (p) => p.fechaCreacion === this.filtroFechaCreacion
        );
      }

      // Simular paginación
      this.totalElements = planesFiltrados.length;
      const inicio = this.page * this.size;
      const fin = inicio + this.size;
      this.planes = planesFiltrados.slice(inicio, fin);

      this.loading = false;
    }, 800);
  }

  // ===== MANEJADORES DE FILTROS =====
  onFiltroChange(): void {
    this.page = 0; // Resetear a página 1 al cambiar filtro
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
      EN_REVISION: 'bg-warning',
      APROBADO: 'bg-info',
    };
    return clases[estado] || 'bg-secondary';
  }

  trackByPlan(index: number, item: Plan): any {
    return item.oidPlan;
  }

  // ===== ACCIONES =====
  crearNuevoPlan(): void {
    console.log('Crear nuevo plan');
    this.onNuevoPlan.emit();
  }

  verDetallesPlan(plan: Plan): void {
    console.log('Ver detalles del plan:', plan);
    this.onVerDetalles.emit(plan);
  }

  modificarPlan(plan: Plan): void {
    console.log('Modificar plan:', plan);
    this.onModificar.emit(plan);
  }

  cambiarEstadoPlan(plan: Plan): void {
    console.log('Cambiar estado del plan:', plan);
    this.onCambiarEstado.emit(plan);
  }

  reintentar(): void {
    this.cargarPlanes();
  }
}
