import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadResponse } from '../../../models';

@Component({
  selector: 'app-modal-eliminar-actividad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-eliminar-actividad.component.html',
  styleUrl: './modal-eliminar-actividad.component.css',
})
export class ModalEliminarActividadComponent {
  @Input() actividad: ActividadResponse | null = null;
  @Input() visible: boolean = false;
  @Input() eliminando: boolean = false;
  @Output() onConfirmar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  confirmar(): void {
    this.onConfirmar.emit();
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
