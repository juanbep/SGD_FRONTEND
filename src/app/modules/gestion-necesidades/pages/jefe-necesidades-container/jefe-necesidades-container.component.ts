import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JefeNecesidadesComponent } from '../jefe-necesidades/jefe-necesidades.component';
import { JefeAsignacionesComponent } from '../jefe-asignaciones/jefe-asignaciones.component';
import { JefeSeleccionadosComponent } from '../../../gestion-seleccionados/pages/jefe-seleccionados/jefe-seleccionados.component';
import { FabAyudaComponent } from '../../shared/fab-ayuda/fab-ayuda.component';
import { ModalInfoFlujoComponent } from '../../components/modales/modal-info-flujo/modal-info-flujo.component';

@Component({
  selector: 'app-jefe-necesidades-container',
  standalone: true,
  imports: [
    CommonModule,
    JefeNecesidadesComponent,
    JefeAsignacionesComponent,
    JefeSeleccionadosComponent,
    FabAyudaComponent,
    ModalInfoFlujoComponent,
  ],
  templateUrl: './jefe-necesidades-container.component.html',
  styleUrl: './jefe-necesidades-container.component.css',
})
export class JefeNecesidadesContainerComponent {
  // Tab activa - AGREGAR 'seleccionados'
  tabActiva: 'revision' | 'asignaciones' | 'seleccionados' = 'revision';

  // Cambiar tab
  cambiarTab(tab: 'revision' | 'asignaciones' | 'seleccionados'): void {
    this.tabActiva = tab;
  }
}
