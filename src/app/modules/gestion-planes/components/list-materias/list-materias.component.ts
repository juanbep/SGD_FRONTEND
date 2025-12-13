import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Materia, MateriaFilters } from '../../models';
import { MateriaHelperService } from '../../services/materia/materia-helper.service';
import { ToastrService } from 'ngx-toastr';
import { BaseHelperService } from '../../services/base-helper.service';
import { MateriaService } from '../../services/materia/materia.service';

@Component({
  selector: 'app-list-materias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-materias.component.html',
  styleUrl: './list-materias.component.css',
})
export class ListMateriasComponent implements OnInit {
  // ===== SERVICIOS =====
  private materiaService = inject(MateriaService);
  private toastr = inject(ToastrService);

  @Input() oidPlan: number | undefined;
  @Input() numeroPlan: string | undefined;

  @Output() onNuevaMateria = new EventEmitter<void>();
  @Output() onModificar = new EventEmitter<Materia>();
  @Output() onEliminar = new EventEmitter<Materia>();
  @Output() onVerCorrequisitos = new EventEmitter<Materia>();

  readonly semestresDisponibles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | '' = '';

  page = 0;
  size = 10;
  totalElements = 0;

  materias: Materia[] = [];
  loading = false;
  error: string | null = null;

  // Control para mostrar toast solo en acciones explícitas del usuario
  private mostrarToast = false;

  Math = Math;

  ngOnInit(): void {
    // No hacer nada aquí, esperar a que llegue el Input
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando cambia el oidPlan
    if (changes['oidPlan']) {
      const oidPlanActual = changes['oidPlan'].currentValue;

      if (oidPlanActual) {
        // Resetear filtros y cargar sin mostrar toast
        this.filtroOid = '';
        this.filtroCodigo = '';
        this.filtroNombre = '';
        this.filtroSemestre = '';
        this.page = 0;
        this.mostrarToast = false; // No mostrar toast en carga inicial
        this.cargarMaterias();
      } else {
        this.error = 'No se ha especificado un plan válido';
        this.materias = [];
        this.totalElements = 0;
      }
    }
  }

  cargarMaterias(mostrarToast: boolean = false): void {
    if (!this.oidPlan) {
      this.error = 'Plan no válido';
      return;
    }

    this.loading = true;
    this.error = null;

    const filtros: MateriaFilters = {
      page: this.page,
      size: this.size,
      oidPlan: this.oidPlan,
    };

    if (this.filtroOid && this.filtroOid.trim().length >= 4) {
      filtros.oidMateria = this.filtroOid.trim();
    }

    if (this.filtroCodigo && this.filtroCodigo.trim().length >= 4) {
      filtros.codigo = this.filtroCodigo.trim();
    }

    if (this.filtroNombre && this.filtroNombre.trim().length >= 4) {
      filtros.nombre = this.filtroNombre.trim();
    }

    if (this.filtroSemestre !== '') {
      filtros.semestre = Number(this.filtroSemestre);
    }

    this.materiaService.getMaterias(filtros).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.materias = response.data.content;
          this.totalElements = response.data.totalElements;

          // Mostrar toast apropiado si se solicitó
          if (mostrarToast) {
            if (this.totalElements > 0) {
              this.toastr.success(
                'Lista de materias actualizada correctamente'
              );
            } else {
              this.toastr.info('No se encontraron materias para este plan');
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
        this.handleError(error, 'cargar materias');
        this.loading = false;
      },
    });
  }

  onFiltroChange(): void {
    const oidValido = !this.filtroOid || this.filtroOid.trim().length >= 4;
    const codigoValido =
      !this.filtroCodigo || this.filtroCodigo.trim().length >= 4;
    const nombreValido =
      !this.filtroNombre || this.filtroNombre.trim().length >= 4;

    if (oidValido && codigoValido && nombreValido) {
      this.page = 0;
      this.mostrarToast = false; // No mostrar toast al filtrar
      this.cargarMaterias();
    }
  }

  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.page = 0;
    this.mostrarToast = true; // Sí mostrar toast al limpiar
    this.cargarMaterias();
  }

  onPageSizeChange(event: any): void {
    this.size = parseInt(event.target.value);
    this.page = 0;
    this.mostrarToast = false; // No mostrar toast al cambiar tamaño
    this.cargarMaterias();
  }

  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.mostrarToast = false; // No mostrar toast al paginar
    this.cargarMaterias();
  }

  actualizarLista(): void {
    this.mostrarToast = true; // Sí mostrar toast al actualizar manualmente
    this.cargarMaterias();
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

  trackByMateria(index: number, item: Materia): any {
    return item.idMateria;
  }

  crearNuevaMateria(): void {
    this.onNuevaMateria.emit();
  }

  modificarMateria(materia: Materia): void {
    this.onModificar.emit(materia);
  }

  eliminarMateria(materia: Materia): void {
    this.onEliminar.emit(materia);
  }

  verCorrequisitos(materia: Materia): void {
    this.onVerCorrequisitos.emit(materia);
  }

  descargarPlanilla(): void {
    console.log('Descargar planilla Excel');
    alert('Funcionalidad de descarga de planilla - Por implementar');
  }

  cargarPlanilla(): void {
    console.log('Cargar planilla Excel');
    alert('Funcionalidad de carga de planilla - Por implementar');
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
    this.cargarMaterias(true);
  }
}
