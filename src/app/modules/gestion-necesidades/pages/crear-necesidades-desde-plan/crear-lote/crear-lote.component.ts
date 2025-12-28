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
  getSortIcon,
  SortDirection,
  toggleSort,
} from '../../../shared/table.utils';
import { MateriaFilters } from '../../../../gestion-planes/models';
import { FiltrosMaterias } from '../crear-necesidades-desde-plan.component';

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
  @Input() filtros: FiltrosMaterias = {};

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

  // ===== ORDENAMIENTO =====
  sortField: string = 'oidMateria';
  sortDirection: SortDirection = 'desc';

  Math = Math;

  ngOnInit(): void {
    if (this.oidPlan && this.oidCalendario) {
      this.cargarMaterias();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recargar si cambian los inputs O los filtros
    if (
      (changes['oidPlan'] || changes['oidCalendario'] || changes['filtros']) &&
      !changes['oidPlan']?.firstChange &&
      !changes['oidCalendario']?.firstChange
    ) {
      this.cargarMaterias();
    }
  }

  // ===== CARGAR MATERIAS DEL PLAN (SIN PAGINACIÓN) =====
  cargarMaterias(mostrarToast: boolean = false): void {
    if (!this.oidPlan) {
      this.error = 'Plan no válido';
      return;
    }

    this.loading = true;
    this.error = null;

    const filtros: MateriaFilters = {
      page: 0,
      size: 9999, // Traer todas las materias
      oidPlan: this.oidPlan,
      sort: buildSortString(this.sortField, this.sortDirection),
      ...(this.filtros.oidDepartamento && {
        oidDepartamento: this.filtros.oidDepartamento,
      }),
      ...(this.filtros.semestre && { semestre: this.filtros.semestre }),
      ...(this.filtros.oidMateria && { oidMateria: this.filtros.oidMateria }),
      ...(this.filtros.codigo && { codigo: this.filtros.codigo }),
      ...(this.filtros.nombre && { nombre: this.filtros.nombre }),
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

        if (response.codigo >= 200 && response.codigo < 300) {
          // El backend devuelve directamente el array de necesidades creadas
          if (
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const cantidadCreadas = response.data.length;

            this.toastr.success(
              `Se crearon ${cantidadCreadas} necesidad(es) exitosamente`,
              'Guardado en lote'
            );

            // Obtener IDs de materias únicas del response
            const idsMateriasGuardadas = [
              ...new Set(response.data.map((item: any) => item.idMateria)),
            ];

            // Eliminar las materias guardadas exitosamente
            idsMateriasGuardadas.forEach((idMateria) => {
              const index = this.materias.findIndex(
                (m) => m.idMateria === idMateria
              );
              if (index !== -1) {
                this.materias.splice(index, 1);
                this.totalElements--;
              }
            });

            // Si no quedan materias, recargar
            if (this.materias.length === 0) {
              this.cargarMaterias();
            }
          } else {
            this.toastr.warning('No se recibieron datos del servidor');
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

    this.materias.splice(index, 1);
    this.totalElements--;
    this.toastr.info(
      `Materia "${materia.nombre}" eliminada de la lista`,
      'Información'
    );
  }

  // ===== ORDENAMIENTO =====
  onSort(campo: string): void {
    const newSort = toggleSort(this.sortField, this.sortDirection, campo);
    this.sortField = newSort.field;
    this.sortDirection = newSort.direction;
    this.cargarMaterias();
  }

  getSortIcon(campo: string): string {
    return getSortIcon(campo, this.sortField, this.sortDirection);
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
