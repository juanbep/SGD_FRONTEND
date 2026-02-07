import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendario } from '../../models';

@Component({
  selector: 'app-modal-eliminar-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-eliminar-calendario.component.html',
  styleUrl: './modal-eliminar-calendario.component.css',
})
export class ModalEliminarCalendarioComponent {
  @Input() calendario: Calendario | null = null;
  @Input() visible: boolean = false;
  @Output() onConfirmar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  confirmar(): void {
    this.onConfirmar.emit();
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
