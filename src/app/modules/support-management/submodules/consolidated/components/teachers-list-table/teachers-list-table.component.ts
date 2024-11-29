import { Component, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'consolidated-teachers-list-table',
  standalone: true,
  imports: [
    PaginatorComponent,
    RouterLink
  ],
  templateUrl: './teachers-list-table.component.html',
  styleUrl: './teachers-list-table.component.css'
})
export class TeacherListTableComponent implements OnInit {
  
  //TODO Declarar variables

  constructor() {
    //TODO Mantener la tabla actualizada utilizando effect
   }


  ngOnInit(): void {
    //TODO Llamar al método para obtener los datos de la tabla
  }

  //TODO Método para obtener los datos de la tabla

  




}
