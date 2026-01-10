import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NecesidadResponse } from '../../../models';
import { SeleccionadoHelperService } from '../../../../gestion-seleccionados/services/seleccionado-helper.service';
import { SeleccionadoResponse } from '../../../../gestion-seleccionados/models';

@Component({
  selector: 'app-modal-asignar-docente',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './modal-asignar-docente.component.html',
  styleUrl: './modal-asignar-docente.component.css',
})
export class ModalAsignarDocenteComponent implements OnInit, OnChanges {
  @Input() necesidad: NecesidadResponse | null = null;
  @Input() visible: boolean = false;
  @Input() asignando: boolean = false;
  @Input() oidCalendario: number | string = '';
  @Input() oidDepartamento: number | string = '';

  @Output() onConfirmar = new EventEmitter<number[]>(); // Ahora emite array de OIDs
  @Output() onCancelar = new EventEmitter<void>();

  private seleccionadoHelper = inject(SeleccionadoHelperService);

  // Datos
  seleccionados: SeleccionadoResponse[] = [];
  loadingSeleccionados = false;
  errorCarga: string | null = null;

  // Selección múltiple (máximo 3)
  docentesSeleccionados: SeleccionadoResponse[] = []; // Array de docentes seleccionados
  oidSeleccionadoTemp: number | null = null; // Selección temporal del dropdown
  intentoConfirmar: boolean = false;

  readonly MAX_DOCENTES = 3; // Máximo de docentes

  ngOnInit(): void {
    if (this.visible && this.necesidad) {
      this.cargarSeleccionados();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.resetModal();
      this.cargarSeleccionados();
    }
  }

  async cargarSeleccionados(): Promise<void> {
    if (!this.oidCalendario || !this.oidDepartamento) {
      this.errorCarga =
        'Faltan parámetros obligatorios (Calendario o Departamento)';
      return;
    }

    this.loadingSeleccionados = true;
    this.errorCarga = null;

    try {
      this.seleccionados = await this.seleccionadoHelper.getAll({
        oidCalendario: this.oidCalendario,
        oidDepartamento: this.oidDepartamento,
        page: 0,
        size: 1000,
      });

      if (this.seleccionados.length === 0) {
        this.errorCarga =
          'No hay docentes seleccionados disponibles para este calendario y departamento';
      }
    } catch (error: any) {
      console.error('Error al cargar seleccionados:', error);
      this.errorCarga = 'Error al cargar la lista de docentes disponibles';
    } finally {
      this.loadingSeleccionados = false;
    }
  }

  // AGREGAR DOCENTE A LA LISTA
  agregarDocente(): void {
    if (!this.oidSeleccionadoTemp) return;

    // Validar que no esté ya agregado
    if (
      this.docentesSeleccionados.some(
        (d) => d.oidSeleccionado === this.oidSeleccionadoTemp
      )
    ) {
      return;
    }

    // Validar máximo
    if (this.docentesSeleccionados.length >= this.MAX_DOCENTES) {
      return;
    }

    // Buscar el docente seleccionado
    const docente = this.seleccionados.find(
      (s) => s.oidSeleccionado === this.oidSeleccionadoTemp
    );

    if (docente) {
      this.docentesSeleccionados.push(docente);
      this.oidSeleccionadoTemp = null; // Limpiar selección temporal
    }
  }

  getSeleccionadosDisponibles(): SeleccionadoResponse[] {
    return this.seleccionados.filter(
      (s) =>
        !this.docentesSeleccionados.some(
          (d) => d.oidSeleccionado === s.oidSeleccionado
        )
    );
  }

  // ELIMINAR DOCENTE DE LA LISTA
  eliminarDocente(oidSeleccionado: number): void {
    this.docentesSeleccionados = this.docentesSeleccionados.filter(
      (d) => d.oidSeleccionado !== oidSeleccionado
    );
  }

  // CONFIRMAR ASIGNACIONES
  confirmar(): void {
    this.intentoConfirmar = true;

    if (this.docentesSeleccionados.length === 0) {
      return;
    }

    // Emitir array de OIDs
    const oidSeleccionados = this.docentesSeleccionados.map(
      (d) => d.oidSeleccionado
    );
    this.onConfirmar.emit(oidSeleccionados);
  }

  cancelar(): void {
    if (!this.asignando) {
      this.onCancelar.emit();
    }
  }

  resetModal(): void {
    this.docentesSeleccionados = [];
    this.oidSeleccionadoTemp = null;
    this.errorCarga = null;
    this.intentoConfirmar = false;
  }

  // GETTERS
  getNombreCompleto(seleccionado: SeleccionadoResponse): string {
    return `${seleccionado.usuario.nombres} ${seleccionado.usuario.apellidos}`;
  }

  getIdentificacion(seleccionado: SeleccionadoResponse): string {
    return seleccionado.usuario.identificacion;
  }

  get puedeAgregar(): boolean {
    return (
      !!this.oidSeleccionadoTemp &&
      this.docentesSeleccionados.length < this.MAX_DOCENTES &&
      !this.docentesSeleccionados.some(
        (d) => d.oidSeleccionado === this.oidSeleccionadoTemp
      )
    );
  }

  get puedeConfirmar(): boolean {
    return this.docentesSeleccionados.length > 0 && !this.asignando;
  }

  get alcanzaMaximo(): boolean {
    return this.docentesSeleccionados.length >= this.MAX_DOCENTES;
  }

  get contadorSeleccion(): string {
    return `${this.docentesSeleccionados.length}/${this.MAX_DOCENTES}`;
  }
}
