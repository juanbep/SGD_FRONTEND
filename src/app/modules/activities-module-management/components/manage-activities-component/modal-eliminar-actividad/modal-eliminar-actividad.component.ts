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

  estados = [
    { oid: 1, nombre: 'ACTIVA', class: 'bg-success' },
    { oid: 2, nombre: 'INACTIVA', class: 'bg-danger' },
    { oid: 3, nombre: 'INCOMPLETA', class: 'bg-warning' },
  ];

  confirmar(): void {
    this.onConfirmar.emit();
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  getEstadoNombre(oidEstado: number | undefined): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.nombre : 'DESCONOCIDO';
  }

  getEstadoBadgeClass(oidEstado: number | undefined): string {
    const estado = this.estados.find((e) => e.oid === oidEstado);
    return estado ? estado.class : 'bg-secondary';
  }
}
