import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { SupportManagementService } from '../../../../services/support-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'activities-filter',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './activities-filter.component.html',
  styleUrl: './activities-filter.component.css'
})
export class ActivitiesFilterComponent {

  // Opciones del dropdown
  stateSource1 = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
    { valor: 'opcion2', texto: 'Pendiente firma' },
  ];

  stateSource2 = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
  ]

  source = [
    { valor: 'default', texto: 'Fuente' },
    { valor: 'opcion1', texto: 'Fuente 1' },
    { valor: 'opcion2', texto: 'Fuente 2' },
  ];

  rolEvualator = [
    { valor: 'default', texto: 'Rol evaluador' },
    { valor: 'opcion1', texto: 'Estudiante' },
    { valor: 'opcion2', texto: 'Coordirnado' },
    { valor: 'opcion3', texto: 'Jefe de Departamento' },
    { valor: 'opcion4', texto: 'Docente' },
  ];

  typeActivity = [
    { valor: 'default', texto: 'Tipo actividad' },
    { valor: 'opcion1', texto: 'Docencia' },
    { valor: 'opcion2', texto: 'Trabajos Docencia' },
    { valor: 'opcion3', texto: 'Trabajos de Investigacion' },
    { valor: 'opcion4', texto: 'Administracion' },
    { valor: 'opcion5', texto: 'Otros servicios' }
  ];

  public stateSourceSelected = this.stateSource1;

  valueActivity: string | null = '';
  valueEvaluator: string | null = '';
  valuetypeActivity: string = this.typeActivity[0].texto;
  valueRolEvaluator: string = this.rolEvualator[0].texto;
  valueSource: string = this.source[1].texto;
  valueState: string = this.stateSource1[0].texto;

  constructor(private service: SupportManagementService) {

  }

  ngOnInit(): void {

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
    this.valueState = this.stateSource1[0].texto;
    this.valueSource = opcion.texto;
    this.valueSource == 'Fuente 1' ? this.stateSourceSelected = this.stateSource1 : this.stateSourceSelected = this.stateSource2;
  }

  seleccionarOpcionStateSource(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
    this.valueState = opcion.texto;
  }

  filterAction() {
    this.valueActivity = (<HTMLInputElement>document.getElementById("activity")).value;
    this.valueEvaluator = (<HTMLInputElement>document.getElementById("evaluator")).value;

    let params = new HttpParams()
      .set('idEvaluado', '6')
      .set('codigoActividad', this.valueActivity)
      .set('tipoActividad', this.valuetypeActivity == 'Tipo actividad' ? '' : this.valuetypeActivity)
      .set('nombreEvaluador', this.valueEvaluator)
      .set('roles', this.valueRolEvaluator == 'Rol evaluador' ? '' : this.valueRolEvaluator)
    // .set('tipoFuente',this.valueSource=='Fuente 1'?'1':'2')
    // .set('estadoFuente', this.valueState== 'Estado'? this.valueState = '': this.valueState)

    this.service.uploadActivitiesFilter(params);
  }

  clearAction() {
    (<HTMLInputElement>document.getElementById("activity")).value = '';
    (<HTMLInputElement>document.getElementById("evaluator")).value = '';

    let params = new HttpParams()
      .set('idEvaluado', '6')
      .set('codigoActividad', '')
      .set('tipoActividad', '')
      .set('nombreEvaluador', '')
      .set('roles','')
    
    
    this.valuetypeActivity != 'Tipo actividad'? this.valuetypeActivity = this.typeActivity[0].texto : this.valuetypeActivity;
    this.valueRolEvaluator != 'Rol evaluador'? this.valueRolEvaluator = this.rolEvualator[0].texto : this.valueRolEvaluator;
    this.service.uploadActivitiesFilter(params);
  }
}
