import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'consolidated-teacher-filter',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './consolidated-teacher-filter.component.html',
  styleUrl: './consolidated-teacher-filter.component.css'
})
export class ConsolidatedTeacherFilterComponent {


  typeActivity = [
    { valor: 'default', texto: 'Tipo actividad' },
    { valor: 'opcion1', texto: 'Docencia' },
    { valor: 'opcion2', texto: 'Trabajos Docencia' },
    { valor: 'opcion3', texto: 'Trabajos de Investigacion' },
    { valor: 'opcion4', texto: 'Administracion' },
    { valor: 'opcion5', texto: 'Otros servicios' }
  ];

  public valuetypeActivity: string = this.typeActivity[0].texto;

  seleccionarOpcionActivity(event:Event, opcion: { valor: string, texto: string }): void {
    event.preventDefault();
    this.valuetypeActivity = opcion.texto;
  }

  filterAction(){

  }

  clearAction(){
    
  }



}
