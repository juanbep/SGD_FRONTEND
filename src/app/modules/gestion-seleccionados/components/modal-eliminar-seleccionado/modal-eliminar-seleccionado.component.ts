import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SeleccionadoResponse } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-eliminar-seleccionado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-eliminar-seleccionado.component.html',
  styleUrl: './modal-eliminar-seleccionado.component.css',
})
export class ModalEliminarSeleccionadoComponent {
  @Input() visible: boolean = false;
  @Input() seleccionado: SeleccionadoResponse | null = null;
  @Input() eliminando: boolean = false;
  @Output() onConfirmar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  confirmar(): void {
    this.onConfirmar.emit();
  }

  cancelar(): void {
    if (!this.eliminando) {
      this.onCancelar.emit();
    }
  }

  getNombreCompleto(): string {
    if (!this.seleccionado?.usuario) return 'N/A';
    return `${this.seleccionado.usuario.nombres} ${this.seleccionado.usuario.apellidos}`;
  }

  getIdentificacion(): string {
    return this.seleccionado?.usuario?.identificacion || 'N/A';
  }

  getDepartamento(): string {
    return this.seleccionado?.usuario?.usuarioDetalle?.departamento || 'N/A';
  }
}
