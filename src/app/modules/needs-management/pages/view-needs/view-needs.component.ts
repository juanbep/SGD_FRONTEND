import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

interface NeedRow {
  oid: string;
  codigo: string;
  nombre: string;
  semestre: string;
  grupo: string;
  cupo: number;
  horasPreparacion: number;
  horasDocencia: number;
  horasSemanales: number;
  periodoOid?: string;
  departamentoOid?: string;
  programaOid?: string;
}

@Component({
  selector: 'app-view-needs',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent],
  templateUrl: './view-needs.component.html',
  styleUrls: ['./view-needs.component.css'],
})
export class ViewNeedsComponent {
  // Datos mock para visualización
  allNeeds: NeedRow[] = [];
  needs: NeedRow[] = [];

  // Opciones mock para filtros
  periodos = [
    { oid: 'P-2025-1', label: '2025 - I' },
    { oid: 'P-2025-2', label: '2025 - II' },
  ];

  departamentos = [
    { oid: 'D-01', label: 'Departamento de Matemáticas' },
    { oid: 'D-02', label: 'Departamento de Física' },
    { oid: 'D-03', label: 'Departamento de Ciencias Sociales' },
  ];

  programas = [
    { oid: 'PR-01', label: 'Ingeniería' },
    { oid: 'PR-02', label: 'Ciencias' },
  ];

  // Filtros seleccionados (bindings)
  filtroPeriodo: string = '';
  filtroDepartamento: string = '';
  filtroPrograma: string = '';

  // Paginación simple (mock) - currentPage es 1-based para shared-paginator
  currentPage = 1;
  pageSize = 5;

  constructor() {
    this.loadMockData();
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
        horasPreparacion: 10,
        horasDocencia: 48,
        horasSemanales: 4,
        periodoOid: 'P-2025-1',
        departamentoOid: 'D-01',
        programaOid: 'PR-01',
      },
      {
        oid: 'N-0002',
        codigo: 'FIS201',
        nombre: 'Física II',
        semestre: '2',
        grupo: 'B',
        cupo: 25,
        horasPreparacion: 12,
        horasDocencia: 56,
        horasSemanales: 4,
        periodoOid: 'P-2025-1',
        departamentoOid: 'D-02',
        programaOid: 'PR-02',
      },
      {
        oid: 'N-0003',
        codigo: 'CS105',
        nombre: 'Programación I',
        semestre: '1',
        grupo: 'C',
        cupo: 40,
        horasPreparacion: 8,
        horasDocencia: 64,
        horasSemanales: 6,
        periodoOid: 'P-2025-2',
        departamentoOid: 'D-01',
        programaOid: 'PR-01',
      },
      {
        oid: 'N-0004',
        codigo: 'HIS300',
        nombre: 'Historia Universal',
        semestre: '3',
        grupo: 'A',
        cupo: 20,
        horasPreparacion: 5,
        horasDocencia: 32,
        horasSemanales: 2,
        periodoOid: 'P-2025-2',
        departamentoOid: 'D-03',
        programaOid: 'PR-02',
      },
      {
        oid: 'N-0005',
        codigo: 'QUI150',
        nombre: 'Química Básica',
        semestre: '2',
        grupo: 'D',
        cupo: 28,
        horasPreparacion: 9,
        horasDocencia: 48,
        horasSemanales: 4,
        periodoOid: 'P-2025-1',
        departamentoOid: 'D-02',
        programaOid: 'PR-02',
      },
    ];

    // Inicializar lista activa y paginación
    this.needs = [...this.allNeeds];
  }

  trackByOid(index: number, item: NeedRow) {
    return item.oid;
  }

  // Computed
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

  aplicarFiltros() {
    // Filtrado simple por OID exacto de periodo, departamento y programa
    this.currentPage = 1;
    this.needs = this.allNeeds.filter((n) => {
      if (this.filtroPeriodo && n.periodoOid !== this.filtroPeriodo)
        return false;
      if (
        this.filtroDepartamento &&
        n.departamentoOid !== this.filtroDepartamento
      )
        return false;
      if (this.filtroPrograma && n.programaOid !== this.filtroPrograma)
        return false;
      return true;
    });
  }

  limpiarFiltros() {
    this.filtroPeriodo = '';
    this.filtroDepartamento = '';
    this.filtroPrograma = '';
    this.needs = [...this.allNeeds];
    this.currentPage = 1;
  }
}
