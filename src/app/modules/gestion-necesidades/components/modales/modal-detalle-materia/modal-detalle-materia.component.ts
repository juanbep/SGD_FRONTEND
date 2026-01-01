import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Materia } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-detalle-materia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle-materia.component.html',
  styleUrl: './modal-detalle-materia.component.css',
})
export class ModalDetalleMateriaComponent {
  @Input() materia: Materia | null = null;
  @Input() mostrar: boolean = false;
  @Output() onCerrar = new EventEmitter<void>();

  cerrar(): void {
    this.onCerrar.emit();
  }

  cerrarSiClickFuera(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrar();
    }
  }
}
