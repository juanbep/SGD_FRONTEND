import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'support-management-filter-teachers-consolidated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-teachers-consolidated.component.html',
  styleUrl: './filter-teachers-consolidated.component.css'
})
export class FilterTeachersConsolidatedComponent {

  states = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
  ]

  contractType = [
    { valor: 'default', texto: 'Tipo contrato' },
    { valor: 'opcion1', texto: 'Planta' },
    { valor: 'opcion2', texto: 'Ocasional' },
  ]



  valueState: string = this.states[0].texto;

  ngOnInit(): void {
    
  }


  // Mensaje para mostrar la opción seleccionada
  mensajeSeleccion: string = '';



  seleccionarOpcionState(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.mensajeSeleccion = `Opción seleccionada: ${opcion.texto} (${opcion.valor})`;
    this.valueState = opcion.texto;
  }

  filterAction() {
    // this.valueActivity = (<HTMLInputElement>document.getElementById("activity")).value;
    // this.valueEvaluator = (<HTMLInputElement>document.getElementById("evaluator")).value;

    // let params = new HttpParams()
    //   .set('idEvaluado', '6')
    //   .set('codigoActividad', this.valueActivity)
    //   .set('tipoActividad', this.valuetypeActivity == 'Tipo actividad' ? '' : this.valuetypeActivity)
    //   .set('nombreEvaluador', this.valueEvaluator)
    //   .set('roles', this.valueRolEvaluator == 'Rol evaluador' ? '' : this.valueRolEvaluator)
    // // .set('tipoFuente',this.valueSource=='Fuente 1'?'1':'2')
    // // .set('estadoFuente', this.valueState== 'Estado'? this.valueState = '': this.valueState)

    // this.service.uploadActivitiesFilter(params);
  }

  clearAction() {
    // (<HTMLInputElement>document.getElementById("activity")).value = '';
    // (<HTMLInputElement>document.getElementById("evaluator")).value = '';

    // let params = new HttpParams()
    //   .set('idEvaluado', '6')
    //   .set('codigoActividad', '')
    //   .set('tipoActividad', '')
    //   .set('nombreEvaluador', '')
    //   .set('roles','')
    
    
    // this.valuetypeActivity != 'Tipo actividad'? this.valuetypeActivity = this.typeActivity[0].texto : this.valuetypeActivity;
    // this.valueRolEvaluator != 'Rol evaluador'? this.valueRolEvaluator = this.rolEvualator[0].texto : this.valueRolEvaluator;
    // this.service.uploadActivitiesFilter(params);
  }
}

