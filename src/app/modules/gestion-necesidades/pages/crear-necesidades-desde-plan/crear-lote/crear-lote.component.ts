import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../../../gestion-planes/services/materia/materia.service';
import { NecesidadesService } from '../../../services';
import {
  CreateNecesidadLoteDTO,
  Materia,
  NecesidadLoteItem,
} from '../../../models';
import {
  buildSortString,
  getPaginationInfo,
  getSortIcon,
  getTotalPages,
  getVisiblePages,
  SortDirection,
  toggleSort,
} from '../../../shared/table.utils';
import { MateriaFilters } from '../../../../gestion-planes/models';

// Interfaz para manejar el estado de cada fila en MODO LOTE
interface MateriaLote extends Materia {
  cantidadGrupos: number | null;
  cupo: number | null;
}

@Component({
  selector: 'app-crear-lote',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './crear-lote.component.html',
  styleUrl: './crear-lote.component.css',
})
export class CrearLoteComponent implements OnInit, OnChanges {
  // ===== INPUTS =====
  @Input() oidPlan: number = 0;
  @Input() oidCalendario: number = 0;

  // ===== SERVICIOS =====
  private materiaService = inject(MateriaService);
  private necesidadesService = inject(NecesidadesService);
  private toastr = inject(ToastrService);

  // ===== DATOS =====
  materias: MateriaLote[] = [];
  totalElements = 0;
  loading = false;
  error: string | null = null;
  guardandoLote = false;

  // ===== PAGINACIÓN Y ORDENAMIENTO =====
  pageSizeOptions = [5, 10, 25, 50];
  page = 0;
  size = 10;
  sortField: string = 'oidMateria';
  sortDirection: SortDirection = 'desc';

  Math = Math;

  ngOnInit(): void {
    if (this.oidPlan && this.oidCalendario) {
      this.cargarMaterias();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recargar si cambian los inputs
    if (
      (changes['oidPlan'] || changes['oidCalendario']) &&
      !changes['oidPlan']?.firstChange &&
      !changes['oidCalendario']?.firstChange
    ) {
      this.cargarMaterias();
    }
  }

  // ===== CARGAR MATERIAS DEL PLAN =====
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
      sort: buildSortString(this.sortField, this.sortDirection),
    };

    this.materiaService.getMaterias(filtros).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.materias = response.data.content.map(
            (materia) =>
              ({
                ...materia,
                cantidadGrupos: null,
                cupo: null,
              } as MateriaLote)
          );

          this.totalElements = response.data.totalElements;

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

