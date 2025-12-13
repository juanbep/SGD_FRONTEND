import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Materia } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-correquisitos-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-correquisitos-modal.component.html',
  styleUrl: './ver-correquisitos-modal.component.css',
})
export class VerCorrequisitosModalComponent {
  @Input() materia!: Materia;
  @Output() onCerrar = new EventEmitter<void>();

  cerrar(): void {
    this.onCerrar.emit();
  }
}
