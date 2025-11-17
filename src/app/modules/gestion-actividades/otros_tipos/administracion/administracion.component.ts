import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ACTIVIDADES_METADATA } from '../../config/actividades-metadata.config';
import { GestionActividadBaseComponent } from '../../shared/modal-actividad/gestion-actividad-base/gestion-actividad-base.component';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [GestionActividadBaseComponent],
  template: `
    <app-gestion-actividad-base
      [metadata]="metadata"
    ></app-gestion-actividad-base>
  `,
})
export class AdministracionComponent {
  readonly metadata = ACTIVIDADES_METADATA['ADMINISTRACION'];
}
