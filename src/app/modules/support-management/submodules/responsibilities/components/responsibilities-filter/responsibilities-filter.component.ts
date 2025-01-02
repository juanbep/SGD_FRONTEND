import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'responsibilities-filter',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './responsibilities-filter.component.html',
  styleUrl: './responsibilities-filter.component.css'
})
export class ResponsibilitiesFilterComponent {
  // Opciones del dropdown

  stateSource2 = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
  ]

  rolEvualator = [
    { valor: 'default', texto: 'Rol evaluado' },
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

  valuetypeActivity: string = this.typeActivity[0].texto;
  valueRolEvaluator: string = this.rolEvualator[0].texto;


  constructor(private service: ResponsibilitiesServicesService, private toastr: MessagesInfoService) {

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
    let valueActivity = (<HTMLInputElement>document.getElementById("activity")).value;
    let valueEvaluator = (<HTMLInputElement>document.getElementById("evaluator")).value;
    
    this.service.getResponsibilities('4', valueActivity, this.valuetypeActivity == 'Tipo actividad' ? '' : this.valuetypeActivity, valueEvaluator, this.valueRolEvaluator == 'Rol evaluado' ? '' : this.valueRolEvaluator, 0,10).subscribe
      ({
        next: data => {
          this.service.setResponsibilitiesData(data);
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }

  clearAction() {
    (<HTMLInputElement>document.getElementById("activity")).value = '';
    (<HTMLInputElement>document.getElementById("evaluator")).value = '';

    this.valuetypeActivity != 'Tipo actividad' ? this.valuetypeActivity = this.typeActivity[0].texto : this.valuetypeActivity;
    this.valueRolEvaluator != 'Rol evaluador' ? this.valueRolEvaluator = this.rolEvualator[0].texto : this.valueRolEvaluator;

    this.service.getResponsibilities('4', '', '', '', '',0,10).subscribe({
      next: data => {
        this.service.setResponsibilitiesData(data);
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }
}
