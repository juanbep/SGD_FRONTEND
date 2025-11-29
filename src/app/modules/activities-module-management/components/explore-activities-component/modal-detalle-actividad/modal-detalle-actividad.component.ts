import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadResponse } from '../../../models';
import {
  getEstadoBadgeClass,
  getEstadoNombre,
} from '../../../utils/actividad-utils';

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

  getEstadoNombre = getEstadoNombre;
  getEstadoBadgeClass = getEstadoBadgeClass;
}
