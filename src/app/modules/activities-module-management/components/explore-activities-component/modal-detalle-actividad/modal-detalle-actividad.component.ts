import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadResponse } from '../../../models';

@Component({
  selector: 'app-modal-detalle-actividad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle-actividad.component.html',
  styleUrl: './modal-detalle-actividad.component.css',
})
export class ModalDetalleActividadComponent {
  @Input() actividad: ActividadResponse | null = null;
  @Input() visible: boolean = false;
  @Output() onCerrar = new EventEmitter<void>();

  cerrar(): void {
    this.onCerrar.emit();
  }

  getEstadoNombre(oidEstado: number): string {
    const estados: { [key: number]: string } = {
      1: 'ACTIVA',
      2: 'INACTIVA',
      3: 'INCOMPLETA',
    };
    return estados[oidEstado] || 'DESCONOCIDO';
  }

  getEstadoBadgeClass(oidEstado: number): string {
    const clases: { [key: number]: string } = {
      1: 'bg-success',
      2: 'bg-danger',
      3: 'bg-warning',
    };
    return clases[oidEstado] || 'bg-secondary';
  }
}
