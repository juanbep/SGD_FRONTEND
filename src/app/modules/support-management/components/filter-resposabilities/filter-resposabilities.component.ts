import { Component } from '@angular/core';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'support-management-resposabilities-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-resposabilities.component.html',
  styleUrl: './filter-resposabilities.component.css'
})
export class FilterResposabilitiesComponent {
  // Opciones del dropdown

  stateSource2 = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
  ]

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

  valueActivity: string | null = '';
  valueEvaluator: string | null = '';
  valuetypeActivity: string = this.typeActivity[0].texto;
  valueRolEvaluator: string = this.rolEvualator[0].texto;


  constructor(private service: SupportManagementResponsabilitiesService) {

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


  seleccionarOpcionStateSource(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
  }

  filterAction() {
    this.valueActivity = (<HTMLInputElement>document.getElementById("activity")).value;
    this.valueEvaluator = (<HTMLInputElement>document.getElementById("evaluator")).value;

    let params = new HttpParams()
      .set('idEvaluador', '4')
      .set('codigoActividad', this.valueActivity)
      .set('tipoActividad', this.valuetypeActivity == 'Tipo actividad' ? '' : this.valuetypeActivity)
      .set('nombreEvaluador', this.valueEvaluator)
      .set('roles', this.valueRolEvaluator == 'Rol evaluador' ? '' : this.valueRolEvaluator)
    // .set('tipoFuente',this.valueSource=='Fuente 1'?'1':'2')
    // .set('estadoFuente', this.valueState== 'Estado'? this.valueState = '': this.valueState)

    this.service.uploadResponsabilitiesFilter(params);
  }

  clearAction() {
    (<HTMLInputElement>document.getElementById("activity")).value = '';
    (<HTMLInputElement>document.getElementById("evaluator")).value = '';

    let params = new HttpParams()
      .set('idEvaluador', '4')
      .set('codigoActividad', '')
      .set('tipoActividad', '')
      .set('nombreEvaluador', '')
      .set('roles', '')


    this.valuetypeActivity != 'Tipo actividad' ? this.valuetypeActivity = this.typeActivity[0].texto : this.valuetypeActivity;
    this.valueRolEvaluator != 'Rol evaluador' ? this.valueRolEvaluator = this.rolEvualator[0].texto : this.valueRolEvaluator;
    this.service.uploadResponsabilitiesFilter(params);
  }
}
