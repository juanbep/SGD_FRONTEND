import { Component } from '@angular/core';
import { ACTIVIDADES_METADATA } from '../../config/actividades-metadata.config';
import { GestionActividadBaseComponent } from '../../shared/modal-actividad/gestion-actividad-base/gestion-actividad-base.component';

@Component({
  selector: 'app-extension',
  standalone: true,
  imports: [GestionActividadBaseComponent],
  template: `
    <app-gestion-actividad-base
      [metadata]="metadata"
    ></app-gestion-actividad-base>
  `,
})
export class ExtensionComponent {
  readonly metadata = ACTIVIDADES_METADATA['EXTENSION'];
}
