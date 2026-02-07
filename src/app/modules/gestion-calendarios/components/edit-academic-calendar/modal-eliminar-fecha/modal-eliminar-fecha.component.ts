import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fecha } from '../../../models';

@Component({
  selector: 'app-modal-eliminar-fecha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-eliminar-fecha.component.html',
  styleUrl: './modal-eliminar-fecha.component.css',
})
export class ModalEliminarFechaComponent {
  @Input() fecha: Fecha | null = null;
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
