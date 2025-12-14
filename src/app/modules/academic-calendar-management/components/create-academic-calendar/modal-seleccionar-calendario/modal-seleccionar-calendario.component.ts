import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendario, Fecha } from '../../../models';
import { Utils } from '../../../utils/calendario.utils';

@Component({
  selector: 'app-modal-seleccionar-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-seleccionar-calendario.component.html',
  styleUrl: './modal-seleccionar-calendario.component.css',
})
export class ModalSeleccionarCalendarioComponent {
  @Input() visible: boolean = false;
  @Input() calendarios: Calendario[] = [];
  @Output() onSeleccionar = new EventEmitter<Calendario>();
  @Output() onCancelar = new EventEmitter<void>();

  calendarioSeleccionado: Calendario | null = null;

  seleccionar(calendario: Calendario): void {
    this.calendarioSeleccionado = calendario;
  }

  confirmar(): void {
    if (this.calendarioSeleccionado) {
      this.onSeleccionar.emit(this.calendarioSeleccionado);
      this.calendarioSeleccionado = null;
    }
  }

  cancelar(): void {
    this.calendarioSeleccionado = null;
    this.onCancelar.emit();
  }

  obtenerIdentificador(calendario: Calendario): string {
    return Utils.formatearAnioPeriodo(
      calendario.anioCalendario,
      calendario.numeroCalendario
    );
  }

  obtenerBadgeClass(estado: string): string {
    return Utils.getBadgeClass(estado);
  }

  contarFechasConDatos(fechas: Fecha[] | undefined): number {
    if (!fechas || fechas.length === 0) return 0;

    return fechas.filter((fecha) => {
      const tieneFechaInicial =
        fecha.fechaInicial && fecha.fechaInicial.toString().trim() !== '';
      const tieneFechaFin =
        fecha.fechaFin && fecha.fechaFin.toString().trim() !== '';

      return tieneFechaInicial || tieneFechaFin;
    }).length;
  }
}
