import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import {
  FilterModalComponent,
  CampoFiltro,
  ValoresFiltros,
} from '../../../../shared/components/filter-modal/filter-modal.component';
import { LoadNeedsModalComponent } from '../../components/load-needs-modal/load-needs-modal.component';
import { AdjustLoadModalComponent, AjusteCargueData } from '../../components/adjust-load-modal/adjust-load-modal.component';
import { EditNeedModalComponent, EditNeedData } from '../../components/edit-need-modal/edit-need-modal.component';

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
    FormsModule,
    PaginatorComponent,
    FilterModalComponent,
    LoadNeedsModalComponent,
    AdjustLoadModalComponent,
    EditNeedModalComponent,
  ],
  templateUrl: './manage-needs.component.html',
  styleUrl: './manage-needs.component.css',
})
export class ManageNeedsComponent {
  // Signals para estado reactivo
  allNeeds = signal<NeedRow[]>([]);
  needs = signal<NeedRow[]>([]);
  
  periodos = signal([
    { oid: 'P-2025-1', label: '2025 - I' },
    { oid: 'P-2025-2', label: '2025 - II' },
  ]);

  // Filtros
  filtroPeriodo = signal('');
  filtroNombre = signal('');
  filtroSemestre = signal('');
  filtroCodigo = signal('');

  // Modales
  mostrarModalFiltros = signal(false);
  editarModalVisible = signal(false);
  cargarModalVisible = signal(false);
  ajusteCargueVisible = signal(false);
  deleteConfirmVisible = signal(false);
  
  necesidadEditando = signal<NeedRow | null>(null);
  deleteTargetOid = signal<string | null>(null);

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);

  // Selección
  selectedNeeds = signal(new Set<string>());

  // Computed signals
  hasSelection = computed(() => this.selectedNeeds().size > 0);
  
  totalPages = computed(() => 
    Math.max(1, Math.ceil(this.needs().length / this.pageSize()))
  );
  
  visibleNeeds = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.needs().slice(start, start + this.pageSize());
  });

  camposFiltroModal: CampoFiltro[] = [];

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

  loadMockData(): void {
    const mockData: NeedRow[] = [
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

    this.allNeeds.set(mockData);
    this.needs.set([...mockData]);
  }

  trackByOid(_index: number, item: NeedRow): string {
    return item.oid;
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  // Manejo de selección
  toggleSelection(oid: string): void {
    this.selectedNeeds.update(selected => {
      const newSet = new Set(selected);
      if (newSet.has(oid)) {
        newSet.delete(oid);
      } else {
        newSet.add(oid);
      }
      return newSet;
    });
  }

  isSelected(oid: string): boolean {
    return this.selectedNeeds().has(oid);
  }

  // Modal de filtros
  abrirModalFiltros(): void {
    this.mostrarModalFiltros.set(true);
  }

  cerrarModalFiltros(): void {
    this.mostrarModalFiltros.set(false);
  }

  aplicarFiltrosModal(valores: ValoresFiltros): void {
    this.filtroNombre.set((valores['nombre'] as string) || '');
    this.filtroSemestre.set((valores['semestre'] as string) || '');
    this.filtroCodigo.set((valores['codigo'] as string) || '');
    this.aplicarTodosFiltros();
  }

  limpiarFiltrosModal(): void {
    this.filtroNombre.set('');
    this.filtroSemestre.set('');
    this.filtroCodigo.set('');
    this.aplicarTodosFiltros();
  }

  aplicarTodosFiltros(): void {
    this.currentPage.set(1);
    
    const filtered = this.allNeeds().filter((n) => {
      if (this.filtroPeriodo() && n.periodoOid !== this.filtroPeriodo())
        return false;

      if (
        this.filtroNombre() &&
        !n.nombre.toLowerCase().includes(this.filtroNombre().toLowerCase())
      )
        return false;
      
      if (this.filtroSemestre() && n.semestre !== this.filtroSemestre())
        return false;
      
      if (
        this.filtroCodigo() &&
        !n.codigo.toLowerCase().includes(this.filtroCodigo().toLowerCase())
      )
        return false;

      return true;
    });
    
    this.needs.set(filtered);
  }

  limpiarFiltros(): void {
    this.filtroPeriodo.set('');
    this.filtroNombre.set('');
    this.filtroSemestre.set('');
    this.filtroCodigo.set('');
    this.needs.set([...this.allNeeds()]);
    this.currentPage.set(1);
  }

  // Acciones
  cargarNecesidades(): void {
    this.cargarModalVisible.set(true);
  }

  enviarARevision(): void {
    if (!this.hasSelection()) return;
    console.log('Enviando a revisión:', Array.from(this.selectedNeeds()));
  }

  editarNecesidad(oid: string): void {
    const necesidad = this.allNeeds().find((n) => n.oid === oid);
    if (!necesidad) return;
    this.necesidadEditando.set(necesidad);
    this.editarModalVisible.set(true);
  }

  onGuardarEdicion(data: EditNeedData): void {
    const editando = this.necesidadEditando();
    if (!editando) return;
    
    const updated = this.allNeeds().map((n) => {
      if (n.oid === editando.oid) {
        return {
          ...n,
          grupo: data.grupo,
          cupo: data.cupo,
          horasSemanales: data.horasSemanales,
        } as NeedRow;
      }
      return n;
    });
    
    this.allNeeds.set(updated);
    this.aplicarTodosFiltros();
    this.necesidadEditando.set(null);
  }

  onCerrarEdicion(): void {
    this.editarModalVisible.set(false);
    this.necesidadEditando.set(null);
  }

  eliminarNecesidad(oid: string): void {
    this.deleteTargetOid.set(oid);
    this.deleteConfirmVisible.set(true);
  }

  confirmarEliminarNecesidad(): void {
    const oid = this.deleteTargetOid();
    if (!oid) return;
    
    const filtered = this.allNeeds().filter((n) => n.oid !== oid);
    this.allNeeds.set(filtered);
    this.aplicarTodosFiltros();
    this.cancelarEliminar();
  }

  cancelarEliminar(): void {
    this.deleteTargetOid.set(null);
    this.deleteConfirmVisible.set(false);
  }

  // Métodos del Modal de Cargar Necesidades
  onCerrarModalCargar(): void {
    this.cargarModalVisible.set(false);
  }

  onNecesidadesCargadas(necesidades: NeedRow[]): void {
    const current = this.allNeeds();
    const toAdd = necesidades.filter(
      (nueva) => !current.find((n) => n.oid === nueva.oid)
    );
    
    this.allNeeds.set([...current, ...toAdd]);
    this.aplicarTodosFiltros();
    console.log(`${toAdd.length} necesidades cargadas exitosamente`);
  }

  onAbrirAjusteCargue(): void {
    this.ajusteCargueVisible.set(true);
  }

  onCerrarAjusteCargue(): void {
    this.ajusteCargueVisible.set(false);
  }

  onAplicarAjusteCargue(data: AjusteCargueData): void {
    console.log('Aplicando ajustes:', data);
    // Aquí se aplicarían los ajustes a las necesidades seleccionadas
  }
}
