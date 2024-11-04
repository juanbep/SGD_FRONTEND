import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SupportManagementService } from '../../services/support-management.service';
import { HttpParams } from '@angular/common/http';
import { Actividad } from '../../../../core/activities.interface';

@Component({
  selector: 'supportManagement-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  // Opciones del dropdown
  stateSource1 = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
    { valor: 'opcion2', texto: 'Pendiente firma' },
  ];
  source = [
    { valor: 'default', texto: 'Fuente' },
    { valor: 'opcion1', texto: 'Fuente 1' },
    { valor: 'opcion2', texto: 'Fuente 2' },
  ];

  rolEvualator = [
    { valor: 'default', texto: 'Rol Evaluador' },
    { valor: 'opcion1', texto: 'Estudiante' },
    { valor: 'opcion2', texto: 'Coordirnado' },
    { valor: 'opcion3', texto: 'Jefe de Departamento' },
  ];

  typeActivity = [
    { valor: 'default', texto: 'Tipo actividad' },
    { valor: 'opcion1', texto: 'Docencia' },
    { valor: 'opcion2', texto: 'Trabajos Docencia' },
    { valor: 'opcion3', texto: 'Trabajos de Investigacion' },
    { valor: 'opcion4', texto: 'Administracion' },
    { valor: 'opcion5', texto: 'Otros servicios' }
  ];

  valuetypeActivity: string = this.typeActivity[0].texto;
  valueRolEvaluator: string = this.rolEvualator[0].texto;
  valueSource: string = this.source[0].texto;
  valueState: string = this.stateSource1[0].texto;

  constructor(private service:SupportManagementService){

  }


  // Mensaje para mostrar la opción seleccionada
  mensajeSeleccion: string = '';

  // Función para capturar la opción seleccionada
  seleccionarOpcionActivity(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
    this.valuetypeActivity = opcion.texto;
    console.log(this.mensajeSeleccion)
  }

  seleccionarOpcionEvaluator(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
    this.valueRolEvaluator = opcion.texto;
  }

  seleccionarOpcionSource(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
    this.valueSource = opcion.texto;
  }

  seleccionarOpcionStateSource(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
    this.valueState = opcion.texto;
  }
  public activities: Actividad[] = [];
  
  filterAction(){

    let params = new HttpParams()
      .set('codigoActividad','')
      .set('tipoActividad', this.valuetypeActivity)
      .set('nombreEvaluador', '')
      .set('roles',this.valueRolEvaluator)

    this.service.actualizarFiltro(params);
  }

  

}
