import { Component, EventEmitter, input, Output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-load-needs-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './load-needs-modal.component.html',
  styleUrl: './load-needs-modal.component.css',
})
export class LoadNeedsModalComponent {
  visible = input<boolean>(false);
  periodos = input<{ oid: string; label: string }[]>([]);
  
  @Output() cerrar = new EventEmitter<void>();
  @Output() cargar = new EventEmitter<NeedRow[]>();
  @Output() abrirAjusteCargue = new EventEmitter<void>();

  planSeleccionado = signal('');
  necesidadesDisponibles = signal<NeedRow[]>([]);
  seleccionadas = signal(new Set<string>());

  todasSeleccionadas = computed(() => {
    const necesidades = this.necesidadesDisponibles();
    const selec = this.seleccionadas();
    return necesidades.length > 0 && necesidades.every((n) => selec.has(n.oid));
  });

  aplicarFiltros(): void {
    if (!this.planSeleccionado()) {
      this.necesidadesDisponibles.set([]);
      return;
    }

    // Mock: Simular necesidades disponibles
    this.necesidadesDisponibles.set([
      {
        oid: 'D-0001',
        codigo: 'ENG101',
        nombre: 'Inglés I',
        semestre: '1',
        grupo: 'A',
        cupo: 35,
        horasSemanales: 3,
        periodoOid: this.planSeleccionado(),
      },
      {
        oid: 'D-0002',
        codigo: 'ALG200',
        nombre: 'Álgebra Lineal',
        semestre: '2',
        grupo: 'B',
        cupo: 30,
        horasSemanales: 4,
        periodoOid: this.planSeleccionado(),
      },
      {
        oid: 'D-0003',
        codigo: 'BIO150',
        nombre: 'Biología General',
        semestre: '1',
        grupo: 'C',
        cupo: 25,
        horasSemanales: 5,
        periodoOid: this.planSeleccionado(),
      },
    ]);
  }

  abrirFiltrosModal(): void {
    console.log('Abrir filtros de modal de carga');
  }

  toggleSeleccion(oid: string): void {
    this.seleccionadas.update(selec => {
      const newSet = new Set(selec);
      if (newSet.has(oid)) {
        newSet.delete(oid);
      } else {
        newSet.add(oid);
      }
      return newSet;
    });
  }

  isSeleccionada(oid: string): boolean {
    return this.seleccionadas().has(oid);
  }

  toggleTodas(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      const todosOids = new Set(this.necesidadesDisponibles().map(n => n.oid));
      this.seleccionadas.set(todosOids);
    } else {
      this.seleccionadas.set(new Set());
    }
  }

  trackByOid(index: number, item: NeedRow): string {
    return item.oid;
  }

  onCerrar(): void {
    this.planSeleccionado.set('');
    this.necesidadesDisponibles.set([]);
    this.seleccionadas.set(new Set());
    this.cerrar.emit();
  }

  onAbrirAjuste(): void {
    this.abrirAjusteCargue.emit();
  }

  confirmarCarga(): void {
    if (this.seleccionadas().size === 0) return;

    const necesidadesSeleccionadas = this.necesidadesDisponibles().filter((n) =>
      this.seleccionadas().has(n.oid)
    );

    this.cargar.emit(necesidadesSeleccionadas);
    this.onCerrar();
  }
}
