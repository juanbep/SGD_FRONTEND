import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JefeNecesidadesComponent } from '../jefe-necesidades/jefe-necesidades.component';
import { JefeAsignacionesComponent } from '../jefe-asignaciones/jefe-asignaciones.component';

@Component({
  selector: 'app-jefe-necesidades-container',
  standalone: true,
  imports: [CommonModule, JefeNecesidadesComponent, JefeAsignacionesComponent],
  templateUrl: './jefe-necesidades-container.component.html',
  styleUrl: './jefe-necesidades-container.component.css',
})
export class JefeNecesidadesContainerComponent {
  // Tab activa
  tabActiva: 'revision' | 'asignaciones' = 'revision';

  // Cambiar tab
  cambiarTab(tab: 'revision' | 'asignaciones'): void {
    this.tabActiva = tab;
  }
}
