import { Component } from '@angular/core';
import { GestionActividadBaseComponent } from '../../shared/modal-actividad/gestion-actividad-base/gestion-actividad-base.component';
import { ACTIVIDADES_METADATA } from '../../config/actividades-metadata.config';

@Component({
  selector: 'app-trabajos-docencia',
  standalone: true,
  imports: [GestionActividadBaseComponent],
  template: `
    <app-gestion-actividad-base
      [metadata]="metadata"
    ></app-gestion-actividad-base>
  `,
})
export class TrabajosDocenciaComponent {
  readonly metadata = ACTIVIDADES_METADATA['TRABAJOS_DOCENCIA'];
}
