import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

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
    { valor: 'opcion3', texto: 'Pendiente firma' },
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

  public valueActivity: string | null = '';
  public valueEvaluator: string | null = '';
  public valuetypeActivity: string = this.typeActivity[0].texto;
  public valueRolEvaluator: string = this.rolEvualator[0].texto;
  public valueSource: string = this.source[1].texto;
  public valueState: string = this.stateSource1[0].texto;

  constructor(private service: ActivitiesServicesService,  private toastr: MessagesInfoService) {

  }

  ngOnInit(): void {

  }

  // Función para capturar la opción seleccionada
  seleccionarOpcionActivity(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.valuetypeActivity = opcion.texto;
  }

  seleccionarOpcionEvaluator(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.valueRolEvaluator = opcion.texto;
  }

  seleccionarOpcionSource(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.valueState = this.stateSource1[0].texto;
    this.valueSource = opcion.texto;
    this.valueSource == 'Fuente 1' ? this.stateSourceSelected = this.stateSource1 : this.stateSourceSelected = this.stateSource2;
  }

  seleccionarOpcionStateSource(event: Event, opcion: { valor: string, texto: string }) {
    event.preventDefault();
    this.valueState = opcion.texto;
  }

  filterAction() {
    this.valueActivity = (<HTMLInputElement>document.getElementById("activity")).value;
    this.valueEvaluator = (<HTMLInputElement>document.getElementById("evaluator")).value;
    
    this.service.getActivities('6', this.valueActivity, this.valuetypeActivity == 'Tipo actividad' ? '' : this.valuetypeActivity, this.valueEvaluator, this.valueRolEvaluator == 'Rol evaluador' ? '' : this.valueRolEvaluator,0,10).subscribe({
      next: data => {
        this.service.setDataActivities(data);
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });

  }

  clearAction() {
    (<HTMLInputElement>document.getElementById("activity")).value = '';
    (<HTMLInputElement>document.getElementById("evaluator")).value = '';

    this.valuetypeActivity != 'Tipo actividad'? this.valuetypeActivity = this.typeActivity[0].texto : this.valuetypeActivity;
    this.valueRolEvaluator != 'Rol evaluado'? this.valueRolEvaluator = this.rolEvualator[0].texto : this.valueRolEvaluator;
    this.service.getActivities('6', '', '', '', '',0,2).subscribe({
      next: data => {
        this.service.setDataActivities(data);
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }
}
