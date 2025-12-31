import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ModalConfirmacionConfig {
  titulo: string;
  mensaje: string;
  mensajeSecundario?: string; // Mensaje adicional opcional
  textoBotonConfirmar?: string;
  textoBotonCancelar?: string;
  tipoBotonConfirmar?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  icono?: string;
}
@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css',
})
export class ModalConfirmacionComponent {
  @Input() visible = false;
  @Input() config: ModalConfirmacionConfig = {
    titulo: 'Confirmar acción',
    mensaje: '¿Está seguro de realizar esta acción?',
    textoBotonConfirmar: 'Confirmar',
    textoBotonCancelar: 'Cancelar',
    tipoBotonConfirmar: 'primary',
    icono: 'fa-question-circle',
  };
  @Input() procesando = false; // Para mostrar spinner en el botón

  @Output() onConfirmar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  confirmar(): void {
    if (!this.procesando) {
      this.onConfirmar.emit();
    }
  }

  cancelar(): void {
    if (!this.procesando) {
      this.onCancelar.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.procesando) {
      this.cancelar();
    }
  }
}