  // ===== GUARDAR TODAS EN LOTE =====
  guardarTodasEnLote(): void {
    // Filtrar solo materias con datos completos
    const materiasValidas = this.materias.filter(
      (m) => m.cantidadGrupos && m.cantidadGrupos > 0 && m.cupo && m.cupo > 0
    );

    if (materiasValidas.length === 0) {
      this.toastr.warning(
        'Debe configurar al menos una materia con cantidad de grupos y cupo',
        'Sin datos para guardar'
      );
      return;
    }

    // Validar cantidad de grupos (1-4)
    const materiasInvalidas = materiasValidas.filter(
      (m) => m.cantidadGrupos! < 1 || m.cantidadGrupos! > 4
    );

    if (materiasInvalidas.length > 0) {
      this.toastr.error(
        'La cantidad de grupos debe estar entre 1 y 4',
        'Validación'
      );
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de crear necesidades en lote para ${materiasValidas.length} materia(s)?\n\nSe crearán los grupos automáticamente según la cantidad especificada.`
    );

    if (!confirmar) return;

    // Preparar DTO
    const necesidades: NecesidadLoteItem[] = materiasValidas.map((m) => ({
      idMateria: m.idMateria,
      cantidadGrupos: m.cantidadGrupos!,
      cupo: m.cupo!,
    }));

    const dto: CreateNecesidadLoteDTO = {
      oidCalendario: this.oidCalendario,
      necesidades: necesidades,
    };

    this.guardandoLote = true;

    this.necesidadesService.createNecesidadesLote(dto).subscribe({
      next: (response) => {
        this.guardandoLote = false;

        console.log('Respuesta del backend:', response); // DEBUG

        if (response.codigo >= 200 && response.codigo < 300) {
          // Verificar si data existe y es un array
          if (response.data && Array.isArray(response.data)) {
            // Contar exitosos solo si tienen la propiedad exitoso
            const exitosos = response.data.filter((r) => r.exitoso === true);
            const fallidos = response.data.filter((r) => r.exitoso === false);

            if (exitosos.length > 0) {
              this.toastr.success(
                `Se crearon ${exitosos.length} necesidad(es) exitosamente`,
                'Guardado en lote'
              );

              // Eliminar las materias guardadas exitosamente
              exitosos.forEach((resultado) => {
                const index = this.materias.findIndex(
                  (m) => m.idMateria === resultado.idMateria
                );
                if (index !== -1) {
                  this.materias.splice(index, 1);
                  this.totalElements--;
                }
              });
            }

            if (fallidos.length > 0) {
              this.toastr.warning(
                `${fallidos.length} materia(s) no se pudieron guardar. Revise los mensajes.`,
                'Algunos errores'
              );

              // Mostrar errores individuales
              fallidos.forEach((resultado) => {
                this.toastr.error(
                  resultado.mensaje || 'Error desconocido',
                  resultado.nombreMateria
                );
              });
            }
          } else {
            // Si data no es un array, asumir que TODO fue exitoso
            this.toastr.success(
              `Se crearon ${materiasValidas.length} necesidad(es) exitosamente`,
              'Guardado en lote'
            );

            // Eliminar TODAS las materias válidas
            materiasValidas.forEach((materia) => {
              const index = this.materias.findIndex(
                (m) => m.idMateria === materia.idMateria
              );
              if (index !== -1) {
                this.materias.splice(index, 1);
                this.totalElements--;
              }
            });
          }

          // Si la página quedó vacía, recargar
          if (this.materias.length === 0) {
            if (this.page > 0) {
              this.page--;
            }
            this.cargarMaterias();
          }
        } else {
          this.toastr.warning(
            response.mensaje || 'No se pudieron crear las necesidades'
          );
        }
      },
      error: (error) => {
        this.guardandoLote = false;
        this.handleError(error, 'guardar necesidades en lote');
      },
    });
  }

  // ===== ELIMINAR FILA =====
  eliminarFila(index: number): void {
    const materia = this.materias[index];

    const confirmar = confirm(
      `¿Está seguro de eliminar la materia "${materia.nombre}" de la lista?\n\nEsta acción solo la quitará de la vista actual.`
    );

    if (confirmar) {
      this.materias.splice(index, 1);
      this.totalElements--;
      this.toastr.info('Materia eliminada de la lista', 'Información');

      // Si la página quedó vacía, ir a la anterior
      if (this.materias.length === 0 && this.page > 0) {
        this.page--;
        this.cargarMaterias();
      }
    }
  }

  // ===== ORDENAMIENTO =====
  onSort(campo: string): void {
    const newSort = toggleSort(this.sortField, this.sortDirection, campo);
    this.sortField = newSort.field;
    this.sortDirection = newSort.direction;
    this.page = 0;
    this.cargarMaterias();
  }

  getSortIcon(campo: string): string {
    return getSortIcon(campo, this.sortField, this.sortDirection);
  }

  // ===== PAGINACIÓN =====
  onPageSizeChange(): void {
    this.page = 0;
    this.cargarMaterias();
  }

  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarMaterias();
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

  trackByMateria(index: number, item: MateriaLote): any {
    return item.idMateria;
  }

  // ===== UTILIDADES =====
  reintentar(): void {
    this.cargarMaterias(true);
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
