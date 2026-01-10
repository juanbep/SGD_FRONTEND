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
  @Input() oidDepartamento?: number | string = '';

  @Output() onConfirmar = new EventEmitter<number>(); // Emite oidSeleccionado
  @Output() onCancelar = new EventEmitter<void>();

  private seleccionadoHelper = inject(SeleccionadoHelperService);
  intentoConfirmar: boolean = false;

  // Datos
  seleccionados: SeleccionadoResponse[] = [];
  loadingSeleccionados = false;
  errorCarga: string | null = null;

  // Selección
  oidSeleccionadoSeleccionado: number | null = null;

  ngOnInit(): void {
    if (this.visible && this.necesidad) {
      this.cargarSeleccionados();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando el modal se abre, cargar seleccionados
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
        size: 1000, // Cargar todos los seleccionados disponibles
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

  confirmar(): void {
    this.intentoConfirmar = true;

    if (!this.oidSeleccionadoSeleccionado) {
      return;
    }

    this.onConfirmar.emit(this.oidSeleccionadoSeleccionado);
  }

  cancelar(): void {
    if (!this.asignando) {
      this.onCancelar.emit();
    }
  }

  resetModal(): void {
    this.oidSeleccionadoSeleccionado = null;
    this.errorCarga = null;
    this.intentoConfirmar = false;
  }

  // Getter para mostrar nombre completo en el dropdown
  getNombreCompleto(seleccionado: SeleccionadoResponse): string {
    return `${seleccionado.usuario.nombres} ${seleccionado.usuario.apellidos}`;
  }

  // Getter para mostrar identificación
  getIdentificacion(seleccionado: SeleccionadoResponse): string {
    return seleccionado.usuario.identificacion;
  }

  get puedeConfirmar(): boolean {
    return !!this.oidSeleccionadoSeleccionado && !this.asignando;
  }

  // Getter para obtener el seleccionado actual
  get seleccionadoActual(): SeleccionadoResponse | undefined {
    if (!this.oidSeleccionadoSeleccionado) return undefined;
    return this.seleccionados.find(
      (s) => s.oidSeleccionado === this.oidSeleccionadoSeleccionado
    );
  }
}
