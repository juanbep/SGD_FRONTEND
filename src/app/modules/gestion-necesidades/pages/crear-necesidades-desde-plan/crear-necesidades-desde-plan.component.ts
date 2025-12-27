import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MateriaService } from '../../../gestion-planes/services/materia/materia.service';
import { NecesidadesService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateNecesidadDTO, Materia } from '../../models';
import { GRUPOS_DISPONIBLES } from '../../utils/necesidades.utils';
import {
  buildSortString,
  getPaginationInfo,
  getSortIcon,
  getTotalPages,
  getVisiblePages,
  SortDirection,
  toggleSort,
} from '../../shared/table.utils';
import { MateriaFilters } from '../../../gestion-planes/models';

// Interfaz para manejar el estado de cada fila
interface MateriaConEstado extends Materia {
  cupo: number | null;
  grupo: string | null;
  guardando: boolean;
  gruposDisponibles: { value: string; label: string }[];
}

@Component({
  selector: 'app-crear-necesidades-desde-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './crear-necesidades-desde-plan.component.html',
  styleUrl: './crear-necesidades-desde-plan.component.css',
})
export class CrearNecesidadesDesdePlanComponent implements OnInit {
  // ===== SERVICIOS =====
  private materiaService = inject(MateriaService);
  private necesidadesService = inject(NecesidadesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // ===== PARÁMETROS DE RUTA =====
  oidPlan: number = 0;
  oidCalendario: number = 0;

  // ===== DATOS =====
  materias: MateriaConEstado[] = [];
  totalElements = 0;
  loading = false;
  error: string | null = null;

  // ===== GRUPOS DISPONIBLES (TODOS) =====
  readonly todosLosGrupos = GRUPOS_DISPONIBLES.filter(
    (g) => g.value !== 'TODOS'
  );

  // ===== PAGINACIÓN Y ORDENAMIENTO =====
  pageSizeOptions = [5, 10, 25, 50];
  page = 0;
  size = 10;
  sortField: string = 'oidMateria';
  sortDirection: SortDirection = 'desc';

  // ===== FILTROS (DESHABILITADOS) =====
  readonly semestresDisponibles: { value: number | 'TODOS'; label: string }[] =
    [
      { value: 'TODOS', label: 'TODOS' },
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

  filtroOid: string = '';
  filtroCodigo: string = '';
  filtroNombre: string = '';
  filtroSemestre: number | 'TODOS' = 'TODOS';
  filtroDepartamento: number | 'TODOS' = 'TODOS';

  Math = Math;

  ngOnInit(): void {
    this.obtenerParametrosRuta();
  }

  // ===== OBTENER PARÁMETROS DE RUTA =====
  private obtenerParametrosRuta(): void {
    this.route.params.subscribe((params) => {
      this.oidPlan = Number(params['oidPlan']);
      this.oidCalendario = Number(params['oidCalendario']);

      if (!this.oidPlan || !this.oidCalendario) {
        this.toastr.error(
          'Parámetros de navegación inválidos',
          'Error de navegación'
        );
        this.volverALista();
        return;
      }

      this.cargarMaterias();
    });
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
          // Mapear materias agregando campos de estado
          this.materias = response.data.content.map(
            (materia) =>
              ({
                ...materia,
                cupo: null,
                grupo: null,
                guardando: false,
                gruposDisponibles: [...this.todosLosGrupos],
              } as MateriaConEstado)
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

  // ===== GUARDAR NECESIDAD (INDIVIDUAL) =====
  guardarNecesidad(materia: MateriaConEstado, index: number): void {
    // Validaciones
    if (!materia.cupo || materia.cupo <= 0) {
      this.toastr.warning(
        'Debe ingresar un cupo válido mayor a 0',
        'Validación'
      );
      return;
    }

    if (!materia.grupo || materia.grupo === 'TODOS') {
      this.toastr.warning('Debe seleccionar un grupo', 'Validación');
      return;
    }

    // Preparar DTO
    const dto: CreateNecesidadDTO = {
      oidCalendario: this.oidCalendario,
      idMateria: materia.idMateria,
      grupo: materia.grupo,
      cupo: materia.cupo,
    };

    materia.guardando = true;

    this.necesidadesService.createNecesidad(dto).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.toastr.success(
            `Necesidad creada: ${materia.nombre} - Grupo ${materia.grupo}`,
            'Éxito'
          );

          // Actualizar grupos disponibles eliminando el que se acaba de guardar
          materia.gruposDisponibles = materia.gruposDisponibles.filter(
            (g) => g.value !== materia.grupo
          );

          // Verificar si ya se guardaron los 4 grupos
          if (materia.gruposDisponibles.length === 0) {
            // Eliminar la fila completamente
            this.materias.splice(index, 1);
            this.totalElements--;

            this.toastr.info(
              `Todos los grupos de "${materia.nombre}" han sido guardados`,
              'Materia completa'
            );

            // Si la página quedó vacía, ir a la anterior
            if (this.materias.length === 0 && this.page > 0) {
              this.page--;
              this.cargarMaterias();
            }
          } else {
            // Resetear campos
            materia.cupo = null;
            materia.grupo = null;
            materia.guardando = false;
          }
        } else {
          this.toastr.warning(
            response.mensaje || 'No se pudo crear la necesidad'
          );
          materia.guardando = false;
        }
      },
      error: (error) => {
        this.handleError(error, 'crear necesidad');
        materia.guardando = false;
      },
    });
  }

  // ===== ELIMINAR FILA (SOLO VISUAL) =====
  eliminarFila(index: number): void {
    const materia = this.materias[index];

    const confirmar = confirm(
      `¿Está seguro de eliminar la materia "${materia.nombre}" de la lista?\n\nEsta acción solo la quitará de la vista actual.`
    );

    if (confirmar) {
      // Eliminar de la tabla
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

  trackByMateria(index: number, item: MateriaConEstado): any {
    return item.idMateria;
  }

  // ===== NAVEGACIÓN =====
  volverALista(): void {
    this.router.navigate(['/app/gestion-necesidades/management']);
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
