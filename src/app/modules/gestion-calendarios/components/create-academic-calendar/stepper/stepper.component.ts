import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
})
export class StepperComponent {
  @Input() pasoActual: number = 1;
  @Input() pasosCompletados: boolean[] = [];
  @Input() titulosPasos: string[] = [];
  @Output() irAPaso = new EventEmitter<number>();

  seleccionarPaso(paso: number): void {
    this.irAPaso.emit(paso);
  }

  esPasoActivo(indice: number): boolean {
    return this.pasoActual === indice + 1;
  }

  esPasoCompletado(indice: number): boolean {
    return this.pasosCompletados[indice] || false;
  }
}
