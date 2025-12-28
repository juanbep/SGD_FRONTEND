import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NecesidadResponse } from '../../models';

@Component({
  selector: 'app-modal-eliminar-necesidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-eliminar-necesidad.component.html',
  styleUrl: './modal-eliminar-necesidad.component.css',
})
export class ModalEliminarNecesidadComponent {
  @Input() necesidad: NecesidadResponse | null = null;
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

  getBadgeClassEstado(estado: string | undefined): string {
    switch (estado) {
      case 'BORRADOR':
        return 'bg-secondary';
      case 'PUBLICADA':
        return 'bg-success';
      case 'CANCELADA':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
