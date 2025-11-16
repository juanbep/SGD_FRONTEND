import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import {
  FilterModalComponent,
  CampoFiltro,
  ValoresFiltros,
} from '../../../../shared/components/filter-modal/filter-modal.component';

interface NeedRow {
  oid: string;
  codigo: string;
  nombre: string;
  semestre: string;
  grupo: string;
  cupo: number;
  horasSemanales: number;
  periodoOid?: string;
}

@Component({
  selector: 'app-manage-needs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginatorComponent,
    FilterModalComponent,
  ],
  templateUrl: './manage-needs.component.html',
  styleUrls: ['./manage-needs.component.css'],
})
export class ManageNeedsComponent {
  // Datos mock para visualización
  allNeeds: NeedRow[] = [];
  needs: NeedRow[] = [];

  // Opciones mock para filtros
  periodos = [
    { oid: 'P-2025-1', label: '2025 - I' },
    { oid: 'P-2025-2', label: '2025 - II' },
  ];

  // Filtro seleccionado
  filtroPeriodo: string = '';

  // Control del modal de filtros
  mostrarModalFiltros: boolean = false;
  camposFiltroModal: CampoFiltro[] = [];

  // Filtros del modal
  filtroNombre: string = '';
  filtroSemestre: string = '';
  filtroCodigo: string = '';

  // Paginación
  currentPage = 1;
  pageSize = 10;

  // Selección de filas
  selectedNeeds: Set<string> = new Set();

  constructor() {
    this.loadMockData();
    this.configurarCamposModal();
  }

  configurarCamposModal(): void {
    this.camposFiltroModal = [
      {
        nombre: 'nombre',
        etiqueta: 'Nombre',
        tipo: 'texto',
        placeholder: 'Ingrese el nombre de la necesidad',
      },
      {
        nombre: 'semestre',
        etiqueta: 'Semestre',
        tipo: 'select',
        opciones: [
          { valor: '1', etiqueta: 'Semestre 1' },
          { valor: '2', etiqueta: 'Semestre 2' },
          { valor: '3', etiqueta: 'Semestre 3' },
          { valor: '4', etiqueta: 'Semestre 4' },
          { valor: '5', etiqueta: 'Semestre 5' },
          { valor: '6', etiqueta: 'Semestre 6' },
        ],
      },
      {
        nombre: 'codigo',
        etiqueta: 'Código',
        tipo: 'texto',
        placeholder: 'Ingrese el código',
      },
    ];
  }

  loadMockData() {
    this.allNeeds = [
      {
        oid: 'N-0001',
        codigo: 'MAT101',
        nombre: 'Matemáticas I',
        semestre: '1',
        grupo: 'A',
        cupo: 30,
        horasSemanales: 4,
        periodoOid: 'P-2025-1',
      },
      {
        oid: 'N-0002',
        codigo: 'FIS201',
        nombre: 'Física II',
        semestre: '2',
        grupo: 'B',
        cupo: 25,
        horasSemanales: 4,
        periodoOid: 'P-2025-1',
      },
      {
        oid: 'N-0003',
        codigo: 'CS105',
        nombre: 'Programación I',
        semestre: '1',
        grupo: 'C',
        cupo: 40,
        horasSemanales: 6,
        periodoOid: 'P-2025-2',
      },
      {
        oid: 'N-0004',
        codigo: 'HIS300',
        nombre: 'Historia Universal',
        semestre: '3',
        grupo: 'A',
        cupo: 20,
        horasSemanales: 2,
        periodoOid: 'P-2025-2',
      },
      {
        oid: 'N-0005',
        codigo: 'QUI150',
        nombre: 'Química Básica',
        semestre: '2',
        grupo: 'D',
        cupo: 28,
        horasSemanales: 4,
        periodoOid: 'P-2025-1',
      },
    ];

    this.needs = [...this.allNeeds];
  }

  trackByOid(index: number, item: NeedRow) {
    return item.oid;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.needs.length / this.pageSize));
  }

  get visibleNeeds(): NeedRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.needs.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  // Manejo de selección
  toggleSelection(oid: string): void {
    if (this.selectedNeeds.has(oid)) {
      this.selectedNeeds.delete(oid);
    } else {
      this.selectedNeeds.add(oid);
    }
  }

  isSelected(oid: string): boolean {
    return this.selectedNeeds.has(oid);
  }

  get hasSelection(): boolean {
    return this.selectedNeeds.size > 0;
  }

  // Modal de filtros
  abrirModalFiltros(): void {
    this.mostrarModalFiltros = true;
  }

  cerrarModalFiltros(): void {
    this.mostrarModalFiltros = false;
  }

  aplicarFiltrosModal(valores: ValoresFiltros): void {
    this.filtroNombre = (valores['nombre'] as string) || '';
    this.filtroSemestre = (valores['semestre'] as string) || '';
    this.filtroCodigo = (valores['codigo'] as string) || '';

    this.aplicarTodosFiltros();
  }

  limpiarFiltrosModal(): void {
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.filtroCodigo = '';
    this.aplicarTodosFiltros();
  }

  aplicarTodosFiltros(): void {
    this.currentPage = 1;
    this.needs = this.allNeeds.filter((n) => {
      if (this.filtroPeriodo && n.periodoOid !== this.filtroPeriodo)
        return false;

      if (
        this.filtroNombre &&
        !n.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      )
        return false;
      if (this.filtroSemestre && n.semestre !== this.filtroSemestre)
        return false;
      if (
        this.filtroCodigo &&
        !n.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase())
      )
        return false;

      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtroPeriodo = '';
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.filtroCodigo = '';
    this.needs = [...this.allNeeds];
    this.currentPage = 1;
  }

  // Acciones
  cargarNecesidades(): void {
    console.log('Cargando necesidades...');
    // Implementar lógica de carga
  }

  enviarARevision(): void {
    if (!this.hasSelection) return;
    console.log('Enviando a revisión:', Array.from(this.selectedNeeds));
    // Implementar lógica de envío
  }

  editarNecesidad(oid: string): void {
    console.log('Editando necesidad:', oid);
    // Implementar lógica de edición
  }

  eliminarNecesidad(oid: string): void {
    console.log('Eliminando necesidad:', oid);
    // Implementar lógica de eliminación
  }
}
