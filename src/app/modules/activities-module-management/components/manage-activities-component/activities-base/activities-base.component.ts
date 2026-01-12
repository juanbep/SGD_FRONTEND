import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaActividadesAcademicasComponent } from '../../explore-activities-component/tabla-actividades-academicas/tabla-actividades-academicas.component';
import { ActividadResponse } from '../../../models';
import { TablaActividadesDocenciaComponent } from '../../explore-activities-component/tabla-actividades-docencia/tabla-actividades-docencia.component';

@Component({
  selector: 'app-activities-base',
  standalone: true,
  imports: [
    CommonModule,
    TablaActividadesAcademicasComponent,
    TablaActividadesDocenciaComponent,
  ], //TablaActividadesDocenciaComponent
  templateUrl: './activities-base.component.html',
  styleUrl: './activities-base.component.css',
})
export class ActivitiesBaseComponent implements OnChanges {
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onEditar = new EventEmitter<ActividadResponse>();
  @Output() onEliminar = new EventEmitter<ActividadResponse>();

  // Control de tabs
  tabActiva: 'generales' | 'docencia' = 'generales';

  // ViewChild para acceder a las tablas
  @ViewChild('tablaGenerales')
  tablaGenerales!: TablaActividadesAcademicasComponent;
  @ViewChild('tablaDocencia') tablaDocencia!: TablaActividadesDocenciaComponent;

  // Detectar cambios en el modo
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modo']) {
      // Si cambia a modo 'gestionar' y estaba en tab 'docencia', volver a 'actividades generales'
      if (this.modo === 'gestionar' && this.tabActiva === 'docencia') {
        this.tabActiva = 'generales';
      }
    }
  }

  handleEditar(actividadData: ActividadResponse): void {
    this.onEditar.emit(actividadData);
  }

  handleEliminar(actividadData: ActividadResponse): void {
    this.onEliminar.emit(actividadData);
  }

  // Método público para recargar tabla según tab activo
  recargarTabla(): void {
    if (this.tabActiva === 'generales' && this.tablaGenerales) {
      this.tablaGenerales.loadActividades();
    }
    if (this.tabActiva === 'docencia' && this.tablaDocencia) {
      this.tablaDocencia.loadActividades();
    }
  }

  // Cambia el tab activo
  cambiarTab(tab: 'generales' | 'docencia'): void {
    // Solo permite cambiar a 'docencia' si está en modo 'visualizar'
    if (tab === 'docencia' && this.modo !== 'visualizar') {
      return;
    }
    this.tabActiva = tab;
  }

  // Verifica si un tab está activo
  isTabActiva(tab: 'generales' | 'docencia'): boolean {
    return this.tabActiva === tab;
  }
}
