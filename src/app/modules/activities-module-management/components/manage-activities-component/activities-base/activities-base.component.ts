import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaActividadesAcademicasComponent } from '../../explore-activities-component/tabla-actividades-academicas/tabla-actividades-academicas.component';
import { ActividadResponse } from '../../../models';

@Component({
  selector: 'app-activities-base',
  standalone: true,
  imports: [CommonModule, TablaActividadesAcademicasComponent],
  templateUrl: './activities-base.component.html',
  styleUrl: './activities-base.component.css',
})
export class ActivitiesBaseComponent {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<ActividadResponse>();
  @Output() onEliminar = new EventEmitter<ActividadResponse>();

  // ViewChild para acceder a la tabla
  @ViewChild(TablaActividadesAcademicasComponent)
  tabla!: TablaActividadesAcademicasComponent;

  handleEditar(actividadData: ActividadResponse): void {
    this.onEditar.emit(actividadData);
  }

  handleEliminar(actividadData: ActividadResponse): void {
    this.onEliminar.emit(actividadData);
  }

  // Método público para recargar tabla
  recargarTabla(): void {
    if (this.tabla) {
      this.tabla.loadActividades();
    }
  }
}
