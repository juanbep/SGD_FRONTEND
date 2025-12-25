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

@Component({
  selector: 'app-list-necesidades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './list-necesidades.component.html',
  styleUrl: './list-necesidades.component.css',
})
export class ListNecesidadesComponent implements OnInit {
  // ===== SERVICIOS =====
  private toastr = inject(ToastrService);

  // ===== REFERENCIA AL INPUT FILE =====
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ===== OPCIONES DE FILTROS =====
  readonly semestresDisponibles: { value: number | string; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'NO_APLICA', label: 'No aplica' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
  ];

  readonly gruposDisponibles: { value: string; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
  ];

  readonly estadosDisponibles: { value: string; label: string }[] = [
    { value: 'TODOS', label: 'TODOS' },
    { value: 'BORRADOR', label: 'BORRADOR' },
    { value: 'EN_REVISION_SECRETARIO', label: 'EN REVISIÓN SECRETARIO' },
    { value: 'EN_REVISION_JEFE', label: 'EN REVISIÓN JEFE' },
    { value: 'NO_ASIGNADA', label: 'NO ASIGNADA' },
    { value: 'ASIGNADA', label: 'ASIGNADA' },
  ];

  pageSizeOptions = [5, 10, 25, 50];

  // ===== CALENDARIOS =====
  calendarios: { value: number; label: string }[] = [];
  loadingCalendarios = false;

  // ===== FILTROS =====
  filtroCalendario: number | null = null;
  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | string = 'TODOS';
  filtroGrupo: string = 'TODOS';
  filtroCupo: number | null = null;
  filtroEstado: string = 'TODOS';

  // ===== PAGINACIÓN Y ORDENAMIENTO =====
  page = 0;
  size = 10;
  totalElements = 0;
  sortField: string = 'oidNecesidad';
  sortDirection: 'asc' | 'desc' = 'desc';

  // ===== DATOS =====
  necesidades: any[] = [];
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
  necesidadSeleccionada: any = null;

  Math = Math;

  ngOnInit(): void {
    this.cargarCalendarios();
  }

  // ===== CARGAR CALENDARIOS =====
  cargarCalendarios(): void {
    this.loadingCalendarios = true;
    // TODO: Implementar servicio
    setTimeout(() => {
      this.calendarios = [
        { value: 1, label: '2025-1' },
        { value: 2, label: '2025-2' },
      ];
      this.loadingCalendarios = false;
    }, 500);
  }

  onCalendarioChange(): void {
    this.page = 0;
    this.cargarNecesidades();
  }

  // ===== CARGAR NECESIDADES =====
  cargarNecesidades(mostrarToast: boolean = false): void {
    this.loading = true;
    this.error = null;

    // TODO: Implementar servicio
    setTimeout(() => {
      this.necesidades = [];
      this.totalElements = 0;
      this.loading = false;

      if (mostrarToast) {
        this.toastr.info('Función cargarNecesidades pendiente de implementar');
      }
    }, 1000);
  }

  // ===== FILTROS =====
  buscarConFiltros(): void {
    this.page = 0;
    this.cargarNecesidades();
  }

  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = 'TODOS';
    this.filtroGrupo = 'TODOS';
    this.filtroCupo = null;
    this.filtroEstado = 'TODOS';
    this.page = 0;
    this.cargarNecesidades();
  }

  hasFiltrosActivos(): boolean {
    return (
      this.filtroOid !== '' ||
      this.filtroCodigo !== '' ||
      this.filtroNombre !== '' ||
      this.filtroSemestre !== 'TODOS' ||
      this.filtroGrupo !== 'TODOS' ||
      this.filtroCupo !== null ||
      this.filtroEstado !== 'TODOS'
    );
  }

  // ===== ORDENAMIENTO =====
  onSort(campo: string): void {
    if (this.sortField === campo) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = campo;
      this.sortDirection = 'asc';
    }
    this.page = 0;
    this.cargarNecesidades();
  }

  getSortIcon(campo: string): string {
    if (this.sortField !== campo) {
      return 'fas fa-sort text-muted';
    }
    return this.sortDirection === 'asc'
      ? 'fas fa-sort-up text-primary'
      : 'fas fa-sort-down text-primary';
  }

  // ===== PAGINACIÓN =====
  onPageSizeChange(): void {
    this.page = 0;
    this.cargarNecesidades();
  }

  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarNecesidades();
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

  trackByNecesidad(index: number, item: any): any {
    return item.oidNecesidad || index;
  }

  // ===== ACCIONES =====
  crearNuevaNecesidad(): void {
    this.toastr.info('Crear necesidad - pendiente de implementar');
  }

  modificarNecesidad(necesidad: any): void {
    this.toastr.info('Modificar necesidad - pendiente de implementar');
  }

  eliminarNecesidad(necesidad: any): void {
    this.toastr.info('Eliminar necesidad - pendiente de implementar');
  }

  gestionarCorrequisitos(necesidad: any): void {
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

  // ===== UTILIDADES =====
  getBadgeClassEstado(estado: string): string {
    const clases: Record<string, string> = {
      BORRADOR: 'bg-secondary',
      EN_REVISION_SECRETARIO: 'bg-warning',
      EN_REVISION_JEFE: 'bg-info',
      NO_ASIGNADA: 'bg-primary',
      ASIGNADA: 'bg-success',
    };
    return clases[estado] || 'bg-secondary';
  }

  reintentar(): void {
    this.cargarNecesidades(true);
  }
}
