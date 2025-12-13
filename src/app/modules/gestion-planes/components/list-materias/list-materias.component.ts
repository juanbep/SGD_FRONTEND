import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Materia, MateriaFilters } from '../../models';
import { MateriaHelperService } from '../../services/materia/materia-helper.service';
import { ToastrService } from 'ngx-toastr';
import { BaseHelperService } from '../../services/base-helper.service';
import { MateriaService } from '../../services/materia/materia.service';
import { EliminarMateriaModalComponent } from './eliminar-materia-modal/eliminar-materia-modal.component';
import { VerCorrequisitosModalComponent } from './ver-correquisitos-modal/ver-correquisitos-modal.component';

@Component({
  selector: 'app-list-materias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EliminarMateriaModalComponent,
    VerCorrequisitosModalComponent,
  ],
  templateUrl: './list-materias.component.html',
  styleUrl: './list-materias.component.css',
})
export class ListMateriasComponent implements OnInit, OnChanges {
  // ===== SERVICIOS =====
  private materiaService = inject(MateriaService);
  private toastr = inject(ToastrService);

  @Input() oidPlan: number | undefined;
  @Input() numeroPlan: string | undefined;

  @Output() onNuevaMateria = new EventEmitter<void>();
  @Output() onModificar = new EventEmitter<Materia>();
  @Output() onEliminar = new EventEmitter<Materia>();
  @Output() onVerCorrequisitos = new EventEmitter<Materia>();

  // ===== REFERENCIA AL INPUT FILE =====
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

  mostrarModalEliminar = false;
  materiaAEliminar: Materia | null = null;

  mostrarModalCorrequisitos = false;
  materiaVerCorrequisitos: Materia | null = null;

  // ===== ESTADOS PARA DESCARGA/CARGA =====
  descargando = false;
  cargandoArchivo = false;
  archivoSeleccionado: File | null = null;

  Math = Math;

  ngOnInit(): void {
    // No hacer nada aquí, esperar a que llegue el Input
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['oidPlan']) {
      const oidPlanActual = changes['oidPlan'].currentValue;

      if (oidPlanActual) {
        this.filtroOid = '';
        this.filtroCodigo = '';
        this.filtroNombre = '';
        this.filtroSemestre = '';
        this.page = 0;
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
      this.cargarMaterias();
    }
  }

  limpiarFiltros(): void {
    this.filtroOid = '';
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.filtroSemestre = '';
    this.page = 0;
    this.cargarMaterias();
  }

  onPageSizeChange(event: any): void {
    this.size = parseInt(event.target.value);
    this.page = 0;
    this.cargarMaterias();
  }

  irAPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
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

  // ===== ACCIONES =====
  crearNuevaMateria(): void {
    this.onNuevaMateria.emit();
  }

  modificarMateria(materia: Materia): void {
    this.onModificar.emit(materia);
  }

  eliminarMateria(materia: Materia): void {
    this.materiaAEliminar = materia;
    this.mostrarModalEliminar = true;
  }

  onMateriaEliminada(): void {
    this.mostrarModalEliminar = false;
    this.materiaAEliminar = null;
    this.cargarMaterias(true);
  }

  onCancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.materiaAEliminar = null;
  }

  //Ver Correquisitos:
  verCorrequisitos(materia: Materia): void {
    this.materiaVerCorrequisitos = materia;
    this.mostrarModalCorrequisitos = true;
  }

  onCerrarCorrequisitos(): void {
    this.mostrarModalCorrequisitos = false;
    this.materiaVerCorrequisitos = null;
  }

  // ===== DESCARGAR PLANILLA =====
  descargarPlanilla(): void {
    if (!this.oidPlan) {
      this.toastr.error('No se ha especificado un plan válido');
      return;
    }

    this.descargando = true;
    this.toastr.info('Preparando descarga...', 'Descargando');

    this.materiaService.descargarPlanillaExcel(this.oidPlan).subscribe({
      next: (blob) => {
        const nombreArchivo = `Materias_Plan_${
          this.numeroPlan || this.oidPlan
        }_${new Date().getTime()}.xlsx`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        link.click();

        window.URL.revokeObjectURL(url);

        this.descargando = false;
        this.toastr.success('Planilla descargada correctamente', 'Éxito');
      },
      error: (error) => {
        console.error('Error al descargar planilla:', error);
        const mensajeError =
          error?.error?.mensaje || 'Error al descargar la planilla';
        this.toastr.error(mensajeError, 'Error en descarga');
        this.descargando = false;
      },
    });
  }

  // ===== CARGAR PLANILLA =====
  cargarPlanilla(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!this.validarArchivo(file)) {
      input.value = '';
      return;
    }

    this.archivoSeleccionado = file;
    this.confirmarCargaArchivo();
  }

  private validarArchivo(file: File): boolean {
    const extensionesPermitidas = ['.xlsx', '.xls'];
    const extension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();

    if (!extensionesPermitidas.includes(extension)) {
      this.toastr.error(
        'Solo se permiten archivos Excel (.xlsx, .xls)',
        'Archivo no válido'
      );
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.toastr.error(
        'El archivo no debe superar los 5MB',
        'Archivo muy grande'
      );
      return false;
    }

    return true;
  }

  private confirmarCargaArchivo(): void {
    if (!this.archivoSeleccionado) return;

    const confirmar = confirm(
      `¿Está seguro de cargar el archivo "${this.archivoSeleccionado.name}"?\n\n` +
        'Esto actualizará las materias del plan según el contenido del archivo.'
    );

    if (confirmar) {
      this.subirArchivo();
    } else {
      this.archivoSeleccionado = null;
      this.fileInput.nativeElement.value = '';
    }
  }

  private subirArchivo(): void {
    if (!this.oidPlan || !this.archivoSeleccionado) {
      this.toastr.error('No se puede cargar el archivo', 'Error');
      return;
    }

    this.cargandoArchivo = true;
    this.toastr.info('Cargando archivo...', 'Procesando');

    this.materiaService
      .cargarPlanillaExcel(this.oidPlan, this.archivoSeleccionado)
      .subscribe({
        next: (response) => {
          // La respuesta exitosa es un string
          this.toastr.success(
            response || 'Materias cargadas correctamente desde el archivo',
            'Éxito'
          );
          this.cargarMaterias(true);
          this.limpiarCargaArchivo();
        },
        error: (error) => {
          console.error('Error al cargar archivo:', error);

          let mensajeError =
            'Error al cargar el archivo. Verifique el formato y contenido.';

          if (error?.error?.mensaje) {
            mensajeError = error.error.mensaje;
          } else if (error?.error?.text) {
            try {
              const errorObj = JSON.parse(error.error.text);
              mensajeError = errorObj.mensaje || mensajeError;
            } catch (e) {
              mensajeError = error.error.text || mensajeError;
            }
          } else if (error?.message) {
            mensajeError = error.message;
          }

          this.toastr.error(mensajeError, 'Error al cargar archivo');
          this.limpiarCargaArchivo();
        },
      });
  }

  private limpiarCargaArchivo(): void {
    this.cargandoArchivo = false;
    this.archivoSeleccionado = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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
